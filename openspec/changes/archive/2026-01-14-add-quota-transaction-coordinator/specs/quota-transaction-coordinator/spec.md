# Quota Transaction Coordinator Specification

## ADDED Requirements

### Requirement: Idempotent Pre-deduction
The system SHALL prevent duplicate quota charges when the same operation is retried due to network failures or client retries.

#### Scenario: First pre-deduction attempt
- **WHEN** `preDeduct(userId: "user123", amount: 10, externalId: "task-uuid-abc")` is called
- **THEN** the system SHALL:
  - Create a PENDING `SubscriptionTransaction` with `external_id = "task-uuid-abc"`, `transaction_type = PRE_DEDUCT`, `transaction_status = PENDING`
  - Deduct 10 from `SubscriptionQuota.balance`
  - Add 10 to `SubscriptionQuota.locked_balance`
  - Set `change_amount = -10` (negative for deduction)
  - Record `balance_snapshot` as the balance value after deduction
  - Return transaction details with status PENDING

#### Scenario: Duplicate pre-deduction attempt (idempotency)
- **GIVEN** a PENDING transaction exists with `external_id = "task-uuid-abc"`
- **WHEN** `preDeduct(userId: "user123", amount: 10, externalId: "task-uuid-abc")` is called again
- **THEN** the system SHALL:
  - NOT create a new transaction
  - NOT deduct balance again
  - Return the existing transaction details with status PENDING

#### Scenario: Insufficient balance
- **GIVEN** user has balance = 5
- **WHEN** `preDeduct(userId: "user123", amount: 10, externalId: "task-uuid-xyz")` is called
- **THEN** the system SHALL:
  - NOT create a transaction
  - NOT modify balance
  - Throw `InsufficientBalanceException` with clear error message

### Requirement: Atomic Transaction Settlement
The system SHALL finalize pending quota charges when operations complete successfully, ensuring balance and transaction logs remain consistent with full traceability.

#### Scenario: Settle successful operation
- **GIVEN** a PENDING transaction exists with `uuid = "txn-123"`, `external_id = "task-uuid-abc"`, `change_amount = -10`
- **WHEN** `settle(externalId: "task-uuid-abc")` is called
- **THEN** the system SHALL atomically:
  - Create new `SubscriptionTransaction` record with:
    - `transaction_type = SETTLE`
    - `transaction_status = SUCCESS`
    - `parent_uuid = "txn-123"` (linking back to PRE_DEDUCT)
    - `change_amount = -10` (same as parent, negative for final deduction)
    - `balance_snapshot` = current balance after settlement
    - `external_id = null` (not needed for SETTLE)
  - Update original PRE_DEDUCT transaction status to SUCCESS
  - Subtract 10 from `SubscriptionQuota.locked_balance`
  - Add 10 to `SubscriptionQuota.total_spent`
  - Ensure all updates occur in a single database transaction

#### Scenario: Settle non-existent transaction
- **GIVEN** no transaction exists with `external_id = "task-uuid-nonexistent"`
- **WHEN** `settle(externalId: "task-uuid-nonexistent")` is called
- **THEN** the system SHALL throw `TransactionNotFoundException`

#### Scenario: Settle already settled transaction (idempotency)
- **GIVEN** a SUCCESS transaction exists with `external_id = "task-uuid-abc"` and a SETTLE child transaction exists
- **WHEN** `settle(externalId: "task-uuid-abc")` is called again
- **THEN** the system SHALL:
  - NOT modify balance
  - NOT create duplicate SETTLE transaction
  - Return success (idempotent behavior)

### Requirement: Atomic Transaction Rollback
The system SHALL return locked funds to available balance when operations fail, ensuring no credits are lost with full audit traceability.

#### Scenario: Rollback failed operation
- **GIVEN** a PENDING transaction exists with `uuid = "txn-123"`, `external_id = "task-uuid-abc"`, `change_amount = -10`
- **WHEN** `rollback(externalId: "task-uuid-abc", reason: "AI API timeout")` is called
- **THEN** the system SHALL atomically:
  - Create new `SubscriptionTransaction` record with:
    - `transaction_type = ROLLBACK`
    - `transaction_status = SUCCESS`
    - `parent_uuid = "txn-123"` (linking back to PRE_DEDUCT)
    - `change_amount = +10` (positive, returning credits)
    - `balance_snapshot` = current balance after rollback
    - `remark = "AI API timeout"` (capturing failure reason)
    - `external_id = null` (not needed for ROLLBACK)
  - Update original PRE_DEDUCT transaction status to SUCCESS
  - Subtract 10 from `SubscriptionQuota.locked_balance`
  - Add 10 back to `SubscriptionQuota.balance`
  - Ensure all updates occur in a single database transaction

#### Scenario: Rollback non-existent transaction
- **GIVEN** no transaction exists with `external_id = "task-uuid-nonexistent"`
- **WHEN** `rollback(externalId: "task-uuid-nonexistent")` is called
- **THEN** the system SHALL throw `TransactionNotFoundException`

#### Scenario: Rollback already rolled back transaction (idempotency)
- **GIVEN** a SUCCESS transaction exists with `external_id = "task-uuid-abc"` and a ROLLBACK child transaction exists
- **WHEN** `rollback(externalId: "task-uuid-abc")` is called again
- **THEN** the system SHALL:
  - NOT modify balance
  - NOT create duplicate ROLLBACK transaction
  - Return success (idempotent behavior)

### Requirement: Negative Balance Protection
The system SHALL enforce that user balance never drops below zero, preventing overdrafts.

#### Scenario: Prevent negative balance on pre-deduction
- **GIVEN** user has balance = 5
- **WHEN** `preDeduct(userId: "user123", amount: 10, externalId: "task-uuid-xyz")` is called
- **THEN** the system SHALL:
  - Validate that `balance >= amount` before any database writes
  - Reject the operation with `InsufficientBalanceException`
  - NOT create a transaction record

#### Scenario: Concurrent pre-deductions with race condition
- **GIVEN** user has balance = 10
- **WHEN** two concurrent `preDeduct` calls each request amount = 7
- **THEN** the system SHALL:
  - Process calls sequentially via database row-level locking
  - Allow first call to succeed (balance: 10 → 3, locked: 0 → 7)
  - Reject second call with `InsufficientBalanceException` (3 < 7)

### Requirement: Transaction Audit Trail with Traceability
The system SHALL maintain a complete, immutable record of all quota operations with parent-child relationships for full financial audit reconstruction.

#### Scenario: Record complete transaction lifecycle
- **GIVEN** a successful operation completes
- **WHEN** the full cycle executes: preDeduct → settle
- **THEN** the system SHALL create exactly 2 transaction records:
  1. PRE_DEDUCT record with `external_id`, `change_amount < 0`, `balance_snapshot`, `transaction_status = PENDING` → `SUCCESS`
  2. SETTLE record with `parent_uuid` pointing to PRE_DEDUCT, `change_amount < 0`, `balance_snapshot`
- **AND** both records SHALL be immutable (never deleted, only status updated)

#### Scenario: Record failed operation lifecycle
- **GIVEN** an operation fails
- **WHEN** the full cycle executes: preDeduct → rollback
- **THEN** the system SHALL create exactly 2 transaction records:
  1. PRE_DEDUCT record with `external_id`, `change_amount < 0`, `transaction_status = PENDING` → `SUCCESS`
  2. ROLLBACK record with `parent_uuid` pointing to PRE_DEDUCT, `change_amount > 0` (positive), `remark` with failure reason

#### Scenario: Query transaction history with parent-child relationships
- **GIVEN** user "user123" has 3 completed operations: 2 successful (PRE_DEDUCT + SETTLE) and 1 failed (PRE_DEDUCT + ROLLBACK)
- **WHEN** administrator queries transactions for "user123"
- **THEN** the system SHALL return 6 total records (3 PRE_DEDUCT + 2 SETTLE + 1 ROLLBACK)
- **AND** each SETTLE/ROLLBACK record SHALL have `parent_uuid` linking to its PRE_DEDUCT
- **AND** records SHALL be ordered by `created_at` DESC

#### Scenario: Balance reconstruction from transaction history
- **GIVEN** user "user123" has transaction history with `balance_snapshot` values: [100, 90, 95, 85]
- **WHEN** administrator needs to verify balance integrity at any point in time
- **THEN** the system SHALL:
  - Allow querying transactions up to specific timestamp
  - Use `balance_snapshot` from last transaction before timestamp to verify balance
  - Enable dispute resolution without replaying all calculations

### Requirement: Database Transaction Atomicity
The system SHALL use database transactions to ensure balance updates and transaction logs are always consistent.

#### Scenario: Atomic pre-deduction
- **WHEN** `preDeduct` is called
- **THEN** the system SHALL wrap the following operations in a single database transaction:
  1. Read current `SubscriptionQuota` with row-level lock (`FOR UPDATE`)
  2. Validate `balance >= amount`
  3. Update `SubscriptionQuota` (deduct from balance, add to locked_balance)
  4. Create `SubscriptionTransaction` record with `transaction_type = PRE_DEDUCT`, `transaction_status = PENDING`, negative `change_amount`, `balance_snapshot`
- **AND** if any step fails, all changes SHALL be rolled back

#### Scenario: Atomic settlement
- **WHEN** `settle` is called
- **THEN** the system SHALL wrap the following operations in a single database transaction:
  1. Read `SubscriptionTransaction` by `external_id` with lock
  2. Validate status is PENDING
  3. Update original transaction status to SUCCESS
  4. Create new SETTLE transaction with `parent_uuid`, negative `change_amount`, `balance_snapshot`
  5. Update `SubscriptionQuota` (subtract from locked_balance, add to total_spent)
- **AND** if any step fails, all changes SHALL be rolled back

#### Scenario: Atomic rollback
- **WHEN** `rollback` is called
- **THEN** the system SHALL wrap the following operations in a single database transaction:
  1. Read `SubscriptionTransaction` by `external_id` with lock
  2. Validate status is PENDING
  3. Update original transaction status to SUCCESS
  4. Create new ROLLBACK transaction with `parent_uuid`, positive `change_amount`, `balance_snapshot`, `remark`
  5. Update `SubscriptionQuota` (subtract from locked_balance, add back to balance)
- **AND** if any step fails, all changes SHALL be rolled back

### Requirement: Balance Query
The system SHALL provide a method to retrieve current user quota information for display and validation.

#### Scenario: Get user quota
- **WHEN** `getQuota(userId: "user123")` is called
- **THEN** the system SHALL return:
  - `balance`: Available credits
  - `locked_balance`: Credits locked in pending operations
  - `total_spent`: Lifetime usage
  - `warning_threshold`: Low-balance alert threshold
  - `available_balance`: Computed as `balance` (locked_balance not subtracted since it's already deducted from balance)

#### Scenario: Get quota for non-existent user
- **WHEN** `getQuota(userId: "nonexistent")` is called
- **THEN** the system SHALL throw `QuotaNotFoundException`

### Requirement: Top-up Credits
The system SHALL support adding credits to user accounts through purchases or administrative grants with full audit trail.

#### Scenario: Admin credits top-up
- **WHEN** `topUp(userId: "user123", amount: 50, reason: "Beta tester bonus")` is called by admin
- **THEN** the system SHALL atomically:
  - Add 50 to `SubscriptionQuota.balance`
  - Create `SubscriptionTransaction` with:
    - `transaction_type = TOPUP`
    - `transaction_status = SUCCESS`
    - `change_amount = +50` (positive)
    - `balance_snapshot` = balance after top-up
    - `remark = "Beta tester bonus"`
    - `external_id = null` (not required for top-ups)
    - `parent_uuid = null` (top-ups have no parent)

#### Scenario: Purchase credits top-up
- **GIVEN** payment transaction "payment-123" succeeds for 100 credits
- **WHEN** `topUp(userId: "user123", amount: 100, externalId: "payment-123", reason: "Credit purchase")` is called
- **THEN** the system SHALL:
  - Check if transaction with `external_id = "payment-123"` already exists (idempotency)
  - If exists, return existing transaction (prevent double credit)
  - If not exists, add credits and create TOPUP transaction

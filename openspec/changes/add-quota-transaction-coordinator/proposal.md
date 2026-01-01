# Change: Reliable Quota Transaction Coordinator (Service Layer)

## Why

For an MVP, reliability in billing is the highest priority after core functionality. Currently, the system lacks any quota or credit management for AI operations (text generation, image generation). This creates three critical risks:

1. **Double Spending Prevention**: Without idempotency, network retries could charge users multiple times for a single AI generation request.
2. **Financial Integrity**: System crashes after charging but before completing the AI call result in users losing money without getting results, with no mechanism to identify or fix "stuck" transactions.
3. **Developer Complexity**: Each service must manually implement balance checks, deductions, and rollback logic, increasing error potential and development time.

## What Changes

This change introduces a centralized **Quota Transaction Coordinator** service that encapsulates the entire "Pre-deduct → Settle/Rollback" lifecycle:

- **New Database Schema**:
  - `SubscriptionQuota` model with fields: `balance`, `locked_balance`, `total_spent`, `warning_threshold`
  - `SubscriptionTransaction` model with idempotency via `external_id`, parent-child traceability via `parent_uuid`, and audit trail via `balance_snapshot`

- **Atomic State Machine**: Implement core methods:
  - `preDeduct(userId, amount, requestId)`: Locks funds and creates a PENDING record with negative `change_amount`
  - `settle(requestId)`: Finalizes the spend, creates SETTLE child transaction linked via `parent_uuid`, moves funds from locked_balance to total_spent
  - `rollback(requestId)`: Returns locked funds to balance, creates ROLLBACK child transaction with positive `change_amount` and failure reason in `remark`
  - `topUp(userId, amount, externalId?, reason?)`: Adds credits via purchase or admin grant with TOPUP transaction

- **Negative Balance Protection**: Enforce that balance cannot drop below zero via application logic

- **Database Transaction Guarantees**: Use Prisma transactions to ensure balance and transaction logs stay in sync

- **Enhanced Audit Trail**:
  - `balance_snapshot` field records balance after each transaction for point-in-time verification
  - `parent_uuid` creates explicit link between PRE_DEDUCT → SETTLE/ROLLBACK for full traceability
  - `change_amount` uses signed values (negative for deductions, positive for credits added)

All business modules (task service, chat service) will use this coordinator instead of implementing their own quota logic.

## Impact

**Breaking Changes:**
- **BREAKING**: New dependency - all AI generation services must integrate quota coordinator before processing requests

**Affected Specs:**
- `quota-transaction-coordinator` (NEW) - Core quota management capability

**Affected Code:**
- New service: `apps/api/src/service/quota-transaction-coordinator.service.ts`
- Database schema: `apps/api/prisma/schema.prisma` - add `SubscriptionQuota` and `SubscriptionTransaction` models
- New enums: `apps/api/src/enum/transaction.enum.ts` - TransactionType, TransactionStatus
- Integration points: `apps/api/src/service/task.service.ts`, `apps/api/src/service/chat.service.ts`

**MVP Scope:**
- Synchronous, blocking quota checks (no async queues)
- SQL row-level locking (no distributed locks like Redis)
- Single database transaction atomicity

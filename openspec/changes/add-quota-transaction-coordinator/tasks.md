# Implementation Tasks

## 1. Database Schema

- [ ] 1.1 Add `SubscriptionQuota` model to `apps/api/prisma/schema.prisma`
  - Fields: `id`, `uuid` (with @default(uuid())), `balance`, `locked_balance`, `total_spent`, `warning_threshold`, `deleted`, `created_at`, `updated_at`, `created_by` (unique), `updated_by`
  - Use `Decimal` type with precision `@db.Decimal(18, 4)` for all balance fields
  - Add defaults: `balance = 0`, `locked_balance = 0`, `total_spent = 0`, `warning_threshold = 0`, `deleted = false`
  - Add index on `created_by` for fast user lookups
  - Add table mapping: `@@map("subscription_quota")`

- [ ] 1.2 Add `SubscriptionTransaction` model to `apps/api/prisma/schema.prisma`
  - Fields: `id`, `uuid` (with @default(uuid())), `external_id` (nullable, unique), `parent_uuid` (nullable), `transaction_type`, `transaction_status`, `change_amount`, `balance_snapshot`, `remark` (nullable), `deleted`, `created_at`, `updated_at`, `created_by`, `updated_by`
  - Use `@db.Char(32)` for type and status fields
  - Use `@db.Decimal(18, 4)` for amount and snapshot fields
  - Add unique constraint on `external_id` for idempotency
  - Add indexes on `created_by` and `external_id`
  - Add table mapping: `@@map("subscription_transaction")`

- [ ] 1.3 Generate Prisma client and create migration
  - Run `pnpm --filter @brownie/api prisma-generate`
  - Run `npx prisma migrate dev --name add-quota-transaction-coordinator`
  - Verify migration SQL includes all fields, constraints, and indexes

- [ ] 1.4 Seed initial user quotas for testing
  - Create seed script to add `SubscriptionQuota` records for existing users (e.g., 100 credits default balance)
  - Ensure `created_by` matches existing user UUIDs

## 2. Enum and Constants

- [ ] 2.1 Create transaction type enum in `apps/api/src/enum/transaction.enum.ts`
  - Define `TransactionType` with values: `PRE_DEDUCT`, `SETTLE`, `ROLLBACK`, `TOPUP`
  - Define `TransactionStatus` with values: `PENDING`, `SUCCESS`, `FAILED`

- [ ] 2.2 Define credit cost constants in `apps/api/src/constants/quota.constants.ts`
  - `TEXT_TO_IMAGE_COST = 1`
  - `IMAGE_TO_IMAGE_COST = 2`
  - Export as readonly constants

## 3. Service Implementation

- [ ] 3.1 Create `QuotaTransactionCoordinatorService` at `apps/api/src/service/quota-transaction-coordinator.service.ts`
  - Inject `PrismaService` dependency
  - Initialize logger

- [ ] 3.2 Implement `preDeduct` method
  - Accept parameters: `userId: string`, `amount: number`, `externalId: string`
  - Use `prisma.$transaction()` with interactive transaction callback
  - Lock user quota row: `findUnique({ where: { created_by: userId } })` (Prisma handles locking)
  - Check if transaction with `external_id` already exists (idempotency check)
  - If exists and PENDING, return existing transaction
  - Validate `balance >= amount`, throw `InsufficientBalanceException` if insufficient
  - Calculate new balance: `newBalance = currentBalance - amount`, `newLockedBalance = currentLockedBalance + amount`
  - Update `SubscriptionQuota`: set balance and locked_balance
  - Create `SubscriptionTransaction` with:
    - `transaction_type = PRE_DEDUCT`
    - `transaction_status = PENDING`
    - `change_amount = -amount` (negative)
    - `balance_snapshot = newBalance`
    - `external_id = externalId`
    - `parent_uuid = null`
  - Return transaction details

- [ ] 3.3 Implement `settle` method (renamed from `commit`)
  - Accept parameter: `externalId: string`
  - Use `prisma.$transaction()` with interactive transaction callback
  - Find PRE_DEDUCT transaction by `external_id`
  - Throw `TransactionNotFoundException` if not found
  - If already SUCCESS with SETTLE child, return success (idempotency)
  - Validate original transaction status is PENDING
  - Update original transaction: `transaction_status = SUCCESS`
  - Get quota record for user
  - Calculate new values: `newLockedBalance = currentLockedBalance - amount`, `newTotalSpent = currentTotalSpent + amount`
  - Update `SubscriptionQuota`: set locked_balance and total_spent
  - Create new SETTLE transaction with:
    - `transaction_type = SETTLE`
    - `transaction_status = SUCCESS`
    - `change_amount = original.change_amount` (same as parent, negative)
    - `balance_snapshot = currentBalance` (balance unchanged in settle)
    - `parent_uuid = original.uuid`
    - `external_id = null`
  - Return success confirmation

- [ ] 3.4 Implement `rollback` method
  - Accept parameters: `externalId: string`, `reason?: string`
  - Use `prisma.$transaction()` with interactive transaction callback
  - Find PRE_DEDUCT transaction by `external_id`
  - Throw `TransactionNotFoundException` if not found
  - If already SUCCESS with ROLLBACK child, return success (idempotency)
  - Validate original transaction status is PENDING
  - Update original transaction: `transaction_status = SUCCESS`
  - Get quota record for user
  - Calculate amount from original transaction (abs value of change_amount)
  - Calculate new values: `newBalance = currentBalance + amount`, `newLockedBalance = currentLockedBalance - amount`
  - Update `SubscriptionQuota`: set balance and locked_balance
  - Create new ROLLBACK transaction with:
    - `transaction_type = ROLLBACK`
    - `transaction_status = SUCCESS`
    - `change_amount = +amount` (positive, opposite of parent)
    - `balance_snapshot = newBalance`
    - `parent_uuid = original.uuid`
    - `remark = reason`
    - `external_id = null`
  - Return success confirmation

- [ ] 3.5 Implement `getQuota` method (renamed from `getBalance`)
  - Accept parameter: `userId: string`
  - Query `SubscriptionQuota` by `created_by = userId`
  - Throw `QuotaNotFoundException` if not found
  - Return quota details: `balance`, `locked_balance`, `total_spent`, `warning_threshold`

- [ ] 3.6 Implement `topUp` method
  - Accept parameters: `userId: string`, `amount: number`, `externalId?: string`, `reason?: string`
  - Use `prisma.$transaction()` with interactive transaction callback
  - If `externalId` provided, check for existing TOPUP transaction (idempotency)
  - If exists, return existing transaction
  - Lock and get quota record
  - Calculate new balance: `newBalance = currentBalance + amount`
  - Update `SubscriptionQuota`: set balance
  - Create TOPUP transaction with:
    - `transaction_type = TOPUP`
    - `transaction_status = SUCCESS`
    - `change_amount = +amount` (positive)
    - `balance_snapshot = newBalance`
    - `external_id = externalId` (if provided)
    - `parent_uuid = null`
    - `remark = reason`
  - Return transaction details

## 4. Exception Classes

- [ ] 4.1 Create custom exceptions in `apps/api/src/exception/`
  - `InsufficientBalanceException` (extends `BadRequestException`)
  - `TransactionNotFoundException` (extends `NotFoundException`)
  - `QuotaNotFoundException` (extends `NotFoundException`)

- [ ] 4.2 Add error messages to `apps/api/src/exception/error-message.ts`
  - `InsufficientBalance`: "Insufficient balance to complete operation"
  - `TransactionNotFound`: "Transaction not found"
  - `QuotaNotFound`: "User quota not found"

## 5. Integration with Task Service

- [ ] 5.1 Inject `QuotaTransactionCoordinatorService` into `TaskService`
  - Add to constructor dependencies
  - Store as private readonly property

- [ ] 5.2 Update `createNanoBananaProTask` method
  - Import credit cost constants
  - Determine cost based on task type (TEXT_TO_IMAGE vs IMAGE_TO_IMAGE)
  - Before creating task, call `preDeduct(created_by, cost, taskUuid)`
  - Wrap existing AI generation code in try/catch
  - On success (after task status=COMPLETED at line 249-255):
    - Call `settle(taskUuid)` to finalize charge
  - On failure (in catch block at line 258-270, before setting status=FAILED):
    - Call `rollback(taskUuid, error.message)` to return credits
    - Then proceed with existing error handling

- [ ] 5.3 Handle quota errors gracefully
  - If `preDeduct` throws `InsufficientBalanceException`, return clear error to user without creating task
  - Log all quota operations for debugging

## 6. Documentation & Monitoring

- [ ] 6.1 Add logging to all quota operations
  - Log preDeduct with user_uuid, amount, external_id, result
  - Log settle with external_id, parent transaction UUID
  - Log rollback with external_id, reason, parent transaction UUID
  - Log topUp with user_uuid, amount, reason
  - Log errors with full context for debugging

- [ ] 6.2 Update API documentation
  - Document quota behavior in task creation endpoints
  - Document error responses for insufficient balance
  - Document that tasks consume credits before execution

- [ ] 6.3 Create admin utilities (optional for MVP)
  - Script to query stuck PENDING transactions (older than 1 hour)
  - Script to manually rollback stuck transactions
  - Script to query user transaction history with parent-child relationships

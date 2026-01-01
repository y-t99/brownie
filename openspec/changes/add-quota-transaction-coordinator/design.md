# Design: Quota Transaction Coordinator

## Context

The Brownie API currently provides AI generation services (text-to-image, image-to-image) without any quota or billing management. Users can make unlimited requests, and there's no mechanism to track usage or enforce limits. For a viable MVP, we need reliable financial controls before scaling.

**Key Stakeholders:**
- End users: Need transparent, fair billing
- Developers: Need simple, reliable quota APIs
- Business: Need accurate usage tracking and financial integrity

**Constraints:**
- MVP timeline: Must be simple and ship quickly
- Scale: Optimize for <1000 concurrent users initially
- Database: PostgreSQL with Prisma ORM
- Existing services: NestJS-based task and chat services

## Goals / Non-Goals

**Goals:**
- Prevent double-charging users on retry/failure scenarios
- Ensure atomic balance updates (no partial states)
- Provide clean API for business services to check/deduct quotas
- Track all transactions for audit and debugging
- Protect against negative balances

**Non-Goals:**
- Distributed locking (Redis, Zookeeper) - overkill for MVP scale
- Async message queues - adds complexity without clear benefit at this scale
- Multi-currency or complex pricing models - flat rate per operation for MVP
- Real-time balance streaming to clients - batch queries are sufficient

## Decisions

### Decision 1: Three-Phase Transaction Pattern (Pre-deduct → Commit/Rollback)

**Rationale:**
The two-phase commit pattern is proven in financial systems. By locking funds upfront (`preDeduct`), we guarantee the user has sufficient balance before making expensive AI API calls. If the AI call fails, we `rollback` the lock. If it succeeds, we `commit` the charge.

**Alternatives Considered:**
1. **Post-deduction only**: Charge after AI call completes
   - ❌ Problem: User might run out of credits mid-operation, wasting API costs
2. **Optimistic locking**: Assume success, rollback on failure
   - ❌ Problem: Race conditions can allow negative balances
3. **Pre-deduct with timeout**: Auto-rollback after X minutes
   - ⚠️ Viable but adds complexity; defer to post-MVP

**Decision:** Use explicit three-phase pattern with manual commit/rollback.

### Decision 2: Idempotency via external_id

**Rationale:**
Network retries are common. Without idempotency, a retry could create duplicate PENDING transactions. By requiring callers to provide a unique `external_id` (e.g., `taskUuid`), we can detect and ignore duplicate `preDeduct` calls.

**Implementation:**
- Add `external_id` as a UNIQUE constraint in `SubscriptionTransaction` table
- On duplicate `external_id`, return the existing transaction instead of creating new

**Alternatives Considered:**
1. **Database-level deduplication only**: Rely on UNIQUE constraint errors
   - ❌ Problem: Ugly error handling, no graceful retry experience
2. **Time-window deduplication**: Only prevent duplicates within 5 minutes
   - ⚠️ Adds complexity without clear benefit

**Decision:** Strict idempotency with permanent uniqueness.

### Decision 3: Synchronous, Blocking Quota Checks

**Rationale:**
For MVP, quota checks must happen *before* initiating AI API calls to avoid wasted costs. Synchronous blocking is simpler and sufficient for <1000 concurrent users.

**Performance Considerations:**
- SQL row-level locking is fast (<10ms) for low contention
- If we hit scale issues, we can add Redis caching layer post-MVP

**Alternatives Considered:**
1. **Async event-driven**: Publish event, process in background
   - ❌ Problem: Can't block AI call if quota insufficient
2. **Optimistic with eventual consistency**: Check quota, charge later
   - ❌ Problem: Users could exceed limits before we catch up

**Decision:** Synchronous preDeduct required before AI operations.

### Decision 4: Single Database Transaction for Atomicity

**Rationale:**
PostgreSQL ACID guarantees are sufficient for MVP. Using Prisma's `$transaction` ensures that balance updates and transaction log writes succeed together or fail together.

**Example:**
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Deduct from user quota
  await tx.subscriptionQuota.update({ ... });
  // 2. Create transaction record
  await tx.subscriptionTransaction.create({ ... });
  // Both succeed or both rollback
});
```

**Alternatives Considered:**
1. **Distributed transactions (2PC)**: Coordinate across multiple databases
   - ❌ Overkill for single-database architecture
2. **Saga pattern**: Multi-step compensating transactions
   - ❌ Too complex for MVP

**Decision:** Use Prisma `$transaction` for atomic operations.

### Decision 5: SubscriptionQuota Schema Design

**Schema:**
```prisma
model SubscriptionQuota {
  id                Int      @id @default(autoincrement())
  uuid              String   @unique @default(uuid()) @db.Char(191)

  // Financial Core Fields
  balance           Decimal  @default(0) @db.Decimal(18, 4) // Available credits for use
  locked_balance    Decimal  @default(0) @db.Decimal(18, 4) // Credits currently frozen/pending
  total_spent       Decimal  @default(0) @db.Decimal(18, 4) // Cumulative historical usage
  warning_threshold Decimal  @default(0) @db.Decimal(18, 4) // Threshold for low-balance alerts

  // Standard Audit Fields
  deleted           Boolean  @default(false)
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  created_by        String   @unique @db.Char(191) // Linked User/Developer ID
  updated_by        String   @db.Char(191)

  @@index([created_by])
  @@map("subscription_quota")
}
```

**Rationale:**
- **`balance`**: Available credits the user can spend
- **`locked_balance`**: Credits reserved for pending operations (PENDING state) - prevents double-spending during concurrent requests
- **`total_spent`**: Audit trail of total usage (never decreases) - enables lifetime usage tracking
- **`warning_threshold`**: Configurable alert threshold for low balance notifications (deferred to post-MVP for implementation)
- **`created_by` as unique key**: Uses user identifier directly instead of separate `user_uuid` field, simplifying schema and queries

**Flow:**
1. **preDeduct**: `balance -= amount`, `locked_balance += amount`
2. **settle** (commit): `locked_balance -= amount`, `total_spent += amount`
3. **rollback**: `locked_balance -= amount`, `balance += amount`

**Invariant:** `balance >= 0` (enforced by application logic before updates)

**Design Benefits:**
- **Decimal precision (18, 4)**: Balances cost vs. precision - 4 decimal places sufficient for fractional credits while reducing storage overhead
- **Automatic UUID generation**: Simplifies service layer code by delegating ID generation to database
- **Soft delete flag**: Enables balance history preservation for audit compliance without hard deletion

### Decision 6: SubscriptionTransaction Schema

**Schema:**
```prisma
model SubscriptionTransaction {
  id                 Int      @id @default(autoincrement())
  uuid               String   @unique @default(uuid()) @db.Char(191)

  // Business Logic & Idempotency
  external_id        String?  @unique @db.Char(191) // Unique Request ID from API to prevent double-charging
  parent_uuid        String?  @db.Char(191)        // Links Rollbacks/Settlements to the original Pre-deduct

  // Transaction Details
  transaction_type   String   @db.Char(32)  // Types: PRE_DEDUCT, SETTLE, ROLLBACK, TOPUP
  transaction_status String   @db.Char(32)  // Status: PENDING, SUCCESS, FAILED

  change_amount      Decimal  @db.Decimal(18, 4) // Positive for credits added, negative for deducted
  balance_snapshot   Decimal  @db.Decimal(18, 4) // Balance after this transaction for audit trails
  remark             String?  @db.Char(191)      // Error messages or human-readable notes

  // Standard Audit Fields
  deleted            Boolean  @default(false)
  created_at         DateTime @default(now())
  updated_at         DateTime @updatedAt
  created_by         String   @db.Char(191)
  updated_by         String   @db.Char(191)

  @@index([created_by])
  @@index([external_id])
  @@map("subscription_transaction")
}
```

**Transaction Types:**
- **`PRE_DEDUCT`**: Initial lock when operation starts, status = PENDING
- **`SETTLE`**: Finalize charge when operation succeeds, status = SUCCESS
- **`ROLLBACK`**: Cancel charge when operation fails, status = SUCCESS (rollback succeeded)
- **`TOPUP`**: Add credits to account (e.g., purchase, admin grant), status = SUCCESS

**Status Values:**
- **`PENDING`**: Transaction is locked, awaiting settle/rollback (only for PRE_DEDUCT)
- **`SUCCESS`**: Transaction completed successfully
- **`FAILED`**: Unexpected error during processing (requires manual intervention)

**Key Fields Explained:**
- **`external_id` (optional)**: Idempotency key for API requests (e.g., `taskUuid`). Only PRE_DEDUCT transactions require this. SETTLE/ROLLBACK use `parent_uuid` to reference the original PRE_DEDUCT
- **`parent_uuid`**: Links SETTLE/ROLLBACK back to original PRE_DEDUCT transaction UUID, enabling full audit trail reconstruction
- **`change_amount`**:
  - Negative for deductions (PRE_DEDUCT, SETTLE): `-10.5000`
  - Positive for additions (TOPUP, ROLLBACK): `+10.5000`
- **`balance_snapshot`**: Records `SubscriptionQuota.balance` value immediately after this transaction, critical for dispute resolution and debugging
- **`remark`**: Human-readable context (e.g., "AI generation task abc123", "Rollback due to API timeout")

**Design Benefits:**
- **Parent-child traceability**: `parent_uuid` creates explicit link between PRE_DEDUCT → SETTLE/ROLLBACK, making financial audits trivial
- **Balance reconstruction**: `balance_snapshot` allows point-in-time balance verification without replaying entire transaction history
- **Flexible idempotency**: `external_id` is optional, only required for operations that need retry protection

## Risks / Trade-offs

### Risk 1: Database Lock Contention
**Impact:** High-volume users might experience slow quota checks if many concurrent requests hit the same user balance row.

**Mitigation:**
- For MVP, row-level locking is acceptable for <1000 concurrent users
- If contention becomes an issue, add Redis cache layer for balance reads
- Monitor query performance and database lock metrics

### Risk 2: Stuck PENDING Transactions
**Impact:** If service crashes between `preDeduct` and `commit/rollback`, funds remain locked indefinitely.

**Mitigation:**
- Add background job to auto-rollback PENDING transactions older than 1 hour
- Provide admin dashboard to manually inspect and resolve stuck transactions
- Log warnings for long-running PENDING states

### Risk 3: Idempotency Key Collisions
**Impact:** If different operations accidentally reuse the same `external_id`, one will be silently ignored.

**Mitigation:**
- Use UUIDs generated by the coordinator or caller (e.g., `taskUuid`)
- Document requirement for globally unique IDs
- Add validation to reject non-UUID formats

## Migration Plan

**Phase 1: Database Schema (No Breaking Changes)**
1. Add `SubscriptionQuota` and `SubscriptionTransaction` models to Prisma schema
2. Run migration: `pnpm --filter @brownie/api prisma-generate && npx prisma migrate dev --name add-quota-transaction-coordinator`
3. Seed test users with initial quota records (e.g., 100 credits balance)

**Phase 2: Service Implementation**
1. Create `QuotaTransactionCoordinatorService` with core methods
2. Write unit tests for preDeduct, settle, rollback
3. Write integration tests for concurrent operations

**Phase 3: Service Integration (Breaking Changes)**
1. Update `TaskService.createNanoBananaProTask` to call `preDeduct` before AI call
2. Wrap AI generation in try/catch: settle on success, rollback on failure
3. Update `ChatService` similarly (if quota-aware)

**Phase 4: Monitoring & Operations**
1. Add logs for all quota operations
2. Create admin API to view user balances and transaction history
3. Set up alerts for stuck PENDING transactions

**Rollback Plan:**
If critical bugs are found post-deployment:
1. Feature flag to bypass quota checks (allow all operations)
2. Fix bugs in staging environment
3. Re-enable quota checks after validation

## Open Questions

1. **Initial user balance**: What's the default credit amount for new users?
   - **Proposed**: 100 credits for beta users, 0 for production (require payment)

2. **Credit pricing**: How many credits per operation?
   - **Proposed**: 1 credit per text-to-image, 2 credits per image-to-image (higher resolution = higher cost)

3. **Negative balance handling**: Should we allow temporary overdrafts?
   - **Proposed**: No overdrafts for MVP; strict enforcement of `balance >= amount`

4. **Timeout for auto-rollback**: How long before PENDING transactions auto-rollback?
   - **Proposed**: 1 hour for MVP, configurable via environment variable

5. **Audit retention**: How long should we keep transaction history?
   - **Proposed**: Indefinite retention for MVP (add archival strategy post-MVP if storage becomes issue)

# Brownie Project Conventions

## Overview

Brownie is an AI-powered creative platform providing text-to-image and image-to-image generation services. The backend API is built with NestJS, Prisma ORM, and PostgreSQL.

## Technology Stack

- **Framework**: NestJS (Node.js)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **AI Providers**: Google Generative AI (Gemini models)
- **Storage**: S3-compatible object storage
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces

## Architectural Principles

### Simplicity First
- Write concise, powerful code that does exactly what's needed
- Avoid over-engineering and premature abstractions
- Implement the simplest correct solution first
- Let requirements drive implementation, not speculation

### Data Integrity
- Related operations must be atomic—succeed together or fail together
- Validate all inputs strictly; reject invalid data immediately
- Use database transactions (`prisma.$transaction()`) for multi-step operations
- Calculate derived values from source data rather than storing redundant information

### Consistency
- Follow established NestJS patterns (controllers, services, providers)
- Use Prisma for all database access
- Error handling uses unified, predefined messages in `exception/error-message.ts`
- All text (messages, comments, docs) must be in English

## Code Organization

```
apps/api/
├── src/
│   ├── controller/        # HTTP route handlers
│   ├── service/           # Business logic
│   ├── db-provider/       # Database providers (Prisma)
│   ├── enum/              # Shared enums
│   ├── exception/         # Custom exceptions and error messages
│   └── util/              # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
```

## Naming Conventions

### Files and Directories
- Use kebab-case: `task.service.ts`, `quota-transaction-coordinator.service.ts`
- Service files: `*.service.ts`
- Controller files: `*.controller.ts`
- Enum files: `*.enum.ts`

### Database
- Table names: snake_case (e.g., `user_balance`, `subscription_transaction`)
- Column names: snake_case (e.g., `user_uuid`, `created_at`)
- Model names in Prisma: PascalCase (e.g., `UserBalance`, `SubscriptionTransaction`)
- Use `@@map()` to map PascalCase models to snake_case tables

### TypeScript
- Classes: PascalCase (e.g., `TaskService`, `QuotaTransactionCoordinatorService`)
- Interfaces: PascalCase with descriptive names (e.g., `NanoBananaProInput`)
- Variables/parameters: camelCase (e.g., `userId`, `externalId`)
- Constants: UPPER_SNAKE_CASE (e.g., `TEXT_TO_IMAGE_COST`)
- Enums: PascalCase names, UPPER_SNAKE_CASE values (e.g., `TaskStatus.PENDING`)

## Database Schema Standards

### Common Fields
All models should include:
```prisma
id         Int      @id @default(autoincrement())
uuid       String   @unique @db.Char(191)
created_at DateTime @default(now())
updated_at DateTime @updatedAt
created_by String   @db.Char(191)
updated_by String   @db.Char(191)
deleted    Boolean  @default(false)  // Soft delete flag (if applicable)
```

### UUID Generation
- Use `generateUUID(UUIDType.*)` utility for all UUIDs
- Define UUID types in `UUIDType` enum

### Financial/Numeric Fields
- Use `Decimal` type with `@db.Decimal(18, 8)` for monetary values
- Never use `Float` or `Double` for financial calculations

### Indexes
- Add `@unique` on natural keys (e.g., `uuid`, `external_id`)
- Add `@@index()` on frequently queried fields (e.g., `user_uuid`, `created_by`)

## Error Handling

### Exception Classes
- Extend NestJS built-in exceptions: `BadRequestException`, `NotFoundException`, etc.
- Define custom exceptions in `exception/` directory
- Add error messages to `exception/error-message.ts` constant

### Error Messages
- Use clear, professional English
- Follow pattern: `"Resource not found"`, `"Insufficient balance to complete operation"`
- Reference messages from `ERROR_MESSAGE` constant

## Service Patterns

### Dependency Injection
```typescript
@Injectable()
export class MyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
}
```

### Transaction Usage
```typescript
await this.prisma.$transaction(async (tx) => {
  // Multiple database operations
  await tx.model1.update({ ... });
  await tx.model2.create({ ... });
});
```

### Logging
```typescript
private readonly logger = new Logger(MyService.name);

this.logger.log('Operation completed successfully');
this.logger.error('Operation failed:', error);
this.logger.warn('Potential issue detected');
```

## Testing Standards

### Test Organization
- Unit tests: Test individual methods in isolation
- Integration tests: Test full workflows with real database
- Use descriptive test names: `"should throw InsufficientBalanceException when balance is insufficient"`

### Test Database
- Use separate test database or in-memory database
- Clean up test data after each test
- Use transactions for test isolation when possible

## Deployment & Operations

### Environment Variables
- Define all config in `.env` file
- Use `ConfigService` to access environment variables
- Document required variables in `.env.example`

### Database Migrations
- Generate migrations: `npx prisma migrate dev --name <description>`
- Apply migrations: `npx prisma migrate deploy`
- Always review generated SQL before applying

### Monitoring
- Log all critical operations (quota changes, payments, errors)
- Include context in logs: user ID, operation ID, amounts
- Use structured logging where possible

## OpenSpec Integration

### When to Create Proposals
- New features or capabilities
- Breaking changes (API, schema)
- Architecture changes
- Performance optimizations that change behavior
- Security pattern updates

### When to Skip Proposals
- Bug fixes (restoring intended behavior)
- Typos, formatting, comments
- Non-breaking dependency updates
- Configuration changes
- Tests for existing behavior

## Security Considerations

### Input Validation
- Validate all user inputs at controller level
- Use NestJS validation pipes with class-validator
- Reject invalid data immediately with clear errors

### Financial Operations
- Use database transactions for atomicity
- Validate balance before operations
- Maintain audit trails for all financial changes
- Enforce idempotency for critical operations

### Authentication
- Store password hashes with salt (never plaintext)
- Use secure session management
- Validate user permissions before operations

# Brownie API

A NestJS-based backend API service for the Brownie platform, providing comprehensive authentication, chat, and task management capabilities.

## Features Overview

### 1. Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication system using `@nestjs/jwt`
- **User Registration & Login**: 
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/signin` - User login
- **Role-Based Access Control (RBAC)**: Support for User and Admin roles
- **Guards & Decorators**:
  - `AuthGuard` - JWT token verification and request authentication
  - `RoleGuard` - Role-based authorization
  - `@Public()` decorator - Mark endpoints as publicly accessible
  - `@Roles()` decorator - Restrict endpoints to specific roles

### 2. Chat System
- **Session Management**: Create and manage chat sessions with unique UUIDs
- **Message Handling**: 
  - `GET /api/chat/session/:sessionUuid` - Retrieve chat session details
  - `POST /api/chat/session/:sessionUuid/message` - Submit user messages
- **Real-time Streaming**: 
  - `SSE /api/chat/session/:sessionUuid/message/:messageUuid/assistant/stream` - Server-Sent Events for streaming assistant responses
- **Message Roles**: Support for system, user, assistant, and tool messages
- **Message States**: Track message lifecycle (executing, processing, pending, success, paused, error)
- **Message Blocks**: Structured content storage with JSON support

### 3. Task Management
- **Task Creation & Storage**: Store tasks with metadata and payload
- **Resource Relations**: Link tasks with related resources through `TaskResourceRelation` model
- **Task Triggers**: 
  - `POST /api/task/trigger/callback/:state` - Admin-only task trigger callbacks
- **Integration with Trigger.dev**: Uses `@brownie/task` package for background job processing
- **Quota & Credits**:
  - AI tasks are pre-charged via a quota lock before execution, then settled on success or rolled back on failure
  - Insufficient balance results in a `400 Bad Request` without creating a task

### 4. Internal Administration
Admin-only endpoints for system management:
- **Message Specification Retrieval**: 
  - `GET /api/internal/session/:sessionUuid/message/:messageUuid/specification/:specification`
- **Context Curation**: 
  - `POST /api/internal/context/curation` - Manage user context and memory

### 5. Database & Data Persistence
- **PostgreSQL Database**: Using Prisma ORM
- **Models**:
  - `User` - User accounts with password hashing and salt
  - `ChatSession` - Chat session records
  - `ChatMessage` - Individual messages with role and status
  - `ChatMessageBlock` - Message content blocks
  - `Task` - Task definitions and metadata
  - `TaskResourceRelation` - Task-resource associations
- **Soft Delete Support**: Logical deletion with `deleted` flag
- **Audit Trail**: Automatic tracking of created_at, updated_at, created_by, updated_by

### 6. Middleware & Validation
- **Global Validation Pipe**: Input validation using `class-validator` and `class-transformer`
- **CORS Enabled**: Cross-Origin Resource Sharing support
- **Global API Prefix**: All endpoints prefixed with `/api`

### 7. Infrastructure
- **Docker Support**: Dockerfile included for containerized deployment
- **Environment Configuration**: Using `@nestjs/config` for environment variable management
- **Database Migrations**: Prisma migrations for schema version control
- **Port Configuration**: Configurable port (default: 3001)

## Technology Stack
- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **ORM**: Prisma 6.x
- **Database**: PostgreSQL
- **Authentication**: JWT (@nestjs/jwt)
- **Runtime**: Node.js
- **Package Manager**: pnpm (workspace)
- **AI Integration**: Vercel AI SDK

## API Endpoints Summary

### Public Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Protected Endpoints (Authenticated Users)
- `GET /api/chat/session/:sessionUuid` - Get chat session
- `POST /api/chat/session/:sessionUuid/message` - Send message
- `SSE /api/chat/session/:sessionUuid/message/:messageUuid/assistant/stream` - Stream assistant response

### Admin-Only Endpoints
- `POST /api/task/trigger/callback/:state` - Task trigger callback
- `GET /api/internal/session/:sessionUuid/message/:messageUuid/specification/:specification` - Get message specification
- `POST /api/internal/context/curation` - Context curation

## Development Commands
```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start:prod

# Database
pnpm prisma-generate

# Testing
pnpm test
pnpm test:e2e

# Linting
pnpm lint
```

## Architecture Highlights
- **Modular Design**: Separated controllers, services, and middleware
- **Dependency Injection**: Leveraging NestJS DI container
- **Type Safety**: Full TypeScript implementation
- **Scalable Structure**: Organized by feature domains (auth, chat, task, user)
- **Security First**: JWT authentication, role-based access control, input validation
- **Real-time Capabilities**: SSE for streaming responses
- **Extensible**: Easy to add new features and modules

# Brownie API

A NestJS-based API server for the Brownie project.

## Description

This is the backend API service built with [NestJS](https://nestjs.com/), providing RESTful endpoints for the Brownie application.

## Installation

```bash
# Install dependencies from the root of the monorepo
pnpm install
```

## Running the app

```bash
# Development mode
pnpm dev

# Production mode
pnpm start:prod
```

## Test

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## API Endpoints

- `GET /api` - Welcome message
- `GET /api/health` - Health check endpoint

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
src/
├── app.controller.ts    # Main application controller
├── app.module.ts        # Root application module
├── app.service.ts       # Main application service
└── main.ts             # Application entry point
```

## Development

The API server runs on `http://localhost:3001` by default with the `/api` prefix.

All endpoints are prefixed with `/api`, so the health check endpoint would be available at:
`http://localhost:3001/api/health`
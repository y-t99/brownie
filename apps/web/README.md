# Web

Brownie web application (Next.js).

## Routes

- Landing page: `/`
- Developer console: `/console` (e.g. `/console/transactions`, `/console/login`)

## Setup

- Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_API_BASE_URL`.
- Run `pnpm dev --filter=web` (defaults to port `3000`).

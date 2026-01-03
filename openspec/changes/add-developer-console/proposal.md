# Change: Add Developer Console Frontend

## Why

The Brownie API backend currently lacks a user-facing interface for developers to monitor their API usage, track transaction history, and manage costs. Developers need a clean, efficient way to:
- Monitor API call transactions in real-time
- Debug failed requests by inspecting payloads
- Track costs and usage patterns
- Manage API keys and account settings

A dedicated B2D (Business to Developer) console will provide developers with the visibility and control they need, following a Zen & Minimalist design philosophy that prioritizes data clarity and developer productivity.

## What Changes

- **NEW**: Next.js 14+ frontend application with App Router
- **NEW**: Transactions monitoring page with high-density data table
- **NEW**: Task detail drawer for debugging and inspection
- **NEW**: Zen-inspired visual design system (Tailwind + Shadcn/UI)
- **NEW**: Developer-focused UX (keyboard shortcuts, monospace fonts, click-to-copy utilities)
- **NEW**: Global navigation shell with user context and balance display

### Technology Additions
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI components (Radix UI)
- Lucide React icons
- Inter font (UI) + JetBrains Mono/Fira Code (monospace)

## Impact

- **Affected specs**: Creates new `developer-console` capability
- **Affected code**:
  - New `/apps/console/` or `/apps/web/` directory (frontend application)
  - API endpoints may need CORS configuration for frontend consumption
  - Potential authentication/session management integration
- **Dependencies**: Requires backend API to be accessible from frontend (CORS, authentication)
- **User Experience**: First user-facing interface for the platform
- **Deployment**: New deployment target (Vercel/Next.js hosting)

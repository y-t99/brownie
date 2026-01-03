# Design: Developer Console Frontend

## Context

The Brownie platform currently consists of a NestJS API backend with Prisma ORM and PostgreSQL. This proposal adds a frontend web application to provide developers with a graphical interface for monitoring API usage and managing their accounts.

**Background:**
- Current state: API-only backend serving AI model aggregation requests
- Target users: Technical developers familiar with APIs, terminal tools, and keyboard-driven workflows
- Business goal: Improve developer experience and provide transparency into usage and costs

**Constraints:**
- Must maintain backend-frontend separation (no monolithic coupling)
- Frontend should be deployable independently
- Must work with existing API authentication mechanisms
- Performance: Initial page load < 2s, table interactions < 100ms

**Stakeholders:**
- End users: Developers using the Brownie API
- Internal: Backend team (API contracts), DevOps (deployment), Product (UX requirements)

## Goals / Non-Goals

**Goals:**
- Provide real-time transaction monitoring with debugging capabilities
- Implement Zen & Minimalist design philosophy (high signal-to-noise ratio)
- Support developer workflows (keyboard shortcuts, copy utilities, monospace data)
- Maintain sub-100ms interaction latency for table operations
- Enable easy debugging with payload inspection and detailed error states

**Non-Goals:**
- Real-time WebSocket updates (use polling initially)
- Mobile-first responsive design (desktop-first for developers)
- Multi-language i18n (English only, as per project conventions)
- Advanced analytics/dashboards (focus on raw transaction data first)
- Admin management features (user-facing only in MVP)

## Decisions

### 1. Framework: Next.js 14+ with App Router

**Decision:** Use Next.js 14+ with App Router (not Pages Router).

**Rationale:**
- **Server Components**: Reduces JavaScript bundle size, improves initial load performance
- **App Router**: Modern, type-safe routing with layouts and nested routes
- **React Server Components**: Enables data fetching closer to components
- **Built-in optimization**: Image optimization, font optimization, code splitting
- **Developer ecosystem**: Large community, excellent TypeScript support

**Alternatives considered:**
- Vite + React SPA: Faster dev server but requires more manual optimization and API route setup
- Remix: Great DX but smaller ecosystem and less mature
- Pure React SPA: Simple but loses server-side rendering benefits

### 2. Component Library: Shadcn/UI (Radix UI + Tailwind)

**Decision:** Use Shadcn/UI components built on Radix UI primitives.

**Rationale:**
- **Copy-paste components**: Full control over component code (not a dependency)
- **Radix UI primitives**: Accessible, unstyled components with excellent keyboard support
- **Tailwind integration**: Fits Zen design philosophy (utility-first, minimal custom CSS)
- **Developer-friendly**: Easy to customize and extend without fighting abstractions

**Alternatives considered:**
- Material UI: Too opinionated, harder to achieve minimalist aesthetic
- Chakra UI: Good but adds extra bundle size and runtime overhead
- Headless UI: Similar to Radix but smaller ecosystem

### 3. Data Fetching: Polling over WebSockets

**Decision:** Use polling (SWR or TanStack Query) for initial implementation.

**Rationale:**
- **Simplicity**: No WebSocket infrastructure needed initially
- **Reliability**: Easier to handle reconnection and error states
- **Sufficient for MVP**: 5-10 second polling provides adequate freshness for transaction monitoring
- **Easier debugging**: HTTP requests visible in Network tab

**Future consideration:** Migrate to WebSocket or Server-Sent Events for real-time updates in v2.

### 4. Typography: Inter + JetBrains Mono

**Decision:** Inter for UI text, JetBrains Mono for monospace content.

**Rationale:**
- **Inter**: Modern, highly legible at all sizes, excellent for UI
- **JetBrains Mono**: Developer-favorite, excellent ligatures, clear distinction between similar characters
- **Performance**: Both available via next/font with automatic optimization

**Alternatives:**
- Fira Code: Good ligatures but slightly less readable at small sizes
- SF Pro: System font but less distinctive

### 5. State Management: React Context + SWR

**Decision:** Use React Context for global UI state, SWR for server state.

**Rationale:**
- **Separation of concerns**: UI state (theme, filters) vs. server state (transactions, user data)
- **SWR benefits**: Built-in caching, revalidation, optimistic updates
- **Simplicity**: No Redux boilerplate for simple global state needs

**Alternatives:**
- Redux Toolkit: Overkill for current scope
- Zustand: Good but Context + SWR simpler for this use case
- TanStack Query: Similar to SWR, either works (chose SWR for smaller size)

### 6. Authentication Integration

**Decision:** Use HTTP-only cookies for session management, integrate with existing backend auth.

**Rationale:**
- **Security**: HTTP-only cookies prevent XSS attacks
- **Simplicity**: Backend already handles auth, frontend just maintains session
- **Standard pattern**: Next.js middleware can handle route protection

**Implementation:**
- Backend sets HTTP-only cookie on login
- Frontend middleware validates session on protected routes
- API calls automatically include credentials via `credentials: 'include'`

## Architecture

### Directory Structure

```
apps/
├── api/                    # Existing NestJS backend
└── console/                # NEW: Next.js frontend
    ├── src/
    │   ├── app/            # App Router pages
    │   │   ├── (auth)/     # Auth routes group
    │   │   │   └── login/
    │   │   ├── (dashboard)/  # Protected routes group
    │   │   │   ├── layout.tsx
    │   │   │   ├── page.tsx          # Dashboard
    │   │   │   ├── transactions/     # Transactions page
    │   │   │   └── api-keys/         # API keys page
    │   │   └── api/        # API routes (if needed)
    │   ├── components/     # Shared components
    │   │   ├── ui/         # Shadcn/UI components
    │   │   ├── layout/     # Navigation, shell
    │   │   └── features/   # Feature-specific components
    │   ├── lib/            # Utilities
    │   │   ├── api.ts      # API client
    │   │   ├── hooks/      # Custom React hooks
    │   │   └── utils.ts    # Helpers
    │   └── styles/         # Global styles
    └── public/             # Static assets
```

### Data Flow

```
User Browser
    ↓ (HTTP requests with cookies)
Next.js Frontend (Port 3000)
    ↓ (API calls via fetch)
NestJS API Backend (Port 3001)
    ↓ (Prisma queries)
PostgreSQL Database
```

### Component Hierarchy

```
App Shell
├── TopNavigation
│   ├── Logo
│   ├── NavLinks (Dashboard, Transactions, API Keys)
│   └── UserMenu (Avatar, Balance)
├── PageContainer
│   └── [Page Content]
│       ├── PageHeader (Title, Filters)
│       └── DataTable
│           ├── TableRow (click → opens Drawer)
│           └── TaskDetailSheet (Drawer)
```

## Design System Specifications

### Color Tokens

```typescript
// Tailwind config extensions
const colors = {
  canvas: {
    DEFAULT: '#FFFFFF',
    subtle: 'rgb(250 250 250 / 0.3)', // bg-zinc-50/30
  },
  surface: {
    DEFAULT: '#FFFFFF',
    border: 'rgb(228 228 231)', // zinc-200
  },
  text: {
    primary: 'rgb(24 24 27)',    // zinc-900
    secondary: 'rgb(113 113 122)', // zinc-500
  },
  accent: {
    primary: 'rgb(79 70 229)',   // indigo-600
  },
  status: {
    success: {
      bg: 'rgb(236 253 245)',    // emerald-50
      text: 'rgb(4 120 87)',     // emerald-700
    },
    error: {
      bg: 'rgb(255 241 242)',    // rose-50
      text: 'rgb(190 18 60)',    // rose-700
    },
    pending: {
      bg: 'rgb(254 249 195)',    // yellow-50
      text: 'rgb(161 98 7)',     // yellow-700
    },
  },
}
```

### Spacing System

- Container: `max-w-6xl mx-auto px-8`
- Table row height: `min-h-16` (64px)
- Section spacing: `space-y-8` (32px)
- Card padding: `p-6` (24px)

### Typography Scale

```typescript
// Font family
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}

// Type scale
h1: 'text-3xl font-semibold tracking-tight text-zinc-900'
h2: 'text-2xl font-semibold tracking-tight text-zinc-900'
body: 'text-base text-zinc-900'
secondary: 'text-sm text-zinc-500'
mono: 'font-mono text-sm text-zinc-900'
```

## Risks / Trade-offs

### Risk: Frontend-Backend Version Mismatch
- **Impact**: API contract changes could break frontend
- **Mitigation**:
  - Use TypeScript types generated from backend (or shared types package)
  - Implement API versioning
  - Add integration tests for critical flows

### Risk: Initial Load Performance
- **Impact**: Large JavaScript bundle could slow initial load
- **Mitigation**:
  - Use Server Components to reduce client JS
  - Code split by route
  - Lazy load heavy components (syntax highlighter, etc.)
  - Monitor bundle size with @next/bundle-analyzer

### Risk: Real-time Data Staleness
- **Impact**: Polling may show stale data during high-activity periods
- **Mitigation**:
  - Start with 5s polling interval
  - Add manual refresh button
  - Plan WebSocket upgrade for v2

### Trade-off: Copy-paste Components vs. Library
- **Pro**: Full control, easy customization, no version lock-in
- **Con**: Need to update components manually (but Shadcn/UI makes this easy)
- **Decision**: Acceptable trade-off for flexibility

### Trade-off: Desktop-first Design
- **Pro**: Optimized for target users (developers on laptops/desktops)
- **Con**: Mobile experience may be compromised
- **Decision**: Acceptable for B2D use case (can add mobile support later)

## Migration Plan

### Phase 1: MVP (Transactions Monitoring)
1. Set up Next.js project structure
2. Implement global layout and navigation
3. Build Transactions page with data table
4. Add Task detail drawer
5. Integrate with backend API
6. Deploy to staging environment

### Phase 2: Additional Features
- Dashboard with usage charts
- API Keys management page
- Account settings
- Billing/top-up functionality

### Deployment Strategy
- **Staging**: Deploy to Vercel preview environment for each PR
- **Production**: Deploy to Vercel production on merge to main
- **Environment variables**: Manage via Vercel environment variables
- **Rollback**: Use Vercel instant rollback feature

### Rollback Plan
- Vercel allows instant rollback to previous deployment
- No database migrations in frontend (safe to rollback anytime)
- If critical issues: disable frontend deployment, redirect users to API docs

## Open Questions

1. **Authentication flow**: Should we use the existing backend session system or implement separate frontend auth?
   - **Recommendation**: Reuse backend session with HTTP-only cookies

2. **API endpoint patterns**: Should frontend call backend directly or use Next.js API routes as proxy?
   - **Recommendation**: Direct calls for simplicity initially, proxy layer if CORS becomes complex

3. **Monorepo structure**: Should console live in `/apps/console` or separate repo?
   - **Recommendation**: Keep in monorepo for easier code sharing and coordinated releases

4. **Image hosting**: Where should generated AI images be displayed from?
   - **Recommendation**: Use existing S3 URLs from backend, add CDN if performance issues

5. **Error tracking**: Should we add Sentry or similar?
   - **Recommendation**: Yes, add Sentry for error tracking and performance monitoring

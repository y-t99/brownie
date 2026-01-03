# Implementation Tasks

## 1. Project Setup & Infrastructure

- [ ] 1.1 Create Next.js 14+ project in `/apps/console` with TypeScript and App Router
- [ ] 1.2 Configure Tailwind CSS with custom theme (zinc palette, spacing, typography)
- [ ] 1.3 Install and configure Shadcn/UI components
- [ ] 1.4 Set up font optimization (next/font) for Inter and JetBrains Mono
- [ ] 1.5 Configure Lucide React icons
- [ ] 1.6 Set up environment variables for API base URL and authentication
- [ ] 1.7 Configure CORS on backend API to allow frontend origin

## 2. Design System Implementation

- [ ] 2.1 Create Tailwind config with custom color tokens (canvas, surface, text, accent, status colors)
- [ ] 2.2 Install and configure Shadcn/UI components: Button, Table, Sheet/Drawer, Badge, Tooltip
- [ ] 2.3 Create global CSS with base styles and typography definitions
- [ ] 2.4 Implement status color variants (success, error, pending) with bg/text combinations
- [ ] 2.5 Create utility components: StatusIndicator, CopyButton, CodeBlock
- [ ] 2.6 Test visual design against Figma/mockups for Zen aesthetic compliance

## 3. Global Layout & Navigation

- [ ] 3.1 Create root layout with global providers (SWR config, auth context)
- [ ] 3.2 Implement TopNavigation component with logo, nav links, user menu
- [ ] 3.3 Add active route highlighting logic for navigation links
- [ ] 3.4 Implement UserMenu with avatar, balance display, and logout option
- [ ] 3.5 Create PageContainer component with max-w-6xl centering and padding
- [ ] 3.6 Add responsive breakpoints for navigation (mobile menu if needed)

## 4. Authentication Integration

- [ ] 4.1 Create API client utility with fetch wrapper (credentials: 'include')
- [ ] 4.2 Implement Next.js middleware for route protection
- [ ] 4.3 Create login page with form and backend integration
- [ ] 4.4 Implement session validation logic (check cookie on page load)
- [ ] 4.5 Add logout functionality (clear session cookie, redirect to login)
- [ ] 4.6 Handle authentication errors (401 redirect to login)
- [ ] 4.7 Implement redirect after login to originally requested page

## 5. Transactions Page - Data Table

- [ ] 5.1 Create `/app/(dashboard)/transactions/page.tsx` with layout
- [ ] 5.2 Implement TransactionTable component with Shadcn Table
- [ ] 5.3 Add table columns: Status, Task ID, Model, Cost, Time, Action
- [ ] 5.4 Apply custom styling: 64px row height, horizontal-only dividers, no vertical lines
- [ ] 5.5 Implement StatusIndicator with color-coded dots and labels
- [ ] 5.6 Add monospace font styling for Task ID and Cost columns
- [ ] 5.7 Implement relative time display ("2 mins ago") using date-fns or similar
- [ ] 5.8 Add click-to-copy functionality for Task ID with toast confirmation
- [ ] 5.9 Implement strikethrough or ¥0.00 display for failed task costs

## 6. Transactions Page - Filtering

- [ ] 6.1 Create FilterPills component for status filter (All, Succeeded, Failed, Pending)
- [ ] 6.2 Create TimePeriodFilter component (Last 30 Days, Last 7 Days, Today, All Time)
- [ ] 6.3 Implement filter state management (URL params or React state)
- [ ] 6.4 Add visual indication for active filters (highlighted pill)
- [ ] 6.5 Connect filters to data fetching logic (pass params to API)
- [ ] 6.6 Test filter combinations and edge cases

## 7. Task Detail Drawer

- [ ] 7.1 Install and configure Shadcn Sheet component for drawer
- [ ] 7.2 Create TaskDetailDrawer component with header, content sections
- [ ] 7.3 Implement drawer open/close logic (triggered by row click or action button)
- [ ] 7.4 Add drawer header with full Task ID and Status badge
- [ ] 7.5 Create ResultSection to display generated image thumbnail (if succeeded)
- [ ] 7.6 Implement image click-to-expand or lightbox functionality
- [ ] 7.7 Create PayloadSection with syntax-highlighted JSON display
- [ ] 7.8 Install syntax highlighter (react-syntax-highlighter or Prism.js)
- [ ] 7.9 Add TimestampsSection showing created_at and updated_at with millisecond precision
- [ ] 7.10 Implement close on Escape key, outside click, and close button
- [ ] 7.11 Add smooth slide-in/slide-out animations

## 8. Data Fetching & State Management

- [ ] 8.1 Install SWR for data fetching and caching
- [ ] 8.2 Create API hooks: `useTransactions`, `useTaskDetail`, `useUser`
- [ ] 8.3 Implement pagination logic for transactions list
- [ ] 8.4 Add automatic revalidation (5-10 second polling) for transactions
- [ ] 8.5 Implement optimistic UI updates for filters
- [ ] 8.6 Add loading states for initial load and refresh
- [ ] 8.7 Create error boundary and error UI for failed API calls
- [ ] 8.8 Add manual refresh button with loading indicator
- [ ] 8.9 Test cache invalidation and data synchronization edge cases

## 9. Performance Optimization

- [ ] 9.1 Implement Server Components for static content (layout, headers)
- [ ] 9.2 Add dynamic imports for heavy components (syntax highlighter, drawer)
- [ ] 9.3 Configure Next.js Image component for generated images
- [ ] 9.4 Add bundle analyzer and review bundle size
- [ ] 9.5 Optimize font loading with next/font preloading
- [ ] 9.6 Test and measure First Contentful Paint (target < 1s)
- [ ] 9.7 Test and measure Time to Interactive (target < 2s)
- [ ] 9.8 Add performance monitoring (Vercel Analytics or similar)

## 10. Developer Experience Features

- [ ] 10.1 Implement keyboard navigation with Tab focus management
- [ ] 10.2 Add visible focus indicators for all interactive elements
- [ ] 10.3 Implement keyboard shortcuts: "/" for search, "Esc" to close drawer, "r" to refresh
- [ ] 10.4 Create keyboard shortcut help modal or tooltip
- [ ] 10.5 Test accessibility with screen readers and keyboard-only navigation
- [ ] 10.6 Add aria-labels and semantic HTML for accessibility

## 11. Testing & Quality Assurance

- [ ] 11.1 Write unit tests for utility functions (formatCurrency, formatDate, etc.)
- [ ] 11.2 Write component tests for key components (TransactionTable, TaskDetailDrawer)
- [ ] 11.3 Add integration tests for authentication flow
- [ ] 11.4 Test filtering and pagination logic
- [ ] 11.5 Perform cross-browser testing (Chrome, Firefox, Safari)
- [ ] 11.6 Test on different screen sizes (desktop focus, but verify mobile doesn't break)
- [ ] 11.7 Load testing: Test with 100+ transactions in table
- [ ] 11.8 Error scenario testing: Network failures, API errors, empty states

## 12. Documentation & Deployment

- [ ] 12.1 Create README.md for `/apps/console` with setup instructions
- [ ] 12.2 Document environment variables in `.env.example`
- [ ] 12.3 Add code comments for complex logic and design decisions
- [ ] 12.4 Create deployment configuration for Vercel or chosen hosting
- [ ] 12.5 Set up CI/CD pipeline (GitHub Actions) for build and deploy
- [ ] 12.6 Configure staging environment for testing
- [ ] 12.7 Deploy to production and verify functionality
- [ ] 12.8 Monitor error logs and performance metrics post-launch

## 13. Additional Pages (Post-MVP)

- [ ] 13.1 Create Dashboard page with usage summary and charts
- [ ] 13.2 Create API Keys management page
- [ ] 13.3 Create Account Settings page
- [ ] 13.4 Create Billing/Top-up page

## Validation Checklist

Before marking complete, verify:
- [ ] All Zen design principles applied (minimal borders, generous spacing, monospace fonts)
- [ ] Table row height is 64px minimum
- [ ] No vertical table dividers (horizontal only)
- [ ] Click-to-copy works for Task IDs
- [ ] Drawer opens/closes smoothly with animations
- [ ] Syntax highlighting displays correctly for JSON payloads
- [ ] Filters update table without full page reload
- [ ] Status colors match specification (emerald, rose, yellow)
- [ ] Timestamps show millisecond precision
- [ ] Page load < 2s, interactions < 100ms
- [ ] Keyboard navigation works throughout
- [ ] Authentication redirects work correctly
- [ ] Failed task costs show as ¥0.00 or strikethrough

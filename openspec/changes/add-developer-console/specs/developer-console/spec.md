# Developer Console Specification

## ADDED Requirements

### Requirement: Global Application Shell

The developer console SHALL provide a global application shell with consistent navigation and user context.

#### Scenario: Navigation header display
- **WHEN** the user accesses any page in the console
- **THEN** the top navigation bar SHALL display:
  - Application logo/brand on the left
  - Navigation links (Dashboard, Transactions, API Keys) in the center-right
  - User avatar and current balance display on the far right

#### Scenario: Active route indication
- **WHEN** the user is on a specific page (e.g., Transactions)
- **THEN** the corresponding navigation link SHALL be visually indicated as active
- **AND** the page title SHALL be displayed in the main content area

#### Scenario: Responsive container layout
- **WHEN** content is rendered on any page
- **THEN** the content SHALL be centered with a maximum width of 1152px (max-w-6xl)
- **AND** appropriate horizontal padding SHALL be applied for smaller viewports

### Requirement: Transactions List View

The console SHALL display a paginated, filterable list of API transaction records.

#### Scenario: Display transaction table
- **WHEN** the user navigates to the Transactions page
- **THEN** a data table SHALL display with the following columns:
  - Status indicator (dot + label)
  - Task ID (last 8 characters of UUID)
  - Model name
  - Cost (formatted as currency)
  - Relative timestamp
  - Action button (chevron or eye icon)
- **AND** table rows SHALL have a minimum height of 64px
- **AND** rows SHALL only have horizontal dividers (no vertical lines)

#### Scenario: Task ID click-to-copy
- **WHEN** the user clicks on a Task ID in the table
- **THEN** the full UUID SHALL be copied to the clipboard
- **AND** a visual confirmation (toast or inline indicator) SHALL be shown

#### Scenario: Status indicator color coding
- **WHEN** a transaction status is "succeeded"
- **THEN** the status indicator SHALL display with emerald background (bg-emerald-50) and emerald text (text-emerald-700)
- **WHEN** a transaction status is "failed"
- **THEN** the status indicator SHALL display with rose background (bg-rose-50) and rose text (text-rose-700)
- **WHEN** a transaction status is "pending"
- **THEN** the status indicator SHALL display with yellow background (bg-yellow-50) and yellow text (text-yellow-700)

#### Scenario: Monospace font for data fields
- **WHEN** displaying Task IDs, costs, or code-like content
- **THEN** text SHALL be rendered using the monospace font family (JetBrains Mono or Fira Code)

#### Scenario: Cost display for failed tasks
- **WHEN** a transaction has status "failed"
- **THEN** the cost column SHALL display "¥0.00" or show the amount with strikethrough styling

### Requirement: Transaction Filtering

The console SHALL allow users to filter transactions by status and time period.

#### Scenario: Filter by status
- **WHEN** the user clicks on a status filter pill (e.g., "All Status", "Succeeded", "Failed", "Pending")
- **THEN** the transaction table SHALL update to show only transactions matching the selected status
- **AND** the active filter SHALL be visually indicated

#### Scenario: Filter by time period
- **WHEN** the user selects a time period filter (e.g., "Last 30 Days", "Last 7 Days", "Today")
- **THEN** the transaction table SHALL update to show only transactions within the selected period
- **AND** the active time filter SHALL be visually indicated

#### Scenario: Clear filters
- **WHEN** the user clicks "All Status" or "All Time"
- **THEN** all filters SHALL be cleared
- **AND** the full transaction list SHALL be displayed

### Requirement: Task Detail Drawer

The console SHALL display detailed information about a transaction in a side drawer.

#### Scenario: Open task detail drawer
- **WHEN** the user clicks on a table row or action button
- **THEN** a drawer SHALL slide in from the right side
- **AND** the drawer SHALL display:
  - Full Task ID in header
  - Status badge
  - Result section (if task succeeded)
  - Request payload section
  - Timestamps section (created_at, updated_at with millisecond precision)

#### Scenario: Display generated image result
- **WHEN** a task has status "succeeded" and includes an image URL in the result
- **THEN** the drawer SHALL display a thumbnail of the generated image
- **AND** the image SHALL be clickable to view full size

#### Scenario: Display request payload with syntax highlighting
- **WHEN** the task payload is displayed
- **THEN** the JSON content SHALL be formatted with syntax highlighting
- **AND** the content SHALL use a code block component for readability

#### Scenario: Display precise timestamps
- **WHEN** timestamps are shown in the drawer
- **THEN** both `created_at` and `updated_at` SHALL be displayed
- **AND** timestamps SHALL show date, time, and milliseconds

#### Scenario: Close task detail drawer
- **WHEN** the user clicks outside the drawer, presses Escape key, or clicks a close button
- **THEN** the drawer SHALL close with a smooth slide-out animation
- **AND** the user SHALL return to the transactions list view

### Requirement: Zen & Minimalist Visual Design

The console SHALL implement a minimalist design system prioritizing clarity and reducing visual noise.

#### Scenario: Color palette adherence
- **WHEN** rendering any UI element
- **THEN** colors SHALL use the defined palette:
  - Background: Pure white (#FFFFFF) or very pale zinc (bg-zinc-50/30)
  - Surfaces: Pure white with subtle zinc-200 borders
  - Primary text: Deep zinc (text-zinc-900), never pure black
  - Secondary text: Muted zinc (text-zinc-500)
  - Accent: Deep indigo (text-indigo-600) for primary actions

#### Scenario: Minimal shadows and borders
- **WHEN** rendering cards, tables, or elevated surfaces
- **THEN** components SHALL use subtle borders (border-zinc-200)
- **AND** shadows SHALL be minimal or absent (no heavy drop shadows)
- **AND** border radius SHALL be 6-8px (rounded-md or rounded-lg)

#### Scenario: Generous whitespace
- **WHEN** laying out content
- **THEN** adequate spacing SHALL be provided:
  - Table row minimum height: 64px
  - Section vertical spacing: 32px (space-y-8)
  - Card padding: 24px (p-6)
  - Container horizontal padding: 32px (px-8)

#### Scenario: Typography hierarchy
- **WHEN** rendering text content
- **THEN** the Inter font SHALL be used for UI text
- **AND** JetBrains Mono or Fira Code SHALL be used for monospace content (IDs, code, currency)
- **AND** type scale SHALL follow: h1 (text-3xl), h2 (text-2xl), body (text-base), secondary (text-sm)

### Requirement: Developer-Focused Interactions

The console SHALL provide interaction patterns optimized for developer workflows.

#### Scenario: Keyboard navigation support
- **WHEN** the user presses Tab key
- **THEN** focus SHALL move through interactive elements in logical order
- **AND** focused elements SHALL have visible focus indicators

#### Scenario: Keyboard shortcuts for common actions
- **WHEN** the user presses a defined keyboard shortcut (e.g., "/" for search, "Esc" to close drawer)
- **THEN** the corresponding action SHALL be executed
- **AND** keyboard shortcuts SHALL be documented and discoverable

#### Scenario: Click-to-copy utilities
- **WHEN** the user clicks on copyable content (Task ID, API keys)
- **THEN** the content SHALL be copied to clipboard
- **AND** a confirmation message SHALL be displayed

### Requirement: Performance and Responsiveness

The console SHALL maintain fast load times and responsive interactions.

#### Scenario: Initial page load performance
- **WHEN** a user accesses any page in the console
- **THEN** the initial page load SHALL complete in under 2 seconds
- **AND** meaningful content SHALL be visible within 1 second (First Contentful Paint)

#### Scenario: Table interaction latency
- **WHEN** the user interacts with the transaction table (sorting, filtering, opening drawer)
- **THEN** the interaction SHALL respond in under 100 milliseconds
- **AND** loading states SHALL be shown for operations taking longer than 200ms

#### Scenario: Optimistic UI updates
- **WHEN** the user performs an action that updates data (e.g., filtering)
- **THEN** the UI SHALL update immediately with an optimistic state
- **AND** SHALL reconcile with actual server response asynchronously

### Requirement: Data Fetching and Synchronization

The console SHALL fetch and display data from the backend API with appropriate caching and revalidation.

#### Scenario: Fetch transactions on page load
- **WHEN** the user navigates to the Transactions page
- **THEN** the console SHALL fetch transaction data from the backend API
- **AND** a loading state SHALL be displayed while data is being fetched
- **AND** fetched data SHALL be cached for subsequent access

#### Scenario: Periodic data refresh
- **WHEN** the Transactions page is active
- **THEN** data SHALL be automatically refreshed every 5-10 seconds
- **AND** updates SHALL not disrupt user interactions (e.g., if drawer is open)

#### Scenario: Manual refresh trigger
- **WHEN** the user clicks a refresh button or uses a refresh keyboard shortcut
- **THEN** the latest data SHALL be fetched from the backend
- **AND** a loading indicator SHALL briefly display during refresh

#### Scenario: Error handling for failed requests
- **WHEN** an API request fails
- **THEN** an error message SHALL be displayed to the user
- **AND** the user SHALL have the option to retry the request
- **AND** cached data SHALL remain visible if available

### Requirement: Authentication and Session Management

The console SHALL integrate with the backend authentication system and maintain user sessions.

#### Scenario: Protected route access
- **WHEN** an unauthenticated user attempts to access a protected page
- **THEN** the user SHALL be redirected to the login page
- **AND** after successful login, SHALL be redirected back to the originally requested page

#### Scenario: Session persistence
- **WHEN** a user logs in successfully
- **THEN** the session SHALL be maintained using HTTP-only cookies
- **AND** the session SHALL persist across browser refreshes
- **AND** the session SHALL expire after a defined timeout period

#### Scenario: Display user context
- **WHEN** a user is authenticated
- **THEN** the navigation bar SHALL display the user's avatar
- **AND** SHALL display the user's current account balance
- **AND** clicking the avatar SHALL open a user menu with account options

#### Scenario: Logout functionality
- **WHEN** the user clicks the logout option in the user menu
- **THEN** the session SHALL be terminated
- **AND** the user SHALL be redirected to the login page
- **AND** all cached user data SHALL be cleared

# Developer Console Specification

## ADDED Requirements

### Requirement: Console Mount Point

The system SHALL serve the Developer Console as part of the `apps/web` application under the `/console` URL prefix.

#### Scenario: Dashboard route under mount point
- **WHEN** the user navigates to `/console`
- **THEN** the Developer Console dashboard page SHALL be displayed

#### Scenario: Transactions route under mount point
- **WHEN** the user navigates to `/console/transactions`
- **THEN** the Transactions page SHALL be displayed

#### Scenario: Login route under mount point
- **WHEN** the user navigates to `/console/login`
- **THEN** the login page SHALL be displayed

#### Scenario: Console navigation routes
- **WHEN** the user uses the console navigation header links
- **THEN** navigation SHALL stay within the `/console/*` URL namespace

## MODIFIED Requirements

### Requirement: Authentication and Session Management

The console SHALL protect authenticated routes under `/console/*` and use `/console/login` for authentication.

#### Scenario: Protected route access under mount point
- **WHEN** an unauthenticated user attempts to access `/console/transactions`
- **THEN** the user SHALL be redirected to `/console/login`
- **AND** after successful login, SHALL be redirected back to the originally requested page


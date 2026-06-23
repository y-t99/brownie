## ADDED Requirements

### Requirement: Authenticated homepage guidance

The web application SHALL check the current session before presenting homepage authentication controls.

#### Scenario: Authenticated visitor opens the homepage

- **WHEN** the session endpoint returns an authenticated user
- **THEN** the homepage SHALL display the user's name and email
- **AND** the homepage SHALL provide an action that navigates to `/chat`
- **AND** the homepage SHALL NOT display sign-in or account-creation forms

#### Scenario: Anonymous visitor opens the homepage

- **WHEN** the session endpoint returns HTTP 401
- **THEN** the homepage SHALL display the existing sign-in and account-creation forms

#### Scenario: Session check fails unexpectedly

- **WHEN** the session endpoint fails with a status other than HTTP 401
- **THEN** the homepage SHALL display a retryable error
- **AND** the homepage SHALL NOT treat the visitor as anonymous

### Requirement: Confirmed logout

The web application SHALL require confirmation before ending a chat session.

#### Scenario: User cancels logout

- **WHEN** the user opens the logout confirmation and selects cancel
- **THEN** the confirmation SHALL close
- **AND** the user SHALL remain on `/chat`

#### Scenario: Logout succeeds

- **WHEN** the user confirms logout
- **AND** the logout endpoint succeeds
- **THEN** the application SHALL navigate to `/`
- **AND** the refreshed homepage SHALL resolve the cleared session

#### Scenario: Logout fails

- **WHEN** the user confirms logout
- **AND** the logout endpoint fails
- **THEN** the user SHALL remain on `/chat`
- **AND** the confirmation SHALL display the error
- **AND** the user SHALL be able to retry

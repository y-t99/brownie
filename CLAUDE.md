# Core Coding Philosophy
## 1. Simplicity & Power
- Write concise, powerful code that does exactly what's needed—no more, no less
- Avoid redundant logic, mock implementations, or placeholder code
- If a feature is incomplete, mark it clearly with comments rather than implementing partial solutions

## 2. Clarity & Explicitness
- All text (messages, comments, documentation) must be in English for international standards
- Use industry best practices for naming conventions and messaging
- Error messages should be clear, professional, and follow established patterns
- Names should be self-documenting and unambiguous

## 3. Data Integrity
- Related operations must be atomic—succeed together or fail together
- Validate all inputs strictly; reject invalid data immediately with clear errors
- Calculate derived values from source data when possible rather than storing redundant information
- Use data-driven approaches (lookup tables, mappings) for deterministic relationships

## 4. Consistency & Standards
- Reuse established patterns and constants throughout the codebase
- Follow project conventions strictly—never introduce custom patterns for standard operations
- Error handling should use unified, predefined messages
- Return values should follow consistent patterns across similar operations

## 5. Minimalism
- Return only the essential data needed by callers
- Don't implement features that weren't explicitly requested
- Don't set fields that aren't required or can't be determined yet
- Keep metadata minimal unless specifically needed

## 6. Defensive Programming
- Validate computed values and calculations
- Throw errors early when preconditions aren't met
- Don't allow "silent failures" with default fallback values
- Ensure data constraints are enforced at the business logic level

## 7. Maintainability
- Organize code logically with clear separation of concerns
- Use type-safe approaches for data structures and lookups
- Group related operations together
- Mark future work clearly and specifically

## 8. Pragmatism
- Focus on what adds real value to the system
- Don't over-engineer solutions
- Implement the simplest correct solution first
- Let requirements drive implementation, not speculation

## Key Questions Before Writing Code
1. Is this the simplest solution that solves the problem?
2. Does this follow existing project patterns?
3. Are all edge cases handled with clear errors?
4. Is the data flow atomic and consistent?
5. Will this be immediately clear to another developer?
6. Am I implementing only what was requested?

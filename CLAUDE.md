<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

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
- Follow industry-standard naming semantics for all identifiers:
  - Choose names that reflect domain concepts and business intent, not technical implementation
  - Use established terminology from the relevant domain
  - Prefer names commonly used in the ecosystem and best practices
  - Avoid overly specific or coupled names that expose implementation details
  - When in doubt, reference official documentation, popular libraries, or authoritative style guides for naming inspiration

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

# Lazy Developer Rules

Write the least code necessary to correctly solve the task.

## Rules

- Understand the relevant existing code, business flow, and project conventions before changing it.
- Make the smallest change required. Do not add unrequested functionality.
- Prefer: Delete > Reuse > Simplify > Modify > Add.
- Reuse existing services, repositories, utilities, constants, enums, and patterns before creating anything new.
- Do not build for hypothetical future requirements.
- Do not create functions, classes, helpers, services, interfaces, variables, wrappers, or abstractions unless they provide real value.
- Do not extract a function unless it is reused, meaningfully improves readability, or the framework requires it.
- Keep simple one-use logic inline when readable.
- Remove dead, duplicate, redundant, unused, and obsolete code in the changed area.
- Prefer built-in language/framework features and existing dependencies.
- Do not add dependencies when existing tools are enough.
- Use clear, natural, domain-oriented names. Avoid generic names such as `data`, `result`, `temp`, `processedData`, or `finalResult`.
- Keep conditions simple and avoid unnecessary nesting, variables, and comments.
- Add comments only when non-obvious business logic needs explanation.
- Do not use clever one-liners merely to reduce LOC.
- Do not refactor, rename, reformat, or restructure unrelated working code.
- Keep the diff minimal.

## Database

- Never perform database queries, inserts, updates, or deletes inside loops.
- Avoid N+1 queries and duplicate database calls.
- Fetch records in bulk and use batch operations such as `insertMany`, `bulkWrite`, etc. when appropriate.
- Avoid loading unnecessary data. Use pagination or batching for large datasets when needed.

## Logging

- Preserve useful existing logs and do not add excessive logging.
- Log only useful flow information, failures, and record counts.
- Prefer counts over complete objects or collections.
- Do not log sensitive information or unnecessarily log inside loops.

## Error Handling

- Follow the project's existing exception-handling strategy.
- Do not silently ignore errors or use empty catch blocks.
- Use specific exception handling when practical.

## Refactoring

When asked to simplify, optimize, clean up, or reduce code:
- Preserve existing behavior unless explicitly asked to change it.
- Prefer removing code over adding another abstraction.
- Remove code made unnecessary by the change.

## Project Tracker Synchronization

Whenever code, APIs, schemas, UI components, or architectural features are implemented, modified, or completed:
- Always update the project tracker to reflect current progress, block statuses, and the changelog.
- Maintain **strict synchronization** across all tracker files:
  - `backend/PROJECT_TRACKER.md`
  - `frontend/PROJECT_TRACKER.md`
  - `./PROJECT_TRACKER.md`
- Any change to one tracker file must be mirrored identically to the others in the same commit/task.

## Before Finishing

Review the diff once.
Check that:
- The requirement is fully satisfied.
- Tracker files (`backend/PROJECT_TRACKER.md`, `frontend/PROJECT_TRACKER.md`, and `./PROJECT_TRACKER.md`) are updated and in exact sync.
- Existing project conventions are followed.
- No unnecessary code or abstractions were introduced.
- No database calls exist inside loops.
- N+1 and duplicate database calls are avoided.
- Names are clear and domain-oriented.
- Logs are minimal and useful.
- Unrelated code was not changed.

Remove anything unnecessary, duplicated, unrequested, or simpler to express with existing code.
Every changed line should contribute to the requested result.

## Safety

Never sacrifice correctness, security, validation, null/edge-case handling, data integrity, transaction safety, required error handling, accessibility, or resource cleanup just to reduce code.

## Priority

Correctness > Existing Conventions > Clarity > Simplicity > Reuse > Efficient Database Access > Small Diff > LOC

**Goal: the least amount of clear, maintainable code needed to correctly solve the task.**

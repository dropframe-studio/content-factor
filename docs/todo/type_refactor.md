# To-Do: Architecture & Refactoring

## Must-Have

### [REFACTOR] Remove Side-Effects in `transform.ts`
*   **Goal:** Allow importing the transform module without running it.
*   **Effort:** Small
*   **Dependencies:** None

### [REFACTOR] Define Strict Template Interfaces
*   **Goal:** Replace `any` return types with `ContentItem` / `BuildLog`.
*   **Effort:** Medium
*   **Dependencies:** None

## Should-Have

### [REFACTOR] Inject Configuration for Paths
*   **Goal:** Remove hardcoded `process.cwd()` calls.
*   **Effort:** Medium
*   **Dependencies:** None

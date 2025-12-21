# TODO Scan & Analysis Report
**Date:** December 20, 2025
**Scope:** Full Repository

## Executive Summary
A comprehensive scan of the codebase reveals a highly disciplined approach to technical debt management. The repository is remarkably free of inline `TODO`, `FIXME`, or `BUG` comments, indicating that the project relies on a centralized backlog rather than scattered code comments.

The primary source of truth for technical debt and future planning is `TODO.md`.

## Codebase Scan Results
- **Inline TODOs:** 0 found in source code (excluding documentation).
- **Inline FIXMEs:** 0 found.
- **Inline BUGs:** 0 found.
- **Inline NOTEs:** 1 found (`docs/web_portal/src/components/Sidebar.astro`).

**Analysis:** The lack of inline markers suggests a mature development process where issues are triaged into the central plan immediately rather than left as code comments.

## Centralized Backlog Analysis (`TODO.md`)
The existing `TODO.md` is well-structured and prioritized.

### Critical Priorities (Immediate Action Required)
1.  **Architecture:** Fix side-effect imports in `pipeline/transform.ts` to enable testability.
2.  **Type Safety:** Replace `any` return types in templates with strict interfaces to prevent runtime crashes.
3.  **Configuration:** Refactor hardcoded paths to use a `PipelineConfig` object.
4.  **Storage:** Complete the storage abstraction layer (Filesystem vs. LowDB/SQLite).

### Key Important Items
-   **Testing:** Implementation of Vitest framework.
-   **Observability:** Migration from `console.log` to structured logging (`pino`).
-   **Validation:** Input validation (Zod) for capture adapters.

## Recommendations
1.  **Enforce Clean Policy:** Formalize the practice of "No Inline TODOs" in the contribution guide.
2.  **Automate Audit:** Add a CI step to warn on new inline TODOs to prevent regression.
3.  **Owner Assignment:** While `TODO.md` lists items, they currently lack assigned owners.
4.  **Workflow:** Establish a periodic review of `TODO.md` (e.g., during "Systems Health Check").

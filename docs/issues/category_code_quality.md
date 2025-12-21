# Issue: Code Quality & Architecture

## Priority: Critical

### [BUG] Side-Effect Import in `transform.ts`
*   **Description:** `pipeline/transform.ts` runs the pipeline logic immediately upon import. This makes it impossible to import the module for unit testing without triggering execution.
*   **Affected Component:** `pipeline/transform.ts` (Line 151)
*   **Steps to Reproduce:**
    1.  Create a test file `test.ts`.
    2.  `import { transform } from './pipeline/transform.js'`.
    3.  Run the test. Observe the pipeline running.

### [TECH] Replace `any` with Strict Types in Templates
*   **Description:** Template functions currently return `any`. This bypasses TypeScript's safety and can crash the dashboard if data shapes mismatch.
*   **Affected Component:** `templates/*.ts`
*   **Remediation:** Define `ContentItem` interface and enforce it.

## Priority: High

### [TECH] Refactor to Config-Based Paths
*   **Description:** Pipeline scripts use `process.cwd()` which breaks when code is moved or run from different contexts (e.g. monorepo).
*   **Affected Component:** `pipeline/*.ts`
*   **Remediation:** Inject a `PipelineConfig` object.

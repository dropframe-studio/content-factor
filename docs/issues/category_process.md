# Issue: Process & DevOps

## Priority: High

### [DEVOPS] Missing CI/CD Pipelines
*   **Description:** There is no automated verification of code. PRs can be merged with broken builds or linting errors.
*   **Affected Component:** `.github/workflows/`
*   **Remediation:** Add `ci.yml` for Build, Lint, and (future) Test.

## Priority: Medium

### [PROCESS] Lack of Linting Configuration
*   **Description:** No `.eslintrc` or `.prettierrc` is enforcing code style.
*   **Affected Component:** Root Directory
*   **Remediation:** Install and configure ESLint + Prettier.

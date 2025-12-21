# Issue: Outdated & Missing Documentation

## Priority: High

### [DOCS] Update Getting Started Guide
*   **Description:** The `docs/getting-started.md` guide references `pnpm capture` which is not a valid script in `package.json`. It should list specific capture commands (`capture:commit`, `capture:link`, etc.). It also lacks setup instructions for the Web App.
*   **Affected Component:** `docs/getting-started.md`
*   **Steps to Reproduce:**
    1.  Clone repo.
    2.  Run `pnpm capture` as instructed.
    3.  Observe failure.

### [DOCS] Create CONTRIBUTING.md
*   **Description:** New contributors have no guidance on PR process, code style, or the strict "No Inline TODO" policy.
*   **Affected Component:** Root Directory
*   **Steps to Reproduce:** Check root directory for `CONTRIBUTING.md`.

## Priority: Medium

### [DOCS] Document Template Extension Pattern
*   **Description:** Developers need a guide on how to add new ArtifactTypes and Templates.
*   **Affected Component:** `docs/guides/`

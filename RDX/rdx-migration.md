# Enhanced Task List: Content Factor RDX Migration

## Objective
Transition Content Factor from a "Local Script Collection" to a "Sovereign RDX Node" with standardized reporting and unified storage logic.

## Tasks
1. **Pipeline Audit**: Analyze the hand-off between `capture` -> `transform` -> `publish`.
2. **Storage Unification**: Audit the "Hybrid" state (Filesystem vs. LowDB vs. SQLite).
3. **Adapter Standardization**: Organize the project-specific capture adapters.
4. **RDX Structure**: Implement the `reports/`, `plans/`, `todos/`, and `adapters/` directories.
5. **Schema Documentation**: Define the standard `Artifact` JSON shape in `RDX/schemas/`.

## Status (2025-12-24)
- [x] Initial Repo Audit completed (2025-12-24_0133).
- [x] Migrate `agent_reports.md` and `gemini_recon.md` to `RDX/reports/`.
- [x] Initialize `RDX/README.md`.
- [x] Categorize `TODO.md` into functional areas (Storage, CLI, UI).
- [x] Create repo-wide link index in `RDX/doc/`.
- [x] Add `RDX/schemas/` with canonical artifact schema reference.

# Standard Sweep Readiness

Timestamp: 2025-12-24_0347
Agent: Codex
Scope: RDX structural audit and synthesis

## Protocol
1. Enumerate all files under `RDX/`.
2. Read every file in `RDX/reports/`, `RDX/plans/`, `RDX/todos/`, `RDX/agent_mission_briefs/`, and `RDX/doc/`.
3. Extract and consolidate:
   - TODOs
   - Plans
   - Next Steps
   - Suggestions
4. Verify required daily reports exist; generate if missing:
   - `YYYY-MM-DD_HHMM_integrity-audit.md`
   - `YYYY-MM-DD_HHMM_pipeline-run.md`
   - `YYYY-MM-DD_HHMM_dep-risk.md`
   - `YYYY-MM-DD_HHMM_storage-usage.md`
5. Produce:
   - `RDX/reports/YYYY-MM-DD_PHASE_2_REPORT.md`
   - `RDX/reports/YYYY-MM-DD_PHASE_2_AAR.md`
6. Record the sweep in a timestamped readiness file.

## Output Checklist
- Daily reports created or confirmed
- Consolidated intelligence report written
- Gap analysis against RDX migration checklist included
- AAR recorded

## Notes
- Keep the sweep read-only; do not modify core code or external registries.

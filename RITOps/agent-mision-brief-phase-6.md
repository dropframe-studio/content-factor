The Mission Brief: RDX/agent_mission_briefs/PHASE_6_STEP_01.md
Markdown
# MISSION BRIEF: PHASE 6 - STEP 01 (SYSTEM AUDIT)
**ID**: `2025-12-22_0310_vmrad_p6_s01`
**Status**: [ INITIALIZED ]
**Commander**: Vincent Radford
**Objective**: Establish a baseline for the Content Factor CLI and Pipeline through rigorous inspection and execution.

---

## 1. MISSION PARAMETERS
* **Safety Level**: RESTRICTED (Execute -> Report -> Halt).
* **Input**: Root Repository / `bin/` / `pipeline/`.
* **Output 1**: Console Briefing (Summary + Request to Proceed).
* **Output 2**: `RDX/reports/PHASE_6_AUDIT.md` (Full Evidence & Suggestions).

---

## 2. EXECUTION CHECKLIST
0. **Pre Run Inspect**: Inspect the bin and pipeline. Confirm proper file naming conventions and folder struture. Confirm correct file paths. Suggest improvements.
1.  **Build Verification**: Execute `pnpm build`. Confirm the TypeScript compiler (tsc) yields zero variances.
2.  **CLI Discovery**: Execute `cf --help`. Verify all core commands (`adopt`, `normalize`, `inspect`) are registered.
3.  **Pipeline Stress Test**: Execute each individual capture command (commit, retro, note, link, screenshot) to verify the data entry points.
4.  **Integrity Inspection**: Verify that the generated artifacts match the 1.1.0 Canonical Standard.

---

## 3. REPORTING REQUIREMENTS
The full RDX report must include:
* **Findings**: Success/Failure for every command.
* **Signal Level**: Low/Medium/High for each system component.
* **Suggestions**: Specific technical improvements for code or SOP efficiency.
* **Next Steps**: Clear path to Step 02 (Safety Lock/Backup).

---

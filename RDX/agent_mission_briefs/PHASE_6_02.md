
# MISSION BRIEF: PHASE 6 - STEP 02 (SAFETY LOCK)
**ID**: `2025-12-22_0450_vmrad_p6_s02`
**Status**: [ INITIALIZED ]
**Commander**: Vincent Radford
**Objective**: Create an immutable backup of all project data and verify archive integrity before database ingestion.

---

## 1. MISSION PARAMETERS
* **Safety Level**: RESTRICTED (Execute -> Report -> Halt).
* **Input**: `./data/` directory (Artifacts, Assets, and Registry).
* **Output 1**: Console Briefing (Backup Path + Size + Request to Proceed).
* **Output 2**: `RDX/reports/PHASE_6_BACKUP.md` (Full Verification Log).

---

## 2. EXECUTION CHECKLIST
0. **Pre-Run Inspect**: Identify the total count of JSON artifacts in `./data/artifacts` and the total size of `./data/assets`.
1. **Archive Generation**: Execute a timestamped compression (ZIP or TAR) of the entire `./data` folder into `./backups/`.
2. **Integrity Check**: Test the archive for corruption (checksum verification). 
3. **Artifact Tally**: Confirm the number of files inside the backup matches the source directory count (318+).
4. **Storage Confirmation**: Ensure the backup is stored outside the primary data pipeline to prevent accidental deletion.

---

## 3. REPORTING REQUIREMENTS
The full RDX report must include:
* **Backup ID**: Unique timestamped filename (e.g., `cf_data_20251222_0450.zip`).
* **Source Stats**: Total file count and directory size.
* **Verification Status**: SUCCESS/FAIL on archive extraction test.
* **Next Steps**: Clear path to Step 03 (Vault Forge/Database Creation).

---

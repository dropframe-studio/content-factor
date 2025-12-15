### 🕵️ Coding Agent Inspection Protocol for `content-factor`

**1. Clone & Setup**
- `git clone https://github.com/dropframe-studio/content-factor`
- Enter the repo: `cd content-factor`
- Check dependencies (`package.json`, `requirements.txt`, or equivalent).
- Run `git branch -a` to see active branches.

**2. Read the Manifest**
- Open `README.md` → log mission statement, usage notes, and any capture/generator references.
- Note if there are instructions for automation or pipelines.

**3. Inspect Folder Structure**
- Look for directories named `capture`, `generator`, `factor`, or `src`.
- Record what modules exist and whether they are implemented or placeholders.
- Note any test folders (`tests/`, `__tests__`) and whether they validate capture/generator logic.

**4. Check Pipelines**
- Inspect `.github/workflows/` or CI/CD configs.
- Log what jobs run (lint, build, deploy, capture tests).
- Report whether pipelines are passing or broken.

**5. Capture Capabilities Audit**
- Identify functions/classes related to “capture” (file ingestion, content parsing, etc.).
- Note what inputs they accept (text, files, streams).
- Report whether capture outputs are stored, transformed, or validated.

**6. Generator Planning**
- Look for modules that produce outputs (reports, assets, relics).
- Note if generator scaffolding exists or is missing.
- Report readiness for automation (commented tasks, TODO markers).

**7. Deliverables & Issues**
- Run `git log --oneline` to see recent commits.
- Note any rollback points or broken commits.
- Log open issues from GitHub (`Issues` tab) if available.

**8. Report Back**
- Write findings into **R.DX/agent_reports.md** (or equivalent).
- Format:  
  - Branch inspected  
  - Capture modules found  
  - Generator modules found  
  - Pipelines status  
  - Deliverables status (delivered / in progress / blocked)  
  - Issues noted  

**9. Report Template**
# Agent Report – `content-factor` Inspection

## 📂 Repo Overview
- **Repo name**: `dropframe-studio/content-factor`
- **Branch inspected**: `__________`
- **Commit hash**: `__________`
- **Date / Time**: `__________`
- **Agent name**: `__________`

---

## 🔍 Findings

### 1. Capture Modules
- **Modules found**:  
  - `__________`  
- **Capabilities**:  
  - Inputs: `__________`  
  - Outputs: `__________`  
- **Status**: Delivered / In Progress / Blocked

### 2. Generator Modules
- **Modules found**:  
  - `__________`  
- **Capabilities**:  
  - Outputs: `__________`  
- **Status**: Delivered / In Progress / Blocked

### 3. Pipelines
- **CI/CD jobs**:  
  - Lint: Passing / Failing  
  - Build: Passing / Failing  
  - Tests: Passing / Failing  
- **Notes**: `__________`

### 4. Deliverables
- **Assets delivered**: `__________`  
- **Locks respected**: Yes / No  
- **Rollback points**: `__________`

### 5. Issues / Fallbacks
- **Open issues**: `__________`  
- **Broken commits**: `__________`  
- **Fallback actions taken**: `__________`

---

## 📡 Summary
- **Overall status**: Stable / Needs Refactor / Blocked  
- **Next steps recommended**:  
  - `__________`  

---

This template ensures every inspection is logged as a **validator artifact**: clear, structured, and refusal‑proof. Agents can fill it in after each inspection, and you’ll have a consistent backlog record in R.DX.


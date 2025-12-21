# TODO Resolution Workflow

## Philosophy
This project adheres to a **"Clean Code, Centralized Debt"** philosophy. We avoid scattering `// TODO` or `// FIXME` comments throughout the codebase. Instead, identified issues and planned improvements are centralized in `TODO.md` or the project's issue tracker.

## Workflow

### 1. Identification
When you encounter a bug, a missing feature, or an area needing refactoring:
- **Do NOT** leave a comment in the code (unless it is vital context for the very next line, e.g., a complex workaround).
- **DO** open `TODO.md` and add an entry under the appropriate category.

### 2. Categorization & Prioritization
Entries in `TODO.md` must be categorized:
- **🔴 Critical:** Blocks development, causes crashes, or is a severe security risk. Immediate action required.
- **🟡 Important:** Affects code quality, testability, or "happy path" user experience.
- **🟢 Enhancement:** New features or UX improvements.
- **🎨 Polish:** Visual tweaks or non-critical refactors.
- **🔧 Technical Debt:** Cleanup tasks that don't directly affect users but improve maintainability.

### 3. Assignment
Since we work as a small, agile unit (or single developer + AI), "Assignment" is implicit but can be made explicit in `TODO.md`:
- **Format:** `### Title (Owner: @User)`
- If unassigned, the item is "Up for Grabs".
- **AI Delegation:** You can assign tasks to the AI agent during a session. "Agent, please tackle item #3 from TODO.md".

### 4. Resolution
1.  **Select:** Pick an item from `TODO.md`.
2.  **Branch:** Create a branch (or just start working if solo) named `fix/todo-item-name` or `feat/todo-item-name`.
3.  **Implement:** Perform the work.
4.  **Verify:** Run tests (once implemented) and build checks.
5.  **Update:** Remove the item from `TODO.md` or move it to a `## Completed` section (or `CHANGELOG.md`).

### 5. Review Cadence
- **Weekly System Health Check:** Review `TODO.md`.
    - Are any "Critical" items older than 1 week?
    - Are any "Enhancements" no longer relevant? (Delete them).
- **Pre-Release:** Ensure no "Critical" items remain before a major version bump.

## Automated Tracking
We use scripts to ensure our "No Inline TODO" policy is respected.
- Run `pnpm audit:todos` (to be implemented) to scan for stray comments.

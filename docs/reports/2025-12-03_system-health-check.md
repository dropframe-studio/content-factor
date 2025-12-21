### **REPORT A: System Health Check**

**Date:** 2025-12-03
**Subject:** `content-factor` Operational Status

| Component | Status | Notes |
| :--- | :--- | :--- |
| **Dependencies** | ✅ **Healthy** | All packages installed via `pnpm` v10.23.0. |
| **Type Safety** | ✅ **Passing** | Root `tsc` and Web App `tsc -b` compiled without blocking errors. |
| **Pipeline Core** | ✅ **Operational** | `capture:commit` successfully generated artifact `raw-commit-20251204-v23h`. Git integration is working. |
| **Web Dashboard** | ✅ **Stable** | Vite build completed in 1.14s. No framework-breaking changes detected. |

**Key Observation:**
The project relies on a pre-compiled `dist/` folder for the pipeline (`node dist/pipeline/capture/commit.js`). This means if you edit the TypeScript in `pipeline/`, you **must** run `pnpm build` (or a watch script) before running `pnpm capture:...` to see your changes. This is a friction point we can solve in the architecture phase.


1.  **Report B (Architectural Gap Analysis):** A detailed plan to move this flat structure into a Monorepo format (moving `pipeline` to `packages/core` and `web_app` to `apps/dashboard`).

2.  **Report C (Logic & Template Review):** An analysis of whether your transformation logic supports your new "Monk/Mountain" branding or if it's still stuck in an older era.
-----

### **REPORT B: Architectural Gap Analysis**

**Date:** 2025-12-03
**Subject:** Modernizing `content-factor` to Clearline Standards

#### **1. Structural Comparison**

We need to move from a "Script Collection" to a "Systems Monorepo."

| Feature | Current `content-factor` | Target (Clearline Standard) | Gap |
| :--- | :--- | :--- | :--- |
| **Project Root** | Mixed (Scripts + Configs) | Clean (Only Orchestration) | `pipeline/` lives at root. |
| **Dependencies** | Shared `node_modules` | Isolated via pnpm workspaces | No `pnpm-workspace.yaml`. |
| **Pipeline Logic** | Coupled to file system | Portable Library | `transform.ts` relies on `process.cwd()`. |
| **Dashboard** | Sub-folder `web_app` | `apps/dashboard` | Needs relocation. |
| **Docs** | Sub-folder `docs/web_portal` | `apps/docs` | Needs relocation. |

#### **2. The Migration Plan**

We should restructure the repository into three distinct zones:

1.  **`packages/core`**: The Pipeline logic (Capture, Transform, Publish). This becomes a library that *any* app can use.
2.  **`apps/dashboard`**: The React/Vite dashboard (consumer of the pipeline data).
3.  **`apps/docs`**: The Astro portal.

#### **3. Critical Friction Point**

The file paths in `transform.ts` use `process.cwd()` to find the `data/` folder.

  * **Risk:** If we move the script into `packages/core`, `process.cwd()` might point to `packages/core` instead of the repo root, breaking the data link.
  * **Fix:** We must refactor the pipeline to accept a `config` object defining where the `data/` folder lives.

-----

### **REPORT C: Logic & Template Review**

**Date:** 2025-12-03
**Subject:** Code Quality & Brand Alignment

#### **1. The "Side-Effect" Code Smell**

**Problem:** The last line of `pipeline/transform.ts` is:

```typescript
// Always run when this file executes
runTransformPipeline();
```

**Impact:** You cannot write a unit test for this file or import `TEMPLATE_MAP` into another tool without *accidentally running the entire transformation pipeline*.
**Recommendation:** Wrap this execution in a check:

```typescript
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runTransformPipeline();
}
```

#### **2. Template Analysis**

The current templates are functional but generic.

  * `PROJECT_EXPLAINER` → Good, but could be specific to "Brand Guidelines."
  * `TEACHING_MOMENT` → A bit academic. Consider renaming to "Field Note" or "Observation" to match your "Sunstar Outfitter" / "Monk" persona.
  * `RAW_COMMIT` → Excellent. This is the heartbeat of the system.

#### **3. Type Safety Gap**

In `transform.ts`:

```typescript
function applyTemplate(artifact: Artifact): any { ... }
```

**Risk:** The return type is `any`. If a template returns a malformed object (missing a `title` or `date`), the dashboard will crash at runtime.
**Fix:** Define a `ContentItem` interface (shared in `types.ts`) that strictly defines what a "Transformed Artifact" must look like.

-----

### **Unified Todo List: "The Modernization Protocol"**

Based on Reports A, B, and C, here is the prioritized checklist to bring `content-factor` up to code.

#### **Phase 1: Stabilization (Low Effort, High Value)**

  * [ ] **Fix Side-Effects:** Modify `pipeline/index.ts`, `transform.ts`, and `publish.ts` to only execute if called directly (not when imported).
  * [ ] **Strict Typing:** Replace `any` in `transform.ts` with a basic `TransformedArtifact` interface.
  * [ ] **Path Config:** Refactor `runTransformPipeline` to accept a `dataDir` argument, defaulting to `process.cwd()` only if not provided.

#### **Phase 2: Restructure (The Big Move)**

  * [ ] **Initialize Workspace:** Create `pnpm-workspace.yaml`.
  * [ ] **Create Packages:** Move `pipeline/` code to `packages/core/src`.
  * [ ] **Move Apps:** Move `web_app` to `apps/dashboard`.
  * [ ] **Link Dependencies:** Update `package.json` in `apps/dashboard` to depend on `packages/core` (e.g., `"@content-factor/core": "workspace:*"`).

#### **Phase 3: Brand Injection**

  * [ ] **Rename Templates:** Update `TEACHING_MOMENT` to `FIELD_NOTE`.
  * [ ] **Update Dashboard:** Apply the "Monk/Mountain" color palette (from `VSM Schools` or `Clearline7` theme) to the Vite app.

-----

### **Next Step**

We have the reports and the checklist.

**Would you like me to start Phase 1 by refactoring `transform.ts` to remove the side-effect and improve the typing?** (This creates a safe foundation before we start moving files around).
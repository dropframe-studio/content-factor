# AI Coding Agent Instructions for Content Factor

## Project Overview

**Content Factor** is a measurable, automated pipeline for content visibility. It operationalizes the **Build → Capture → Transform → Publish → Measure** loop, turning raw commits and work into visible proof-of-work with dashboards, logs, and snapshots.

### Core Philosophy
- **Proof-of-Work**: Every commit or note leaves behind a measurable artifact (JSON).
- **Separation of Concerns**: Each pipeline stage (Capture, Transform, Publish, Measure) is independent.
- **Visibility First**: The system exists to make progress undeniable and shareable.

---

## Architecture & Data Flow

### Key Concept: The Artifact

All work flows through a unified **Artifact** interface (`pipeline/artifact.ts`):

```typescript
interface Artifact {
  id: string;                    // Unique ID: e.g., "build-log-20251026-a7b9"
  slug: string;                  // URL-safe identifier
  createdAt: string;             // ISO 8601 timestamp
  source: ArtifactSource;        // 'git' | 'manual' | 'ci/cd' | 'api' | 'screenshot'
  type: ArtifactType;            // Determines which template to apply
  metadata: {
    title: string;
    summary: string;
    authorId?: string;
    tags: string[];
    sourceRef: string;            // Git SHA, PR number, etc.
  };
  payload: Record<string, unknown>; // Raw source data (flexible per adapter)
}
```

**ArtifactTypes** map to templates:
- `RAW_COMMIT` → BuildLog template
- `PROGRESS_SNAPSHOT` → ProgressSnapshot template  
- `PROJECT_EXPLAINER` → ProjectExplainer template
- `SYSTEM_OBSERVATION` → SystemObservation template
- `TEACHING_MOMENT` → TeachingMoment template

### Pipeline Flow

```
1. CAPTURE (pipeline/capture/*.ts)
   Input: Git commits, manual notes, screenshots
   Output: Artifact JSON → data/artifacts/

2. TRANSFORM (pipeline/transform.ts + templates/)
   Input: Artifact + matched template
   Output: Structured content → data/published/*.json

3. PUBLISH (pipeline/publish.ts + publish/*)
   Input: Structured content
   Output: Markdown files → data/published/*.md

4. MEASURE (pipeline/measure.ts)
   Input: Pipeline state
   Output: Metrics snapshot → data/metrics/
```

---

## Developer Workflows

### Building & Running the Pipeline

```bash
# Full pipeline (runs all steps)
pnpm start

# Individual capture adapters
pnpm capture:commit      # Latest Git commit
pnpm capture:retro       # Sprint retrospective
pnpm capture:note        # Manual note
pnpm capture:screenshot  # Screenshot capture
pnpm capture:link        # Link capture

# Other pipeline steps
pnpm transform           # Apply templates
pnpm publish-content     # Generate Markdown
pnpm measure             # Collect metrics
```

### Build & Compilation

```bash
pnpm build              # TypeScript → dist/ (uses tsc, no bundler)
pnpm start              # Builds then runs full pipeline
```

The project uses **ES modules** (type: "module" in package.json). Always import with `.js` extensions:
```typescript
import { captureCommit } from "./capture/commit.js";  // ✅ Correct
import { captureCommit } from "./capture/commit";     // ❌ Will fail
```

### Web App Dashboard

```bash
cd web_app
pnpm install
pnpm dev                # Runs Express API + Vite dev server concurrently
```

Dashboard shows artifacts with filters, metrics, and Markdown previews. Open `http://localhost:3000`.

---

## Project-Specific Patterns

### Pattern 1: Capture Adapter Design

Each capture source (commit, retro, note, screenshot, link) follows this pattern in `pipeline/capture/`:

```typescript
export function captureXxx(): Artifact {
  // 1. Extract raw data from source
  // 2. Create standardized Artifact object
  // 3. Determine type and assign appropriate template
  // 4. Return Artifact
}

export async function runCapturePipeline() {
  // 1. Call captureXxx()
  // 2. Generate unique ID and slug
  // 3. Write JSON to data/artifacts/
}
```

**Naming**: Use `data/artifacts/{type}-{date}-{hash}.json` format (e.g., `raw-commit-20251026-a7b9.json`).

### Pattern 2: Template Transformation

Templates in `templates/` apply structured lenses to Artifacts:

```typescript
export function xxxTemplate(artifact: Artifact): any {
  // 1. Inspect artifact.type and artifact.payload
  // 2. Extract/normalize relevant fields
  // 3. Return shaped object with type-specific properties
  // Example: progressSnapshotTemplate extracts whatShipped, whatLearned, etc.
}
```

Templates are **deterministic** functions—same Artifact input always produces same output.

The **Template Router** in `pipeline/transform.ts` maps types to templates:
```typescript
const TEMPLATE_MAP: Record<ArtifactType, TemplateFunction> = {
  RAW_COMMIT: buildLogTemplate,
  PROGRESS_SNAPSHOT: progressSnapshotTemplate,
  // ... more mappings
};
```

### Pattern 3: Publisher Routing

Publishers in `publish/` convert templates into distributable formats:

```typescript
// publish/markdown.ts uses a switch on content.type
export function toMarkdown(content: any): string {
  switch (content.type) {
    case 'BuildLog':      return renderBuildLog(content);
    case 'ProgressSnapshot': return renderProgressSnapshot(content);
    // ... etc
  }
}
```

New output channels (social, email, webhook) follow the same pattern: **one function per content type**.

### Pattern 4: File Organization & Naming

- **Artifacts** (raw captures): `data/artifacts/{type}-{date}-{hash}.json`
- **Published JSON** (transformed): `data/published/{id}-{type}.json`
- **Published Markdown**: `data/published/{id}-{type}.md`
- Example chain:
  ```
  data/artifacts/raw-commit-20251026-a7b9.json
    ↓ (transform)
  data/published/raw-commit-20251026-a7b9-BuildLog.json
    ↓ (publish)
  data/published/raw-commit-20251026-a7b9-BuildLog.md
  ```

### Pattern 5: Error Handling & Graceful Degradation

Capture adapters provide **mock data on failure** (e.g., Git not available):

```typescript
try {
  return { hash, message, author, date }; // Real data
} catch (error) {
  return {
    hash: "mock-hash-123456",
    message: "Mock Commit: Test data.",
    author: "System Bot",
    date: new Date().toISOString(),
  };
}
```

This ensures the pipeline **never fails** on missing dependencies—it produces test artifacts instead.

### Pattern 6: TypeScript & Type Safety

- **Strict mode** enabled (`tsconfig.json: "strict": true`)
- **ArtifactType** and **ArtifactSource** are union types (discriminated unions preferred over strings)
- Template functions accept `Artifact` and return `any` (flexibility for varied template shapes)
- Use `.js` extensions in ESM imports (required for Node.js ESM compatibility)

---

## Integration Points & Dependencies

### External Dependencies
- **Git**: `execSync()` calls `git log` for commit capture. Fails gracefully with mock data.
- **Express/CORS**: Web app API server (`web_app/server/api.js`), separate from pipeline.
- **Vite + React + Tailwind**: Web app dashboard (`web_app/src/`).

### Data Flows
- **Pipeline → Web App**: Dashboard reads JSON from `data/artifacts/` and `data/published/`.
- **Web App → Sync Engine**: Artifacts can be exported to `/sync/` for downstream processing (Vault, Prompt OS, Design System).
- **Pipeline ↔ Docs**: Documentation in `/docs/` describes architecture, setup, and philosophy (kept in sync manually).

### No Testing Framework
The project does **not use Jest/Vitest**. Validation is manual/ad-hoc. If adding tests:
- Use a lightweight test runner (Vitest for speed)
- Focus on template transformations (pure functions, easy to test)
- Mock Git calls and file I/O

---

## Common Tasks & Solutions

### Task: Add a New Capture Adapter
1. Create `pipeline/capture/xxx.ts` following the Pattern 1 template.
2. Export `captureXxx()` and `runCapturePipeline()`.
3. Add `pnpm capture:xxx` script to `package.json`.
4. Call from `pipeline/index.ts` if part of the full pipeline.

### Task: Add a New Template Type
1. Define new `ArtifactType` in `pipeline/artifact.ts`.
2. Create `templates/xxxTemplate.ts` (see Pattern 2).
3. Add to `TEMPLATE_MAP` in `pipeline/transform.ts`.
4. Add renderer to `publish/markdown.ts` switch statement.

### Task: Add a New Publisher
1. Create `publish/xxx.ts` with a `toXxx(content: any): string` function.
2. Import and call from `pipeline/publish.ts`.
3. Write output to appropriate directory (e.g., `data/social/`, `data/emails/`).

### Task: Debug Pipeline Issues
- Check `data/artifacts/` for raw capture files.
- Check `data/published/` for transformed and final files.
- Run individual steps: `pnpm capture:commit`, `pnpm transform`, etc.
- Look for console logs (pipeline uses `console.log()` not a logger).
- Re-run `pnpm build` after TypeScript changes.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `pipeline/artifact.ts` | Artifact schema & ID generation |
| `pipeline/index.ts` | Full pipeline orchestration |
| `pipeline/capture/*.ts` | Source adapters (commit, retro, note, screenshot, link) |
| `pipeline/transform.ts` | Template router & transformer |
| `pipeline/publish.ts` | Publisher coordinator |
| `pipeline/measure.ts` | Metrics collection |
| `templates/*.ts` | Content transformation blueprints |
| `publish/markdown.ts` | Markdown renderer (main publisher) |
| `web_app/src/` | React dashboard UI |
| `web_app/server/api.js` | Express API serving artifacts |
| `docs/architecture.md` | Philosophical overview (read this first) |

---

## Notes for AI Agents

- **Always inspect artifact.payload structure** before assuming fields—different sources shape payloads differently.
- **Assume ESM imports**—use `.js` extensions and never use `require()`.
- **Graceful degradation is a feature**—prefer mock data over throwing errors in capture adapters.
- **Data is immutable across the pipeline**—each stage (capture, transform, publish) writes to distinct directories.
- **Templates are pure functions**—same Artifact input must always produce same template output (no side effects).
- **Web app is separate**—the dashboard consumes pipeline outputs but doesn't affect them (read-only access to `data/`).

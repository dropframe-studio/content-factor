# AI Coding Agent Instructions for Content Factor

## Project Overview

**Content Factor** is a measurable, automated pipeline for content visibility. It operationalizes the **Build → Capture → Transform → Publish → Measure** loop, turning raw commits and work into visible proof-of-work with dashboards, logs, and snapshots.

### Core Philosophy
- **Proof-of-Work**: Every commit or note leaves behind a measurable artifact.
- **Separation of Concerns**: Each pipeline stage (Capture, Transform, Publish, Measure) is independent.
- **Visibility First**: The system exists to make progress undeniable and shareable.

---

## Architecture & Data Flow

### Key Concept: The Artifact

All work flows through an **Artifact** abstract base class (`pipeline/artifact.ts`):

```typescript
abstract class Artifact {
  id: string;
  slug: string;
  createdAt: string;
  source: ArtifactSource;        // 'git' | 'manual' | 'ci/cd' | 'api' | 'screenshot'
  type: ArtifactType;            // Determines which template to apply
  metadata: ArtifactMetadata;    // title, summary, tags, sourceRef
  payload: Record<string, unknown>;
  
  abstract getStorageStrategy(): StorageStrategy;
  abstract validate(): boolean;
}
```

**NEW (Dec 2025)**: Artifacts now use **class-based architecture** with storage strategies. Each concrete artifact (e.g., `NoteArtifact`, `LinkArtifact`) extends `Artifact` and declares its storage backend.

**ArtifactTypes** map to templates:
- `RAW_COMMIT` → BuildLog template
- `PROGRESS_SNAPSHOT` → ProgressSnapshot template  
- `PROJECT_EXPLAINER` → ProjectExplainer template
- `SYSTEM_OBSERVATION` → SystemObservation template
- `TEACHING_MOMENT` → TeachingMoment template
- `LINK` → LinkArtifact template

### Storage Architecture (ACTIVE MIGRATION)

The project is **migrating from filesystem-only to hybrid storage**:

**Current State**:
- `commit.ts`, `retro.ts`, `screenshot.ts`: Write to `data/artifacts/{id}.json` (filesystem only, legacy pattern)
- `note.ts`, `link.ts`: Use **StorageManager** with SQLite metadata + filesystem payload (new pattern)

**Storage Backends** (`pipeline/storage/`):
- **SQLite** (`backends/sqlite.ts`): Metadata storage using `sqlite3` (replaced `better-sqlite3` after segfaults)
- **Filesystem** (`backends/filesystem.ts`): JSON payload storage in `data/artifacts/`
- **Manager** (`manager.ts`): Routes artifacts to backends based on `getStorageStrategy()`

**Migration Status**: See [REPORTS/2025-12-18_codex-gpt-sqlite3-migration.md](REPORTS/2025-12-18_codex-gpt-sqlite3-migration.md) and [data_migration_phase_list.md](data_migration_phase_list.md).

### Dual Database Pattern

Content Factor uses **two databases** side-by-side during migration:

1. **SQLite** (`data/content-factor.db`): New structured storage for metadata (artifacts, assets tables)
2. **LowDB** (`data/content-factor.json`): Legacy JSON database used by CLI (`bin/cf.ts`)

**Critical**: Don't confuse `pipeline/db.ts` (LowDB for CLI) with `pipeline/storage/backends/sqlite.ts` (SQLite for pipeline).

### Pipeline Flow

```
1. CAPTURE (pipeline/capture/*.ts)
   Input: Git commits, manual notes, screenshots, links
   Output (legacy): Artifact JSON → data/artifacts/
   Output (new): Metadata → SQLite + Payload → filesystem

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
pnpm start              # Builds + runs capture:commit → transform → publish → measure

# Individual capture adapters
pnpm capture:commit     # Latest Git commit (legacy filesystem)
pnpm capture:retro      # Sprint retrospective (legacy filesystem)
pnpm capture:note       # Manual note (NEW: SQLite + filesystem)
pnpm capture:screenshot # Screenshot capture (legacy filesystem)
pnpm capture:link       # Link capture (NEW: SQLite + filesystem)

# Other pipeline steps
pnpm transform          # Apply templates
pnpm publish-content    # Generate Markdown
pnpm measure            # Collect metrics
```

### CLI Tool (`cf`)

```bash
pnpm build              # Must rebuild after changes to bin/cf.ts
cf status               # Show artifact count from LowDB
cf capture link         # Interactive link capture
```

The CLI uses `commander` and reads from `data/content-factor.json` (LowDB), not SQLite.

### Build & Compilation

```bash
pnpm build              # TypeScript → dist/ (uses tsc, no bundler)
```

The project uses **ES modules** (`type: "module"`). **Always use `.js` extensions** in imports:
```typescript
import { captureCommit } from "./capture/commit.js";  // ✅ Correct
import { captureCommit } from "./capture/commit";     // ❌ Will fail at runtime
```

**Side-Effect Warning**: `pipeline/transform.ts` auto-runs on import (line 151). This breaks testability. Guard with:
```typescript
if (import.meta.url === `file://${process.argv[1]}`) {
  runTransformPipeline();
}
```

### Web App Dashboard

```bash
cd web_app
pnpm install
pnpm dev                # Runs Express API (port 3001) + Vite dev server (port 3000) concurrently
```

Dashboard shows artifacts with filters, metrics, and Markdown previews. API reads from filesystem (`data/artifacts/`, `data/published/`), not SQLite.

---

## Project-Specific Patterns

### Pattern 1: Capture Adapter Design (NEW vs LEGACY)

**LEGACY PATTERN** (commit, retro, screenshot):
```typescript
export function captureXxx(): ArtifactData {
  // Returns plain ArtifactData object
}

export async function runCapturePipeline() {
  const artifact = captureXxx();
  const id = generateArtifactId(artifact.type);
  fs.writeFileSync(`data/artifacts/${id}.json`, JSON.stringify(artifact, null, 2));
}
```

**NEW PATTERN** (note, link):
```typescript
export class XxxArtifact extends Artifact {
  constructor(data: ArtifactData) { super(data); }
  
  getStorageStrategy(): StorageStrategy {
    return {
      metadataBackend: 'sqlite',
      contentBackend: 'filesystem',
      config: { sqliteTable: 'xxx', filesystemPath: 'artifacts' }
    };
  }
  
  validate(): boolean {
    return this.payload.content.length > 0;
  }
}

export async function runCapturePipeline() {
  const artifact = new XxxArtifact({ /* ... */ });
  const manager = new StorageManager();
  await manager.store(artifact);  // Routes to SQLite + filesystem
}
```

**Migration TODO**: Convert commit/retro/screenshot to new pattern (see [TODO.md](TODO.md)).

### Pattern 2: Template Transformation

Templates in `templates/` apply structured lenses to Artifacts:

```typescript
export function xxxTemplate(artifact: ArtifactData): any {  // ⚠️ Returns `any`
  return {
    type: 'XxxContent',
    title: artifact.metadata.title,
    // ... extract fields from artifact.payload
  };
}
```

**Type Safety Issue**: Template functions return `any`, causing runtime crashes. See [TODO.md](TODO.md) for migration to strict types.

The **Template Router** in `pipeline/transform.ts` maps types to templates:
```typescript
const TEMPLATE_MAP: Record<ArtifactType, TemplateFunction> = {
  RAW_COMMIT: buildLogTemplate,
  PROGRESS_SNAPSHOT: progressSnapshotTemplate,
  LINK: transformLink,
  // ... more mappings
};
```

### Pattern 3: Publisher Routing

Publishers in `publish/` convert templates into distributable formats:

```typescript
// publish/markdown.ts uses a switch on content.type
export function toMarkdown(content: any): string {
  switch (content.type) {
    case 'BuildLog':           return renderBuildLog(content);
    case 'ProgressSnapshot':   return renderProgressSnapshot(content);
    case 'LinkContent':        return renderLink(content);
    // ... etc
  }
}
```

New output channels (social, email, webhook) follow the same pattern: **one function per content type**.

### Pattern 4: Storage Strategy Pattern

Each Artifact class declares its storage approach via `getStorageStrategy()`:

```typescript
getStorageStrategy(): StorageStrategy {
  return {
    metadataBackend: 'sqlite',      // Where id, type, title, etc. go
    contentBackend: 'filesystem',   // Where payload goes
    config: {
      sqliteTable: 'notes',         // Table name for metadata
      filesystemPath: 'artifacts'   // Directory for payload JSON
    }
  };
}
```

**Backends can differ**: Metadata in SQLite, payload in filesystem (separation of concerns for large payloads).

### Pattern 5: Error Handling & Graceful Degradation

Capture adapters provide **mock data on failure** (e.g., Git not available):

```typescript
try {
  const output = execSync(`git log -1 --pretty=format:"${format}"`);
  return parseCommit(output);
} catch (error) {
  console.error("Git not available, using mock data");
  return {
    hash: "mock-hash-123456",
    message: "Mock Commit: Test data.",
    author: "System Bot",
    date: new Date().toISOString()
  };
}
```

This ensures the pipeline **never fails** on missing dependencies—it produces test artifacts instead.

### Pattern 6: TypeScript & Type Safety

- **Strict mode** enabled (`tsconfig.json: "strict": true`)
- **NodeNext module resolution** (`module: "NodeNext"`, `moduleResolution: "NodeNext"`)
- **ArtifactType** and **ArtifactSource** are union types (discriminated unions)
- Template functions accept `ArtifactData` and return `any` (**TODO**: Replace with strict types)
- Use `.js` extensions in all imports (required for Node.js ESM compatibility)

---

## Integration Points & Dependencies

### External Dependencies
- **Git**: `execSync()` calls `git log` for commit capture. Fails gracefully with mock data.
- **SQLite**: `sqlite3` package (v5.1.7) for metadata storage. Replaced `better-sqlite3` due to segfaults.
- **LowDB**: `lowdb` (v7.0.1) for CLI JSON database (`data/content-factor.json`).
- **Express/CORS**: Web app API server (`web_app/server/api.js`), separate from pipeline.
- **Vite + React + Tailwind**: Web app dashboard (`web_app/src/`).

### Data Flows
- **Pipeline → SQLite**: New capture adapters (note, link) write metadata to `data/content-factor.db`.
- **Pipeline → Filesystem**: All adapters write payloads to `data/artifacts/`, `data/published/`.
- **Web App → Filesystem**: Dashboard reads from filesystem only (no SQLite integration yet).
- **CLI → LowDB**: `bin/cf.ts` reads/writes to `data/content-factor.json`.

### No Testing Framework
The project does **not use Jest/Vitest**. Validation is manual/ad-hoc. If adding tests:
- Use a lightweight test runner (Vitest for speed)
- Focus on template transformations (pure functions, easy to test)
- Mock Git calls, file I/O, and SQLite connections

---

## Common Tasks & Solutions

### Task: Add a New Capture Adapter
1. Create `pipeline/capture/xxx.ts` extending `Artifact` class.
2. Implement `getStorageStrategy()` and `validate()`.
3. Use `StorageManager` to persist (new pattern) or filesystem writes (legacy).
4. Add `pnpm capture:xxx` script to `package.json`.
5. Add CLI command to `bin/cf.ts` if interactive.

### Task: Add a New Template Type
1. Define new `ArtifactType` in `pipeline/artifact.ts`.
2. Create `templates/xxxTemplate.ts` (see Pattern 2).
3. Add to `TEMPLATE_MAP` in `pipeline/transform.ts`.
4. Add renderer to `publish/markdown.ts` switch statement.

### Task: Migrate Legacy Adapter to New Pattern
1. Convert plain function to class extending `Artifact`.
2. Replace `fs.writeFileSync()` with `StorageManager.store()`.
3. Define storage strategy (SQLite metadata + filesystem payload recommended).
4. Update tests and verify outputs in both SQLite and filesystem.

### Task: Debug Pipeline Issues
- Check `data/artifacts/` for raw capture files (filesystem).
- Check `data/content-factor.db` for metadata (SQLite): `sqlite3 data/content-factor.db ".schema"`.
- Check `data/published/` for transformed and final files.
- Run individual steps: `pnpm capture:commit`, `pnpm transform`, etc.
- Look for console logs (pipeline uses `console.log()` not a logger).
- Re-run `pnpm build` after TypeScript changes.

### Task: Fix Side-Effect Import Issues
Add execution guards to pipeline files:
```typescript
if (import.meta.url === `file://${process.argv[1]}`) {
  runPipeline();
}
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `pipeline/artifact.ts` | Artifact abstract class, types, ID generation |
| `pipeline/index.ts` | Full pipeline orchestration |
| `pipeline/db.ts` | LowDB setup for CLI (not SQLite) |
| `pipeline/storage/manager.ts` | Storage abstraction routing |
| `pipeline/storage/backends/sqlite.ts` | SQLite backend (metadata) |
| `pipeline/storage/backends/filesystem.ts` | Filesystem backend (payloads) |
| `pipeline/capture/*.ts` | Source adapters (commit, retro, note, screenshot, link) |
| `pipeline/transform.ts` | Template router & transformer (**has side-effect import**) |
| `pipeline/publish.ts` | Publisher coordinator |
| `pipeline/measure.ts` | Metrics collection |
| `templates/*.ts` | Content transformation blueprints |
| `publish/markdown.ts` | Markdown renderer (main publisher) |
| `bin/cf.ts` | CLI tool using Commander + LowDB |
| `web_app/src/` | React dashboard UI |
| `web_app/server/api.js` | Express API serving artifacts |
| `docs/architecture.md` | Philosophical overview (read this first) |
| `TODO.md` | Known issues and migration tasks |
| `data_migration_phase_list.md` | Migration plan and status |

---

## Notes for AI Agents

- **Storage is in transition**: Check if a capture adapter uses `StorageManager` (new) or `fs.writeFileSync` (legacy).
- **Two databases exist**: SQLite (`data/content-factor.db`) for new pipeline, LowDB (`data/content-factor.json`) for CLI. Don't confuse them.
- **Always use `.js` extensions in imports**—this is a Node.js ESM requirement, not optional.
- **Graceful degradation is a feature**—prefer mock data over throwing errors in capture adapters.
- **Templates return `any`**—this is a known tech debt item (see TODO.md). Validate outputs carefully.
- **Side-effect imports exist**—`transform.ts` auto-runs on import. Add guards if refactoring.
- **Artifact class hierarchy**—new captures extend `Artifact` base class; legacy uses plain `ArtifactData` objects.
- **Web app reads filesystem only**—no SQLite integration in dashboard yet (planned).

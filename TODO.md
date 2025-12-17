# TODO — Content Factor Improvements
**Generated:** December 16, 2025 at 20:45 UTC  
**Last Inspection:** Post-build validation (pnpm build: success)

---

## 🔴 **Critical — Architecture & Refactoring**

### 1. Fix Side-Effect Import in `transform.ts`
**Priority:** High  
**File:** `pipeline/transform.ts` (line 151)

**Issue:** The transformation pipeline auto-runs on file import, breaking testability and module reusability.

**Current:**
```typescript
// Always run when this file executes
runTransformPipeline();
```

**Fix:** Add execution guard:
```typescript
import { pathToFileURL } from 'url';

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runTransformPipeline();
}
```

**Impact:** Enables unit testing, prevents accidental execution during imports.

---

### 2. Replace `any` with Strict Types in Template Functions
**Priority:** High  
**Files:** 
- `pipeline/transform.ts` (line 39)
- All template files in `templates/*.ts`

**Issue:** Template functions return `any`, causing runtime crashes when malformed objects reach the dashboard.

**Action Items:**
1. Create `pipeline/types.ts` with `ContentItem` interface
2. Define strict return types for each template output:
   - `BuildLogContent`
   - `ProgressSnapshotContent`
   - `ProjectExplainerContent`
   - `SystemObservationContent`
   - `TeachingMomentContent`
   - `LinkContent`
3. Update `TEMPLATE_MAP` type signature
4. Ensure all templates conform to their respective interfaces

**Example:**
```typescript
export interface ContentItem {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  recommendedChannels?: string[];
}

export interface BuildLogContent extends ContentItem {
  type: 'BuildLog';
  whatIBuilt: string;
  whyItMatters: string;
  // ... other fields
}
```

---

### 3. Refactor Storage to Use Config-Based Paths
**Priority:** Medium  
**Files:** 
- `pipeline/transform.ts`
- `pipeline/capture/*.ts`
- `pipeline/publish.ts`
- `pipeline/measure.ts`

**Issue:** All pipeline scripts use `process.cwd()` for file paths, breaking when code moves to monorepo structure (`packages/core`).

**Solution:**
1. Create `pipeline/config.ts`:
```typescript
export interface PipelineConfig {
  rootDir: string;
  artifactsDir: string;
  publishedDir: string;
  metricsDir: string;
}

export function getDefaultConfig(): PipelineConfig {
  const root = process.cwd();
  return {
    rootDir: root,
    artifactsDir: join(root, 'data', 'artifacts'),
    publishedDir: join(root, 'data', 'published'),
    metricsDir: join(root, 'data', 'metrics'),
  };
}
```

2. Update all pipeline functions to accept optional `config` parameter
3. Test with relocated directories

---

### 4. Complete Storage Abstraction Layer
**Priority:** Medium  
**Reference:** `data_migration_phase_list.md` (full architecture spec)

**Current State:** Partial implementation with `pipeline/db.ts` using LowDB, but capture adapters still write directly to filesystem.

**Action Items:**
1. Create `pipeline/storage/types.ts` with `IStorageBackend` interface
2. Implement filesystem backend: `pipeline/storage/filesystem.ts`
3. Implement JSON DB backend: `pipeline/storage/lowdb.ts`
4. Refactor capture adapters to use storage abstraction
5. Add storage strategy configuration to each artifact type

**Benefits:**
- Enables SQLite/external DB migrations
- Separates metadata from large payloads (screenshots, media)
- Improves testability with mock storage backends

---

## 🟡 **Important — Code Quality & Testing**

### 5. Add Testing Framework
**Priority:** Medium  
**Current:** No test files exist (`.test.ts`, `.spec.ts` searches returned empty)

**Recommended Setup:**
1. Install Vitest: `pnpm add -D vitest @vitest/ui`
2. Add test scripts to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

3. **Priority test targets:**
   - Template transformations (pure functions, easy to test)
   - `generateArtifactId()` uniqueness
   - Markdown rendering functions
   - Storage backends (with mocks)

**Example Test Structure:**
```
tests/
├── unit/
│   ├── templates/
│   │   ├── buildLog.test.ts
│   │   └── progressSnapshot.test.ts
│   └── storage/
│       └── filesystem.test.ts
├── integration/
│   └── pipeline.test.ts
└── fixtures/
    └── sample-artifacts.json
```

---

### 6. Implement Structured Logging
**Priority:** Low  
**Current:** Uses raw `console.log()`, `console.error()`, `console.warn()` (30+ instances)

**Issue:** No log levels, no structured output, difficult to filter or analyze.

**Solution:**
1. Install logger: `pnpm add pino` (lightweight, fast)
2. Create `pipeline/logger.ts`:
```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});
```

3. Replace console calls:
   - `console.log` → `logger.info`
   - `console.error` → `logger.error`
   - `console.warn` → `logger.warn`

4. Add log levels for debugging:
```typescript
logger.debug('Processing artifact', { id: artifact.id });
logger.info('Pipeline complete', { artifactsProcessed: count });
```

---

### 7. Add Input Validation to Capture Adapters
**Priority:** Medium  
**Files:** `pipeline/capture/*.ts`

**Issue:** No validation for user input in interactive captures (retro, note, link, screenshot).

**Action Items:**
1. Install validator: `pnpm add zod`
2. Define schemas for each capture type:
```typescript
// pipeline/capture/schemas.ts
import { z } from 'zod';

export const LinkCaptureSchema = z.object({
  url: z.string().url(),
  notes: z.string().min(1),
  tags: z.array(z.string()).optional(),
});
```

3. Validate before creating artifacts
4. Return helpful error messages for invalid input

---

## 🟢 **Enhancement — Features & Functionality**

### 8. Complete Sync Engine Implementation
**Priority:** Low  
**Status:** Placeholder folder exists (`sync/pipeline/` is empty)

**Planned Features (from `sync/README.md`):**
- Tag router for Vault integration
- Reflection intake processor
- Vault export formatter
- Prompt linker for Prompt OS integration

**Action:** Review `sync/README.md` architecture and implement pipeline stages when ready to federate with other Dropframe projects.

---

### 9. Add Watch Mode for Development
**Priority:** Medium  
**Current:** Must run `pnpm build` after every TypeScript change

**Solution:**
```bash
pnpm add -D nodemon
```

Add to `package.json`:
```json
{
  "scripts": {
    "dev:build": "tsc --watch",
    "dev:capture": "nodemon --watch dist --exec 'node dist/pipeline/capture/commit.js'",
    "dev:pipeline": "nodemon --watch dist --exec 'node dist/pipeline/index.js'"
  }
}
```

**Usage:**
```bash
# Terminal 1: Auto-compile TypeScript
pnpm dev:build

# Terminal 2: Auto-run pipeline on changes
pnpm dev:pipeline
```

---

### 10. Standardize Artifact ID Format Across All Captures
**Priority:** Low  
**Issue:** Mixed ID formats between filesystem artifacts and JSON DB artifacts

**Current Examples:**
- Filesystem: `raw-commit-20251026-a7b9.json`
- JSON DB: Uses raw IDs without type prefix

**Proposal:**
1. Always use type-prefixed slugs: `{type}-{date}-{hash}`
2. Update `generateArtifactId()` to enforce this
3. Add migration script for existing artifacts

---

### 11. Add Markdown Preview to CLI Captures
**Priority:** Low  
**Files:** `pipeline/capture/note.ts`, `pipeline/capture/link.ts`, `pipeline/capture/retro.ts`

**Enhancement:** Show preview of generated Markdown before saving artifact.

**Implementation:**
```typescript
import chalk from 'chalk';

function previewMarkdown(content: string) {
  console.log(chalk.dim('\n--- PREVIEW ---'));
  console.log(content);
  console.log(chalk.dim('--- END PREVIEW ---\n'));
  
  const confirm = prompt('Save this artifact? (y/n): ');
  return confirm?.toLowerCase() === 'y';
}
```

---

### 12. Implement Dashboard Filtering & Search
**Priority:** Medium  
**Location:** `web_app/src/`

**Current:** Dashboard shows all artifacts, no filtering/search UI visible

**Enhancements:**
1. Add search bar for title/content full-text search
2. Add filter dropdowns:
   - By type (BuildLog, ProgressSnapshot, etc.)
   - By date range
   - By tags
3. Add sort options (newest first, oldest first, alphabetical)
4. Persist filter state in URL query params

---

## 📚 **Documentation & Maintenance**

### 13. Populate CHANGELOG.md
**Priority:** Low  
**Status:** File exists but is empty

**Action:** Document major changes since project inception:
- Initial pipeline setup
- Addition of capture adapters
- Web dashboard launch
- LowDB integration
- Template system evolution

---

### 14. Update Getting Started Guide
**Priority:** Medium  
**File:** `docs/getting-started.md`

**Issues:**
- References `pnpm capture` (doesn't exist in package.json)
- Missing Web App setup instructions
- No troubleshooting section

**Add:**
1. Prerequisites (Node.js version, pnpm installation)
2. Correct command references
3. Common errors and solutions
4. Development workflow (build → run → view dashboard)

---

### 15. Document Template Extension Pattern
**Priority:** Low  
**Location:** Create `docs/guides/adding-templates.md`

**Content:**
1. Step-by-step guide for adding new ArtifactTypes
2. Template function signature requirements
3. How to add to TEMPLATE_MAP
4. How to add Markdown renderer
5. Example: Creating a "MeetingNotes" template

---

### 16. Add Architecture Decision Records (ADRs)
**Priority:** Low  
**Location:** Create `docs/decisions/`

**Purpose:** Document why certain architectural choices were made

**Suggested ADRs:**
1. `001-why-json-files-over-database.md`
2. `002-esm-modules-and-js-extensions.md`
3. `003-graceful-degradation-with-mock-data.md`
4. `004-separation-of-capture-transform-publish.md`

---

## 🔧 **Technical Debt**

### 17. Remove Dual Link Processing Logic
**Priority:** Medium  
**Files:** 
- `pipeline/transform.ts` (lines 104-134)
- `templates/linkArtifact.ts`

**Issue:** Link artifacts processed differently than other types (separate code path in transform.ts, reads from `content-factor.json` instead of `data/artifacts/`)

**Root Cause:** Migration from filesystem to JSON DB incomplete for links

**Resolution:**
1. Unify link capture to write standard artifact files
2. Remove special-case link processing from transform.ts
3. Add LINK to standard TEMPLATE_MAP
4. Ensure link template outputs match other template patterns

---

### 18. Standardize ArtifactSource Type Usage
**Priority:** Low  
**File:** `templates/linkArtifact.ts` (line 36)

**Issue:** Comment says "cli isn't in ArtifactSource yet"

**Fix:**
1. Add 'cli' to ArtifactSource union type in `pipeline/artifact.ts`
2. Update linkArtifact.ts to use 'cli' instead of 'manual'
3. Audit other capture adapters for consistent source labeling

---

### 19. Consolidate Data Directory Structure
**Priority:** Low  
**Current Structure:**
```
data/
├── artifacts/           # Filesystem artifacts
├── published/           # Transformed + Markdown
├── metrics/             # Pipeline metrics
├── content-factor.json  # JSON DB (artifacts + assets)
└── (various other files)
```

**Issue:** Overlapping storage strategies causing confusion

**Proposal:** Document clear data governance:
1. **Primary Storage:** JSON DB (`content-factor.json`)
2. **Legacy/Cache:** Filesystem artifacts (phase out or archive)
3. **Outputs:** Published and metrics remain filesystem
4. Add `.gitignore` rules for generated files

---

## 🎨 **UX & Polish**

### 20. Improve Error Messages in Pipeline
**Priority:** Low

**Current:** Generic error messages like "TRANSFORMATION FAILED"

**Enhancement:**
1. Add context to errors (which artifact failed, why)
2. Suggest resolution steps
3. Example:
```typescript
console.error(`❌ Transformation failed for artifact: ${artifact.id}`);
console.error(`   Type: ${artifact.type}`);
console.error(`   Reason: No template found for this type`);
console.error(`   💡 Tip: Add ${artifact.type} to TEMPLATE_MAP in pipeline/transform.ts`);
```

---

### 21. Add Progress Indicators for Long Operations
**Priority:** Low  
**Files:** Pipeline operations that process multiple files

**Enhancement:** Use spinner or progress bar for operations:
```bash
pnpm add ora cli-progress
```

Example:
```typescript
import ora from 'ora';

const spinner = ora('Transforming artifacts...').start();
// ... process files ...
spinner.succeed(`Transformed ${count} artifacts`);
```

---

## 🚀 **Future Exploration**

### 22. Monorepo Migration (Phase 2+)
**Reference:** `REPORTS/2025-12-03_system-health-check.md` Report B

**Target Structure:**
```
content-factor/
├── packages/
│   └── core/           # Pipeline logic (portable library)
├── apps/
│   ├── dashboard/      # React/Vite UI
│   └── docs/           # Astro documentation portal
├── pnpm-workspace.yaml
└── turbo.json          # Build orchestration
```

**Blockers:** Must complete #3 (config-based paths) first

---

### 23. CI/CD Pipeline Setup
**Priority:** Future  
**Current:** No GitHub Actions workflows

**Suggested Workflows:**
1. **Type Check:** Run `tsc --noEmit` on every PR
2. **Test:** Run Vitest suite (once tests exist)
3. **Build:** Ensure `pnpm build` succeeds
4. **Deploy:** Auto-deploy dashboard to Netlify/Vercel on main branch

---

### 24. Add Artifact Expiration/Archival
**Priority:** Future

**Concept:** Automatically archive old artifacts to reduce active data size

**Features:**
- Configurable retention policy (e.g., archive after 90 days)
- Move old artifacts to `data/archive/`
- Dashboard toggle to show/hide archived content
- Restore functionality

---

## 📊 **Metrics & Monitoring**

### 25. Expand Metrics Collection
**Priority:** Low  
**File:** `pipeline/measure.ts`

**Current:** Basic file count and timestamps

**Add:**
- Artifacts per type breakdown
- Average processing time per stage
- Success/failure rates
- Storage size tracking
- Template usage statistics
- Dashboard analytics (if GA/Plausible added)

**Output:** Enhanced `data/metrics/metrics.json` for dashboard visualizations

---

## ✅ **Quick Wins (Can be done in < 30 minutes each)**

- [ ] Add `.nvmrc` file for Node version consistency
- [ ] Create `.vscode/settings.json` with recommended extensions
- [ ] Add `CONTRIBUTING.md` with PR guidelines
- [ ] Update `README.md` badges to reflect actual build status
- [ ] Add TypeScript path aliases to avoid `../../` imports
- [ ] Create issue templates in `.github/ISSUE_TEMPLATE/`
- [ ] Add EditorConfig file for consistent formatting
- [ ] Create `scripts/` folder for common tasks (clean, reset-data, etc.)

---

## 📝 **Notes**

- **Build Status:** ✅ All TypeScript compiles successfully (as of Dec 16, 2025)
- **No Blocking Errors:** System is operational, these are enhancements
- **Priority Legend:**
  - 🔴 **Critical:** Affects stability, testability, or monorepo migration
  - 🟡 **Important:** Improves code quality and maintainability
  - 🟢 **Enhancement:** Adds features or improves UX
  - 🎨 **Polish:** Nice-to-have refinements

---

**Next Steps:**
1. Review and prioritize based on immediate goals
2. Create GitHub issues from high-priority items
3. Tackle architectural refactoring (#1-4) before monorepo migration
4. Add testing infrastructure (#5) to prevent regressions

**Last Updated:** December 16, 2025

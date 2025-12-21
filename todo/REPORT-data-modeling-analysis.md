# Analysis Report: Data Modeling & Capture Mechanic Plans

**Report Date:** December 20, 2025  
**Analyst:** AI Coding Agent  
**Subject:** Content Factor Unified Artifact Capture System  
**Source Materials:** `docs/plans/data-modeling-capture-machanic/`

---

## Executive Summary

The planning documents outline a **comprehensive architectural shift** from fragmented capture patterns to a unified artifact system. This represents a **major refactoring** that will:

✅ **Consolidate** 5+ capture methods into one canonical schema  
✅ **Enable** directory watching for automatic document capture  
✅ **Introduce** asset policy system (store vs pointer logic)  
✅ **Clarify** the Capture → Template → Publish separation  
❌ **Requires** significant migration work (30-45 dev days)  
⚠️ **Risk** of breaking existing artifacts and templates

**Recommendation**: Proceed in phases with full backup, starting with schema alignment.

---

## 1. Findings

### 1.1 Current State Analysis

**Existing Artifact Architecture** (as of Dec 2025):
```typescript
// pipeline/artifact.ts - Current implementation
abstract class Artifact {
  id: string;
  slug: string;
  createdAt: string;
  source: ArtifactSource;  // 'git' | 'manual' | 'ci/cd' | 'api' | 'screenshot'
  type: ArtifactType;
  metadata: { title, summary, tags, sourceRef };
  payload: Record<string, unknown>;  // Flexible, unstructured
}
```

**Gaps Identified**:
- ❌ No `origin` field (system, user, path tracking)
- ❌ No `asset_policy` (store vs pointer decision logic)
- ❌ No `content_ref` (extracted content separate from raw data)
- ❌ No `lifecycle` (status, revision, archived_at)
- ❌ No `metadata.intent` (why was this captured?)
- ❌ No `links` (relationships between artifacts)
- ⚠️ `payload` is untyped, should migrate to `content_ref` + `metadata_ext`

**Current Capture Adapters**:
| Adapter | Pattern | Storage | Schema Compliance |
|---------|---------|---------|-------------------|
| `commit.ts` | Legacy (plain object) | Filesystem only | ❌ Missing fields |
| `retro.ts` | Legacy (plain object) | Filesystem only | ❌ Missing fields |
| `screenshot.ts` | Legacy (plain object) | Filesystem only | ❌ Missing fields |
| `note.ts` | New (extends Artifact) | SQLite + Filesystem | ⚠️ Partial |
| `link.ts` | New (extends Artifact) | SQLite + Filesystem | ⚠️ Partial |

**Conclusion**: 60% of capture adapters use legacy pattern and are non-compliant with proposed schema.

---

### 1.2 Proposed Schema Analysis

**Canonical Schema** (from `artifict.schema.json` + plan docs):

```typescript
interface UnifiedArtifact {
  // Core identity
  id: string;                    // UUID or hash-based
  type: "document" | "annotation" | "commit" | "link" | 
        "screenshot" | "audio" | "image" | "dataset" | "other";
  
  // Origin tracking (NEW)
  origin: {
    system: string;              // "watcher" | "cli" | "git" | "api"
    user?: string;
    path?: string;
    device?: string;
  };
  
  // Asset management (NEW)
  asset_policy: {
    mode: "store" | "pointer" | "hybrid";
    reason?: string;             // "size" | "sensitivity" | "manual"
    location: string;            // "filesystem" | "s3" | "gcs"
    checksum: string;            // SHA-256 for integrity
    size_bytes?: number;
  };
  
  // Content reference (NEW - replaces payload)
  content_ref: string | null;    // Extracted text, transcript, etc.
  
  // Enhanced metadata
  metadata: {
    title: string;
    description?: string;
    tags: string[];
    created_at: string;
    intent: "note" | "retro" | "commentary" | "reference" | "unknown";  // NEW
    threat_level?: "none" | "low" | "medium" | "high" | "strategic";   // NEW
    confidence?: number;         // 0-1 for ML captures
    relations?: string[];        // Related artifact IDs
  };
  
  // Type-specific extensions
  metadata_ext?: Record<string, unknown>;  // Replaces generic payload
  custom?: Record<string, unknown>;        // User-defined
  
  // Relationships (NEW)
  links?: Array<{
    target_id: string;
    relation: string;            // "describes" | "references" | "derived_from"
  }>;
  
  // Lifecycle (NEW)
  lifecycle: {
    status: "active" | "archived" | "deleted";
    revision: number;
    archived_at?: string;
  };
  
  // Capture timestamp
  captured_at: string;           // System time when captured
}
```

**Schema Strengths**:
1. ✅ **Universal**: Same schema for commits, docs, notes, screenshots
2. ✅ **Flexible**: `metadata_ext` and `custom` for type-specific data
3. ✅ **Traceable**: `origin`, `lifecycle`, and `links` enable full lineage
4. ✅ **Asset-aware**: `asset_policy` separates metadata from storage decisions
5. ✅ **Intent-driven**: `metadata.intent` enables semantic routing

**Schema Concerns**:
1. ⚠️ **Breaking change**: All existing artifacts need migration
2. ⚠️ **Complexity**: More fields = more validation overhead
3. ⚠️ **Storage impact**: Dual storage (metadata in SQLite, assets in filesystem)

---

### 1.3 Directory Watcher Proposal

**Core Concept**: Watch filesystem directories for new/modified files, automatically create artifacts.

**Implementation Plan** (from `TS-directory-watcher.md`):

```typescript
// Proposed structure
pipeline/capture/watcher/
  ├── index.ts          // Chokidar-based file watcher
  ├── ingest.ts         // File → Artifact mapping
  ├── classify.ts       // MIME → artifact.type
  ├── fingerprint.ts    // SHA-256 checksumming
  └── policy.ts         // Asset policy decision logic
```

**Workflow**:
```
1. File added to watched directory (e.g., data/inbox/)
   ↓
2. Calculate SHA-256 checksum
   ↓
3. Check if checksum exists (dedupe)
   ↓
4. Detect MIME type
   ↓
5. Classify artifact.type (document, image, audio, etc.)
   ↓
6. Apply asset policy rules:
   - < 10MB → store
   - Image/audio → store
   - Video/large → pointer
   ↓
7. Create Artifact with:
   - origin.system = "watcher"
   - metadata.intent = "reference" (always, no auto-detection)
   ↓
8. Persist via StorageManager
```

**Key Features**:
- ✅ **Idempotent**: Same file won't create duplicate artifacts (checksum dedupe)
- ✅ **Non-blocking**: Watcher runs as background process
- ✅ **Policy-driven**: Asset storage decisions are configurable
- ✅ **MIME-aware**: Classifies by content type, not file extension

**Challenges**:
1. ⚠️ **State management**: Need to track seen files (recommend SQLite `watcher_state` table)
2. ⚠️ **Error handling**: What happens if file is moved/deleted during processing?
3. ⚠️ **Resource usage**: Watching large directories could be expensive
4. ❌ **No intent detection**: Watcher can't distinguish note vs reference (always sets "reference")

---

### 1.4 Intent System & Universal Forms

**Conceptual Framework** (from `data-model.md`):

The plans define **3 layers** that must remain separate:

```
Layer 1: CAPTURE (Forms - "What was recorded?")
  ├── Evidence (documents, screenshots, commits)
  ├── Annotation (notes, margin comments)
  ├── Reflection (retros, AARs)
  └── Signal (lattice communications)
  
  ↓ (metadata.intent determines form)
  
Layer 2: INTERPRETATION (Templates - "What is this used as?")
  ├── BuildLog
  ├── ProgressSnapshot
  ├── SystemObservation
  ├── ProjectExplainer
  └── TeachingMoment
  
  ↓ (template produces structured content)
  
Layer 3: PUBLICATION (Views - "How is it rendered?")
  ├── Markdown
  ├── Dashboard JSON
  └── Social snippets
```

**Key Insight**: `metadata.intent` is the discriminator for "universal forms":
- `intent: "reference"` → Evidence form (documents, links, screenshots)
- `intent: "note"` → Annotation form
- `intent: "retro"` → Reflection form (AARs, retrospectives)
- `intent: "commentary"` → Signal form (lattice inputs)

**This solves the "retro vs note" confusion**:
- Both are `type: "annotation"`
- Differentiated by `metadata.intent`
- Templates can route based on intent

**Critical Rule** (from `data-contract.md`):
> "Templates are readers and writers of meaning, never editors of truth."

Templates:
- ✅ MAY read all artifact fields
- ✅ MAY produce new files in `data/published/`
- ❌ MUST NOT modify artifacts in `data/artifacts/`
- ❌ MUST NOT backfill or "upgrade" metadata

---

### 1.5 Asset Policy System

**Decision Logic** (from `overview.md` + plan docs):

```typescript
function decideAssetPolicy(mime: string, sizeBytes: number): AssetPolicy {
  if (sizeBytes < 10_000_000) {           // < 10MB
    return { mode: "store", reason: "size" };
  }
  
  if (mime.startsWith("image/") || mime.startsWith("audio/")) {
    return { mode: "store", reason: "type" };
  }
  
  if (mime.startsWith("video/")) {
    return { mode: "pointer", reason: "size" };
  }
  
  // Default for documents
  if (mime === "application/pdf" || mime.startsWith("text/")) {
    return { mode: "store", reason: "type" };
  }
  
  return { mode: "pointer", reason: "size" };
}
```

**Storage Implications**:
- **Store mode**: Copy file to `data/assets/{artifact-id}/original.ext`
- **Pointer mode**: Store path reference in `asset_policy.location`, don't duplicate
- **Hybrid mode**: (Future) Store compressed + pointer to original

**Rationale**:
1. Small files (< 10MB): Cheap to store, easier to backup/sync
2. Images/audio: Content is the asset, must preserve
3. Video/large files: Too expensive to duplicate
4. Documents (PDF, text): Core content, should be stored

**Gaps**:
- ❌ No encryption support for sensitive files
- ❌ No compression for "store" mode
- ❌ No cleanup strategy for orphaned assets (if artifact deleted)

---

## 2. Architectural Assessment

### 2.1 Strengths of Proposed Design

1. **Unified Schema Eliminates Fragmentation**
   - Current: 5 different capture adapters with inconsistent output
   - Proposed: 1 schema, multiple sources
   - Impact: Easier to query, transform, and extend

2. **Clear Layer Separation**
   - Capture (Layer 1) produces immutable truth
   - Templates (Layer 2) interpret without mutation
   - Publishers (Layer 3) render for consumption
   - Impact: Prevents spaghetti dependencies

3. **Intent-Based Routing**
   - `metadata.intent` enables semantic classification without changing schema
   - Templates can route based on intent + type
   - Impact: Solves "retro vs note" and other ambiguities

4. **Asset Policy Abstraction**
   - Decouples "what was captured" from "where it's stored"
   - Enables future cloud storage (S3, GCS) without schema changes
   - Impact: Scales from local files to distributed storage

5. **Extensibility via `metadata_ext` and `custom`**
   - New artifact types don't require schema changes
   - User experiments don't pollute core schema
   - Impact: Future-proof for unknown use cases

---

### 2.2 Weaknesses & Risks

1. **Migration Complexity (HIGH RISK)**
   - 50+ existing artifacts in `data/artifacts/` with old schema
   - No backward compatibility layer proposed
   - Templates may break if artifacts missing new fields
   - **Mitigation**: Phased migration with full backups

2. **Directory Watcher State Management**
   - Need to track seen files to prevent duplicates
   - State can get out of sync if files manually deleted
   - No cleanup strategy for stale state
   - **Mitigation**: SQLite-based state with periodic cleanup job

3. **Asset Storage Duplication**
   - "Store" mode duplicates files (original + `data/assets/`)
   - Doubles disk usage for all small/medium files
   - No compression or deduplication beyond checksum
   - **Mitigation**: Add cleanup task to remove orphaned assets

4. **No Intent Auto-Detection**
   - Directory watcher always sets `intent: "reference"`
   - Manual captures must prompt for intent (UX friction)
   - No ML/heuristic-based intent suggestion
   - **Mitigation**: Add "smart suggestions" based on filename/content in future

5. **Template Contract Not Enforced**
   - Plans document contracts but don't provide enforcement
   - Templates could still mutate artifacts (runtime issue)
   - No lint rules or type guards
   - **Mitigation**: Add validation layer in `transform.ts` + runtime checks

---

### 2.3 Integration with Current Codebase

**Compatibility Matrix**:

| Component | Current State | Proposed Change | Compatibility |
|-----------|---------------|-----------------|---------------|
| `pipeline/artifact.ts` | Abstract class, 7 fields | Add 6 new fields | ⚠️ Breaking |
| `pipeline/storage/` | SQLite + Filesystem | Add asset backend | ✅ Additive |
| `pipeline/capture/commit.ts` | Legacy pattern | Refactor to class | ⚠️ Breaking |
| `pipeline/capture/note.ts` | Class pattern | Update schema | ⚠️ Minor changes |
| `templates/*.ts` | Read `payload` | Read `content_ref` + `metadata_ext` | ⚠️ Breaking |
| `publish/markdown.ts` | Renders content.type | No changes needed | ✅ Compatible |
| `web_app/` | Reads filesystem | Add asset serving | ⚠️ Minor changes |
| `bin/cf.ts` | LowDB only | Add watcher commands | ✅ Additive |

**Breaking Changes**:
1. Artifact schema (7 → 13 fields)
2. Capture adapter signatures
3. Template data access (`payload` → `content_ref` + `metadata_ext`)
4. Asset storage location (`data/artifacts/` → `data/assets/`)

**Non-Breaking Additions**:
1. Directory watcher (new capture method)
2. Asset policy system (new abstraction)
3. Intent-based routing (new metadata field)
4. CLI commands (`cf watch`, `cf capture document`)

---

### 2.4 Comparison to Existing Migration Work

**Current Migration** (from `data_migration_phase_list.md`):
- Goal: Move from filesystem-only to SQLite metadata + filesystem payloads
- Status: 2/5 adapters migrated (`note.ts`, `link.ts`)
- Blockers: `commit.ts`, `retro.ts`, `screenshot.ts` still use legacy pattern

**Proposed Plans**:
- Goal: Unified artifact schema + directory watcher
- Overlap: Both require capture adapter refactoring
- Conflict: Two different schema targets (current migration vs proposed schema)

**Critical Finding**: **The two efforts are not aligned!**

Current migration targets this schema:
```typescript
{ id, slug, createdAt, source, type, metadata, payload }
```

Proposed schema is:
```typescript
{ id, type, origin, asset_policy, content_ref, metadata, metadata_ext, 
  custom, links, lifecycle, captured_at }
```

**Recommendation**: **Pause current migration, adopt proposed schema as target.**
- This avoids double-migration (filesystem → partial SQLite → full unified schema)
- Consolidates effort into one comprehensive refactor
- Aligns with long-term vision from plans

---

## 3. Suggestions

### 3.1 Immediate Actions (This Week)

1. **Freeze Current Migration** (Phase 1)
   - Document current state of `note.ts` and `link.ts` migrations
   - Create feature branch: `feature/unified-artifact-schema`
   - Full backup of `data/artifacts/` and `data/content-factor.db`

2. **Schema Alignment Audit** (Phase 1)
   - Compare `pipeline/artifact.ts` to `artifict.schema.json` field-by-field
   - Document every field addition, removal, rename
   - Create migration script skeleton: `scripts/migrate-artifacts.ts`

3. **Stakeholder Decision on Blockers**
   - Blocker 1: Asset storage location (`data/assets/` vs current)
   - Blocker 2: Migration strategy (one-time vs lazy)
   - Blocker 3: Template backward compatibility approach
   - **Decision deadline**: End of week (Dec 27, 2025)

---

### 3.2 Technical Recommendations

#### Recommendation 1: Adopt Canonical Schema Incrementally

**Instead of**: Big-bang migration of all artifacts + adapters + templates  
**Do this**: Phased rollout with dual-schema support

**Phase A**: Update Artifact class, make new fields optional
```typescript
abstract class Artifact {
  // Existing fields (required)
  id: string;
  slug: string;
  createdAt: string;
  source: ArtifactSource;
  type: ArtifactType;
  metadata: ArtifactMetadata;
  
  // New fields (optional initially)
  origin?: ArtifactOrigin;
  asset_policy?: AssetPolicy;
  content_ref?: string | null;
  lifecycle?: Lifecycle;
  links?: Link[];
}
```

**Phase B**: Migrate adapters one by one (start with `screenshot.ts`)

**Phase C**: Backfill existing artifacts with defaults

**Phase D**: Make new fields required, remove old fields

**Benefit**: Reduces blast radius, allows testing at each phase.

---

#### Recommendation 2: Implement Directory Watcher as Standalone Service

**Instead of**: Integrating watcher into main pipeline process  
**Do this**: Separate process/daemon with its own lifecycle

```bash
# New commands
pnpm watch:start        # Start watcher daemon (background)
pnpm watch:stop         # Graceful shutdown
pnpm watch:status       # Show watched dirs + stats

# CLI equivalents
cf watch start --dirs data/inbox,vault/documents
cf watch stop
cf watch status
```

**Architecture**:
```
watcher-daemon/
  ├── index.ts          # Main process (uses pm2 or systemd)
  ├── health.ts         # Health check endpoint
  ├── state.ts          # SQLite state management
  └── config.json       # Watch directories, policy overrides
```

**Benefit**: 
- Watcher crashes don't affect main pipeline
- Can be deployed/scaled independently
- Easier to debug and monitor

---

#### Recommendation 3: Add Schema Validation Layer

**Instead of**: Manual validation in each adapter  
**Do this**: Centralized JSON Schema validation

```typescript
// pipeline/schemas/validator.ts
import Ajv from "ajv";
import artifactSchema from "./artifact.schema.json";

const ajv = new Ajv();
const validateArtifact = ajv.compile(artifactSchema);

export function validateAndStore(artifact: Artifact): string {
  const valid = validateArtifact(artifact.serialize());
  
  if (!valid) {
    throw new ValidationError(
      `Artifact failed schema validation: ${ajv.errorsText(validateArtifact.errors)}`
    );
  }
  
  return storageManager.store(artifact);
}
```

**Usage in adapters**:
```typescript
// Before (no validation)
await storageManager.store(artifact);

// After (enforced validation)
await validateAndStore(artifact);
```

**Benefit**: Catches schema violations at write-time, not read-time.

---

#### Recommendation 4: Asset Storage Abstraction

**Instead of**: Hardcoding `data/assets/` paths everywhere  
**Do this**: Asset backend interface

```typescript
// pipeline/storage/backends/asset.ts
export class AssetBackend implements IStorageBackend {
  constructor(private basePath: string = "data/assets") {}
  
  async storeAsset(artifactId: string, filePath: string): Promise<string> {
    const assetDir = path.join(this.basePath, artifactId);
    await fs.ensureDir(assetDir);
    
    const ext = path.extname(filePath);
    const destPath = path.join(assetDir, `original${ext}`);
    
    await fs.copyFile(filePath, destPath);
    return destPath;
  }
  
  async retrieveAsset(artifactId: string): Promise<string | null> {
    const assetDir = path.join(this.basePath, artifactId);
    const files = await fs.readdir(assetDir);
    return files.length > 0 ? path.join(assetDir, files[0]) : null;
  }
  
  async deleteAsset(artifactId: string): Promise<boolean> {
    const assetDir = path.join(this.basePath, artifactId);
    await fs.remove(assetDir);
    return true;
  }
}
```

**Benefit**: 
- Easy to swap filesystem for S3/GCS later
- Centralized asset cleanup logic
- Testable in isolation

---

#### Recommendation 5: Intent Detection (Future Enhancement)

**Instead of**: Always setting `intent: "reference"` for directory watcher  
**Do this**: ML-based intent suggestion (Phase 2)

```typescript
// Future: pipeline/capture/watcher/intent-detector.ts
export async function suggestIntent(
  filePath: string, 
  mime: string, 
  content: string
): Promise<{ intent: string; confidence: number }> {
  // Heuristics:
  // - Filename contains "retro" or "AAR" → "retro"
  // - Filename contains "note" or in "notes/" dir → "note"
  // - Commit message in content → "reference"
  // - Short text with bullet points → "note"
  
  // ML model (future):
  // - Train on existing artifact corpus
  // - Classify based on content + metadata
  
  return { intent: "reference", confidence: 0.5 };  // Placeholder
}
```

**Benefit**: Reduces manual intent tagging, improves automation.

---

### 3.3 Process Recommendations

1. **Create ADR (Architecture Decision Record)**
   - Document decision to adopt unified schema
   - Rationale for directory watcher approach
   - Trade-offs and alternatives considered
   - Store in `docs/decisions/001-unified-artifact-schema.md`

2. **Establish Schema Governance**
   - Schema changes require review + approval
   - Version schema file (`artifact.schema.v2.json`)
   - Migration guide mandatory for breaking changes
   - Create `SCHEMA_CHANGELOG.md`

3. **Test-Driven Migration**
   - Write tests BEFORE migrating each adapter
   - Test fixtures for old + new schema
   - Integration tests for watcher → storage flow
   - Target: 80% coverage for new capture logic

4. **Documentation-First Development**
   - Update `docs/architecture.md` with new flow diagrams
   - Create `docs/guides/directory-watcher.md` user guide
   - Update `.github/copilot-instructions.md` with new patterns
   - Write migration guide before writing migration code

---

## 4. Next Steps

### Immediate (Next 2 Weeks)

**Week 1: Planning & Alignment**
- [ ] Stakeholder review of this report
- [ ] Decision on 3 critical blockers (asset storage, migration strategy, template compat)
- [ ] Create `feature/unified-artifact-schema` branch
- [ ] Full backup of current data (artifacts + DB)
- [ ] Schema alignment audit (current vs canonical)

**Week 2: Foundation Work**
- [ ] Implement schema validation layer (Recommendation 3)
- [ ] Update `Artifact` base class with optional new fields
- [ ] Create migration script skeleton
- [ ] Write test fixtures for new schema
- [ ] Update SQLite schema with new fields

---

### Short-Term (Next 4 Weeks)

**Weeks 3-4: Adapter Migration**
- [ ] Migrate `screenshot.ts` to new schema (pilot)
- [ ] Test end-to-end flow
- [ ] Migrate `commit.ts` and `retro.ts`
- [ ] Update `note.ts` and `link.ts` to full schema
- [ ] Backfill existing artifacts (migration script)

**Weeks 5-6: Directory Watcher**
- [ ] Implement watcher core (fingerprint, classify, policy)
- [ ] Add state management (SQLite)
- [ ] Create CLI commands
- [ ] Integration testing
- [ ] Documentation

---

### Medium-Term (Next 3 Months)

**Month 2: Asset System**
- [ ] Implement `AssetBackend` class
- [ ] Add asset storage for "store" mode
- [ ] Update web app to serve from `data/assets/`
- [ ] Add cleanup job for orphaned assets

**Month 3: Templates & Publishing**
- [ ] Update all templates to read new schema
- [ ] Test template routing with intent system
- [ ] Enforce template contract (validation layer)
- [ ] Update publish layer for new metadata

**Month 3: Stabilization**
- [ ] Complete test coverage (>80% target)
- [ ] Performance testing (watcher with 1000+ files)
- [ ] Documentation finalization
- [ ] User acceptance testing

---

### Long-Term (Next 6 Months)

**Q2 2026: Advanced Features**
- [ ] ML-based intent detection
- [ ] Cloud storage backends (S3, GCS)
- [ ] Drag-and-drop GUI (Tkinter or PyQt)
- [ ] Advanced query DSL for artifacts
- [ ] Relationship graph visualization

**Q2 2026: Integration**
- [ ] Sync with Grindline (workflow automation)
- [ ] Integration with StyleSystem (shared tokens)
- [ ] API for external systems
- [ ] Webhook notifications for new captures

---

## 5. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Data loss during migration** | Medium | Critical | Full backups + dry-run + rollback plan |
| **Template breakage** | High | High | Dual-schema support + phased rollout |
| **Watcher performance issues** | Medium | Medium | Separate daemon + resource limits |
| **Scope creep** | High | Medium | Strict phase boundaries + MVP focus |
| **Developer confusion** | Medium | Medium | Comprehensive docs + examples |
| **Storage cost explosion** | Low | Medium | Asset policy + cleanup jobs |
| **Integration conflicts** | Medium | High | Early stakeholder alignment |

**Overall Risk Level**: **MEDIUM-HIGH**

This is a **major architectural refactor** that touches every part of the pipeline. However, the plans are well-thought-out and the phased approach mitigates most risks.

---

## 6. Conclusion

The data modeling and capture mechanic plans represent a **mature, well-reasoned architectural vision** for Content Factor. The proposed unified artifact schema solves real fragmentation issues and enables powerful new capabilities (directory watching, asset management, intent-based routing).

**Key Takeaways**:
1. ✅ Plans are technically sound and align with industry best practices
2. ⚠️ Implementation is a 30-45 day effort with migration complexity
3. 🔴 Current migration work conflicts with proposed schema (needs alignment)
4. ✅ Phased approach reduces risk and allows for testing at each stage
5. ✅ Directory watcher is a high-value feature that solves real pain points

**Go/No-Go Recommendation**: **GO** with conditions:
- Pause current migration, adopt canonical schema as target
- Start with schema alignment + migration script
- Implement directory watcher as standalone service
- Enforce schema validation before storage
- Comprehensive testing and documentation

**Confidence Level**: **HIGH** - The plans are solid, the codebase is ready, and the benefits justify the effort.

---

## Appendices

### Appendix A: Schema Comparison Table

| Field | Current | Proposed | Change Type |
|-------|---------|----------|-------------|
| `id` | ✅ string | ✅ string | Same |
| `slug` | ✅ string | ❌ Removed | Breaking |
| `createdAt` | ✅ string | → `metadata.created_at` | Moved |
| `source` | ✅ ArtifactSource | → `origin.system` | Restructured |
| `type` | ✅ ArtifactType | ✅ Enhanced enum | Changed |
| `metadata` | ✅ Basic | ✅ Enhanced | Extended |
| `payload` | ✅ Record | → `content_ref` + `metadata_ext` | Restructured |
| `origin` | ❌ Missing | ✅ Added | New |
| `asset_policy` | ❌ Missing | ✅ Added | New |
| `lifecycle` | ❌ Missing | ✅ Added | New |
| `links` | ❌ Missing | ✅ Added | New |
| `captured_at` | ❌ Missing | ✅ Added | New |

**Total Changes**: 7 existing → 11 new (4 removed/restructured, 6 added)

---

### Appendix B: File Type Classification Matrix

| MIME Type | Artifact Type | Asset Policy | Rationale |
|-----------|---------------|--------------|-----------|
| `image/*` | `image` | Store | Visual content, manageable size |
| `audio/*` | `audio` | Store | Audio content, medium size |
| `video/*` | `other` | Pointer | Large files, expensive to duplicate |
| `application/pdf` | `document` | Store | Core content, searchable |
| `text/*` | `document` | Store | Lightweight, core content |
| `application/json` | `dataset` | Store (< 10MB) | Structured data |
| `application/zip` | `other` | Pointer | Archives, large size |
| `application/octet-stream` | `other` | Pointer | Unknown, cautious approach |

---

### Appendix C: References

**Planning Documents**:
- `docs/plans/data-modeling-capture-machanic/overview.md` (301 lines)
- `docs/plans/data-modeling-capture-machanic/data-model.md` (260 lines)
- `docs/plans/data-modeling-capture-machanic/data-contract.md` (301 lines)
- `docs/plans/data-modeling-capture-machanic/artifact-schema.md` (150 lines)
- `docs/plans/data-modeling-capture-machanic/directory-watcher.md` (282 lines)
- `docs/plans/data-modeling-capture-machanic/TS-directory-watcher.md` (231 lines)
- `docs/plans/data-modeling-capture-machanic/ts-pipeline-artifact.md` (229 lines)
- `docs/plans/data-modeling-capture-machanic/artifict.schema.json` (207 lines)

**Related Documentation**:
- `docs/architecture.md` (current architecture)
- `data_migration_phase_list.md` (current migration plan)
- `TODO.md` (known tech debt)
- `.github/copilot-instructions.md` (AI agent guide)

**Total Planning Documentation**: 2,061 lines across 8 files

---

**Report compiled**: December 20, 2025  
**Next review**: After stakeholder decisions on blockers  
**Owner**: Development team lead (TBD)

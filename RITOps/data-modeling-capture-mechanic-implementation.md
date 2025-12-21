# TODO: Data Modeling & Capture Mechanic Implementation

**Created:** December 20, 2025  
**Source:** `docs/plans/data-modeling-capture-machanic/`  
**Status:** Planning → Implementation

---

## 🎯 Executive Summary

The plans define a **unified artifact capture system** that consolidates all content sources (documents, commits, notes, retros, screenshots, audio) into a single pipeline with:
- Directory watcher for automatic file capture
- Universal Artifact schema (replaces fragmented capture patterns)
- Asset policy system (store vs pointer decision logic)
- Clear separation: Capture → Template → Publish

**Critical Insight**: The current codebase has **partial implementation** with legacy patterns. This plan requires **schema migration + new capture layer**.

---

## 📋 Todo List

### Phase 1: Schema Alignment & Foundation (HIGH PRIORITY)

- [ ] **1.1** Audit current `pipeline/artifact.ts` against canonical schema
  - Compare with `artifict.schema.json` (207 lines)
  - Identify missing fields: `origin`, `asset_policy`, `content_ref`, `lifecycle`, `metadata.intent`
  - Map existing fields to new schema
  - Document breaking changes

- [ ] **1.2** Create migration path for existing artifacts
  - Inventory `data/artifacts/*.json` files (50+ legacy artifacts)
  - Write migration script to upgrade schema
  - Add default values: `origin.system`, `asset_policy.mode`, `lifecycle.status`
  - Preserve existing `payload` as `content_ref` or `custom`

- [ ] **1.3** Update `Artifact` base class with new fields
  - Add `origin: { system, user?, path? }`
  - Add `asset_policy: { mode, reason, location, checksum, size_bytes? }`
  - Add `content_ref: string | null`
  - Add `lifecycle: { status, revision, archived_at? }`
  - Add `metadata.intent` with enum: `["note", "retro", "commentary", "reference", "unknown"]`
  - Update `validate()` to check required fields

- [ ] **1.4** Implement JSON Schema validation
  - Copy `artifict.schema.json` to `pipeline/schemas/artifact.schema.json`
  - Add `ajv` or similar validator to pipeline dependencies
  - Integrate validation into `Artifact.validate()`
  - Add schema validation tests

---

### Phase 2: Asset Policy System (MEDIUM PRIORITY)

- [ ] **2.1** Create asset policy decision logic
  - Implement `pipeline/capture/policy.ts` (from `directory-watcher.md` line 77-96)
  - Default rules:
    - `< 10MB` → store
    - Images/audio → store
    - Video/large files → pointer
    - Manual override support
  - Add configuration file: `pipeline/config/asset-policy.json`

- [ ] **2.2** Implement fingerprinting utilities
  - Create `pipeline/capture/fingerprint.ts`
  - SHA-256 checksum for all captured files
  - Dedupe logic (check existing checksums before creating new artifact)
  - Add to `StorageManager` integration

- [ ] **2.3** Add MIME detection
  - Create `pipeline/capture/classify.ts` (from `TS-directory-watcher.md` line 40-50)
  - Map MIME types to artifact types:
    - `image/*` → `image`
    - `audio/*` → `audio`
    - `application/pdf` → `document`
    - `text/*` → `document`
  - Add `mime-types` dependency

---

### Phase 3: Directory Watcher Implementation (HIGH PRIORITY)

- [ ] **3.1** Set up directory watcher infrastructure
  - Create `pipeline/capture/watcher/` directory
  - Add `chokidar` dependency for file watching
  - Define watch directories in config (suggest: `data/inbox/`)
  - Implement event handlers: `add`, `change`, (ignore `unlink` initially)

- [ ] **3.2** Implement core ingestion logic
  - Create `pipeline/capture/watcher/ingest.ts` (from `TS-directory-watcher.md` line 75-138)
  - Map file → Artifact using canonical schema
  - Integrate with `StorageManager`
  - Handle errors gracefully (log + continue watching)

- [ ] **3.3** Add state tracking
  - Implement seen-file tracking (checksum-based)
  - Prevent duplicate artifact creation on file modification
  - Store state in SQLite (`watcher_state` table) or separate JSON
  - Add cleanup for stale entries

- [ ] **3.4** Create watcher CLI commands
  - `pnpm capture:watch` - start directory watcher
  - `pnpm capture:watch:stop` - graceful shutdown
  - `cf watch start` - CLI command
  - `cf watch status` - show watched directories + recent captures

---

### Phase 4: Intent & Metadata Layer (MEDIUM PRIORITY)

- [ ] **4.1** Implement intent-based classification
  - Update capture adapters to set `metadata.intent`:
    - `commit.ts` → `"reference"`
    - `note.ts` → `"note"` (default) or user-selected
    - `retro.ts` → `"retro"`
    - `watcher` → `"reference"` (no auto-detection)
  - Add intent to template router logic

- [ ] **4.2** Extend metadata structure
  - Add `metadata.threat_level` (optional, for strategic bolts)
  - Add `metadata.relations` array (link to related artifact IDs)
  - Add `metadata.confidence` (0-1 for ML-assisted captures)
  - Keep backward compatibility with existing metadata

- [ ] **4.3** Implement metadata_ext patterns
  - Define type-specific extensions:
    - `document`: `{ mime, page_count?, word_count? }`
    - `commit`: `{ hash, branch, author, diff_stats }`
    - `annotation`: `{ target_artifact?, position? }`
  - Update capture adapters to populate metadata_ext

---

### Phase 5: Template Contract Enforcement (MEDIUM PRIORITY)

- [ ] **5.1** Document template read/write contracts
  - Create `docs/contracts/template-contract.md` (based on `data-contract.md`)
  - Enforce: Templates MAY read artifacts, MUST NOT write to `data/artifacts/`
  - Add rule: Templates write only to `data/published/`

- [ ] **5.2** Audit existing templates for violations
  - Check `templates/*.ts` for direct artifact mutations
  - Ensure all outputs go to `data/published/`
  - Verify no templates write to `data/artifacts/`

- [ ] **5.3** Add template validation layer
  - Create `pipeline/templates/validate.ts`
  - Runtime checks: Templates cannot access filesystem except through storage APIs
  - Lint rule: Templates must return typed content, not mutate inputs

---

### Phase 6: Storage Layer Updates (HIGH PRIORITY)

- [ ] **6.1** Align StorageManager with new schema
  - Update `pipeline/storage/backends/sqlite.ts` to store new fields:
    - `origin` (JSON blob)
    - `asset_policy` (JSON blob)
    - `content_ref` (TEXT)
    - `lifecycle` (JSON blob)
    - `metadata.intent` (indexed TEXT)
  - Create migration for existing `notes` and `links` tables

- [ ] **6.2** Implement asset storage abstraction
  - Create `pipeline/storage/backends/asset.ts`
  - Handle `mode: "store"` → copy file to `data/assets/{id}/`
  - Handle `mode: "pointer"` → store path reference only
  - Integrate with `asset_policy` decision logic

- [ ] **6.3** Add checksum-based deduplication
  - Before creating artifact, query existing checksums
  - If match found: link instead of duplicate
  - Store dedupe metadata in `custom.dedupe_of`

---

### Phase 7: Capture Adapter Refactoring (MEDIUM PRIORITY)

- [ ] **7.1** Migrate `commit.ts` to new pattern
  - Extend `Artifact` class instead of returning plain object
  - Populate `origin.system = "git"`
  - Add `asset_policy` (Git commits have no file, set `mode: "pointer"`)
  - Set `metadata.intent = "reference"`
  - Use `StorageManager.store()`

- [ ] **7.2** Migrate `retro.ts` to new pattern
  - Same as commit migration
  - Set `origin.system = "cli"`
  - Set `metadata.intent = "retro"`
  - Preserve interactive prompt flow

- [ ] **7.3** Migrate `screenshot.ts` to new pattern
  - Add asset policy logic (screenshots should `mode: "store"`)
  - Calculate checksum of image file
  - Set `origin.system = "screenshot"`
  - Store image in `data/assets/{id}/`

- [ ] **7.4** Update `note.ts` and `link.ts`
  - Already use `Artifact` class pattern
  - Update to match canonical schema
  - Add missing fields: `asset_policy`, `lifecycle`, full `origin`

---

### Phase 8: CLI & User Experience (LOW PRIORITY)

- [ ] **8.1** Add drag-and-drop GUI (optional)
  - Research: Tkinter + tkdnd vs PySide/PyQt
  - Implement minimal drag-drop window
  - Drops should trigger same `ingest_file()` logic as watcher
  - Store in separate `scripts/gui/` directory (Python)

- [ ] **8.2** Enhance CLI capture commands
  - `cf capture document ./path/to/file.pdf --tags research,ai`
  - `cf capture folder ./documents/ --watch`
  - `cf capture url https://example.com/article`
  - Add progress indicators for batch captures

- [ ] **8.3** Add artifact query commands
  - `cf list --intent=retro`
  - `cf list --type=document --tag=strategy`
  - `cf show {artifact-id}` (render artifact details)
  - `cf search "keyword"` (full-text search in metadata)

---

### Phase 9: Testing & Validation (HIGH PRIORITY)

- [ ] **9.1** Create test fixtures
  - Sample files for each artifact type
  - Mock directory structure for watcher tests
  - Invalid files (corrupted, empty, unsupported types)

- [ ] **9.2** Write integration tests
  - Directory watcher end-to-end flow
  - Asset policy decision logic
  - Schema validation (valid + invalid artifacts)
  - Deduplication logic

- [ ] **9.3** Add schema migration tests
  - Test old artifact → new schema conversion
  - Verify no data loss
  - Test backward compatibility

---

### Phase 10: Documentation & Migration Guide (MEDIUM PRIORITY)

- [ ] **10.1** Write migration guide
  - Create `docs/guides/artifact-schema-migration.md`
  - Step-by-step upgrade process
  - Breaking changes list
  - Rollback procedure

- [ ] **10.2** Update architecture docs
  - Revise `docs/architecture.md` with new capture layer
  - Add directory watcher flow diagram
  - Document intent system and universal forms

- [ ] **10.3** Create capture mechanic reference
  - `docs/reference/capture-mechanic.md`
  - Asset policy rules
  - MIME type mappings
  - Intent values and their meanings

---

## 🚨 Critical Blockers & Decisions Needed

### Blocker 1: Schema Migration Strategy
**Question**: Should we migrate all existing artifacts at once or lazily?
**Options**:
- A. One-time migration script (safer, all-or-nothing)
- B. Lazy migration (read old schema, write new schema)
- C. Dual-schema support with compatibility layer

**Recommendation**: Option A (one-time migration) with full backup.

---

### Blocker 2: Asset Storage Location
**Question**: Where do we store actual file assets?
**Current**: Everything in `data/artifacts/{id}.json` (metadata only)
**Proposed**: `data/assets/{id}/original.ext` (new hierarchy)

**Impacts**:
- Web app needs to serve from new location
- StorageManager needs asset-aware retrieve logic
- Backup/sync processes change

**Decision needed**: Approve new `data/assets/` structure.

---

### Blocker 3: Template Backward Compatibility
**Question**: How do templates handle artifacts with old schema?
**Options**:
- A. Templates must handle both schemas (complex)
- B. Migrate all artifacts first, then update templates
- C. Add compatibility layer in transform.ts

**Recommendation**: Option B (migrate first) to avoid template complexity.

---

## 📊 Implementation Metrics

**Estimated Effort**:
- Phase 1 (Schema): 3-5 days
- Phase 2 (Asset Policy): 2-3 days
- Phase 3 (Directory Watcher): 4-6 days
- Phase 4 (Metadata): 2-3 days
- Phase 5 (Template Contract): 1-2 days
- Phase 6 (Storage): 4-5 days
- Phase 7 (Adapter Refactor): 5-7 days
- Phase 8 (CLI/UX): 3-4 days (optional)
- Phase 9 (Testing): 3-4 days
- Phase 10 (Docs): 2-3 days

**Total**: ~30-45 dev days (5-7 weeks at steady pace)

**Risk Level**: MEDIUM-HIGH
- Schema migration is irreversible without backups
- Directory watcher adds complexity to deployment
- Asset storage doubles disk usage initially

---

## 🎯 Success Criteria

1. ✅ All artifacts conform to canonical JSON schema
2. ✅ Directory watcher successfully captures new files
3. ✅ Asset policy system correctly routes store vs pointer
4. ✅ No duplicate artifacts created (checksum dedupe works)
5. ✅ Existing templates work with new artifact schema
6. ✅ Web app displays new artifact metadata
7. ✅ CLI commands support new capture types
8. ✅ All existing artifacts migrated without data loss
9. ✅ Documentation updated and accurate
10. ✅ Test coverage >70% for new capture logic

---

## 🔗 Related Files

- Planning docs: `docs/plans/data-modeling-capture-machanic/*.md`
- Current artifact model: `pipeline/artifact.ts`
- Storage layer: `pipeline/storage/`
- Capture adapters: `pipeline/capture/`
- Migration plan: `data_migration_phase_list.md`
- Tech debt: `TODO.md`

---

## 📝 Next Immediate Steps (This Week)

1. **Schema audit**: Compare current vs canonical schema (Task 1.1)
2. **Backup data**: Full copy of `data/artifacts/` before migration
3. **Decision on blockers**: Asset storage location + migration strategy
4. **Create Phase 1 branch**: `feature/unified-artifact-schema`
5. **Start migration script**: `scripts/migrate-artifacts.ts`

**Owner**: TBD  
**Target Completion**: Q1 2025

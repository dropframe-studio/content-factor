# Quick Reference: Data Modeling & Capture Mechanic

**Last Updated**: December 20, 2025  
**Status**: Planning Complete → Ready for Implementation

---

## 📌 What This Is

The **unified artifact capture system** consolidates all content capture methods (commits, documents, notes, retros, screenshots) into a single schema with automatic directory watching.

---

## 🎯 Key Changes at a Glance

### Current State
```
5 capture adapters → inconsistent schemas → filesystem only
```

### Future State
```
1 unified schema → multiple sources → SQLite metadata + smart asset storage
```

---

## 📊 Schema Evolution

**Before** (7 fields):
```typescript
{ id, slug, createdAt, source, type, metadata, payload }
```

**After** (11 fields):
```typescript
{ 
  id, type, origin, asset_policy, content_ref,
  metadata (enhanced), metadata_ext, custom, links,
  lifecycle, captured_at 
}
```

---

## 🔑 Critical Concepts

### 1. Universal Forms (Intent-Based Classification)
- **Evidence** → `intent: "reference"` (docs, screenshots, commits)
- **Annotation** → `intent: "note"` (margin notes, quick thoughts)
- **Reflection** → `intent: "retro"` (AARs, retrospectives)
- **Signal** → `intent: "commentary"` (lattice communications)

### 2. Asset Policy (Storage Decision)
```typescript
< 10MB           → store (copy to data/assets/)
Image/Audio      → store (preserve content)
Video/Large      → pointer (reference only)
Manual override  → respect
```

### 3. Layer Separation
```
CAPTURE → produces immutable truth (data/artifacts/)
   ↓
TEMPLATE → interprets without mutation (data/published/)
   ↓
PUBLISH → renders for consumption (Markdown, dashboard)
```

**Rule**: Templates can read artifacts, never write to them.

---

## 🚀 Directory Watcher (New Feature)

### What It Does
Watches filesystem directories (e.g., `data/inbox/`) and automatically creates artifacts for new files.

### Workflow
```
File added → SHA-256 checksum → dedupe check → MIME detect
  → classify type → apply policy → create artifact → persist
```

### Commands
```bash
pnpm watch:start --dirs data/inbox,vault/documents
pnpm watch:status
pnpm watch:stop

cf watch start
cf watch status
```

### Limitations
- Always sets `intent: "reference"` (no auto-detection)
- Requires state management (SQLite `watcher_state` table)
- Can't detect semantic intent from content alone

---

## ⚠️ Critical Decisions Needed

| Decision | Options | Recommendation | Impact |
|----------|---------|----------------|--------|
| **Migration Strategy** | One-time / Lazy / Dual-schema | One-time with backup | All artifacts |
| **Asset Storage** | `data/assets/` vs current | `data/assets/{id}/` | Web app + backups |
| **Template Compat** | Handle both schemas / Migrate first | Migrate first | Template complexity |

**Decision Deadline**: End of December 2025

---

## 📅 Implementation Phases

### Phase 1: Schema Foundation (Week 1-2)
- Audit current vs canonical schema
- Backup all data
- Update Artifact class (optional fields)
- Add schema validation

### Phase 2: Adapter Migration (Week 3-4)
- Migrate screenshot.ts (pilot)
- Migrate commit.ts + retro.ts
- Update note.ts + link.ts
- Backfill existing artifacts

### Phase 3: Directory Watcher (Week 5-6)
- Implement watcher core
- Add CLI commands
- State management
- Integration testing

### Phase 4: Asset System (Month 2)
- AssetBackend class
- Update web app
- Cleanup jobs

### Phase 5: Stabilization (Month 3)
- Template updates
- Contract enforcement
- Testing + docs

**Total Estimate**: 30-45 dev days (6-9 weeks)

---

## 🎓 Key Learnings from Plans

### 1. Forms ≠ Templates
**Forms** (capture intent): Why was this captured?  
**Templates** (interpretation): How do we interpret this?

Confusion resolved by `metadata.intent` field.

### 2. Retro vs Note (Solved!)
- Both are `type: "annotation"`
- Differentiated by `metadata.intent`
- Same schema, different semantic meaning

### 3. Asset Policy (Storage Independence)
Metadata decisions are separate from storage decisions.
- Artifacts describe **what** was captured
- Asset policy describes **where** it's stored

### 4. Content Ref vs Payload
- `payload`: Old pattern, unstructured blob
- `content_ref`: Extracted text/transcript (searchable)
- `metadata_ext`: Type-specific structured data
- `custom`: User experiments

---

## 📚 Essential Reading

**Must Read** (in order):
1. `overview.md` - Big picture + unifying principles
2. `data-model.md` - Layer separation + forms concept
3. `data-contract.md` - Template contracts + intent rules
4. `artifict.schema.json` - Canonical schema (source of truth)

**Implementation Guides**:
5. `TS-directory-watcher.md` - Watcher implementation
6. `ts-pipeline-artifact.md` - Artifact mapping

**Reference**:
7. `directory-watcher.md` - Python version (for comparison)
8. `artifact-schema.md` - Schema rationale

---

## 🔗 Related Files in Repo

| File | Purpose | Status |
|------|---------|--------|
| `pipeline/artifact.ts` | Current artifact model | ⚠️ Needs update |
| `pipeline/storage/` | Storage abstraction | ✅ Good foundation |
| `pipeline/capture/*.ts` | Capture adapters | ⚠️ 3/5 need migration |
| `data_migration_phase_list.md` | Current migration plan | 🔴 Conflicts with new plan |
| `TODO.md` | Tech debt | ℹ️ Some items overlap |

---

## 🚨 Red Flags & Warnings

1. **Current Migration Conflicts**
   - Active work on SQLite migration uses different schema
   - **Action**: Pause current work, align on canonical schema

2. **Breaking Changes Ahead**
   - All existing artifacts need migration
   - Templates must read new fields
   - Storage locations change

3. **No Rollback Plan**
   - Schema changes are one-way
   - **Action**: Full backup mandatory before starting

4. **Template Contract Unenforced**
   - Plans document rules but no runtime validation
   - **Action**: Add validation layer in transform.ts

---

## ✅ Success Criteria

Migration is complete when:
- [ ] All artifacts conform to `artifact.schema.json`
- [ ] Directory watcher captures files successfully
- [ ] Asset policy routes store/pointer correctly
- [ ] Zero duplicate artifacts (checksum dedupe works)
- [ ] Templates work with new schema
- [ ] Web app displays new metadata
- [ ] Test coverage >70% for capture logic
- [ ] Documentation updated
- [ ] No data loss from migration

---

## 🆘 Quick Help

**Q: Where do I start?**  
A: Read `todo/REPORT-data-modeling-analysis.md` (this report), then `overview.md` from plans.

**Q: What's the single most important change?**  
A: Adding `metadata.intent` to disambiguate capture purpose from interpretation.

**Q: Can I migrate incrementally?**  
A: Yes! Make new fields optional, migrate adapters one-by-one, then backfill.

**Q: What breaks if I skip the migration?**  
A: Directory watcher can't be implemented (needs full schema), templates may crash on missing fields.

**Q: Where can I experiment safely?**  
A: Use `custom` and `metadata_ext` fields - they won't break core logic.

---

## 📞 Next Actions

1. **Review this summary** with team
2. **Read full report**: `todo/REPORT-data-modeling-analysis.md`
3. **Read full todo list**: `todo/data-modeling-capture-mechanic-implementation.md`
4. **Decide on blockers** (asset storage, migration strategy, template compat)
5. **Create feature branch**: `feature/unified-artifact-schema`
6. **Backup data**: Full copy of `data/` directory
7. **Start Phase 1**: Schema alignment audit

---

**Questions?** → Review planning docs in `docs/plans/data-modeling-capture-machanic/`  
**Ready to build?** → Start with todo list (89 tasks across 10 phases)

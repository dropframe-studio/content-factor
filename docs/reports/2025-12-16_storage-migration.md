# Storage Migration Report - 2025-12-16

## Objective
Refactor artifacts to declare storage strategies and route writes through a StorageManager with filesystem + SQLite backends.

## Work Summary
* Created storage abstraction (`pipeline/storage/types.ts`, `backends/filesystem.ts`, `backends/sqlite.ts`, `manager.ts`) to support metadata/content split.
* Converted `pipeline/artifact.ts` into an abstract class with validation, strategy declaration, and serialization.
* Refactored link/note capture to class-based artifacts with hybrid storage (metadata → sqlite `links`/`notes`, payload → filesystem).
* Updated templates/transform to consume `ArtifactData` shapes; kept existing transform entrypoint behavior.
* Added `better-sqlite3` + types and configured script allowance in `pnpm-workspace.yaml`.

## Suggestions
* Implement retrieval/query in StorageManager to hydrate artifacts by joining sqlite metadata with filesystem payloads.
* Add a migration script to backfill existing JSON artifacts into sqlite tables to keep historical metadata queryable.
* Introduce configurable storage paths/tables and a flag to skip metadata fetch during link capture for offline/testing scenarios.

## Next Steps
1) Validate capture flows end-to-end (link/note) and verify dual writes (DB row + JSON payload).  
2) Add dual-write consistency handling (write ordering + rollback on failure).  
3) Teach transform to list from SQLite metadata to reduce filesystem scans and enable future pagination/filtering.***

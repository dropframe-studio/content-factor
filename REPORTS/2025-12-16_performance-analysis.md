# Performance Analysis Report - 2025-12-16

## Executive Summary
Hybrid storage reduces JSON write overhead for metadata queries by moving structured fields into SQLite while keeping payloads on disk. The change lowers per-capture filesystem writes but adds SQLite insert cost. Transform/publish still read from filesystem JSON outputs; retrieval paths are not yet optimized.

## Findings

### 1) Metadata write efficiency (Positive)
* **Location:** `pipeline/storage/manager.ts` (metadataBackend: sqlite)
* **Impact:** Metadata writes now go to SQLite with a single upsert; file payload writes are unchanged. This should scale better than all-json once queries exist.

### 2) Read path remains filesystem-only (Risk: Medium)
* **Location:** `pipeline/transform.ts`
* **Issue:** Transform still reads from `data/artifacts/*.json`; it does not use SQLite metadata yet.
* **Impact:** Benefits of SQLite are not realized for reads; list/query operations still O(N) file reads.
* **Recommendation:** Add a metadata-driven transform mode that sources artifact lists from SQLite.

### 3) Dual-write consistency (Risk: Low)
* **Location:** `StorageManager.store`
* **Issue:** Metadata and payload writes are not wrapped in a transaction across backends.
* **Impact:** A crash between writes could leave SQLite and filesystem out of sync.
* **Recommendation:** Add simple two-phase handling: write payload first, then metadata, or add a compensating delete on failure.

### 4) Native module cost (Low)
* **Location:** `better-sqlite3`
* **Impact:** Adds native build time but negligible runtime overhead for current usage.

## Next Steps
1) Implement a retrieval/query path in StorageManager and optionally transform from SQLite metadata.  
2) Add basic consistency handling (write order + rollback) for dual writes.  
3) Benchmark capture/transform with 100+ artifacts to measure improvements and adjust strategy.***

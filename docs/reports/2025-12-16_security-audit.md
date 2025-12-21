# Security Audit Report - 2025-12-16

## Executive Summary
The new storage layer introduces SQLite as a metadata backend and keeps payloads on the filesystem. The primary risks are local data access, build-script approvals for `better-sqlite3`, and validation gaps on artifact inputs. No external network calls were added beyond existing metadata fetches for links.

## Findings

### 1) SQLite file permissions (Low)
* **Location:** `data/content-factor.db`
* **Issue:** Database file is created in `data/` without explicit permission hardening.
* **Risk:** Local users/processes could read metadata if they can access the workspace.
* **Recommendation:** Document expected permissions; consider placing DB under a configurable path with stricter OS-level permissions in multi-user environments.

### 2) Build script approval for better-sqlite3 (Low)
* **Location:** `pnpm-workspace.yaml`, `pnpm-lock.yaml`
* **Issue:** `allowScripts: better-sqlite3` permits native build. This is expected but should be tracked.
* **Risk:** Native module build could be tampered with if registry trust is compromised.
* **Recommendation:** Pin versions and keep integrity checks; avoid adding new script-allowances without review.

### 3) Artifact payload validation (Medium)
* **Location:** `pipeline/capture/link.ts`, `pipeline/capture/note.ts`
* **Issue:** Validation ensures basic URL/content presence but does not sanitize tags/notes beyond trimming.
* **Risk:** Untrusted input could be persisted to both SQLite and filesystem, potentially affecting downstream rendering.
* **Recommendation:** Add stricter validation/sanitization for tags and text fields (length limits, allowed characters).

### 4) Metadata fetch in link capture (Low)
* **Location:** `fetchMetadata` in `pipeline/capture/link.ts`
* **Issue:** Fetches arbitrary URLs to scrape metadata.
* **Risk:** Could reach untrusted hosts; sandboxed environments mitigate but should be documented.
* **Recommendation:** Add timeout and allowlist/denylist controls; surface a CLI flag to skip fetch.

## Next Steps
1) Add configurable DB path and chmod guidance for multi-user setups.  
2) Introduce input sanitization utilities for capture flows (length limits, charset).  
3) Add a fetch timeout and optional disable flag for metadata scraping.***

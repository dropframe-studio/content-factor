MISSION BRIEF: Operation Canonical Anchor
Date: December 21, 2025

Status: [ READY ]

Objective: Transition the Content Factor ecosystem from fragmented, manual captures to a standardized, automated pipeline via RITUAL OPS.

1. The Commander’s Intent
To establish a "Winningest Hand" of data integrity by enforcing a strict Universal Artifact Schema across all 318 files. The system must move from an "intention-based" workflow to an "Inspection-first" posture. Stability is to be earned through structure, not enforced through discipline.

2. Operational Parameters (The RDX Hierarchy)
The CLI Agent must execute all commands according to the four-stage RDX loop:

SWEEP: Perform pre-flight backups and "Clean the Deck" of redundant legacy reports.

INSPECT: Analyze artifacts against the 11-field Canonical Schema (Version 1.1.0):
    - [id, type, origin, asset_policy, content_ref, metadata, metadata_ext, custom, links, lifecycle, captured_at]

REPORT: Identify "residue" (missing fields, broken links) and update the TODO.md automatically.

AUDIT: Perform post-flight integrity checks using SHA-256 checksums to verify that the mission was successful.

3. Strategic Directives
Asset Policy: Implement the "Store vs. Pointer" decision logic. Small visual assets (PNG/JPG) are to be Stored in data/assets/, while large files are kept as Pointers.

Zero Data Loss: All legacy payloads must be preserved within the new payload object during migration.

Visibility: Every run must produce an artifact of itself (a "Proof-of-Work") to ensure progress is undeniable and shareable.

4. Tactical Commands
PHASE 1 & 2: Standardization & Root Migration
- cf migrate: Standardizes the root and upgrades schema.
- cf audit: Runs the integrity verification engine.
- cf capture: Automatically applies Asset Policy and Fingerprinting to new files.

PHASE 3: Deep Persistence (The SQLite Layer)
- cf db:init: Scaffolds the content-factor.db with the unified schema tables.
- cf sync: Reconciles the filesystem artifacts with the SQLite metadata store.
- cf watch: Activates the directory watcher for real-time ingestion.

PHASE 4: Monorepo Deployment (The Scale Layer)
- cf pack: Extracts core logic into @cf/core for distribution.
- cf portal: Deploys the Astro-based documentation and React dashboard.

Mission Control Assessment: System healthy. Signal high. No corrective action required.
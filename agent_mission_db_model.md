🏗️ Agent Mission: Architecture Upgrade (Storage Layer)
Objective: Refactor the pipeline to use an Abstract Base Class for Artifacts and implement a Storage Manager abstraction.

Design Spec:

Pattern: Repository/Strategy Pattern (Artifacts declare how they are stored).

Driver: sqlite3 (install this).

Location: core_projects/content-factor/pipeline.

Tasks:

Install Dependencies:

Run npm add sqlite3.

Run npm add -D @types/sqlite3.

Create Storage Layer (pipeline/storage/):

types.ts: Define StorageBackend, StorageStrategy, IStorageBackend.

backends/filesystem.ts: Implement FilesystemBackend (move existing JSON write logic here).

backends/sqlite.ts: Scaffold SqliteBackend (init content-factor.db, create tables).

manager.ts: Implement StorageManager to route data based on strategy.

Refactor Core (pipeline/artifact.ts):

Convert Artifact from interface to abstract class.

Add abstract methods: getStorageStrategy(), validate().

Update Artifacts (pipeline/capture/):

Refactor link.ts (and linkArtifact.ts) to be a class LinkArtifact extends Artifact.

Define its strategy: metadataBackend: 'sqlite', contentBackend: 'filesystem'.

Update Orchestrator (pipeline/index.ts & transform.ts):

Update the capture flow to instantiate the class (new LinkArtifact(...)) and use storageManager.store(artifact).

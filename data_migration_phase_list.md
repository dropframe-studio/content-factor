## Current State

**Structure:**
```
pipeline/
├── artifact.ts         # Interface + types
├── capture/
│   ├── commit.ts
│   ├── link.ts         # ✅ Currently working
│   ├── note.ts         # ✅ Currently working
│   └── retro.ts
├── index.ts           # Full pipeline orchestrator
├── transform.ts
├── publish.ts
└── measure.ts
```

**Current Storage:** Everything writes to `data/artifacts/{id}.json` - pure filesystem, no database yet.

**Current Pattern:** `captureLink()` and `captureNote()` return `Artifact` interface and immediately write JSON.

---

## Recommended Architecture

### 1. **Create Storage Abstraction Layer**

```typescript
// pipeline/storage/types.ts
export type StorageBackend = 'filesystem' | 'sqlite' | 'external';

export interface StorageStrategy {
  // Where metadata lives
  metadataBackend: StorageBackend;
  
  // Where content/payload lives (can be different!)
  contentBackend: StorageBackend;
  
  // Optional: specific configuration
  config?: {
    sqliteTable?: string;
    externalConnection?: string;
    filesystemPath?: string;
  };
}

export interface IStorageBackend {
  // Core CRUD operations
  store(artifact: Artifact): Promise<string>; // returns ID
  retrieve(id: string): Promise<Artifact | null>;
  query(filters: Record<string, any>): Promise<Artifact[]>;
  delete(id: string): Promise<boolean>;
  list(type?: ArtifactType): Promise<string[]>; // return IDs
}
```

### 2. **Convert Artifact to Abstract Base Class**

```typescript
// pipeline/artifact.ts
export abstract class Artifact {
  id: string;
  slug: string;
  createdAt: string;
  source: ArtifactSource;
  type: ArtifactType;
  metadata: ArtifactMetadata;
  payload: Record<string, unknown>;
  
  constructor(data: ArtifactData) {
    this.id = data.id || generateArtifactId(data.type);
    this.slug = data.slug;
    // ... initialize fields
  }
  
  // Each artifact type declares its storage strategy
  abstract getStorageStrategy(): StorageStrategy;
  
  // Validation hook
  abstract validate(): boolean;
  
  // Optional: serialize/deserialize hooks for custom handling
  serialize(): Record<string, any> {
    return { ...this };
  }
}
```

### 3. **Refactor Capture Types as Classes**

```typescript
// pipeline/capture/link.ts
export class LinkArtifact extends Artifact {
  // Typed payload for better DX
  payload!: {
    url: string;
    notes: string;
    captureType: 'link';
  };
  
  getStorageStrategy(): StorageStrategy {
    return {
      // Metadata (queryable) goes to sqlite
      metadataBackend: 'sqlite',
      
      // Actual link notes stay in filesystem for now
      contentBackend: 'filesystem',
      
      config: {
        sqliteTable: 'links',
        filesystemPath: 'data/links'
      }
    };
  }
  
  validate(): boolean {
    return !!this.payload.url && this.payload.url.startsWith('http');
  }
}
```

```typescript
// pipeline/capture/note.ts
export class NoteArtifact extends Artifact {
  payload!: {
    content: string;
    noteType: ArtifactType;
  };
  
  getStorageStrategy(): StorageStrategy {
    // Notes are still experimental - keep flexible
    return {
      metadataBackend: 'sqlite', // structured queries
      contentBackend: 'filesystem', // full text stays in files
      config: {
        sqliteTable: 'notes'
      }
    };
  }
  
  validate(): boolean {
    return this.payload.content.length > 0;
  }
}
```

```typescript
// pipeline/capture/screenshot.ts (future)
export class ScreenshotArtifact extends Artifact {
  payload!: {
    imagePath: string;
    annotations?: string;
    metadata: Record<string, any>; // loose - still learning
  };
  
  getStorageStrategy(): StorageStrategy {
    return {
      // Hybrid: metadata queryable, binary stays in filesystem
      metadataBackend: 'sqlite',
      contentBackend: 'filesystem', // images always filesystem
      config: {
        sqliteTable: 'screenshots',
        filesystemPath: 'data/media/screenshots'
      }
    };
  }
  
  validate(): boolean {
    return !!this.payload.imagePath;
  }
}
```

### 4. **Storage Router/Manager**

```typescript
// pipeline/storage/manager.ts
export class StorageManager {
  private backends: Map<StorageBackend, IStorageBackend>;
  
  constructor() {
    this.backends = new Map([
      ['filesystem', new FilesystemBackend()],
      ['sqlite', new SqliteBackend()],
      // ['external', new ExternalBackend()], // future
    ]);
  }
  
  async store(artifact: Artifact): Promise<string> {
    const strategy = artifact.getStorageStrategy();
    
    // 1. Store metadata
    const metadataBackend = this.backends.get(strategy.metadataBackend)!;
    const metadataId = await metadataBackend.store({
      ...artifact,
      payload: undefined // don't store payload in metadata backend
    });
    
    // 2. Store content/payload (if different backend)
    if (strategy.contentBackend !== strategy.metadataBackend) {
      const contentBackend = this.backends.get(strategy.contentBackend)!;
      await contentBackend.store({
        id: artifact.id,
        payload: artifact.payload
      } as any);
    }
    
    return artifact.id;
  }
  
  async retrieve(id: string, type?: ArtifactType): Promise<Artifact | null> {
    // Query all backends, reconstruct artifact
    // ... implementation
  }
}
```

### 5. **Backend Implementations**

```typescript
// pipeline/storage/backends/filesystem.ts
export class FilesystemBackend implements IStorageBackend {
  private basePath: string;
  
  constructor(basePath = 'data') {
    this.basePath = basePath;
  }
  
  async store(artifact: Artifact): Promise<string> {
    const dir = join(this.basePath, 'artifacts');
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, `${artifact.id}.json`),
      JSON.stringify(artifact, null, 2)
    );
    return artifact.id;
  }
  
  // ... other methods
}
```

```typescript
// pipeline/storage/backends/sqlite.ts
import Database from 'better-sqlite3'; // or your sqlite lib of choice

export class SqliteBackend implements IStorageBackend {
  private db: Database.Database;
  
  constructor(dbPath = 'data/content-factory.db') {
    this.db = new Database(dbPath);
    this.initTables();
  }
  
  private initTables() {
    // Create tables based on artifact types
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        slug TEXT,
        createdAt TEXT,
        title TEXT,
        summary TEXT,
        tags TEXT, -- JSON array
        sourceRef TEXT,
        -- no payload stored here
        metadata_json TEXT -- full metadata as JSON
      )
    `);
  }
  
  async store(artifact: Artifact): Promise<string> {
    const strategy = artifact.getStorageStrategy();
    const table = strategy.config?.sqliteTable || 'artifacts';
    
    // Insert metadata into appropriate table
    const stmt = this.db.prepare(`
      INSERT INTO ${table} (id, slug, createdAt, title, summary, tags, sourceRef, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      artifact.id,
      artifact.slug,
      artifact.createdAt,
      artifact.metadata.title,
      artifact.metadata.summary,
      JSON.stringify(artifact.metadata.tags),
      artifact.metadata.sourceRef,
      JSON.stringify(artifact.metadata)
    );
    
    return artifact.id;
  }
  
  // ... query, retrieve, etc
}
```

---

## Migration Path

**Phase 1: Add abstraction (backward compatible)**
1. Create `storage/` directory with interfaces
2. Implement `FilesystemBackend` (matches current behavior)
3. Create `StorageManager` with only filesystem

**Phase 2: Refactor artifacts to classes**
1. Convert `Artifact` interface → abstract class
2. Convert `LinkArtifact`, `NoteArtifact` to classes extending Artifact
3. Update capture scripts to use new classes

**Phase 3: Add SQLite**
1. Add `better-sqlite3` dependency
2. Implement `SqliteBackend`
3. Update `LinkArtifact` to use hybrid storage (metadata → sqlite, content → filesystem)

**Phase 4: External DB support**
1. Implement `ExternalBackend` (postgres/mongo/etc)
2. Make backend configurable via environment variables


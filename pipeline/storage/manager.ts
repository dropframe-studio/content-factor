// storage/manager.ts

import { Artifact } from '../artifact.js';
import type { ArtifactType } from '../artifact.js';
import type { IStorageBackend, StorageBackend, StorageStrategy, StoredArtifact } from './types.js';
import { FilesystemBackend } from './backends/filesystem.js';
import { SqliteBackend } from './backends/sqlite.js';

export class StorageManager {
  private backends: Map<StorageBackend, IStorageBackend>;

  constructor(options?: { filesystemBasePath?: string; sqlitePath?: string }) {
    this.backends = new Map<StorageBackend, IStorageBackend>([
      ['filesystem', new FilesystemBackend(options?.filesystemBasePath)],
      ['sqlite', new SqliteBackend(options?.sqlitePath)],
    ]);
  }

  private getBackend(backend: StorageBackend) {
    const instance = this.backends.get(backend);
    if (!instance) {
      throw new Error(`Storage backend '${backend}' is not configured.`);
    }
    return instance;
  }

  async store(artifact: Artifact): Promise<string> {
    if (!artifact.validate()) {
      throw new Error(`Artifact validation failed for type ${artifact.type}`);
    }

    const strategy = artifact.getStorageStrategy();
    const serialized = artifact.serialize();
    const metadataPayload: StoredArtifact = { ...serialized };

    // 1. PRIMARY ATTEMPT: Strategy-defined metadata backend (e.g., SQLite)
    try {
      const metadataBackend = this.getBackend(strategy.metadataBackend);
      
      // If content and metadata are separate, strip payload from metadata
      if (strategy.contentBackend !== strategy.metadataBackend) {
        delete (metadataPayload as { payload?: unknown }).payload;
      }

      await metadataBackend.store(metadataPayload, strategy);
      console.log(`[Storage] Metadata stored via ${strategy.metadataBackend}`);

      // Store content if separate
      if (strategy.contentBackend !== strategy.metadataBackend) {
        const contentBackend = this.getBackend(strategy.contentBackend);
        await contentBackend.store(serialized, strategy);
        console.log(`[Storage] Content stored via ${strategy.contentBackend}`);
      }

      return artifact.id;

    } catch (error) {
      console.warn(`\n⚠️  [Storage Error] Primary backend (${strategy.metadataBackend}) failed.`);
      console.warn(`   Reason: ${error instanceof Error ? error.message : "Unknown error"}`);

      // 2. FALLBACK: Filesystem
      if (strategy.metadataBackend !== 'filesystem') {
        try {
          console.log(`[Storage] Attempting fallback to Filesystem...`);
          const fsBackend = this.getBackend('filesystem');
          await fsBackend.store(serialized, strategy);
          console.log(`✅ [Storage] Fallback Successful: Data saved to local disk.`);
          return artifact.id;
        } catch (fsError) {
          console.error(`❌ [Storage] Fallback to Filesystem also failed.`);
        }
      }

      // 3. LAST RESORT: Dump to console
      console.error(`\nCRITICAL: System could not save artifact ${artifact.id}.`);
      console.log("--- DATA DUMP START ---");
      console.log(JSON.stringify(serialized, null, 2));
      console.log("--- DATA DUMP END ---\n");
      
      return artifact.id;
    }
  }
  async retrieve(id: string, strategy: StorageStrategy): Promise<StoredArtifact | null> {
    const metadataBackend = this.getBackend(strategy.metadataBackend);
    const contentBackend =
      strategy.contentBackend === strategy.metadataBackend
        ? null
        : this.getBackend(strategy.contentBackend);

    const metadata = await metadataBackend.retrieve(id, undefined, strategy);
    if (!metadata) return null;

    if (!contentBackend) return metadata;

    const content = await contentBackend.retrieve(id, undefined, strategy);
    if (content?.payload) {
      return { ...metadata, payload: content.payload };
    }
    return metadata;
  }

  async list(type?: ArtifactType, strategy?: StorageStrategy): Promise<string[]> {
    const metadataBackend = strategy
      ? this.getBackend(strategy.metadataBackend)
      : this.getBackend('filesystem');
    return metadataBackend.list(type, strategy);
  }
}

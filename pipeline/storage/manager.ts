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
    const metadataBackend = this.getBackend(strategy.metadataBackend);
    const contentBackend =
      strategy.contentBackend === strategy.metadataBackend
        ? null
        : this.getBackend(strategy.contentBackend);

    const serialized = artifact.serialize();
    const metadataPayload: StoredArtifact = { ...serialized };

    if (contentBackend) {
      delete (metadataPayload as { payload?: unknown }).payload;
    }

    await metadataBackend.store(metadataPayload, strategy);

    if (contentBackend) {
      await contentBackend.store(serialized, strategy);
    }

    return artifact.id;
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

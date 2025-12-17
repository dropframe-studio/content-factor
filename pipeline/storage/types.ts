import type { ArtifactData, ArtifactType } from '../artifact.js';

export type StorageBackend = 'filesystem' | 'sqlite' | 'external';

export interface StorageStrategy {
  metadataBackend: StorageBackend;
  contentBackend: StorageBackend;
  config?: {
    sqliteTable?: string;
    externalConnection?: string;
    filesystemPath?: string;
  };
}

// Stored artifacts can optionally omit payloads when the backend is metadata-only.
export type StoredArtifact = Omit<ArtifactData, 'payload'> & { payload?: Record<string, unknown> };

export interface IStorageBackend {
  store(artifact: StoredArtifact, strategy?: StorageStrategy): Promise<string>;
  retrieve(id: string, type?: ArtifactType, strategy?: StorageStrategy): Promise<StoredArtifact | null>;
  query(filters: Record<string, unknown>, strategy?: StorageStrategy): Promise<StoredArtifact[]>;
  delete(id: string, strategy?: StorageStrategy): Promise<boolean>;
  list(type?: ArtifactType, strategy?: StorageStrategy): Promise<string[]>;
}

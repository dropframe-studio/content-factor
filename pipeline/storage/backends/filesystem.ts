import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { IStorageBackend, StorageStrategy, StoredArtifact } from '../types.js';

export class FilesystemBackend implements IStorageBackend {
  private basePath: string;

  constructor(basePath = 'data') {
    this.basePath = basePath;
  }

  private getArtifactsDir(strategy?: StorageStrategy) {
    const customPath = strategy?.config?.filesystemPath ?? 'artifacts';
    return join(process.cwd(), this.basePath, customPath);
  }

  async store(artifact: StoredArtifact, strategy?: StorageStrategy): Promise<string> {
    const dir = this.getArtifactsDir(strategy);
    mkdirSync(dir, { recursive: true });
    const outPath = join(dir, `${artifact.id}.json`);
    writeFileSync(outPath, JSON.stringify(artifact, null, 2));
    return artifact.id as string;
  }

  async retrieve(id: string, _type?: string, strategy?: StorageStrategy): Promise<StoredArtifact | null> {
    const dir = this.getArtifactsDir(strategy);
    const filePath = join(dir, `${id}.json`);
    if (!existsSync(filePath)) return null;
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async query(_filters: Record<string, unknown>, strategy?: StorageStrategy): Promise<StoredArtifact[]> {
    const dir = this.getArtifactsDir(strategy);
    if (!existsSync(dir)) return [];
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    return files.map((file) => {
      const data = readFileSync(join(dir, file), 'utf-8');
      return JSON.parse(data);
    });
  }

  async delete(id: string, strategy?: StorageStrategy): Promise<boolean> {
    const dir = this.getArtifactsDir(strategy);
    const filePath = join(dir, `${id}.json`);
    if (!existsSync(filePath)) {
      return false;
    }
    unlinkSync(filePath);
    return true;
  }

  async list(_type?: string, strategy?: StorageStrategy): Promise<string[]> {
    const dir = this.getArtifactsDir(strategy);
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace(/\.json$/, ''));
  }
}

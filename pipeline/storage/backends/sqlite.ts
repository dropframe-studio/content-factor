import Database from 'better-sqlite3';
import { join } from 'path';
import type { IStorageBackend, StorageStrategy, StoredArtifact } from '../types.js';

export class SqliteBackend implements IStorageBackend {
  private db: Database.Database;

  constructor(dbPath = join(process.cwd(), 'data', 'content-factor.db')) {
    this.db = new Database(dbPath);
    this.ensureTable('artifacts');
  }

  private ensureTable(tableName: string) {
    const table = this.sanitizeTable(tableName);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id TEXT PRIMARY KEY,
        slug TEXT,
        createdAt TEXT,
        source TEXT,
        type TEXT,
        title TEXT,
        summary TEXT,
        tags TEXT,
        sourceRef TEXT,
        payload_json TEXT,
        metadata_json TEXT
      )
    `);
  }

  private sanitizeTable(tableName?: string) {
    return (tableName ?? 'artifacts').replace(/[^a-zA-Z0-9_]/g, '');
  }

  private getTable(strategy?: StorageStrategy) {
    const table = this.sanitizeTable(strategy?.config?.sqliteTable);
    this.ensureTable(table);
    return table;
  }

  async store(artifact: StoredArtifact, strategy?: StorageStrategy): Promise<string> {
    const table = this.getTable(strategy);
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO ${table} (id, slug, createdAt, source, type, title, summary, tags, sourceRef, payload_json, metadata_json)
      VALUES (@id, @slug, @createdAt, @source, @type, @title, @summary, @tags, @sourceRef, @payload_json, @metadata_json)
    `);

    stmt.run({
      id: artifact.id,
      slug: artifact.slug,
      createdAt: artifact.createdAt,
      source: artifact.source,
      type: artifact.type,
      title: artifact.metadata?.title ?? '',
      summary: artifact.metadata?.summary ?? '',
      tags: JSON.stringify(artifact.metadata?.tags ?? []),
      sourceRef: artifact.metadata?.sourceRef ?? '',
      payload_json: artifact.payload ? JSON.stringify(artifact.payload) : null,
      metadata_json: artifact.metadata ? JSON.stringify(artifact.metadata) : null,
    });

    return artifact.id as string;
  }

  async retrieve(id: string, type?: string, strategy?: StorageStrategy): Promise<StoredArtifact | null> {
    const table = this.getTable(strategy);
    const row = this.db
      .prepare(`SELECT * FROM ${table} WHERE id = ? ${type ? 'AND type = ?' : ''}`)
      .get(type ? [id, type] : [id]) as any;

    if (!row) return null;

    return {
      id: row.id,
      slug: row.slug,
      createdAt: row.createdAt,
      source: row.source,
      type: row.type,
      metadata: row.metadata_json ? JSON.parse(row.metadata_json) : undefined,
      payload: row.payload_json ? JSON.parse(row.payload_json) : undefined,
    } as StoredArtifact;
  }

  async query(filters: Record<string, unknown>, strategy?: StorageStrategy): Promise<StoredArtifact[]> {
    const table = this.getTable(strategy);
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.type) {
      clauses.push('type = ?');
      values.push(filters.type);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const rows = this.db.prepare(`SELECT * FROM ${table} ${where}`).all(...values) as any[];

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      createdAt: row.createdAt,
      source: row.source,
      type: row.type,
      metadata: row.metadata_json ? JSON.parse(row.metadata_json) : undefined,
      payload: row.payload_json ? JSON.parse(row.payload_json) : undefined,
    })) as StoredArtifact[];
  }

  async delete(id: string, strategy?: StorageStrategy): Promise<boolean> {
    const table = this.getTable(strategy);
    const info = this.db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    return info.changes > 0;
  }

  async list(type?: string, strategy?: StorageStrategy): Promise<string[]> {
    const table = this.getTable(strategy);
    const rows = type
      ? (this.db.prepare(`SELECT id FROM ${table} WHERE type = ?`).all(type) as any[])
      : (this.db.prepare(`SELECT id FROM ${table}`).all() as any[]);

    return rows.map((row) => row.id as string);
  }
}

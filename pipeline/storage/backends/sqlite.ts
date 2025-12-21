import { join } from 'path';
import type { IStorageBackend, StorageStrategy, StoredArtifact } from '../types.js';
import sqlite3 from 'sqlite3';

export class SqliteBackend implements IStorageBackend {
  private db: sqlite3.Database;
  private ready: Promise<void>;

  constructor(dbPath = join(process.cwd(), 'data', 'content-factor.db')) {
    this.db = new sqlite3.Database(dbPath);
    this.ready = this.ensureTable('artifacts');
  }

  private run(sql: string, params: unknown[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (this: sqlite3.RunResult, err) {
        if (err) return reject(err);
        resolve(this);
      });
    });
  }

  private get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row as T | undefined);
      });
    });
  }

  private all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as T[]);
      });
    });
  }

  private sanitizeTable(tableName?: string) {
    return (tableName ?? 'artifacts').replace(/[^a-zA-Z0-9_]/g, '');
  }

  private async ensureTable(tableName: string) {
    const table = this.sanitizeTable(tableName);
    await this.run(
      `
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
      `.trim(),
    );
  }

  private async getTable(strategy?: StorageStrategy) {
    const table = this.sanitizeTable(strategy?.config?.sqliteTable);
    await this.ensureTable(table);
    return table;
  }

  async store(artifact: StoredArtifact, strategy?: StorageStrategy): Promise<string> {
    await this.ready;
    const table = await this.getTable(strategy);
    await this.run(
      `
        INSERT OR REPLACE INTO ${table} (id, slug, createdAt, source, type, title, summary, tags, sourceRef, payload_json, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `.trim(),
      [
        artifact.id,
        artifact.slug,
        artifact.createdAt,
        artifact.source,
        artifact.type,
        artifact.metadata?.title ?? '',
        artifact.metadata?.summary ?? '',
        JSON.stringify(artifact.metadata?.tags ?? []),
        artifact.metadata?.sourceRef ?? '',
        artifact.payload ? JSON.stringify(artifact.payload) : null,
        artifact.metadata ? JSON.stringify(artifact.metadata) : null,
      ],
    );

    return artifact.id as string;
  }

  async retrieve(id: string, type?: string, strategy?: StorageStrategy): Promise<StoredArtifact | null> {
    await this.ready;
    const table = await this.getTable(strategy);
    const row = await this.get<any>(
      `SELECT * FROM ${table} WHERE id = ? ${type ? 'AND type = ?' : ''}`,
      type ? [id, type] : [id],
    );

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
    await this.ready;
    const table = await this.getTable(strategy);
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.type) {
      clauses.push('type = ?');
      values.push(filters.type);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const rows = await this.all<any>(`SELECT * FROM ${table} ${where}`, values);

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
    await this.ready;
    const table = await this.getTable(strategy);
    const result = await this.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  async list(type?: string, strategy?: StorageStrategy): Promise<string[]> {
    await this.ready;
    const table = await this.getTable(strategy);
    const rows = type
      ? await this.all<any>(`SELECT id FROM ${table} WHERE type = ?`, [type])
      : await this.all<any>(`SELECT id FROM ${table}`);

    return rows.map((row) => row.id as string);
  }
}

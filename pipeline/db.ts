// pipeline/db.ts
import { join } from 'path';
import fs from 'fs-extra';
import { JSONFilePreset } from 'lowdb/node';

// 1. Define the Schema (Types)
export interface Artifact {
  id: string;
  type: string;
  slug: string;
  title: string;
  payload: string; // JSON string
  created_at: string;
  is_published: boolean;
}

export interface Asset {
  id: string;
  artifact_id: string;
  bucket: string;
  original_name: string;
  storage_path: string;
  size_bytes: number;
  created_at: string;
}

interface Data {
  artifacts: Artifact[];
  assets: Asset[];
}

// 2. Setup Paths
const DATA_DIR = join(process.cwd(), 'data');
fs.ensureDirSync(DATA_DIR);
const DB_PATH = join(DATA_DIR, 'content-factor.json');

// 3. Initialize with default empty arrays
const defaultData: Data = { artifacts: [], assets: [] };

// 4. Export the DB accessor
export async function getDb() {
  // JSONFilePreset automatically reads or creates the file
  const db = await JSONFilePreset<Data>(DB_PATH, defaultData);
  return db;
}

// 5. Init Helper (Optional for LowDB but keeps CLI consistent)
export async function initDb() {
  await getDb();
  console.log('   ✅ JSON DB Connected: content-factor.json');
}
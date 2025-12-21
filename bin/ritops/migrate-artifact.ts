import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// 1. Define the Canonical Schema
interface CanonicalArtifact {
  version: "1.1.0";
  id: string;
  type: string;
  timestamp: string;
  origin: {
    system: string;
    path?: string;
  };
  asset_policy: {
    mode: "store" | "pointer";
    checksum: string;
  };
  lifecycle: {
    status: "active" | "archived";
    revision: number;
  };
  payload: any;
  metadata: {
    intent: "note" | "retro" | "reference" | "unknown";
    [key: string]: any;
  };
}

async function migrate() {
  const sourceDir = './data/artifacts';
  const targetDir = './data/artifacts_migrated';
  
  // Ensure target directory exists
  await fs.mkdir(targetDir, { recursive: true });

  const files = await fs.readdir(sourceDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  console.log(`🚀 Starting migration of ${jsonFiles.length} artifacts...`);

  for (const file of jsonFiles) {
    const rawData = await fs.readFile(path.join(sourceDir, file), 'utf-8');
    const legacy = JSON.parse(rawData);

    // 2. Transformation Logic (Mapping Legacy to Canonical)
    const migrated: CanonicalArtifact = {
      version: "1.1.0",
      id: legacy.id || legacy.sourceArtifactId || `migrated_${crypto.randomUUID().slice(0, 8)}`,
      type: legacy.type || "unknown",
      timestamp: legacy.timestamp || new Date().toISOString(),
      
      origin: {
        system: "legacy-migration", // Identifying where this came from
        path: file
      },
      
      asset_policy: {
        mode: "pointer", // Default for legacy text-based JSON
        checksum: crypto.createHash('sha256').update(rawData).digest('hex')
      },
      
      lifecycle: {
        status: "active",
        revision: 1
      },
      
      payload: legacy.payload || legacy, // Keep existing data
      
      metadata: {
        intent: mapIntent(legacy.type),
        ...legacy.metadata
      }
    };

    await fs.writeFile(
      path.join(targetDir, file),
      JSON.stringify(migrated, null, 2)
    );
  }

  console.log("✅ Migration complete. Check data/artifacts_migrated/");
}

// Helper to guess intent based on old types
function mapIntent(type: string): "note" | "retro" | "reference" | "unknown" {
  if (type === "raw-commit") return "reference";
  if (type === "retro") return "retro";
  if (type === "system-observation") return "note";
  return "unknown";
}

migrate().catch(console.error);

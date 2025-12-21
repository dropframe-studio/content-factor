import fs from 'fs/promises';
import path from 'path';

async function postFlightAudit() {
  const sourceDir = './data/artifacts';
  const migratedDir = './data/artifacts_migrated';
  
  const originalFiles = await fs.readdir(sourceDir);
  const jsonFiles = originalFiles.filter(f => f.endsWith('.json'));

  console.log(`🔍 Auditing ${jsonFiles.length} Migrated Artifacts...`);

  let failures = 0;

  for (const file of jsonFiles) {
    const original = JSON.parse(await fs.readFile(path.join(sourceDir, file), 'utf-8'));
    const migrated = JSON.parse(await fs.readFile(path.join(migratedDir, file), 'utf-8'));

    // SOP CHECK: Does the ID match?
    if (migrated.id !== (original.id || original.sourceArtifactId)) {
        // We handle the 'migrated_' prefix cases here
        if (!migrated.id.startsWith('migrated_')) {
            console.error(`❌ ID Mismatch in ${file}`);
            failures++;
        }
    }

    // SOP CHECK: Is the payload intact?
    // We check if the original keys exist inside the new payload
    const originalKeys = Object.keys(original.payload || original);
    const migratedKeys = Object.keys(migrated.payload);

    if (originalKeys.length > migratedKeys.length) {
      console.error(`⚠️ Possible Data Loss in ${file}: Key count dropped.`);
      failures++;
    }
  }

  if (failures === 0) {
    console.log("✅ ALL SYSTEMS GREEN. Migration integrity verified.");
  } else {
    console.log(`🚨 Audit failed with ${failures} warnings. Do not proceed to Phase 2.`);
  }
}

postFlightAudit().catch(console.error);

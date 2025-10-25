// pipeline/transform.ts

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Artifact } from './artifact.js'; // Import the schema
import { progressSnapshotTemplate } from '../templates/progressSnapshot.js'; // Import the template

// In a real system, you would import ALL templates and use a mapping function.
// For now, we only import the template we need for demonstration.

/**
 * Executes the transformation step: loads artifacts, runs them through templates,
 * and saves the resulting content object to the published directory.
 */
export async function runTransformPipeline() {
  const artifactsDir = join(process.cwd(), 'data', 'artifacts');
  const publishedDir = join(process.cwd(), 'data', 'published');

  // 1. Ensure output directory exists
  mkdirSync(publishedDir, { recursive: true });

  try {
    // 2. Read all files in the artifacts directory
    const files = readdirSync(artifactsDir).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
      console.log('🟡 No artifacts found to transform in data/artifacts/.');
      return;
    }

    console.log(`\n======================================================`);
    console.log(`🌀 Running Transformation on ${files.length} Artifact(s)`);
    console.log(`======================================================`);

    for (const fileName of files) {
      const artifactPath = join(artifactsDir, fileName);
      const artifactData = readFileSync(artifactPath, 'utf-8');
      
      let artifact: Artifact;
      try {
        // Parse the raw artifact JSON
        artifact = JSON.parse(artifactData);
      } catch (e) {
        console.error(`❌ ERROR: Failed to parse JSON for artifact: ${fileName}`);
        continue;
      }

      // 3. Select Template and Execute Transformation
      // In this example, we hardcode the use of the Progress Snapshot template.
      // A full system would use artifact.transformers or artifact.type to select.
      const transformedContent = progressSnapshotTemplate(artifact);

      // 4. Save the Output
      // Use the artifact ID and the template type to name the published content file.
      const outputFileName = `${artifact.id}-${transformedContent.type}.json`;
      const outputPath = join(publishedDir, outputFileName);
      
      writeFileSync(outputPath, JSON.stringify(transformedContent, null, 2));

      console.log(`  ✅ Transformed ${artifact.id} using ${transformedContent.type} → ${outputFileName}`);
    }
    
    console.log(`\nTransformation complete. Published content is in ${publishedDir}/\n`);

  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error(`❌ ERROR: Artifacts directory not found. Please run 'pnpm capture' first.`);
    } else {
      console.error(`❌ TRANSFORMATION FAILED:`, error);
    }
    process.exit(1);
  }
}

// Check if the script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTransformPipeline();
}

// pipeline/transform.ts

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { Artifact, ArtifactType } from './artifact.js';

// Import all templates
import { buildLogTemplate } from '../templates/buildLog.js';
import { progressSnapshotTemplate } from '../templates/progressSnapshot.js';
import { projectExplainerTemplate } from '../templates/projectExplainer.js';
import { systemObservationTemplate } from '../templates/systemObservation.js';
import { teachingMomentTemplate } from '../templates/teachingMoment.js';
import { transformLink } from '../templates/linkArtifact.js';

/**
 * Template function type definition
 */
type TemplateFunction = (artifact: Artifact) => any;

/**
 * Map artifact types to their corresponding template functions
 */
const TEMPLATE_MAP: Record<ArtifactType, TemplateFunction> = {
  RAW_COMMIT: buildLogTemplate,
  BUILD_LOG: buildLogTemplate,
  PROGRESS_SNAPSHOT: progressSnapshotTemplate,
  PROJECT_EXPLAINER: projectExplainerTemplate,
  SYSTEM_OBSERVATION: systemObservationTemplate,
  TEACHING_MOMENT: teachingMomentTemplate,
  LINK: (a) => a, // Placeholder, LINK handled separately for now
};

/**
 * Applies the appropriate template to an artifact based on its type.
 * @param artifact The artifact to transform
 * @returns The structured content object
 */
function applyTemplate(artifact: Artifact): any {
  const templateFn = TEMPLATE_MAP[artifact.type];
  
  if (!templateFn) {
    console.warn(`⚠️  No template found for artifact type: ${artifact.type}. Skipping.`);
    return null;
  }
  
  return templateFn(artifact);
}

/**
 * Executes the transformation step: loads artifacts, runs them through templates,
 * and saves the resulting content object to the published directory.
 */
export async function runTransformPipeline() {
  const artifactsDir = join(process.cwd(), 'data', 'artifacts');
  const publishedDir = join(process.cwd(), 'data', 'published');
  const contentFactorFile = join(process.cwd(), 'data', 'content-factor.json');

  // 1. Ensure output directory exists
  mkdirSync(publishedDir, { recursive: true });

  try {
    // --- PART 1: Process Standard Artifacts ---
    if (existsSync(artifactsDir)) {
      const files = readdirSync(artifactsDir).filter(file => file.endsWith('.json'));

      if (files.length > 0) {
        console.log(`
======================================================`);
        console.log(`🌀 Running Transformation on ${files.length} Artifact(s)`);
        console.log(`======================================================`);

        for (const fileName of files) {
          const artifactPath = join(artifactsDir, fileName);
          const artifactData = readFileSync(artifactPath, 'utf-8');
          
          let artifact: Artifact;
          try {
            artifact = JSON.parse(artifactData);
          } catch (e) {
            console.error(`❌ ERROR: Failed to parse JSON for artifact: ${fileName}`);
            continue;
          }

          // 3. Apply the appropriate template based on artifact type
          const transformedContent = applyTemplate(artifact);
          
          if (!transformedContent) {
            continue; // Skip if no template was found
          }

          // 4. Save the output
          const outputFileName = `${artifact.id}-${transformedContent.type}.json`;
          const outputPath = join(publishedDir, outputFileName);
          
          writeFileSync(outputPath, JSON.stringify(transformedContent, null, 2));

          console.log(`  ✅ Transformed ${artifact.id} (${artifact.type}) → ${transformedContent.type} → ${outputFileName}`);
        }
      }
    }

    // --- PART 2: Process Links from content-factor.json ---
    if (existsSync(contentFactorFile)) {
      console.log(`
======================================================`);
      console.log(`🔗 Processing Links from content-factor.json`);
      console.log(`======================================================`);

      const contentData = JSON.parse(readFileSync(contentFactorFile, 'utf-8'));
      const items = contentData.artifacts || [];
      const linksOutput = { artifacts: [] as any[], published: [] as any[] };

      for (const item of items) {
        if (item.type === 'Link') {
           try {
             const { artifact, publishedFile } = transformLink(item);
             linksOutput.artifacts.push(artifact);
             linksOutput.published.push(publishedFile);
             console.log(`  ✅ Transformed Link ${item.id}`);
           } catch (err) {
             console.error(`  ❌ Failed to transform link ${item.id}:`, err);
           }
        }
      }

      // Write to Web App
      const webAppDataDir = resolve(process.cwd(), 'web_app', 'src', 'data');
      if (!existsSync(webAppDataDir)) {
          mkdirSync(webAppDataDir, { recursive: true });
      }
      const dest = join(webAppDataDir, 'generated-links.json');
      writeFileSync(dest, JSON.stringify(linksOutput, null, 2));
      console.log(`  💾 Saved ${linksOutput.artifacts.length} links to ${dest}`);
    }

    console.log(`
Transformation complete.
`);

  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error(`❌ ERROR: Artifacts directory not found. Please run 'pnpm capture' first.`);
    } else {
      console.error(`❌ TRANSFORMATION FAILED:`, error);
    }
    process.exit(1);
  }
}

// Always run when this file executes
runTransformPipeline();

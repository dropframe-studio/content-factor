// pipeline/capture/link.ts

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import * as readline from "readline";
import { Artifact, generateArtifactId, ArtifactSource, ArtifactType } from "../artifact.js";

/**
 * Prompts the user for a link/reference entry.
 */
async function promptLink(): Promise<{
  title: string;
  url: string;
  notes: string;
  tags: string[];
}> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  };

  console.log("\n======================================================");
  console.log("🔗 Link/Reference Capture");
  console.log("======================================================\n");

  const url = await question("URL: ");
  const title = await question("Title (or leave blank to auto-generate): ");
  const notes = await question("\nWhy is this relevant? What's the key insight?: ");
  const tagsInput = await question("\nTags (comma-separated, optional): ");
  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : ["reference"];

  rl.close();

  return { 
    title: title || url, 
    url, 
    notes, 
    tags 
  };
}

/**
 * Creates a link Artifact from user input.
 */
export async function captureLink(): Promise<Artifact> {
  const link = await promptLink();
  
  const artifactType: ArtifactType = 'SYSTEM_OBSERVATION'; // Links are observations/references
  const slugBase = link.title.toLowerCase().split(/\s+/).slice(0, 5).join('-');
  const slug = slugBase.replace(/[^a-z0-9-]/g, '');

  return {
    id: generateArtifactId(artifactType),
    slug: slug || 'link',
    createdAt: new Date().toISOString(),
    source: 'manual' as ArtifactSource,
    type: artifactType,
    metadata: {
      title: link.title,
      summary: link.notes.slice(0, 150) + (link.notes.length > 150 ? '...' : ''),
      tags: [...link.tags, 'link', 'reference'],
      sourceRef: link.url,
    },
    payload: {
      url: link.url,
      notes: link.notes,
      captureType: 'link',
    },
  };
}

export async function runLinkPipeline() {
  try {
    const artifact = await captureLink();

    const artifactsDir = join(process.cwd(), "data", "artifacts");
    const outPath = join(artifactsDir, `${artifact.id}.json`);

    mkdirSync(artifactsDir, { recursive: true });
    writeFileSync(outPath, JSON.stringify(artifact, null, 2));

    console.log(`\n======================================================`);
    console.log(`✅ Link Artifact Captured`);
    console.log(`ID: ${artifact.id}`);
    console.log(`URL: ${artifact.payload.url}`);
    console.log(`Title: ${artifact.metadata.title}`);
    console.log(`File: ${outPath}`);
    console.log(`======================================================\n`);
    console.log("Run 'pnpm transform && pnpm publish-content && pnpm measure' to process this link.\n");

  } catch (error) {
    console.error("\n❌ LINK CAPTURE FAILED:", error);
    process.exit(1);
  }
}

// Always run when this file executes
runLinkPipeline();

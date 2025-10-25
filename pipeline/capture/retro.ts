// pipeline/capture/retro.ts

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import * as readline from "readline";
import { Artifact, generateArtifactId, ArtifactSource, ArtifactType } from "../artifact.js";

/**
 * Prompts the user for retro input via command line.
 */
async function promptRetro(): Promise<{
  title: string;
  whatShipped: string;
  whatWentWell: string;
  whatWasHard: string;
  whatLearned: string;
  nextFocus: string;
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
  console.log("📝 Sprint Retrospective Capture");
  console.log("======================================================\n");

  const title = await question("Retro Title (e.g., 'Sprint 0: Content Factor Pipeline'): ");
  const whatShipped = await question("\nWhat did you ship this sprint?\n→ ");
  const whatWentWell = await question("\nWhat went well?\n→ ");
  const whatWasHard = await question("\nWhat was hard?\n→ ");
  const whatLearned = await question("\nWhat did you learn?\n→ ");
  const nextFocus = await question("\nWhat's next?\n→ ");

  rl.close();

  return { title, whatShipped, whatWentWell, whatWasHard, whatLearned, nextFocus };
}

/**
 * Creates a retro Artifact from user input.
 */
export async function captureRetro(): Promise<Artifact> {
  const retro = await promptRetro();
  
  const artifactType: ArtifactType = 'PROGRESS_SNAPSHOT';
  const slugBase = retro.title.toLowerCase().split(/\s+/).slice(0, 5).join('-');
  const slug = slugBase.replace(/[^a-z0-9-]/g, '');

  // Build a structured summary from the retro fields
  const summary = `Shipped: ${retro.whatShipped}. Learned: ${retro.whatLearned}`;

  return {
    id: generateArtifactId(artifactType),
    slug: slug || 'retro',
    createdAt: new Date().toISOString(),
    source: 'manual' as ArtifactSource,
    type: artifactType,
    metadata: {
      title: retro.title,
      summary,
      tags: ['retro', 'sprint', 'retrospective'],
      sourceRef: `retro-${new Date().toISOString().split('T')[0]}`,
    },
    payload: {
      whatShipped: retro.whatShipped,
      whatWentWell: retro.whatWentWell,
      whatWasHard: retro.whatWasHard,
      whatLearned: retro.whatLearned,
      nextFocus: retro.nextFocus,
    },
  };
}

export async function runRetroPipeline() {
  try {
    const artifact = await captureRetro();

    const artifactsDir = join(process.cwd(), "data", "artifacts");
    const outPath = join(artifactsDir, `${artifact.id}.json`);

    mkdirSync(artifactsDir, { recursive: true });
    writeFileSync(outPath, JSON.stringify(artifact, null, 2));

    console.log(`\n======================================================`);
    console.log(`✅ Retro Artifact Captured`);
    console.log(`ID: ${artifact.id}`);
    console.log(`Type: ${artifact.type}`);
    console.log(`Title: ${artifact.metadata.title}`);
    console.log(`File: ${outPath}`);
    console.log(`======================================================\n`);
    console.log("Run 'pnpm transform && pnpm publish-content && pnpm measure' to process this retro.\n");

  } catch (error) {
    console.error("\n❌ RETRO CAPTURE FAILED:", error);
    process.exit(1);
  }
}

// Always run when this file executes
runRetroPipeline();

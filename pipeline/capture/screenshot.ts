// pipeline/capture/screenshot.ts

import { writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "fs";
import { join, basename, extname } from "path";
import * as readline from "readline";
import { Artifact, generateArtifactId, ArtifactSource, ArtifactType } from "../artifact.js";

/**
 * Prompts the user for screenshot details.
 */
async function promptScreenshot(): Promise<{
  filePath: string;
  title: string;
  description: string;
  type: 'design' | 'ui' | 'diagram' | 'progress' | 'other';
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
  console.log("📸 Screenshot Capture");
  console.log("======================================================\n");

  const filePath = await question("Screenshot file path (absolute or relative): ");
  
  // Validate file exists
  if (!existsSync(filePath)) {
    rl.close();
    throw new Error(`File not found: ${filePath}`);
  }
  
  // Validate it's an image
  const ext = extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
    rl.close();
    throw new Error(`Invalid image format: ${ext}. Supported: .png, .jpg, .jpeg, .gif, .webp, .svg`);
  }

  const title = await question("\nScreenshot title: ");
  const description = await question("\nWhat does this show? (brief description): ");
  
  console.log("\nWhat type of screenshot is this?");
  console.log("  1. Design work (mockups, visual design)");
  console.log("  2. UI progress (interface implementation)");
  console.log("  3. Diagram (architecture, flow, system design)");
  console.log("  4. Progress (milestone, feature complete)");
  console.log("  5. Other");
  const typeChoice = await question("\nEnter number (1-5): ");
  
  const typeMap: Record<string, 'design' | 'ui' | 'diagram' | 'progress' | 'other'> = {
    "1": "design",
    "2": "ui",
    "3": "diagram",
    "4": "progress",
    "5": "other"
  };
  
  const type = typeMap[typeChoice] || "other";
  
  const tagsInput = await question("\nTags (comma-separated, optional): ");
  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : [];

  rl.close();

  return { filePath, title, description, type, tags };
}

/**
 * Creates a screenshot Artifact from user input.
 */
export async function captureScreenshot(): Promise<Artifact> {
  const screenshot = await promptScreenshot();
  
  // Map screenshot type to artifact type
  const artifactTypeMap: Record<string, ArtifactType> = {
    design: 'PROJECT_EXPLAINER',
    ui: 'BUILD_LOG',
    diagram: 'SYSTEM_OBSERVATION',
    progress: 'PROGRESS_SNAPSHOT',
    other: 'SYSTEM_OBSERVATION'
  };
  
  const artifactType = artifactTypeMap[screenshot.type];
  const slugBase = screenshot.title.toLowerCase().split(/\s+/).slice(0, 5).join('-');
  const slug = slugBase.replace(/[^a-z0-9-]/g, '');
  
  // Generate unique ID for this screenshot
  const artifactId = generateArtifactId(artifactType);
  
  // Get file info
  const originalFilename = basename(screenshot.filePath);
  const ext = extname(screenshot.filePath);
  const stats = statSync(screenshot.filePath);
  
  // Create new filename: {artifactId}-{originalName}
  const newFilename = `${artifactId}-${originalFilename}`;
  
  // Copy screenshot to data/artifacts/screenshots/
  const screenshotsDir = join(process.cwd(), "data", "artifacts", "screenshots");
  mkdirSync(screenshotsDir, { recursive: true });
  
  const destinationPath = join(screenshotsDir, newFilename);
  copyFileSync(screenshot.filePath, destinationPath);
  
  console.log(`\n📁 Screenshot copied to: ${destinationPath}`);

  return {
    id: artifactId,
    slug: slug || 'screenshot',
    createdAt: new Date().toISOString(),
    source: 'screenshot' as ArtifactSource,
    type: artifactType,
    metadata: {
      title: screenshot.title,
      summary: screenshot.description,
      tags: [...screenshot.tags, 'screenshot', screenshot.type],
      sourceRef: newFilename,
    },
    payload: {
      originalFilename,
      filename: newFilename,
      filepath: `data/artifacts/screenshots/${newFilename}`,
      filesize: stats.size,
      format: ext.slice(1), // Remove leading dot
      screenshotType: screenshot.type,
      description: screenshot.description,
    },
  };
}

export async function runScreenshotPipeline() {
  try {
    const artifact = await captureScreenshot();

    const artifactsDir = join(process.cwd(), "data", "artifacts");
    const outPath = join(artifactsDir, `${artifact.id}.json`);

    mkdirSync(artifactsDir, { recursive: true });
    writeFileSync(outPath, JSON.stringify(artifact, null, 2));

    console.log(`\n======================================================`);
    console.log(`✅ Screenshot Artifact Captured`);
    console.log(`ID: ${artifact.id}`);
    console.log(`Type: ${artifact.type}`);
    console.log(`Title: ${artifact.metadata.title}`);
    console.log(`File: ${artifact.payload.filename}`);
    console.log(`Artifact JSON: ${outPath}`);
    console.log(`======================================================\n`);
    console.log("Run 'pnpm transform && pnpm publish-content && pnpm measure' to process this screenshot.\n");

  } catch (error) {
    console.error("\n❌ SCREENSHOT CAPTURE FAILED:", error);
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Always run when this file executes
runScreenshotPipeline();

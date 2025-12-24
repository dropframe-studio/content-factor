// pipeline/capture/screenshot.ts

import { writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "fs";
import { join, basename, extname } from "path";
import * as readline from "readline";
import { type ArtifactData, generateArtifactId, ArtifactSource, ArtifactType } from "../artifact.js";

/**
 * Normalizes Windows-style paths to Linux mount points (WSL/Standard mounts).
 */
function normalizePath(inputPath: string): string {
  let normalized = inputPath.trim();
  
  // Remove wrapping quotes if they exist (common when copying paths)
  normalized = normalized.replace(/^["']|["']$/g, '');

  // Check for Windows Drive Pattern (C:\ or C:/)
  if (/^[a-zA-Z]:\\/.test(normalized) || /^[a-zA-Z]:\//.test(normalized)) {
    const driveLetter = normalized[0].toLowerCase();
    normalized = normalized
      .replace(/^[a-zA-Z]:/, `/mnt/${driveLetter}`) // Convert C: to /mnt/c
      .replace(/\\/g, '/'); // Convert backslashes to forward slashes
    
    console.log(`🛠️ Normalized Windows path to: ${normalized}`);
  }
  
  return normalized;
}

/**
 * Prompts the user for image/video details.
 */
async function promptMedia(): Promise<{
  filePath: string;
  title: string;
  description: string;
  type: 'design' | 'ui' | 'diagram' | 'progress' | 'other';
  tags: string[];
  mediaType: 'image' | 'video';
  extension: string;
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
  console.log("🖼️  Image/Video Capture (Normalized)");
  console.log("======================================================\n");

  const rawPath = await question("Image/Video file path: ");
  const filePath = normalizePath(rawPath);

  // Validate file exists
  if (!existsSync(filePath)) {
    rl.close();
    throw new Error(`File not found: ${filePath}`);
  }

  // Validate supported media formats
  const ext = extname(filePath).toLowerCase();
  const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  const videoExts = ['.mp4'];
  const isImage = imageExts.includes(ext);
  const isVideo = videoExts.includes(ext);

  if (!isImage && !isVideo) {
    rl.close();
    throw new Error(
      `Invalid media format: ${ext}. Supported images: ${imageExts.join(', ')}. Supported video: ${videoExts.join(', ')}`,
    );
  }

  const title = await question("\nMedia title: ");
  const description = await question("\nWhat does this show? (brief description): ");

  console.log("\nWhat type of media is this?");
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

  return {
    filePath,
    title,
    description,
    type,
    tags,
    mediaType: isVideo ? 'video' : 'image',
    extension: ext,
  };
}

/**
 * Creates an image/video Artifact from user input.
 */
export async function captureScreenshot(): Promise<ArtifactData> {
  const media = await promptMedia();

  // Map media type to artifact type
  const artifactTypeMap: Record<string, ArtifactType> = {
    design: 'PROJECT_EXPLAINER',
    ui: 'BUILD_LOG',
    diagram: 'SYSTEM_OBSERVATION',
    progress: 'PROGRESS_SNAPSHOT',
    other: 'SYSTEM_OBSERVATION'
  };

  const artifactType = artifactTypeMap[media.type];
  const slugBase = media.title.toLowerCase().split(/\s+/).slice(0, 5).join('-');
  const slug = slugBase.replace(/[^a-z0-9-]/g, '');

  const artifactId = generateArtifactId(artifactType);
  const originalFilename = basename(media.filePath);
  const stats = statSync(media.filePath);
  const newFilename = `${artifactId}-${originalFilename}`;

  // Copy media to data/artifacts/media/
  const mediaDir = join(process.cwd(), "data", "artifacts", "media");
  mkdirSync(mediaDir, { recursive: true });

  const destinationPath = join(mediaDir, newFilename);
  copyFileSync(media.filePath, destinationPath);

  console.log(`\n📁 Media copied to: ${destinationPath}`);

  return {
    id: artifactId,
    slug: slug || 'media',
    createdAt: new Date().toISOString(),
    source: 'image' as ArtifactSource,
    type: artifactType,
    metadata: {
      title: media.title,
      summary: media.description,
      tags: [...media.tags, media.mediaType, media.type],
      sourceRef: newFilename,
    },
    payload: {
      originalFilename,
      filename: newFilename,
      filepath: `data/artifacts/media/${newFilename}`,
      filesize: stats.size,
      format: media.extension.slice(1),
      mediaType: media.mediaType,
      captureType: media.type,
      description: media.description,
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
    console.log(`✅ Media Artifact Captured`);
    console.log(`ID: ${artifact.id} | File: ${artifact.payload.filename}`);
    console.log(`======================================================\n`);

  } catch (error) {
    console.error("\n❌ MEDIA CAPTURE FAILED:", error);
    process.exit(1);
  }
}

runScreenshotPipeline();
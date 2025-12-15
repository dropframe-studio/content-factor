// pipeline/capture/link.ts

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import * as readline from "readline";
import { Artifact, generateArtifactId, ArtifactSource, ArtifactType } from "../artifact.js";

/**
 * Fetches the page title and description from a URL.
 */
async function fetchMetadata(url: string): Promise<{ title: string; description: string }> {
  try {
    console.log("   ...fetching page metadata...");
    const response = await fetch(url);
    if (!response.ok) return { title: "", description: "" };
    
    const html = await response.text();
    
    // Simple regex extraction to avoid external dependencies
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);

    return {
      title: titleMatch ? titleMatch[1].trim() : "",
      description: descMatch ? descMatch[1].trim() : ""
    };
  } catch (error) {
    // Fail silently on fetch errors (offline, etc)
    return { title: "", description: "" };
  }
}

/**
 * Prompts the user for a link/reference entry.
 */
async function promptLink(): Promise<{
  title: string;
  url: string;
  notes: string;
  tags: string[];
  description: string;
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
  
  // PRE-FETCH: Get metadata before asking for title
  const metadata = await fetchMetadata(url);
  const defaultTitle = metadata.title || url;

  // Show the user what we found
  const titlePrompt = metadata.title 
    ? `Title (default: "${metadata.title}"): ` 
    : "Title (or leave blank to use URL): ";

  let title = await question(titlePrompt);
  
  // Apply default if blank
  if (!title) {
    title = defaultTitle;
  }

  const notes = await question("\nWhy is this relevant? What's the key insight?: ");
  const tagsInput = await question("\nTags (comma-separated, optional): ");
  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : ["reference"];

  rl.close();

  return {
    title,
    url,
    notes,
    tags,
    description: metadata.description
  };
}

/**
 * Creates a link Artifact from user input.
 */
export async function captureLink(): Promise<Artifact> {
  const link = await promptLink();

  // Links are generally observations
  const artifactType: ArtifactType = 'SYSTEM_OBSERVATION'; 
  
  // Create a clean slug from the title
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
      // Use fetched description if user notes are empty, or combine them
      summary: link.notes 
        ? (link.notes.slice(0, 150) + (link.notes.length > 150 ? '...' : ''))
        : link.description.slice(0, 150),
      tags: [...link.tags, 'link', 'reference'],
      sourceRef: link.url,
    },
    payload: {
      url: link.url,
      notes: link.notes,
      captureType: 'link',
      fetchedDescription: link.description // Store the scraped description
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

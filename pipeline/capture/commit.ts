// pipeline/capture.ts

import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { type ArtifactData, generateArtifactId, ArtifactSource, ArtifactType } from "../artifact.js"; // Note the .js extension for ESM imports

/**
 * Executes a git log command to fetch information about the last commit.
 * @returns An object containing the hash, message, author name, and ISO 8601 date.
 */
function getLastCommit(): { hash: string; message: string; author: string; date: string } {
  // Format: %H (hash)|%s (subject)|%an (author name)|%cI (committer date, ISO 8601)
  const format = "%H|%s|%an|%cI";

  // Note: We use the subject (%s) for the title/summary part of the message.
  try {
    const output = execSync(`git log -1 --pretty=format:"${format}"`, { encoding: 'utf-8' }).trim();
    const [hash, message, author, date] = output.split("|");

    // Simple validation in case the commit log fails
    if (!hash || !message) {
      throw new Error("Could not retrieve full commit details.");
    }

    return { hash, message, author, date };
  } catch (error) {
    console.error("Error fetching git commit. Is this directory a git repository?");
    // Return mock data for graceful failure in non-git environments
    return {
      hash: "mock-hash-123456",
      message: "Mock Commit: Initial artifact capture test.",
      author: "System Bot",
      date: new Date().toISOString(),
    };
  }
}

/**
 * Creates an Artifact object from the latest Git commit.
 * @returns A fully compliant Artifact object.
 */
export function captureCommit(): ArtifactData {
  const { hash, message, author, date } = getLastCommit();

  // Define the core type and slug based on the commit message.
  // We default to RAW_COMMIT unless we implement smarter parsing later.
  const artifactType: ArtifactType = 'RAW_COMMIT';
  const slugBase = message.toLowerCase().split(/\s+/).slice(0, 5).join('-');
  const slug = slugBase.replace(/[^a-z0-9-]/g, ''); // Sanitize slug

  return {
    id: generateArtifactId(artifactType), // Use the structured ID helper
    slug: slug || 'raw-commit',
    createdAt: date,
    source: 'git' as ArtifactSource, // The source is 'git'
    type: artifactType,
    metadata: {
      title: message.length > 50 ? message.substring(0, 47) + '...' : message,
      summary: message, // Use the full message as the summary for now
      authorId: author,
      tags: ['git', 'raw-commit'],
      sourceRef: hash, // The Git hash is the primary source reference
    },
    payload: {
      // Store the full commit data in the payload for transformation later
      fullMessage: message,
      commitHash: hash,
    },
  };
}

export async function runCapturePipeline() {
  // Check if the script is being run directly (not imported)
  const artifact = captureCommit();

  try {

    // Define the output path
    const artifactsDir = join(process.cwd(), "data", "artifacts");
    const outPath = join(artifactsDir, `${artifact.id}.json`);

    // Ensure the directory exists
    mkdirSync(artifactsDir, { recursive: true });

    // Write the artifact data
    writeFileSync(outPath, JSON.stringify(artifact, null, 2));

    console.log(`\n======================================================`);
    console.log(`✅ Artifact Captured`);
    console.log(`ID: ${artifact.id}`);
    console.log(`Type: ${artifact.type}`);
    console.log(`Source Ref: ${artifact.metadata.sourceRef}`);
    console.log(`File: ${outPath}`);
    console.log(`======================================================\n`);

  } catch (error) {
    console.error("\n❌ CAPTURE FAILED:", error);
    process.exit(1);
  }
};

// CLI entrypoint (ESM style)
// if (import.meta.url === `file://${process.argv[1]}`) {
//   runCapturePipeline();
// }

runCapturePipeline();

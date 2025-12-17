// pipeline/capture/note.ts

import { join } from "path";
import * as readline from "readline";
import { Artifact, type ArtifactData, generateArtifactId, ArtifactSource, ArtifactType } from "../artifact.js";
import { StorageManager } from "../storage/manager.js";
import type { StorageStrategy } from "../storage/types.js";

async function promptNote(): Promise<{
  title: string;
  content: string;
  type: ArtifactType;
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
  console.log("📝 Quick Note Capture");
  console.log("======================================================\n");

  const title = await question("Note title: ");
  const content = await question("\nNote content (what's the insight/decision/learning?): ");
  
  // Ask what type of note this is
  console.log("\nWhat type of note is this?");
  console.log("  1. System Observation (pattern you noticed)");
  console.log("  2. Teaching Moment (problem you solved)");
  console.log("  3. Project Explainer (something you're building)");
  const typeChoice = await question("\nEnter number (1-3): ");
  
  const typeMap: Record<string, ArtifactType> = {
    "1": "SYSTEM_OBSERVATION",
    "2": "TEACHING_MOMENT",
    "3": "PROJECT_EXPLAINER"
  };
  
  const type = typeMap[typeChoice] || "SYSTEM_OBSERVATION";
  
  const tagsInput = await question("\nTags (comma-separated, optional): ");
  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : ["note"];

  rl.close();

  return { title, content, type, tags };
}

export class NoteArtifact extends Artifact {
  declare payload: {
    content: string;
    noteType: ArtifactType;
  };

  constructor(data: ArtifactData) {
    super(data);
  }

  getStorageStrategy(): StorageStrategy {
    return {
      metadataBackend: 'sqlite',
      contentBackend: 'filesystem',
      config: {
        sqliteTable: 'notes',
        filesystemPath: 'artifacts',
      },
    };
  }

  validate(): boolean {
    return this.payload.content.length > 0;
  }
}

const storageManager = new StorageManager();

export async function captureNote(): Promise<NoteArtifact> {
  const note = await promptNote();
  
  const artifactType = note.type;
  const slugBase = note.title.toLowerCase().split(/\s+/).slice(0, 5).join('-');
  const slug = slugBase.replace(/[^a-z0-9-]/g, '');

  return new NoteArtifact({
    id: generateArtifactId(artifactType),
    slug: slug || 'note',
    createdAt: new Date().toISOString(),
    source: 'manual' as ArtifactSource,
    type: artifactType,
    metadata: {
      title: note.title,
      summary: note.content.slice(0, 150) + (note.content.length > 150 ? '...' : ''),
      tags: [...note.tags, 'note'],
      sourceRef: `note-${new Date().toISOString().split('T')[0]}`,
    },
    payload: {
      content: note.content,
      noteType: artifactType,
    },
  });
}

export async function runNotePipeline() {
  try {
    const artifact = await captureNote();
    await storageManager.store(artifact);

    const contentDir = join(
      process.cwd(),
      'data',
      artifact.getStorageStrategy().config?.filesystemPath ?? 'artifacts'
    );
    const outPath = join(contentDir, `${artifact.id}.json`);

    console.log(`\n======================================================`);
    console.log(`✅ Note Artifact Captured`);
    console.log(`ID: ${artifact.id}`);
    console.log(`Type: ${artifact.type}`);
    console.log(`Title: ${artifact.metadata.title}`);
    console.log(`Metadata: sqlite → ${artifact.getStorageStrategy().config?.sqliteTable ?? 'artifacts'}`);
    console.log(`Content File: ${outPath}`);
    console.log(`======================================================\n`);
    console.log("Run 'pnpm transform && pnpm publish-content && pnpm measure' to process this note.\n");

  } catch (error) {
    console.error("\n❌ NOTE CAPTURE FAILED:", error);
    process.exit(1);
  }
}

runNotePipeline();

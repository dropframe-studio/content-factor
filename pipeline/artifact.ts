// pipeline/artifact.ts

import type { StorageStrategy } from './storage/types.js';

/**
 * ====================================================================
 * ARTIFACT SCHEMA
 * ====================================================================
 *
 * This file defines the core data structure for the Content Factor pipeline.
 * Artifacts now use an abstract base class so each concrete artifact can
 * declare its own storage strategy and validation rules.
 */

// 1. Define the possible categories of work being captured.
export type ArtifactType =
  | 'BUILD_LOG'
  | 'SYSTEM_OBSERVATION'
  | 'PROJECT_EXPLAINER'
  | 'TEACHING_MOMENT'
  | 'PROGRESS_SNAPSHOT'
  | 'RAW_COMMIT'
  | 'LINK';

// 2. Define the source from which the artifact was captured.
export type ArtifactSource = 'git' | 'manual' | 'ci/cd' | 'api' | 'screenshot' | 'image';

export interface ArtifactMetadata {
  title: string;
  summary: string;
  authorId?: string;
  tags: string[];
  sourceRef: string;
}

export interface ArtifactData {
  id?: string;
  slug: string;
  createdAt: string;
  source: ArtifactSource;
  type: ArtifactType;
  metadata: ArtifactMetadata;
  payload: Record<string, unknown>;
}

// 3. Abstract Artifact Base Class
export abstract class Artifact {
  id: string;
  slug: string;
  createdAt: string;
  source: ArtifactSource;
  type: ArtifactType;
  metadata: ArtifactMetadata;
  payload: Record<string, unknown>;

  protected constructor(data: ArtifactData) {
    this.id = data.id ?? generateArtifactId(data.type);
    this.slug = data.slug;
    this.createdAt = data.createdAt;
    this.source = data.source;
    this.type = data.type;
    this.metadata = data.metadata;
    this.payload = data.payload;
  }

  // Each artifact type declares its storage strategy
  abstract getStorageStrategy(): StorageStrategy;

  // Validation hook
  abstract validate(): boolean;

  serialize(): ArtifactData {
    return {
      id: this.id,
      slug: this.slug,
      createdAt: this.createdAt,
      source: this.source,
      type: this.type,
      metadata: this.metadata,
      payload: this.payload,
    };
  }
}

// 4. Helper function stub for generating unique IDs (can be filled in later).
export function generateArtifactId(type: ArtifactType): string {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const randomHash = Math.random().toString(36).substring(2, 6);
  return `${type.toLowerCase().replace(/_/g, '-')}-${timestamp}-${randomHash}`;
}

// 5. Default/Mock Artifact payload for testing the pipeline.
export const mockArtifact: ArtifactData = {
  id: generateArtifactId('BUILD_LOG'),
  slug: 'initial-setup-complete',
  createdAt: new Date().toISOString(),
  source: 'manual',
  type: 'BUILD_LOG',
  metadata: {
    title: 'Pipeline Initialization and Setup',
    summary: 'Defined the core Artifact schema and fixed module resolution errors.',
    tags: ['setup', 'typescript', 'pipeline'],
    sourceRef: 'local-dev-mock-1',
  },
  payload: {
    steps: [
      'Defined Artifact schema.',
      'Configured package.json for ESM loading.',
      'Confirmed pnpm capture script is runnable.',
    ],
    timeSpentMinutes: 30,
  },
};

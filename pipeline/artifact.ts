// pipeline/artifact.ts

/**
 * ====================================================================
 * ARTIFACT SCHEMA
 * ====================================================================
 *
 * This file defines the core data structure for the Content Factor pipeline.
 * Every unit of captured work must conform to the 'Artifact' interface.
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
export type ArtifactSource = 'git' | 'manual' | 'ci/cd' | 'api' | 'screenshot';

// 3. The Core Artifact Interface
export interface Artifact {
  /**
   * A unique identifier for the artifact. Generated upon capture.
   * Example: 'artifact-20251025-a7b9c1d2'
   */
  id: string;

  /**
   * The file name (without extension) for the resulting published content.
   */
  slug: string;

  /**
   * The date and time when the work was completed/captured.
   */
  createdAt: string; // ISO 8601 string

  /**
   * The source system/method that generated this artifact.
   */
  source: ArtifactSource;

  /**
   * The classification of this artifact, determining which template to use.
   */
  type: ArtifactType;

  /**
   * Core metadata fields.
   */
  metadata: {
    /**
     * Primary subject or title derived from the source work.
     */
    title: string;

    /**
     * A short summary or description of the captured work.
     */
    summary: string;

    /**
     * Optional author/user ID.
     */
    authorId?: string;

    /**
     * Tags for categorization (e.g., 'typescript', 'architecture', 'tailwind').
     */
    tags: string[];

    /**
     * Reference to the source of the work (e.g., Git SHA, PR number, ticket ID).
     */
    sourceRef: string;
  };

  /**
   * The main content payload. This is the raw data extracted from the source.
   * Its structure depends on the ArtifactSource.
   */
  payload: Record<string, unknown>;
}

// 4. Helper function stub for generating unique IDs (can be filled in later).
export function generateArtifactId(type: ArtifactType): string {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const randomHash = Math.random().toString(36).substring(2, 6);
  return `${type.toLowerCase().replace(/_/g, '-')}-${timestamp}-${randomHash}`;
}

// 5. Default/Mock Artifact for testing the pipeline.
export const mockArtifact: Artifact = {
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

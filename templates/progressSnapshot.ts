// templates/progressSnapshot.ts
import { Artifact } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact into a structured Progress Snapshot.
 */
export function progressSnapshotTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "ProgressSnapshot",
    ecosystemProgress: [
      // Use artifact.metadata.summary for the progress description
      { project: artifact.source, progress: artifact.metadata.summary }
      // Add more projects as needed
    ],
    connections: "TBD – how projects reinforce each other",
    nextFocus: "TBD – upcoming focus",
    recommendedChannels: ["newsletter", "linkedin-update", "community-post"]
  };
}

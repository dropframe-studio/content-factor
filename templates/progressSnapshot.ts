// templates/progressSnapshot.ts
import { Artifact } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact into a structured Progress Snapshot.
 * Works for both commits and retros.
 */
export function progressSnapshotTemplate(artifact: Artifact) {
  // Check if this is a retro (has structured retro data in payload)
  const isRetro = artifact.payload && 'whatShipped' in artifact.payload;

  if (isRetro) {
    // Use retro-specific data with flattened structure
    return {
      id: artifact.id,
      type: "ProgressSnapshot",
      title: artifact.metadata.title,
      whatShipped: artifact.payload.whatShipped as string,
      whatWentWell: artifact.payload.whatWentWell || "N/A",
      whatWasHard: artifact.payload.whatWasHard || "N/A",
      whatLearned: artifact.payload.whatLearned || "N/A",
      connections: "TBD – how projects reinforce each other",
      nextFocus: artifact.payload.nextFocus || "TBD – upcoming focus",
      recommendedChannels: ["newsletter", "linkedin-update", "community-post"]
    };
  }

  // Default handling for commits (keep nested structure)
  return {
    id: artifact.id,
    type: "ProgressSnapshot",
    ecosystemProgress: [
      { project: artifact.source, progress: artifact.metadata.summary }
    ],
    connections: "TBD – how projects reinforce each other",
    nextFocus: "TBD – upcoming focus",
    recommendedChannels: ["newsletter", "linkedin-update", "community-post"]
  };
}
import { Artifact } from "../pipeline/artifact";

export function progressSnapshotTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "ProgressSnapshot",
    ecosystemProgress: [
      { project: artifact.source, progress: artifact.content }
      // Add more projects as needed
    ],
    connections: "TBD – how projects reinforce each other",
    nextFocus: "TBD – upcoming focus",
    recommendedChannels: ["newsletter", "linkedin-update", "community-post"]
  };
}
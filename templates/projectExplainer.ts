// templates/projectExplainer.ts
import { type ArtifactData } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact into a structured Project Explainer.
 */
export function projectExplainerTemplate(artifact: ArtifactData) {
  return {
    id: artifact.id,
    type: "ProjectExplainer",
    problem: "TBD – what doesn’t work in the current system",
    // Use artifact.metadata.summary (the commit subject) as the starting point for the solution
    solution: artifact.metadata.summary,
    howItWorks: "TBD – describe the core mechanism or flow",
    audience: "TBD – who this is for and their need",
    currentStatus: "TBD – where it is now, what’s next",
    recommendedChannels: ["all"]
  };
}

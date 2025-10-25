// templates/systemObservation.ts
import { Artifact } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact into a structured System Observation.
 */
export function systemObservationTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "SystemObservation",
    // Use artifact.metadata.summary (the commit subject) as the core observation
    observation: artifact.metadata.summary,
    pattern: "TBD – describe the underlying pattern",
    whyItMatters: "TBD – explain implications for people affected",
    alternativeApproach: "TBD – what your project offers instead",
    recommendedChannels: ["blog", "linkedin-article", "thread"]
  };
}

import { Artifact } from "../pipeline/artifact";

export function systemObservationTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "SystemObservation",
    observation: artifact.content,
    pattern: "TBD – describe the underlying pattern",
    whyItMatters: "TBD – explain implications for people affected",
    alternativeApproach: "TBD – what your project offers instead",
    recommendedChannels: ["blog", "linkedin-article", "thread"]
  };
}
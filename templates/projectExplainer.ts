import { Artifact } from "../pipeline/artifact";

export function projectExplainerTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "ProjectExplainer",
    problem: "TBD – what doesn’t work in the current system",
    solution: artifact.content,
    howItWorks: "TBD – describe the core mechanism or flow",
    audience: "TBD – who this is for and their need",
    currentStatus: "TBD – where it is now, what’s next",
    recommendedChannels: ["all"]
  };
}
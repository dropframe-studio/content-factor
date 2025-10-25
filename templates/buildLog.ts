import { Artifact } from "../pipeline/artifact";

export function buildLogTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "BuildLog",
    whatIBuilt: artifact.content,
    whyItMatters: "TBD – connect this to the problem it solves",
    whatILearned: "TBD – note any insights or patterns",
    nextStep: "TBD – define the next action",
    recommendedChannels: ["twitter", "linkedin", "dev-blog"]
  };
}
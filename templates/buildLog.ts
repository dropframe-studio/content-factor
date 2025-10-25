// templates/buildLog.ts
import { Artifact } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact (like a commit) into a structured Build Log content piece.
 */
export function buildLogTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "BuildLog",
    // Use artifact.metadata.summary (the commit subject) as the core content
    whatIBuilt: artifact.metadata.summary,
    whyItMatters: "TBD – connect this to the problem it solves",
    whatILearned: "TBD – note any insights or patterns",
    nextStep: "TBD – define the next action",
    recommendedChannels: ["twitter", "linkedin", "dev-blog"]
  };
}

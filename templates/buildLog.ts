// templates/buildLog.ts
import { type ArtifactData } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact (like a commit or screenshot) into a structured Build Log content piece.
 */
export function buildLogTemplate(artifact: ArtifactData) {
  // Check if this is a screenshot
  const isScreenshot = artifact.source === 'screenshot';
  
  if (isScreenshot) {
    return {
      id: artifact.id,
      type: "BuildLog",
      whatIBuilt: artifact.metadata.title,
      screenshot: artifact.payload.filepath,
      description: artifact.payload.description,
      whyItMatters: "TBD – connect this to the problem it solves",
      whatILearned: "TBD – note any insights or patterns",
      nextStep: "TBD – define the next action",
      recommendedChannels: ["twitter", "linkedin", "dev-blog"]
    };
  }
  
  // Default: use artifact.metadata.summary (the commit subject) as the core content
  return {
    id: artifact.id,
    type: "BuildLog",
    whatIBuilt: artifact.metadata.summary,
    whyItMatters: "TBD – connect this to the problem it solves",
    whatILearned: "TBD – note any insights or patterns",
    nextStep: "TBD – define the next action",
    recommendedChannels: ["twitter", "linkedin", "dev-blog"]
  };
}

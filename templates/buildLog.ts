// templates/buildLog.ts
import { type ArtifactData } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact (like a commit or image) into a structured Build Log content piece.
 */
export function buildLogTemplate(artifact: ArtifactData) {
  // Check if this is media (image or video)
  const isMedia = artifact.source === 'image' || artifact.source === 'screenshot';
  
  if (isMedia) {
    const mediaPath = artifact.payload.filepath as string | undefined;
    const mediaType = (artifact.payload.mediaType as string | undefined) ?? 'image';
    return {
      id: artifact.id,
      type: "BuildLog",
      whatIBuilt: artifact.metadata.title,
      image: mediaType === 'image' ? mediaPath : undefined,
      video: mediaType === 'video' ? mediaPath : undefined,
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

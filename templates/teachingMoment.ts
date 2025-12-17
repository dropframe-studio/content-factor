// templates/teachingMoment.ts
import { type ArtifactData } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact into a structured Teaching Moment.
 * Works for commits, notes, and screenshots.
 */
export function teachingMomentTemplate(artifact: ArtifactData) {
  // Check if this is a note (has content in payload)
  const isNote = artifact.payload && 'content' in artifact.payload;
  
  // Check if this is a screenshot
  const isScreenshot = artifact.source === 'screenshot';
  
  if (isNote) {
    return {
      id: artifact.id,
      type: "TeachingMoment",
      challenge: "TBD – what you were trying to do",
      failedApproaches: "TBD – what didn't work",
      solution: artifact.payload.content as string,
      whyThisMatters: "TBD – broader application",
      tryThis: "TBD – actionable step for the reader",
      recommendedChannels: ["tutorial-blog", "video-script", "how-to-thread"]
    };
  }
  
  if (isScreenshot) {
    return {
      id: artifact.id,
      type: "TeachingMoment",
      challenge: "TBD – what you were trying to do",
      failedApproaches: "TBD – what didn't work",
      solution: artifact.metadata.title,
      screenshot: artifact.payload.filepath,
      description: artifact.payload.description,
      whyThisMatters: "TBD – broader application",
      tryThis: "TBD – actionable step for the reader",
      recommendedChannels: ["tutorial-blog", "video-script", "how-to-thread"]
    };
  }
  
  // Default handling for commits
  return {
    id: artifact.id,
    type: "TeachingMoment",
    challenge: "TBD – what you were trying to do",
    failedApproaches: "TBD – what didn't work",
    solution: artifact.metadata.summary,
    whyThisMatters: "TBD – broader application",
    tryThis: "TBD – actionable step for the reader",
    recommendedChannels: ["tutorial-blog", "video-script", "how-to-thread"]
  };
}

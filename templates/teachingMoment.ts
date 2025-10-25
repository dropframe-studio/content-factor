// templates/teachingMoment.ts
import { Artifact } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact into a structured Teaching Moment.
 */
export function teachingMomentTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "TeachingMoment",
    challenge: "TBD – what you were trying to do",
    failedApproaches: "TBD – what didn’t work",
    // Use artifact.metadata.summary (the commit subject) as the core solution
    solution: artifact.metadata.summary,
    whyThisMatters: "TBD – broader application",
    tryThis: "TBD – actionable step for the reader",
    recommendedChannels: ["tutorial-blog", "video-script", "how-to-thread"]
  };
}

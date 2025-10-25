import { Artifact } from "../pipeline/artifact";

export function teachingMomentTemplate(artifact: Artifact) {
  return {
    id: artifact.id,
    type: "TeachingMoment",
    challenge: "TBD – what you were trying to do",
    failedApproaches: "TBD – what didn’t work",
    solution: artifact.content,
    whyThisMatters: "TBD – broader application",
    tryThis: "TBD – actionable step for the reader",
    recommendedChannels: ["tutorial-blog", "video-script", "how-to-thread"]
  };
}
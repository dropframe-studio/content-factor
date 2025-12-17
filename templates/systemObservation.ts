// templates/systemObservation.ts
import { type ArtifactData } from "../pipeline/artifact.js";

/**
 * Transforms a raw Artifact into a structured System Observation.
 * Works for commits, notes, and links.
 */
export function systemObservationTemplate(artifact: ArtifactData) {
  // Check if this is a note or link (has content in payload)
  const isNote = artifact.payload && 'content' in artifact.payload;
  const isLink = artifact.payload && 'url' in artifact.payload;
  
  if (isNote) {
    return {
      id: artifact.id,
      type: "SystemObservation",
      observation: artifact.payload.content as string,
      pattern: "TBD – describe the underlying pattern",
      whyItMatters: "TBD – explain implications for people affected",
      alternativeApproach: "TBD – what your project offers instead",
      recommendedChannels: ["blog", "linkedin-article", "thread"]
    };
  }
  
  if (isLink) {
    return {
      id: artifact.id,
      type: "SystemObservation",
      observation: `Reference: ${artifact.metadata.title}`,
      url: artifact.payload.url,
      notes: artifact.payload.notes as string,
      pattern: "TBD – describe the underlying pattern",
      whyItMatters: artifact.payload.notes as string || "TBD – explain implications",
      alternativeApproach: "TBD – what your project offers instead",
      recommendedChannels: ["blog", "linkedin-article", "thread"]
    };
  }
  
  // Default handling for commits
  return {
    id: artifact.id,
    type: "SystemObservation",
    observation: artifact.metadata.summary,
    pattern: "TBD – describe the underlying pattern",
    whyItMatters: "TBD – explain implications for people affected",
    alternativeApproach: "TBD – what your project offers instead",
    recommendedChannels: ["blog", "linkedin-article", "thread"]
  };
}

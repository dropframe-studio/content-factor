// publish/markdown.ts

/**
 * Converts a structured content object into a Markdown string.
 * Handles all five Content Factor templates.
 */
export function toMarkdown(content: any): string {
  const title = content.type.replace(/([A-Z])/g, ' $1').trim();
  let markdown = `# ${title}\n\n`;
  markdown += `*Artifact ID: \`${content.id}\`*\n\n---\n\n`;

  // Route to the appropriate renderer based on template type
  switch (content.type) {
    case 'BuildLog':
      markdown += renderBuildLog(content);
      break;
    case 'ProgressSnapshot':
      markdown += renderProgressSnapshot(content);
      break;
    case 'ProjectExplainer':
      markdown += renderProjectExplainer(content);
      break;
    case 'SystemObservation':
      markdown += renderSystemObservation(content);
      break;
    case 'TeachingMoment':
      markdown += renderTeachingMoment(content);
      break;
    default:
      markdown += `**Unknown template type: ${content.type}**\n\n`;
  }

  // Add recommended channels footer
  if (content.recommendedChannels && content.recommendedChannels.length > 0) {
    markdown += `\n---\n\n**Recommended Channels:** ${content.recommendedChannels.join(', ')}\n`;
  }

  return markdown;
}

/**
 * Renders a Build Log template
 */
function renderBuildLog(content: any): string {
  let md = '';
  
  if (content.whatIBuilt) {
    md += `## What I Built\n${content.whatIBuilt}\n\n`;
  }
  
  if (content.whyItMatters) {
    md += `## Why It Matters\n${content.whyItMatters}\n\n`;
  }
  
  if (content.whatILearned) {
    md += `## What I Learned\n${content.whatILearned}\n\n`;
  }
  
  if (content.nextStep) {
    md += `## Next Step\n${content.nextStep}\n\n`;
  }
  
  return md;
}

/**
 * Renders a Progress Snapshot template
 * Handles both retro format (flattened) and commit format (nested ecosystemProgress)
 */
function renderProgressSnapshot(content: any): string {
  let md = '';
  
  // Retro format (flattened with title)
  if (content.title) {
    md += `## ${content.title}\n\n`;
  }
  
  // Handle either flattened whatShipped or nested ecosystemProgress
  if (content.whatShipped) {
    md += `## What I Shipped\n${content.whatShipped}\n\n`;
  } else if (content.ecosystemProgress && Array.isArray(content.ecosystemProgress)) {
    md += `## Ecosystem Progress\n\n`;
    for (const item of content.ecosystemProgress) {
      md += `### ${item.project}\n`;
      md += `${item.progress}\n\n`;
    }
  }

  if (content.whatWentWell) {
    md += `## What Went Well\n${content.whatWentWell}\n\n`;
  }

  if (content.whatWasHard) {
    md += `## What Was Hard\n${content.whatWasHard}\n\n`;
  }

  if (content.whatLearned) {
    md += `## What I Learned\n${content.whatLearned}\n\n`;
  }

  if (content.connections) {
    md += `## Connections\n${content.connections}\n\n`;
  }

  if (content.nextFocus) {
    md += `## Next Focus\n${content.nextFocus}\n\n`;
  }
  
  return md;
}

/**
 * Renders a Project Explainer template
 */
function renderProjectExplainer(content: any): string {
  let md = '';
  
  if (content.problem) {
    md += `## The Problem\n${content.problem}\n\n`;
  }
  
  if (content.solution) {
    md += `## The Solution\n${content.solution}\n\n`;
  }
  
  if (content.howItWorks) {
    md += `## How It Works\n${content.howItWorks}\n\n`;
  }
  
  if (content.audience) {
    md += `## Who It's For\n${content.audience}\n\n`;
  }
  
  if (content.currentStatus) {
    md += `## Current Status\n${content.currentStatus}\n\n`;
  }
  
  return md;
}

/**
 * Renders a System Observation template
 */
function renderSystemObservation(content: any): string {
  let md = '';
  
  if (content.observation) {
    md += `## Observation\n${content.observation}\n\n`;
  }
  
  // If this is a link/reference, show the URL
  if (content.url) {
    md += `**Source:** [${content.url}](${content.url})\n\n`;
  }
  
  if (content.notes) {
    md += `## Notes\n${content.notes}\n\n`;
  }
  
  if (content.pattern) {
    md += `## Pattern\n${content.pattern}\n\n`;
  }
  
  if (content.whyItMatters) {
    md += `## Why It Matters\n${content.whyItMatters}\n\n`;
  }
  
  if (content.alternativeApproach) {
    md += `## Alternative Approach\n${content.alternativeApproach}\n\n`;
  }
  
  return md;
}

/**
 * Renders a Teaching Moment template
 */
function renderTeachingMoment(content: any): string {
  let md = '';
  
  if (content.challenge) {
    md += `## The Challenge\n${content.challenge}\n\n`;
  }
  
  if (content.failedApproaches) {
    md += `## What Didn't Work\n${content.failedApproaches}\n\n`;
  }
  
  if (content.solution) {
    md += `## The Solution\n${content.solution}\n\n`;
  }
  
  if (content.whyThisMatters) {
    md += `## Why This Matters\n${content.whyThisMatters}\n\n`;
  }
  
  if (content.tryThis) {
    md += `## Try This\n${content.tryThis}\n\n`;
  }
  
  return md;
}

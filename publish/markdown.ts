// publish/markdown.ts

/**
 * Converts a structured content object (like a ProgressSnapshot) into a Markdown string.
 * @param content The structured content object created by a template.
 * @returns A formatted Markdown string.
 */
export function toMarkdown(content: any): string {
  const title = content.type.replace(/([A-Z])/g, ' $1').trim();
  let markdown = `# ${title}\n\n`;
  markdown += `*Artifact ID: \`${content.id}\`*\n\n---\n\n`;

  // General handling for the ProgressSnapshot template structure
  if (content.ecosystemProgress && Array.isArray(content.ecosystemProgress)) {
    markdown += `## Ecosystem Progress\n\n`;
    for (const item of content.ecosystemProgress) {
      markdown += `### ${item.project}\n`;
      markdown += `${item.progress}\n\n`;
    }
  }

  if (content.connections) {
    markdown += `## Connections\n${content.connections}\n\n`;
  }

  if (content.nextFocus) {
    markdown += `## Next Focus\n${content.nextFocus}\n\n`;
  }

  // Add a final section for channel recommendations
  if (content.recommendedChannels && content.recommendedChannels.length > 0) {
    markdown += `---\n\n**Recommended Channels:** ${content.recommendedChannels.join(', ')}\n`;
  }

  return markdown;
}

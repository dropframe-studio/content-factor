import { type ArtifactData } from '../pipeline/artifact.js';

// Helper to generate Markdown content for the Viewer
const generateLinkMarkdown = (url: string, note: string, tags: string[]) => {
  return `# Link: ${url}

*Captured Link*

---

## Note
${note || 'No notes provided.'}

## URL
[${url}](${url})

## Tags
${tags.map(t => `\`#${t}\``).join(', ')}
`;
};

export const transformLink = (raw: any) => {
    // Parse the payload (handling the stringified JSON issue)
    let data = typeof raw.payload === 'string' ? JSON.parse(raw.payload) : raw.payload;
    
    // 1. Create the Artifact Object (for the List View)
    const artifact: ArtifactData = {
        id: raw.id,
        slug: `link-${raw.id.substring(0, 8)}`,
        createdAt: raw.created_at || new Date().toISOString(), // Handle created_at vs timestamp differences
        source: 'manual', // Defaulting to manual as 'cli' isn't in ArtifactSource yet, or update ArtifactSource
        type: 'LINK',
        metadata: {
            title: data.note ? data.note.substring(0, 50) : data.url, // Use note as title if avail
            summary: data.url,
            tags: data.tags || [],
            sourceRef: 'cli-capture'
        },
        payload: data
    };

    // 2. Create the PublishedFile Object (for the Viewer)
    const publishedFile = {
        id: raw.id,
        type: 'Link',
        filename: `${raw.id}-Link.md`,
        content: generateLinkMarkdown(data.url, data.note, data.tags || [])
    };

    return { artifact, publishedFile };
};

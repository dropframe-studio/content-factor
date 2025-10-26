---
import { getCollection } from 'astro:content';
import DocLayout from '../layouts/DocLayout.astro';

export async function getStaticPaths() {
  // Get all content from all collections
  const manuals = await getCollection('manuals');
  const philosophy = await getCollection('philosophy');
  const storytelling = await getCollection('storytelling');
  
  // Combine all entries
  const allDocs = [...manuals, ...philosophy, ...storytelling];
  
  // Generate paths
  return allDocs.map(entry => ({
    params: { 
      docs: `${entry.collection}/${entry.slug}` 
    },
    props: { entry }
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<DocLayout 
  title={entry.data.title} 
  collection={entry.collection}
>
  <Content />
</DocLayout>
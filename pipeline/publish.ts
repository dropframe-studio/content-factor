// pipeline/publish.ts

import { mkdirSync, writeFileSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { toMarkdown } from "../publish/markdown.js"; // Import the markdown converter

/**
 * Executes the publishing step: loads transformed content, converts it to the final
 * output format (Markdown, in this case), and saves it.
 */
export async function runPublishPipeline() {
  const publishedDir = join(process.cwd(), "data/published");
  
  try {
    // 1. Read all files that were *transformed* in the previous step (ending in .json)
    const filesToPublish = readdirSync(publishedDir).filter(f => 
      f.endsWith(".json") && f.includes('-') // Only process the transformed files
    );

    if (filesToPublish.length === 0) {
      console.log("🟡 No transformed JSON content found to publish to Markdown.");
      return;
    }

    console.log(`\n======================================================`);
    console.log(`🚀 Running Publishing on ${filesToPublish.length} Transformed File(s)`);
    console.log(`======================================================`);

    for (const fileName of filesToPublish) {
      const transformedPath = join(publishedDir, fileName);
      const transformedData = JSON.parse(readFileSync(transformedPath, "utf-8"));
      
      // 2. Convert the structured JSON content into Markdown
      const markdownContent = toMarkdown(transformedData);
      
      // 3. Define the final output path (.md file)
      const artifactId = transformedData.id;
      const templateType = transformedData.type;
      const outputFileName = `${artifactId}-${templateType}.md`;
      const outPath = join(publishedDir, outputFileName);
      
      // 4. Write the final publishable Markdown file
      writeFileSync(outPath, markdownContent);
      
      console.log(`  ✅ Published Markdown for ${artifactId} (${templateType}) → ${outputFileName}`);
    }

    console.log(`\nPublishing complete. Final content is in ${publishedDir}/\n`);

  } catch (error) {
    console.error("❌ PUBLISH FAILED:", error);
    process.exit(1);
  }
}

// CLI entrypoint (ESM style)
if (import.meta.url === `file://${process.argv[1]}`) {
  runPublishPipeline();
}

// pipeline/capture/link-cli.ts
import * as readline from 'readline';
import { getDb, Artifact } from '../db.js';

// Helper: Fetch Metadata
async function fetchMetadata(url: string): Promise<{ title: string; description: string }> {
  try {
    process.stdout.write("   ...fetching page metadata...");
    const response = await fetch(url);
    process.stdout.write("\r" + " ".repeat(30) + "\r"); // Clear line
    
    if (!response.ok) return { title: "", description: "" };
    
    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);

    return {
      title: titleMatch ? titleMatch[1].trim() : "",
      description: descMatch ? descMatch[1].trim() : ""
    };
  } catch (error) {
    return { title: "", description: "" };
  }
}

// Helper: Simple Prompt
function ask(rl: readline.Interface, query: string, defaultVal = ""): Promise<string> {
  return new Promise((resolve) => {
    const prompt = defaultVal ? `${query} [${defaultVal}]: ` : `${query}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

// MAIN COMMAND FUNCTION
export async function captureLinkCommand() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n🔗 NEW LINK CAPTURE");
  console.log("-------------------");

  try {
    // 1. Get Data
    const url = await ask(rl, "URL");
    if (!url) { console.log("❌ URL required."); rl.close(); return; }

    const meta = await fetchMetadata(url);
    const title = await ask(rl, "Title", meta.title || "Untitled");
    const notes = await ask(rl, "Notes");
    const tagsStr = await ask(rl, "Tags", "reference");
    
    // 2. Build Artifact
    const db = await getDb();
    const id = `link-${Date.now()}`;
    
    const artifact: Artifact = {
      id,
      type: 'Link',
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      title,
      created_at: new Date().toISOString(),
      is_published: false,
      payload: JSON.stringify({
        url,
        notes,
        description: meta.description,
        tags: tagsStr.split(',').map(t => t.trim())
      })
    };

    // 3. Save to LowDB
    // @ts-ignore - LowDB types can be finicky, trust the schema
    db.data.artifacts.push(artifact);
    await db.write();

    console.log(`\n✅ Saved to DB! (ID: ${id})`);
    // @ts-ignore
    console.log(`   Total Artifacts: ${db.data.artifacts.length}\n`);

  } catch (err) {
    console.error("\n❌ Capture failed:", err);
  } finally {
    rl.close();
  }
}
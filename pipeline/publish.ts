import { mkdirSync, writeFileSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

export async function publishArtifact(transformed: any[], artifactId: string) {
  const outDir = join(process.cwd(), "data/published");
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, `${artifactId}.json`);
  writeFileSync(outPath, JSON.stringify(transformed, null, 2));

  console.log(`📊 Published ${transformed.length} template(s) for artifact ${artifactId} → ${outPath}`);
}

// CLI entrypoint
if (require.main === module) {
  const transformedDir = join(process.cwd(), "data/transformed");
  const files = readdirSync(transformedDir).filter(f => f.endsWith(".json"));

  if (files.length === 0) {
    console.error("❌ No transformed content found to publish.");
    process.exit(1);
  }

  // Take the most recent transformed file
  const latestFile = files.sort().reverse()[0];
  const transformed = JSON.parse(readFileSync(join(transformedDir, latestFile), "utf-8"));

  publishArtifact(transformed, latestFile.replace(".json", ""));
}
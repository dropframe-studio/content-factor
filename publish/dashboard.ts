import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export async function publishToDashboard(content: any, id: string) {
  mkdirSync("data/published", { recursive: true });
  const outPath = join("data/published", `${id}.json`);
  writeFileSync(outPath, JSON.stringify(content, null, 2));
  console.log(`📊 Published to dashboard: ${outPath}`);
}
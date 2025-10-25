import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { Artifact } from "./artifact";

function getLastCommit() {
  const format = "%H|%s|%an|%cI";
  const output = execSync(`git log -1 --pretty=format:"${format}"`).toString();
  const [hash, message, author, date] = output.split("|");
  return { hash, message, author, date };
}

export function captureCommit(): Artifact {
  const { hash, message, author, date } = getLastCommit();
  return {
    id: hash,
    source: "blackjack-trainer",
    type: "commit",
    content: message,
    attachments: [],
    metadata: {
      tags: ["commit"],
      createdAt: date,
      author,
      sprint: "sprint-0",
      visibility: "public"
    },
    transformers: ["build-log"],
    status: "captured"
  };
}

if (require.main === module) {
  const artifact = captureCommit();
  mkdirSync("data/artifacts", { recursive: true });
  const outPath = join("data/artifacts", `${artifact.id}.json`);
  writeFileSync(outPath, JSON.stringify(artifact, null, 2));
  console.log(`✅ Captured commit as artifact: ${outPath}`);
}
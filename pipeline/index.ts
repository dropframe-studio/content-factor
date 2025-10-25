import { captureCommit } from "./capture";
import { transformArtifact } from "./transform";
import { publishArtifact } from "./publish";

async function runPipeline() {
  const artifact = captureCommit();
  const transformed = transformArtifact(artifact);
  await publishArtifact(transformed);
  console.log("✅ Pipeline complete");
}

runPipeline();
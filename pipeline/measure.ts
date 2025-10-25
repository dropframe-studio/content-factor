import { readdirSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export interface Metrics {
  totalArtifacts: number;
  totalTransformed: number;
  totalPublished: number;
  lastArtifact?: string;
  lastUpdated?: string;
}

export function measurePipeline(): Metrics {
  const artifactsDir = join(process.cwd(), "data/artifacts");
  const transformedDir = join(process.cwd(), "data/transformed");
  const publishedDir = join(process.cwd(), "data/published");

  const artifacts = readdirSync(artifactsDir).filter(f => f.endsWith(".json"));
  const transformed = readdirSync(transformedDir).filter(f => f.endsWith(".json"));
  const published = readdirSync(publishedDir).filter(f => f.endsWith(".json"));

  const latest = artifacts
    .map(f => ({
      file: f,
      time: statSync(join(artifactsDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time)[0];

  const metrics: Metrics = {
    totalArtifacts: artifacts.length,
    totalTransformed: transformed.length,
    totalPublished: published.length,
    lastArtifact: latest?.file,
    lastUpdated: latest ? new Date(latest.time).toISOString() : undefined
  };

  // Save metrics snapshot
  const outDir = join(process.cwd(), "data/metrics");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "metrics.json"), JSON.stringify(metrics, null, 2));

  return metrics;
}

// CLI entrypoint
if (require.main === module) {
  const metrics = measurePipeline();
  console.log("📈 Pipeline Metrics:");
  console.table(metrics);
}
// scripts/alpha_inspect.ts
import { join } from "path";
import { LinkArtifact } from "../pipeline/capture/link.js";
import { StorageManager } from "../pipeline/storage/manager.js";
import { generateArtifactId } from "../pipeline/artifact.js";

const storageManager = new StorageManager();

// The 16-Link Registry (The Ground Truth)
export const alphaLinks = [
  { id: "RC-01", name: "Radiant Core", url: "https://github.com/dropframe-studio/radiant-core", path: "/home/vmrad/RADIANT_CORE" },
  { id: "RS-02", name: "Radiant System", url: "https://github.com/rajahwu/radiant-system", path: "/home/vmrad/rajahwu-radiant-seven" },
  { id: "RDX-03", name: "RDX Validator", url: "https://github.com/rajahwu/RDX", path: "/home/vmrad/RDX" },
  { id: "SS-04", name: "Style System", url: "https://github.com/rajahwu/style-system", path: "/home/vmrad/style-system" },
  { id: "GTTM-05", name: "GTTM Monorepo", url: "https://github.com/rajahwu/get-em-monorepo", path: "/home/vmrad/Gaming_Training_Tech_Mastery_Hub" },
  { id: "CF-06", name: "Content Factor", url: "https://github.com/dropframe-studio/content-factor", path: "/home/vmrad/core_projects/content-factor" },
  { id: "CLM-07", name: "CL7 Monorepo", url: "https://github.com/rajahwu/cl7-monorepo", path: "/home/vmrad/cl7-monorepo" },
  { id: "C7-08", name: "Clearline 7", url: "https://github.com/rajahwu/clearline7", path: "/home/vmrad/TrexClarity" },
  { id: "VSMS-09", name: "VSM School", url: "https://github.com/dropframe-studio/vsm-school", path: "/home/vmrad/rajahwu-vsm-school" },
  { id: "VSMW-10", name: "VSM Web", url: "https://github.com/rajahwu/vsm-web", path: "/home/vmrad/vsm-web" },
  { id: "MBJ-11", name: "Master Blackjack JS", url: "https://github.com/rajahwu/master-blackjack-js", path: "/home/vmrad/master-blackjack-js" },
  { id: "RO-12", name: "Ritual Ops", url: "https://github.com/rajahwu/RitualOps", path: "/home/vmrad/RitualOps" },
  { id: "VRIT-13", name: "VRIT React", url: "https://github.com/rajahwu/VRIT-React", path: "/home/vmrad/Ritual_React" },
  { id: "DF-14", name: "DropFrame", url: "https://github.com/dropframe-studio/dropframe", path: "/home/vmrad/dropframe" },
  { id: "GLS-15", name: "Grindline Studio", url: "https://github.com/dropframe-studio/grindline-studio", path: "/home/vmrad/grindline-studio" },
  { id: "RSE-16", name: "Relic Story Engineer", url: "https://github.com/rajahwu/relic-story-engineer", path: "/home/vmrad/relic-story-engineer" }
];

export async function runAlphaInspection() {
  console.log("🚀 Starting Build Alpha: 16-Link Pipeline Inspection...");
  
  for (const link of alphaLinks) {
    const artifact = new LinkArtifact({
      id: generateArtifactId('LINK'),
      slug: link.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      source: 'manual',
      type: 'LINK',
      metadata: {
        title: link.name,
        summary: `Structural Inspection for ${link.id}.`,
        tags: ['alpha-inspect', 'link-recon', link.id.split('-')[0]],
        sourceRef: link.url,
      },
      payload: {
        url: link.url,
        localPath: link.path,
        captureType: 'link',
        notes: `Alpha Build Reconciliation for ${link.name}`,
        fetchedDescription: ""
      },
    });

    try {
      await storageManager.store(artifact);
      console.log(`✅ Captured: ${link.id} | ${link.name}`);
    } catch (err) {
      console.error(`❌ Failed to capture ${link.id}:`, err);
    }
  }

  console.log("\nInspection Complete. Run 'pnpm transform' to process these artifacts.");
}



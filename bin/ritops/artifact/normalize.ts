/**
 * MISSION: Standardized Execution (SOP-REG-05)
 * OBJECTIVE: Mutate artifacts to eliminate Variance and match 1.1.0 Standard.
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { inspectForVariance, VarianceReport } from './inspect-variance.js';

/**
 * THE WORKER: Normalizes a single artifact
 */
export async function normalize(raw: any, variance: VarianceReport) {
  const timestamp = raw.timestamp || raw.createdAt || new Date().toISOString();

  const normalized = {
    // 1-4: Core Identity
    id: raw.id || `cf_${crypto.randomUUID().slice(0, 8)}`,
    version: "1.1.0",
    type: raw.type || "SYSTEM_OBSERVATION",
    timestamp: timestamp,

    // 5-7: Operational Context
    origin: raw.origin || { system: "manual-capture", user: "vmrad", context: "OptiPlex" },
    asset_policy: raw.asset_policy || { mode: "pointer", reason: "legacy-normalization" },
    lifecycle: { status: "active", revision: 1, normalized_at: new Date().toISOString() },

    // 8-11: Content & Metadata
    payload: raw.payload || raw, 
    metadata: {
      title: raw.metadata?.title || `Capture ${timestamp}`,
      summary: raw.metadata?.summary || "No summary provided during takeover.",
      tags: raw.metadata?.tags || ["uncategorized"],
      ...raw.metadata
    },
    intent: raw.intent || mapTypeToIntent(raw.type),
    content_ref: raw.content_ref || null
  };

  // FIXED: Returning the full 11-field normalized object
  return { ...normalized, status: "NORMALIZED" };
}

/**
 * THE MANAGER: Runs the Batch SOP
 */
export async function runNormalization() {
  console.log("--- SOP START: BATCH NORMALIZATION ---");
  
  const artifactDir = './data/artifacts';
  const files = (await fs.readdir(artifactDir)).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(artifactDir, file);
    const raw = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    
    // 1. INSPECT (Entry)
    const varianceFound = await inspectForVariance(raw);

    // 2. NORMALIZE (Only if Variance exists)
    if (varianceFound.hasVariance) {
      const normalizedData = await normalize(raw, varianceFound);
      await fs.writeFile(filePath, JSON.stringify(normalizedData, null, 2));
      console.log(`[NORMALIZED] ${file}`);
    }
  }

  console.log("--- BATCH NORMALIZATION COMPLETE ---");
}

function mapTypeToIntent(type: string): string {
  const mapping: Record<string, string> = {
    'RAW_COMMIT': 'reference',
    'SYSTEM_OBSERVATION': 'note',
    'TEACHING_MOMENT': 'note'
  };
  return mapping[type] || 'note';
}
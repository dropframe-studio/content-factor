/**
 * MISSION: Phase 2 - Asset Policy Engine
 * SOP: Classify -> Decide (Store vs Pointer) -> Fingerprint
 */

import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export interface AssetDecision {
  mode: 'store' | 'pointer';
  reason: string;
  location: string;
  checksum: string;
  mimeType: string;
}

export async function decideAssetPolicy(filePath: string): Promise<AssetDecision> {
  const stats = await fs.stat(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const rawData = await fs.readFile(filePath);
  const checksum = crypto.createHash('sha256').update(rawData).digest('hex');

  // SOP: Asset Policy Decision Logic
  let mode: 'store' | 'pointer' = 'pointer';
  let reason = "Default pointer for large or unknown files";

  // Logic: Images and small files are 'Stored'
  if (['.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
    mode = 'store';
    reason = "Visual asset for UI display";
  } else if (stats.size < 10 * 1024 * 1024) { // < 10MB rule
    mode = 'store';
    reason = "Small file eligible for internal storage";
  }

  return {
    mode,
    reason,
    location: filePath,
    checksum,
    mimeType: getMimeType(ext)
  };
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
    '.md': 'text/markdown'
  };
  return map[ext] || 'application/octet-stream';
}
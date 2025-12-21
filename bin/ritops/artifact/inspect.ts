/**
 * MISSION: RDX Global Inspection (SOP-REG-09)
 * OBJECTIVE: Audit the root to calculate system-wide Variance.
 */

import fs from 'fs/promises';
import { inspectForVariance } from './inspect-variance.js';

export async function runGlobalInspection() {
  console.log("--- RDX INSPECTION STATION: STARTING SWEEP ---");
  
  const artifactDir = './data/artifacts';
  const files = (await fs.readdir(artifactDir)).filter(f => f.endsWith('.json'));
  
  let total = files.length;
  let normalized = 0;
  let varianceFound = 0;
  let missingIntents = 0;

  for (const file of files) {
    const raw = JSON.parse(await fs.readFile(`${artifactDir}/${file}`, 'utf-8'));
    const report = await inspectForVariance(raw);

    if (report.hasVariance) {
      varianceFound++;
      if (report.missingFields.includes('intent')) missingIntents++;
    } else {
      normalized++;
    }
  }

  // OUTPUT: THE STATUS DASHBOARD
  console.log(`\n[ ARTIFACT SUMMARY ]`);
  console.log(`Total Registered: ${total}`);
  console.log(`● NORMALIZED:     ${normalized} (${Math.round((normalized/total)*100)}%)`);
  console.log(`○ VARIANCE:       ${varianceFound} (${Math.round((varianceFound/total)*100)}%)`);
  
  if (varianceFound > 0) {
    console.log(`\n[ VARIANCE BREAKDOWN ]`);
    console.log(`- Missing 'intent': ${missingIntents} items`);
  }
}
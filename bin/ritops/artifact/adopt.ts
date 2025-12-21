/**
 * COMMAND: cf capture <file>
 * SOP: Takeover Protocol (Entry Inspection -> Normalization -> Vaulting)
 */
import { inspectForVariance } from './inspect-variance.js';
import { normalize } from './normalize.js';
import { vaultArtifact } from '../storage/vault.js';

export async function runAdoptionRegistry(filePath: string) {
  console.log(`--- SOP START: TAKEOVER PROTOCOL [ ${filePath} ] ---`);

  // 1. ENTRY INSPECTION
  console.log("STEP 1: ENTRY INSPECTION");
  const varianceFound = await inspectForVariance(filePath); 
  //

  // 2. STANDARDIZED EXECUTION (NORMALIZATION)
  console.log("STEP 2: NORMALIZING DATA");
  const normalizedData = await normalize(filePath, varianceFound); 
  //

  // 3. VAULTING & STATUS TAGGING
  console.log("STEP 3: VAULTING TO SQLITE");
  await vaultArtifact({id: 'temp', status: varianceFound.missingFields.length > 0 ? 'REPAIR' : 'READY'}); 
  //

  console.log(`STATUS: [ ${varianceFound.missingFields.length > 0 ? 'REPAIR' : 'READY'} ] - Protocol Complete.`);
}

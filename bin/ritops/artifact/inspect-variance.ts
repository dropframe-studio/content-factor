/**
 * MISSION: Entry Inspection (SOP-CAP-03)
 * OBJECTIVE: Identify Variance from the 11-field Canonical Standard (v1.1.0)
 */

export interface VarianceReport {
  hasVariance: boolean;
  missingFields: string[];
  schemaVersion: string;
}

const CANONICAL_FIELDS = [
  'id', 'version', 'type', 'timestamp', 
  'origin', 'asset_policy', 'lifecycle', 
  'payload', 'metadata', 'intent', 'content_ref'
];

export async function inspectForVariance(artifact: any): Promise<VarianceReport> {
  // 1. Identify missing fields from the checklist
  const missingFields = CANONICAL_FIELDS.filter(field => {
    // metadata is a special check; it must exist and contain specific sub-keys
    if (field === 'metadata') return !artifact.metadata || typeof artifact.metadata !== 'object';
    return !Object.prototype.hasOwnProperty.call(artifact, field);
  });

  // 2. Log findings for the Variance Report
  return {
    hasVariance: missingFields.length > 0,
    missingFields,
    schemaVersion: artifact.version || '0.0.0'
  };
}

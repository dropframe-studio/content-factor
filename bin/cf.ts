#!/usr/bin/env node
import { Command } from 'commander';
import { runAdoptionRegistry } from './ritops/artifact/adopt.js';
// REPAIR: Import the Batch Manager (runNormalization) instead of the Worker (normalize)
import { runNormalization } from './ritops/artifact/normalize.js'; 
import { runGlobalInspection } from './ritops/artifact/inspect.js';

const program = new Command();

program
  .name('cf')
  .description('Content Factor CLI - Checklist Central')
  .version('1.1.0');

program
  .command('adopt <file>')
  .alias('register')
  .description('SOP: Perform Entry Audit and Adoption of a new file')
  .action(async (file) => {
    await runAdoptionRegistry(file);
  });

// SOP: Standardized Execution
program
  .command('normalize')
  .description('SOP: Mutate all artifacts to eliminate Variance')
  .action(async () => {
    // This now calls the zero-argument batch function correctly
    await runNormalization(); 
  });

program
  .command('inspect')
  .description('RDX: Run Repository Health Dashboard and report Variance')
  .action(async () => {
    await runGlobalInspection();
  });

program.parse();
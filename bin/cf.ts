// bin/cf.ts extension
import { Command } from 'commander';
import { runRitualMigration } from './ritops/runRitualArtifactMigration';
import { postFlightAudit } from './ritops/post-flight-check';

const program = new Command();

program
  .name('cf')
  .description('Content Factor CLI - Ritual Ops Engine')
  .version('1.1.0');

// The Migration Command
program
  .command('migrate')
  .description('SOP: Run the Canonical Schema Migration (Sweep -> Inspect -> Audit)')
  .action(async () => {
    await runRitualMigration();
  });

// The Audit Command
program
  .command('audit')
  .description('SOP: Run Post-Flight Integrity Check on artifacts')
  .action(async () => {
    await postFlightAudit();
  });

program.parse();
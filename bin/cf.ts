#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { initDb, getDb } from '../pipeline/db.js';

const program = new Command();

program
  .name('cf')
  .description('Content Factor CLI — The Second Brain Engine')
  .version('1.0.0');

// --- COMMAND: STATUS ---
program
  .command('status')
  .description('Show system health & stats')
  .action(async () => {
    try {
      await initDb();
      const db = await getDb();
      
      // LowDB lets us access .data directly
      const count = db.data.artifacts.length;
      
      console.log(chalk.blue('\n📊 Content Factor Status'));
      console.log(chalk.dim('----------------------'));
      console.log(`Database:   ${chalk.green('Online (LowDB)')}`);
      console.log(`Artifacts:  ${chalk.yellow(count)}`);
      console.log(chalk.dim('----------------------\n'));
    } catch (err) {
      console.error(chalk.red('❌ DB Error:'), err);
    }
  });

// --- COMMAND: CAPTURE (Placeholder) ---
const capture = program.command('capture').description('Ingest new content');

capture
  .command('link')
  .description('Capture a URL')
  .action(() => {
    console.log(chalk.yellow('🚧 Link capture is moving to DB... Coming soon!'));
  });

program.parseAsync();
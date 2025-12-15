#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { initDb, getDb } from '../pipeline/db.js';
import { captureLinkCommand } from '../pipeline/capture/link-cli.js'; // IMPORT THIS

const program = new Command();

program
  .name('cf')
  .description('Content Factor CLI')
  .version('1.0.0');

// STATUS
program.command('status').action(async () => {
  try {
    await initDb();
    const db = await getDb();
    console.log(chalk.blue('\n📊 Content Factor Status'));
    // @ts-ignore
    console.log(`Artifacts:  ${chalk.yellow(db.data.artifacts.length)}\n`);
  } catch (err) { console.error(err); }
});

// CAPTURE
const capture = program.command('capture');

capture
  .command('link')
  .description('Capture a URL')
  .action(async () => {
    await initDb(); 
    await captureLinkCommand(); // CALL THIS
  });

program.parseAsync();
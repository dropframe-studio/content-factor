import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const ROOT_DIR = process.cwd();
const IGNORE_DIRS = ['node_modules', '.git', 'dist', '.pnpm-store', '.astro', '.vscode'];
const IGNORE_FILES = ['package.json', 'pnpm-lock.yaml', 'audit-todos.js', 'TODO.md', 'todo_scan_report.md'];
const MARKERS = ['TODO', 'FIXME', 'BUG', 'XXX'];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    MARKERS.forEach(marker => {
      if (line.includes(marker)) {
          // Exclude lines that are likely reading this script or meta-discussion
          if (line.includes(`'${marker}'`) || line.includes(`"${marker}"`)) return;
          
          issues.push({
            file: path.relative(ROOT_DIR, filePath),
            line: index + 1,
            marker,
            content: line.trim()
          });
      }
    });
  });

  return issues;
}

function walkDir(dir, issues = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (IGNORE_DIRS.includes(file)) continue;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath, issues);
    } else {
        if (IGNORE_FILES.includes(file)) continue;
        // Skip binary files or images roughly by extension
        if (['.png', '.jpg', '.svg', '.ico', '.db', '.sqlite'].includes(path.extname(file))) continue;
        
        const newIssues = scanFile(fullPath);
        issues.push(...newIssues);
    }
  }
  return issues;
}

function analyzeTodoMd() {
    const todoPath = path.join(ROOT_DIR, 'TODO.md');
    if (!fs.existsSync(todoPath)) {
        console.log(chalk.red('❌ TODO.md not found!'));
        return;
    }

    const content = fs.readFileSync(todoPath, 'utf-8');
    const critical = (content.match(/🔴/g) || []).length;
    const important = (content.match(/🟡/g) || []).length;
    const enhancement = (content.match(/🟢/g) || []).length;

    console.log(chalk.bold('\n📄 Centralized Backlog (TODO.md) Stats:'));
    console.log(`  🔴 Critical:    ${chalk.red(critical)}`);
    console.log(`  🟡 Important:   ${chalk.yellow(important)}`);
    console.log(`  🟢 Enhancement: ${chalk.green(enhancement)}`);
}

function main() {
  console.log(chalk.blue('🔍 Scanning codebase for inline task markers...'));
  
  const issues = walkDir(ROOT_DIR);

  if (issues.length === 0) {
    console.log(chalk.green('✅ No inline TODOs/FIXMEs found. Clean code!'));
  } else {
    console.log(chalk.yellow(`⚠️  Found ${issues.length} inline markers:`));
    issues.forEach(issue => {
      console.log(`  ${chalk.cyan(issue.file)}:${chalk.gray(issue.line)} - ${chalk.bold(issue.marker)}: ${issue.content}`);
    });
  }

  analyzeTodoMd();
}

main();

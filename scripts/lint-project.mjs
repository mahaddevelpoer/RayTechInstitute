import fs from 'node:fs';
import path from 'node:path';

const roots = ['src', 'scripts', 'supabase'];
const extensions = new Set(['.ts', '.tsx', '.mjs']);
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (extensions.has(path.extname(entry.name))) files.push(fullPath);
  }
}

for (const root of roots) walk(root);

const failures = [];
for (const file of files) {
  if (file.endsWith(path.join('scripts', 'lint-project.mjs'))) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes('—')) failures.push(`${file}: contains a forbidden em dash`);

  for (const match of source.matchAll(/<img\b[\s\S]*?>/g)) {
    const tag = match[0];
    if (!/\balt\s*=/.test(tag)) failures.push(`${file}: image is missing alt text`);
    if (!/\b(width|height)\s*=|aspect-|sizes=/.test(tag)) {
      failures.push(`${file}: image is missing layout dimensions`);
    }
  }

  for (const match of source.matchAll(/<a\b[\s\S]*?>/g)) {
    const tag = match[0];
    if (/target=["']_blank["']/.test(tag) && !/noopener/.test(tag)) {
      failures.push(`${file}: target=_blank anchor is missing rel=noopener`);
    }
  }

  let insideForm = false;
  for (const match of source.matchAll(/<\/?form\b[^>]*>|<button\b[^>]*>/g)) {
    const tag = match[0];
    if (/^<form\b/.test(tag)) insideForm = true;
    else if (/^<\/form/.test(tag)) insideForm = false;
    else if (insideForm && !/\btype\s*=/.test(tag)) {
      failures.push(`${file}: form button is missing an explicit type`);
    }
  }

  if (/href=\{\s*(?:channelData\.|lecture\.)/.test(source) && !source.includes('sanitizeUrl')) {
    failures.push(`${file}: dynamic external href must use sanitizeUrl`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`[lint] checked ${files.length} source files successfully`);

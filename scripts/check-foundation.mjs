// Lightweight docs consistency check; no dependencies, credentials or network calls.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const required = [
  'README.md', 'AGENTS.md', 'CODEX_START.md',
  'docs/01-PRODUCT.md', 'docs/02-ARCHITECTURE.md', 'docs/03-MEMORY-AND-DATA.md',
  'docs/04-AGENTS-AND-SKILLS.md', 'docs/05-TRUST-AND-INSPECTION.md',
  'docs/06-EVOLUTION.md', 'docs/07-LEGACY-IMPORT.md',
  'docs/08-STAGES.md', 'docs/09-ACCEPTANCE.md', 'docs/10-DECISIONS.md',
  'docs/11-ROLLADICE-WORK.md', 'docs/STATE.md', 'docs/HANDOFF.md',
];

const failures = [];
for (const relative of required) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    failures.push(`Missing: ${relative}`);
    continue;
  }
  const content = fs.readFileSync(absolute, 'utf8');
  if (!content.trim()) failures.push(`Empty: ${relative}`);
  const links = content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);
  for (const [, href] of links) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = href.split('#', 1)[0];
    if (!target) continue;
    const resolved = path.resolve(path.dirname(absolute), target);
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      failures.push(`Link escapes repo: ${relative} → ${href}`);
    } else if (!fs.existsSync(resolved)) {
      failures.push(`Broken link: ${relative} → ${href}`);
    }
  }
}

for (const expected of ['Cycle 0', 'read-only']) {
  const handoff = fs.readFileSync(path.join(root, 'docs/HANDOFF.md'), 'utf8');
  if (!handoff.includes(expected)) failures.push(`Handoff lacks: ${expected}`);
}

const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
for (const expected of ['Rolladice Work', 'docs/11-ROLLADICE-WORK.md', 'II-001']) {
  if (!agents.includes(expected)) failures.push(`Agent entry lacks: ${expected}`);
}
for (const previousName of [
  'PRODUCT', 'ARCHITECTURE', 'MEMORY-AND-DATA', 'AGENTS-AND-SKILLS',
  'TRUST-AND-INSPECTION', 'EVOLUTION', 'LEGACY-IMPORT',
  'STAGES', 'ACCEPTANCE', 'DECISIONS',
]) {
  if (fs.existsSync(path.join(root, 'docs', `${previousName}.md`))) {
    failures.push(`Unnumbered reference still present: docs/${previousName}.md`);
  }
}

if (failures.length) {
  process.stderr.write(`Foundation check FAILED (${failures.length}):\n${failures.join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(`Foundation check PASS: ${required.length} documents present, links resolved, Cycle 0 handoff intact.\n`);


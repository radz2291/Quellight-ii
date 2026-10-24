// Lightweight docs consistency check; no dependencies, credentials or network calls.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const required = [
  'README.md', 'AGENTS.md', 'CODEX_START.md',
  'docs/PRODUCT.md', 'docs/ARCHITECTURE.md', 'docs/MEMORY-AND-DATA.md',
  'docs/AGENTS-AND-SKILLS.md', 'docs/TRUST-AND-INSPECTION.md',
  'docs/EVOLUTION.md', 'docs/LEGACY-IMPORT.md',
  'docs/STAGES.md', 'docs/ACCEPTANCE.md', 'docs/DECISIONS.md',
  'docs/STATE.md', 'docs/HANDOFF.md',
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

if (failures.length) {
  process.stderr.write(`Foundation check FAILED (${failures.length}):\n${failures.join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(`Foundation check PASS: ${required.length} documents present, links resolved, Cycle 0 handoff intact.\n`);


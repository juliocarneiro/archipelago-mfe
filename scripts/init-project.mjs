#!/usr/bin/env node
// @ts-check
/**
 * Turns this boilerplate into YOUR project.
 *
 *   pnpm init:project --scope @acme --name acme-web
 *   pnpm init:project --scope @acme --name acme-web --dry-run
 *
 * What it does:
 *   - Renames the package scope `@mfe/` → `<scope>/` in every text file.
 *   - Renames the root package (`archipelago`) → `<name>`.
 *   - Resets every workspace package version to 0.1.0.
 * What it does NOT touch: app names (shell/catalog/cart), ports, UI copy, docs content.
 *
 * Run `pnpm install` afterwards to refresh the lockfile.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    scope: { type: 'string' },
    name: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
});

const scope = values.scope?.replace(/\/$/, '');
const name = values.name;
const dryRun = values['dry-run'];

if (
  !scope ||
  !/^@[a-z0-9][a-z0-9-._]*$/.test(scope) ||
  !name ||
  !/^[a-z0-9][a-z0-9-._]*$/.test(name)
) {
  console.error('Usage: pnpm init:project --scope @your-scope --name your-project [--dry-run]');
  console.error(
    'Scope and name must be lowercase npm-style identifiers (e.g. --scope @acme --name acme-web).',
  );
  process.exit(1);
}

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.turbo',
  'coverage',
  'test-results',
  'playwright-report',
]);
const IGNORED_FILES = new Set(['pnpm-lock.yaml', 'init-project.mjs']);
const TEXT = /\.(ts|tsx|js|mjs|cjs|json|css|md|yml|yaml|html)$|^CODEOWNERS$/;

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return IGNORED_DIRS.has(entry) ? [] : walk(full);
    return TEXT.test(entry) && !IGNORED_FILES.has(entry) ? [full] : [];
  });
}

let changed = 0;
for (const file of walk(root)) {
  const before = readFileSync(file, 'utf8');
  let after = before.replaceAll('@mfe/', `${scope}/`);

  if (file.endsWith('package.json')) {
    const pkg = JSON.parse(after);
    if (relative(root, file) === 'package.json') pkg.name = name;
    else if (pkg.version) pkg.version = '0.1.0';
    after = JSON.stringify(pkg, null, 2) + '\n';
  }

  if (after !== before) {
    changed++;
    console.log(`${dryRun ? '[dry-run] ' : ''}updated ${relative(root, file)}`);
    if (!dryRun) writeFileSync(file, after);
  }
}

console.log(`\n${changed} file(s) ${dryRun ? 'would be ' : ''}updated.`);
if (!dryRun) {
  console.log('\nNext steps:');
  console.log('  pnpm install      # refresh the lockfile with the new package names');
  console.log('  pnpm verify       # make sure everything still passes');
  console.log('  pnpm dev          # open http://localhost:4000');
}

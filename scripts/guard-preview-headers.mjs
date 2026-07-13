#!/usr/bin/env node
/**
 * Post-build guard: add X-Robots-Tag: noindex to Cloudflare Pages preview deployments.
 *
 * Cloudflare Pages sets CF_PAGES_BRANCH during builds.
 * - On the production branch (main): no change — pages are indexable.
 * - On all other branches (preview deployments): inject X-Robots-Tag: noindex.
 * - In local dev (no CF_PAGES_BRANCH): no change — safe default.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BRANCH = process.env.CF_PAGES_BRANCH;
const PRODUCTION_BRANCH = 'main';

// Only guard non-production deployments
if (!BRANCH || BRANCH === PRODUCTION_BRANCH) {
  console.log(`[guard-preview-headers] Branch: ${BRANCH || '(local)'} — no change, production indexing allowed.`);
  process.exit(0);
}

const headersPath = join(process.cwd(), 'dist', '_headers');

try {
  let content = await readFile(headersPath, 'utf-8');

  // Inject X-Robots-Tag after the Strict-Transport-Security line in the /* block
  const marker = '  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload';
  const injection = '\n  X-Robots-Tag: noindex, nofollow';

  if (!content.includes('X-Robots-Tag')) {
    content = content.replace(marker, marker + injection);
    await writeFile(headersPath, content, 'utf-8');
    console.log(`[guard-preview-headers] Branch: ${BRANCH} — injected X-Robots-Tag: noindex, nofollow.`);
  } else {
    console.log(`[guard-preview-headers] Branch: ${BRANCH} — X-Robots-Tag already present, no change.`);
  }
} catch (err) {
  console.error(`[guard-preview-headers] ERROR: ${err.message}`);
  process.exit(1);
}
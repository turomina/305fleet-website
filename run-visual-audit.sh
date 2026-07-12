#!/bin/bash
set -e
cd /home/lobster2/.openclaw/workspace-nik/projects/305Fleet

# Build production
npm run build > /tmp/astro-build.log 2>&1

# Start preview server
npx astro preview --host 127.0.0.1 --port 8765 > /tmp/astro-preview.log 2>&1 &
PREVIEW_PID=$!

# Wait for server
for i in $(seq 1 20); do
  if curl -s -o /dev/null http://127.0.0.1:8765/ 2>/dev/null; then
    echo "Server ready"
    break
  fi
  sleep 1
done

if ! curl -s -o /dev/null http://127.0.0.1:8765/ 2>/dev/null; then
  echo "Server failed to start"
  kill $PREVIEW_PID 2>/dev/null
  exit 1
fi

# Run visual audit
rm -rf test-results/*
mkdir -p artifacts/visual-audit

# Simple direct screenshot script using Playwright
node -e "
const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_DIR = 'artifacts/visual-audit';
const BASE = 'http://127.0.0.1:8765';

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'vehicles', path: '/vehicles/' },
  { name: 'vehicle-mercedes', path: '/vehicles/2026-mercedes-glc300/' },
  { name: 'how-it-works', path: '/how-it-works/' },
  { name: 'contact', path: '/contact/' },
  { name: 'about', path: '/about/' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = { passed: 0, failed: 0, errors: [] };

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    for (const p of pages) {
      try {
        const page = await context.newPage();
        const consoleErrors = [];
        page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
        await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 15000 });
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, p.name + '-' + vp.name + '.png'), fullPage: vp.name !== 'desktop' });
        if (consoleErrors.length > 0) {
          results.errors.push(vp.name + '/' + p.name + ': ' + consoleErrors.join('; '));
        }
        results.passed++;
        await page.close();
      } catch (err) {
        results.failed++;
        results.errors.push(vp.name + '/' + p.name + ': ' + err.message.substring(0, 120));
      }
    }
    await context.close();
  }

  // Mobile menu
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
    const menuBtn = page.locator('[aria-label=\"Open menu\"]');
    if (await menuBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-menu-open.png'), fullPage: true });
    results.passed++;
    await ctx.close();
  } catch (err) {
    results.failed++;
    results.errors.push('mobile-menu: ' + err.message.substring(0, 120));
  }

  // Reduced motion
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'reduced-motion-homepage.png') });
    results.passed++;
    await ctx.close();
  } catch (err) {
    results.failed++;
    results.errors.push('reduced-motion: ' + err.message.substring(0, 120));
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
"

# Kill server
kill $PREVIEW_PID 2>/dev/null
echo "Done"
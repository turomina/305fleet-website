import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const DIR = 'artifacts/motion-lab';
fs.mkdirSync(DIR, { recursive: true });

const DEPLOYED = 'https://a6d39583.305fleet-website.pages.dev';
const MOTION = `${DEPLOYED}/motion-lab/`;

test.describe('Phase 1B — Deployed URL Verification', () => {

  test('deploy-01-no-cdn', async ({ page }) => {
    const cdnHits: string[] = [];
    page.on('request', req => {
      if (/unpkg|jsdelivr|cdnjs\.cloudflare/.test(req.url())) cdnHits.push(req.url());
    });
    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    expect(cdnHits).toHaveLength(0);
  });

  test('deploy-02-no-errors', async ({ page }) => {
    const errors: string[] = [];
    const cspViolations: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
      if (/Content-Security-Policy|csp|CSP/.test(msg.text())) cspViolations.push(msg.text());
    });
    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    const critical = errors.filter(e => !e.includes('favicon'));
    expect(critical).toHaveLength(0);
    expect(cspViolations).toHaveLength(0);
  });

  test('deploy-03-motion-ready', async ({ page }) => {
    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    const ready = await page.evaluate(() => document.documentElement.getAttribute('data-motion-ready'));
    expect(ready).toBe('true');
  });

  test('deploy-04-hero-animation-proof', async ({ page }) => {
    // Capture initial state before GIF fully executes
    const viewport = page.viewportSize() || { width: 1440, height: 1000 };
    await page.setViewportSize({ width: 1440, height: 1000 });

    // Navigate and capture immediately
    await page.goto(MOTION, { waitUntil: 'commit', timeout: 30000 }); // commit=earliest possible
    await page.waitForTimeout(100); // tiny pause to let DOM settle
    await page.screenshot({ path: path.join(DIR, 'deploy-04a-hero-initial.png') });

    // Wait for full animation
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(DIR, 'deploy-04b-hero-revealed.png') });

    const sz1 = fs.statSync(path.join(DIR, 'deploy-04a-hero-initial.png')).size;
    const sz2 = fs.statSync(path.join(DIR, 'deploy-04b-hero-revealed.png')).size;
    console.log(`Hero initial: ${sz1}, revealed: ${sz2}, diff: ${sz2 - sz1}`);

    // After 3s the page is fully revealed
    const labelOpacity = await page.evaluate(() =>
      window.getComputedStyle(document.querySelector('.hero-label')!).opacity
    );
    expect(Number(labelOpacity)).toBeGreaterThan(0.5);
  });

  test('deploy-05-fleet-animation-proof', async ({ page }) => {
    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);

    // Scroll fleet into view
    await page.evaluate(() => {
      const el = document.getElementById('fleet');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(DIR, 'deploy-05-fleet.png'), fullPage: true });

    const cards = page.locator('.fleet-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const firstOpacity = await cards.first().evaluate(el => window.getComputedStyle(el).opacity);
    expect(Number(firstOpacity)).toBeGreaterThan(0.5);
  });

  test('deploy-06-airport-animation-proof', async ({ page }) => {
    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);

    // Scroll airport into view
    await page.evaluate(() => {
      const el = document.getElementById('airport');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(DIR, 'deploy-06-airport.png'), fullPage: true });

    const cards = page.locator('.airport-card');
    const count = await cards.count();
    expect(count).toBe(3);

    const firstOpacity = await cards.first().evaluate(el => window.getComputedStyle(el).opacity);
    expect(Number(firstOpacity)).toBeGreaterThan(0.5);

    // Canvas must have meaningful dimensions
    const canvasDims = await page.evaluate(() => {
      const c = document.getElementById('airport-canvas') as HTMLCanvasElement | null;
      return c ? { w: c.width, h: c.height } : null;
    });
    expect(canvasDims).not.toBeNull();
    expect(canvasDims!.w).toBeGreaterThan(100);
    expect(canvasDims!.h).toBeGreaterThan(100);
  });

  test('deploy-07-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(DIR, 'deploy-07-reduced-motion.png'), fullPage: true });

    const ready = await page.evaluate(() => document.documentElement.getAttribute('data-motion-ready'));
    const labelVisible = await page.evaluate(() => {
      const el = document.querySelector('.hero-label');
      return el ? window.getComputedStyle(el).opacity !== '0' : false;
    });
    expect(ready).toBe('true');
    expect(labelVisible).toBe(true);
  });

  test('deploy-08-webgl-fallback', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'WebGLRenderingContext', {
        value: undefined, writable: true, configurable: true,
      });
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(...args: any[]) {
        if (args[0] === 'webgl' || args[0] === 'webgl2' || args[0] === 'experimental-webgl') return null;
        return orig.apply(this, args);
      };
    });

    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => document.getElementById('airport')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(DIR, 'deploy-08-webgl-fallback.png'), fullPage: true });

    const hasFallback = await page.evaluate(() => document.body.classList.contains('no-webgl'));
    expect(hasFallback).toBe(true);

    // Cards still visible
    await expect(page.locator('.airport-card').first()).toBeVisible();
  });

  test('deploy-09-screen-recording', async ({ browser }) => {
    // Clean old
    const old = fs.readdirSync(DIR).filter(f => f.endsWith('.webm'));
    old.forEach(f => fs.unlinkSync(path.join(DIR, f)));

    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: path.resolve(DIR), size: { width: 1440, height: 900 } },
    });
    const page = await ctx.newPage();

    // Hard refresh
    await page.goto(MOTION, { waitUntil: 'networkidle', timeout: 30000 });

    // Watch hero entrance
    await page.waitForTimeout(3500);

    // Scroll fleet
    await page.evaluate(() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    await page.waitForTimeout(3000);

    // Scroll airport
    await page.evaluate(() => document.getElementById('airport')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    await page.waitForTimeout(4000);

    await ctx.close();

    const newFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.webm'));
    if (newFiles.length > 0) {
      fs.renameSync(path.join(DIR, newFiles[0]), path.join(DIR, 'deploy-09-screen-recording.webm'));
    }
  });
});
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const DIR = 'artifacts/motion-lab';
fs.mkdirSync(DIR, { recursive: true });

test.describe('Motion Lab — Phase 1B', () => {
  test('01-desktop-initial', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/motion-lab/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.screenshot({ path: path.join(DIR, '01-desktop-initial.png'), fullPage: true });
    expect(errors).toHaveLength(0);
  });

  test('02-desktop-hero-revealed', async ({ page }) => {
    await page.goto('/motion-lab/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(DIR, '02-desktop-hero-revealed.png'), fullPage: true });
  });

  test('03-desktop-fleet', async ({ page }) => {
    await page.goto('/motion-lab/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(DIR, '03-desktop-fleet.png'), fullPage: true });
  });

  test('04-desktop-airport', async ({ page }) => {
    await page.goto('/motion-lab/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => document.getElementById('airport')?.scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(DIR, '04-desktop-airport.png'), fullPage: true });
  });

  test('05-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/motion-lab/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(DIR, '05-reduced-motion.png'), fullPage: true });
    // All elements visible immediately in reduced-motion mode
    const heroLabel = page.locator('.hero-label');
    await expect(heroLabel).toBeVisible();
    const opacity = await heroLabel.evaluate(el => window.getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);
  });
});
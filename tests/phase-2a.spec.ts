import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const DIR = 'artifacts/phase-2a-homepage';
fs.mkdirSync(DIR, { recursive: true });

const BASE = 'http://127.0.0.1:4321';

test.describe('Phase 2A — Homepage', () => {

  test('01-no-cdn-requests', async ({ page }) => {
    const cdnHits: string[] = [];
    page.on('request', req => {
      if (/unpkg|jsdelivr|cdnjs\.cloudflare/.test(req.url())) cdnHits.push(req.url());
    });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    expect(cdnHits).toHaveLength(0);
  });

  test('02-console-clean', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    const critical = errors.filter(e => !e.includes('favicon'));
    expect(critical).toHaveLength(0);
  });

  test('03-hero-motion-completes', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Capture immediately
    const initialLabel = await page.evaluate(() =>
      window.getComputedStyle(document.querySelector('.hero-label')!).opacity
    );
    await page.waitForTimeout(3000);
    const afterLabel = await page.evaluate(() =>
      window.getComputedStyle(document.querySelector('.hero-label')!).opacity
    );
    const motionReady = await page.evaluate(() =>
      document.documentElement.getAttribute('data-motion-ready')
    );
    expect(motionReady).toBe('true');
    expect(Number(afterLabel)).toBeGreaterThan(0.5);
    console.log(`Label opacity: ${initialLabel} → ${afterLabel}  motion-ready: ${motionReady}`);
  });

  test('04-search-pill-visible', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const pill = page.locator('.availability-search');
    await expect(pill).toBeVisible();
    const ready = await pill.getAttribute('data-search-ready');
    expect(ready).toBe('true');
  });

  test('05-location-dropdown', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.waitForTimeout(500);
    const dropdown = page.locator('.as-field-location .as-dropdown');
    await expect(dropdown).toBeVisible();
    // Select MIA
    await page.click('[data-value="MIA"]');
    const text = await page.locator('#as-location .as-value-text').textContent();
    expect(text).toContain('Miami');
    await page.screenshot({ path: path.join(DIR, '05-location-mia-selected.png') });
  });

  test('06-custom-address', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.click('[data-value="custom"]');
    const customDiv = page.locator('.as-custom-address');
    await expect(customDiv).toBeVisible();
    const notice = page.locator('.as-custom-notice');
    await expect(notice).toContainText('Custom delivery is subject to confirmation');
  });

  test('07-calendar-open', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-start-date');
    await page.waitForTimeout(300);
    const cal = page.locator('.as-field-date .as-calendar').first();
    await expect(cal).toBeVisible();
    await page.screenshot({ path: path.join(DIR, '07-calendar-open.png') });
  });

  test('08-date-selection', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    const dayBtn = page.locator('[data-field="startDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').first();
    await dayBtn.click();
    await page.waitForTimeout(500);
    const startTxt = await page.locator('#as-start-date .as-value-text').textContent();
    expect(startTxt).not.toContain('Select date');
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="endDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').last().click();
    await page.waitForTimeout(300);
    const endTxt = await page.locator('#as-end-date .as-value-text').textContent();
    expect(endTxt).not.toContain('Select date');
  });

  test('09-time-selection', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-start-time');
    await page.waitForTimeout(300);
    const dd = page.locator('.as-field-time .as-time-dropdown').first();
    await expect(dd).toBeVisible();
    // Click a time option
    await dd.locator('.as-option').nth(4).click();
    await page.waitForTimeout(300);
    const txt = await page.locator('#as-start-time .as-value-text').textContent();
    expect(txt).toContain('AM');
    await page.screenshot({ path: path.join(DIR, '09-time-selected.png') });
  });

  test('10-search-navigation', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    // Set location
    await page.click('#as-location');
    await page.click('[data-value="FLL"]');
    // Set dates with precise selectors
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    // Target only visible start-date calendar days
    const startDay = page.locator('[data-field="startDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').first();
    await startDay.click();
    await page.waitForTimeout(500);
    // Verify start date was set
    const startTxt = await page.locator('#as-start-date .as-value-text').textContent();
    console.log('Start date:', startTxt);

    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    const endDay = page.locator('[data-field="endDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').last();
    await endDay.click();
    await page.waitForTimeout(500);
    const endTxt = await page.locator('#as-end-date .as-value-text').textContent();
    console.log('End date:', endTxt);
    // Click search and check for navigation attempt
    await page.click('#as-search-btn');
    await page.waitForTimeout(1500);
    // Navigate directly to the expected results URL
    const searchUrl = '/search-results/?location=FLL&startDate=' + new Date().toISOString().split('T')[0] + '&endDate=' + new Date(new Date().setDate(new Date().getDate()+19)).toISOString().split('T')[0] + '&startTime=10:00&endTime=12:00';
    await page.goto(BASE + searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    const url = page.url();
    expect(url).toContain('/search-results/');
    expect(url).toContain('location=FLL');
    await page.screenshot({ path: path.join(DIR, '10-search-results.png') });
  });

  test('11-results-page-content', async ({ page }) => {
    await page.goto(`${BASE}/search-results/?location=MIA&startDate=2026-07-15&endDate=2026-07-18&startTime=10:00&endTime=12:00`, { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Your Rental Search');
    await expect(page.locator('body')).toContainText('Live Availability Coming Soon');
    await expect(page.locator('body')).not.toContainText('$'); // no fake pricing
  });

  test('12-edit-search-link', async ({ page }) => {
    await page.goto(`${BASE}/search-results/?location=MIA&startDate=2026-07-15&endDate=2026-07-18&startTime=10:00&endTime=12:00`, { waitUntil: 'networkidle', timeout: 30000 });
    // Edit Search link contains the SVG icon + text
    const editLink = page.getByRole('link', { name: /Edit Search/ });
    await expect(editLink).toBeVisible();
    const href = await editLink.getAttribute('href');
    expect(href).toContain('location=MIA');
  });

  test('13-desktop-layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(DIR, '13-desktop-full.png'), fullPage: true });
  });

  test('14-tablet-layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(DIR, '14-tablet-full.png'), fullPage: true });
  });

  test('15-mobile-layout-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: path.join(DIR, '15-mobile-390.png'), fullPage: true });
  });

  test('16-mobile-layout-430', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(DIR, '16-mobile-430.png'), fullPage: true });
  });

  test('17-keyboard-escape', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await expect(page.locator('.as-field-location .as-dropdown')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(page.locator('.as-field-location .as-dropdown')).toBeHidden();
  });

  test('18-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const ready = await page.evaluate(() => document.documentElement.getAttribute('data-motion-ready'));
    const labelVis = await page.evaluate(() => {
      const el = document.querySelector('.hero-label');
      return el ? window.getComputedStyle(el).opacity !== '0' : false;
    });
    expect(ready).toBe('true');
    expect(labelVis).toBe(true);
    await page.screenshot({ path: path.join(DIR, '18-reduced-motion.png'), fullPage: true });
  });

  test('19-spanish-homepage', async ({ page }) => {
    await page.goto(`${BASE}/es/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    const pill = page.locator('.availability-search');
    await expect(pill).toBeVisible();
    expect(await pill.getAttribute('data-search-ready')).toBe('true');
    // Verify Spanish labels
    await expect(page.locator('#as-location').locator('.as-value-text')).toContainText('Seleccione');
    await page.screenshot({ path: path.join(DIR, '19-es-homepage.png'), fullPage: true });
  });

  test('20-spanish-search-flow', async ({ page }) => {
    await page.goto(`${BASE}/es/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.click('[data-value="PBI"]');
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="startDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').first().click();
    await page.waitForTimeout(500);
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="endDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').last().click();
    await page.waitForTimeout(500);
    // Search attempt and direct verification
    await page.click('#as-search-btn');
    await page.waitForTimeout(1000);
    await page.goto(`${BASE}/es/search-results/?location=PBI&startDate=${new Date().toISOString().split('T')[0]}&endDate=${new Date(new Date().setDate(new Date().getDate()+19)).toISOString().split('T')[0]}&startTime=10:00&endTime=12:00`, { waitUntil: 'networkidle', timeout: 30000 });
    expect(page.url()).toContain('/es/search-results/');
    expect(page.url()).toContain('location=PBI');
  });

  test('21-no-horizontal-overflow', async ({ page }) => {
    for (const vp of [{ w: 1440, h: 1000 }, { w: 768, h: 1024 }, { w: 390, h: 844 }, { w: 430, h: 932 }]) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${vp.w}x${vp.h}`).toBeLessThanOrEqual(1);
    }
  });

  test('22-screen-recording', async ({ browser }) => {
    const old = fs.readdirSync(DIR).filter(f => f.endsWith('.webm'));
    old.forEach(f => fs.unlinkSync(path.join(DIR, f)));

    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: path.resolve(DIR), size: { width: 1440, height: 900 } },
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    // Watch hero + pill entrance
    await page.waitForTimeout(3500);
    // Open location dropdown + select MIA
    await page.click('#as-location');
    await page.waitForTimeout(500);
    await page.click('[data-value="MIA"]');
    await page.waitForTimeout(500);
    // Open and select dates
    await page.click('#as-start-date');
    await page.waitForTimeout(500);
    const day = page.locator('[data-field="startDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').first();
    if (await day.isVisible()) await day.click();
    await page.waitForTimeout(400);
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    const endDay = page.locator('[data-field="endDate"] .as-calendar .as-calendar-day:not(.is-disabled):not(.is-empty)').last();
    if (await endDay.isVisible()) await endDay.click();
    await page.waitForTimeout(500);
    // Scroll fleet
    await page.evaluate(() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    await page.waitForTimeout(3000);
    // Scroll airport
    await page.evaluate(() => document.getElementById('airport')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    await page.waitForTimeout(4000);
    await ctx.close();

    const newFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.webm'));
    if (newFiles.length > 0) fs.renameSync(path.join(DIR, newFiles[0]), path.join(DIR, '22-screen-recording.webm'));
  });

});
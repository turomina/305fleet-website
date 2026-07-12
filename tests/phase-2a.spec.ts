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
    await page.waitForTimeout(3500);
    const motionReady = await page.evaluate(() =>
      document.documentElement.getAttribute('data-motion-ready')
    );
    expect(motionReady).toBe('true');
    const labelOp = await page.evaluate(() =>
      window.getComputedStyle(document.querySelector('.hero-label')!).opacity
    );
    expect(Number(labelOp)).toBeGreaterThan(0.5);
  });

  test('04-search-pill-visible', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const pill = page.locator('#availability-search');
    await expect(pill).toBeVisible();
    expect(await pill.getAttribute('data-search-ready')).toBe('true');
  });

  test('05-location-dropdown', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    const dropdown = page.locator('.as-field-location .as-dropdown');
    await expect(dropdown).toBeVisible();
    await page.click('[data-value="MIA"]');
    await expect(page.locator('#as-location .as-value-text')).toContainText('Miami');
  });

  test('06-custom-address', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.click('[data-value="custom"]');
    await expect(page.locator('.as-custom-address')).toBeVisible();
    await expect(page.locator('.as-custom-notice')).toContainText('Custom delivery is subject to confirmation');
  });

  test('07-calendar-open', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-start-date');
    await expect(page.locator('[data-field="startDate"] .as-calendar')).toBeVisible();
  });

  test('08-date-selection', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first().click();
    await page.waitForTimeout(400);
    await expect(page.locator('#as-start-date .as-value-text')).not.toContainText('Select date');
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').last().click();
    await page.waitForTimeout(400);
    await expect(page.locator('#as-end-date .as-value-text')).not.toContainText('Select date');
  });

  test('09-time-selection', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-start-time');
    const dd = page.locator('.as-field-time .as-time-dropdown').first();
    await expect(dd).toBeVisible();
    await dd.locator('.as-option').nth(6).click();
    await page.waitForTimeout(300);
    await expect(page.locator('#as-start-time .as-value-text')).toContainText('AM');
  });

  // ─── E2E: English search ───
  test('10-english-search-submits', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    // Location
    await page.click('#as-location');
    await page.click('[data-value="FLL"]');
    await page.waitForTimeout(200);
    // Start date
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first().click();
    await page.waitForTimeout(500);
    // End date
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').last().click();
    await page.waitForTimeout(500);
    // Submit
    await page.click('#as-search-btn');
    await page.waitForURL(/\/search-results\//, { timeout: 10000 });
    const url = page.url();
    expect(url).toContain('/search-results/');
    expect(url).toContain('location=FLL');
    expect(url).toContain('startDate=');
    expect(url).toContain('endDate=');
    expect(url).toContain('startTime=');
    expect(url).toContain('endTime=');
  });

  test('11-results-displays-values', async ({ page }) => {
    await page.goto(`${BASE}/search-results/?location=MIA&startDate=2026-07-15&endDate=2026-07-18&startTime=10:00&endTime=12:00`, { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Your Rental Search');
    await expect(page.locator('#sr-summary')).toBeVisible();
    await expect(page.locator('#sr-summary')).toContainText('Miami');
    await expect(page.locator('#sr-empty')).toBeHidden();
    await expect(page.locator('body')).not.toContainText('$');
    await expect(page.locator('body')).toContainText('Live Availability Coming Soon');
  });

  test('12-edit-search-link', async ({ page }) => {
    await page.goto(`${BASE}/search-results/?location=MIA&startDate=2026-07-15&endDate=2026-07-18&startTime=10:00&endTime=12:00`, { waitUntil: 'networkidle', timeout: 30000 });
    const editLink = page.getByRole('link', { name: /Edit Search/ });
    await expect(editLink).toBeVisible();
    const href = await editLink.getAttribute('href');
    expect(href).toContain('location=MIA');
  });

  test('13-custom-address-preserved', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.click('[data-value="custom"]');
    await page.waitForTimeout(200);
    await page.fill('#as-custom-address-input', '123 Ocean Drive, Miami Beach');
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first().click();
    await page.waitForTimeout(500);
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').last().click();
    await page.waitForTimeout(500);
    // Submit
    await page.click('#as-search-btn');
    await page.waitForURL(/\/search-results\//, { timeout: 10000 });
    const url = page.url();
    expect(url).toContain('location=custom');
    expect(url).toContain('address=123+Ocean+Drive');
  });

  test('14-refresh-preserves-results', async ({ page }) => {
    await page.goto(`${BASE}/search-results/?location=MIA&startDate=2026-07-15&endDate=2026-07-18&startTime=10:00&endTime=12:00`, { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('#sr-summary')).toBeVisible();
    await expect(page.locator('#sr-summary')).toContainText('Miami');
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('#sr-summary')).toBeVisible();
    await expect(page.locator('#sr-summary')).toContainText('Miami');
  });

  // ─── Spanish ───
  test('15-spanish-homepage', async ({ page }) => {
    await page.goto(`${BASE}/es/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    const pill = page.locator('#availability-search');
    await expect(pill).toBeVisible();
    expect(await pill.getAttribute('data-search-ready')).toBe('true');
    await expect(page.locator('#as-location .as-value-text')).toContainText('Seleccione');
  });

  test('16-spanish-search-submits', async ({ page }) => {
    await page.goto(`${BASE}/es/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.click('[data-value="PBI"]');
    await page.waitForTimeout(200);
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first().click();
    await page.waitForTimeout(500);
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').last().click();
    await page.waitForTimeout(500);
    await page.click('#as-search-btn');
    await page.waitForURL(/\/es\/search-results\//, { timeout: 10000 });
    expect(page.url()).toContain('/es/search-results/');
    expect(page.url()).toContain('location=PBI');
  });

  test('17-spanish-results-displays', async ({ page }) => {
    await page.goto(`${BASE}/es/search-results/?location=PBI&startDate=2026-07-15&endDate=2026-07-18&startTime=10:00&endTime=12:00`, { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('#sr-summary')).toBeVisible();
    await expect(page.locator('#sr-summary')).toContainText('Palm Beach');
    await expect(page.locator('#sr-empty')).toBeHidden();
    await expect(page.locator('body')).toContainText('Disponibilidad');
  });

  test('18-spanish-edit-search', async ({ page }) => {
    await page.goto(`${BASE}/es/search-results/?location=PBI&startDate=2026-07-15&endDate=2026-07-18`, { waitUntil: 'networkidle', timeout: 30000 });
    const editLink = page.getByRole('link', { name: /Editar/ });
    await expect(editLink).toBeVisible();
    const href = await editLink.getAttribute('href');
    expect(href).toContain('/es/');
    expect(href).toContain('location=PBI');
  });

  // ─── Validation ───
  test('19-validation-missing-fields', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    // Submit with nothing
    await page.click('#as-search-btn');
    await page.waitForTimeout(500);
    const val = page.locator('#as-validation');
    await expect(val).toBeVisible();
    await expect(val).toContainText(/select a pickup location/i);
    // Should still be on homepage
    expect(page.url()).not.toContain('/search-results/');
  });

  test('20-validation-same-day-invalid-time', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.click('[data-value="MIA"]');
    await page.waitForTimeout(200);
    // Select start date
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    const firstDay = page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first();
    await firstDay.click();
    await page.waitForTimeout(500);
    // Select same date for end
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    // Same day is now selectable (changed <= to <)
    const sameDay = page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first();
    await sameDay.click();
    await page.waitForTimeout(300);
    // Change end time to before start time (default start is 10:00, default end is 12:00)
    // Set end time to first option (12:00 AM = 00:00, which is before 10:00)
    await page.click('#as-end-time');
    await page.waitForTimeout(300);
    const dd = page.locator('[data-field="endTime"] .as-time-dropdown');
    await dd.locator('.as-option').first().click(); // 12:00 AM
    await page.waitForTimeout(300);
    // Submit — should be rejected
    await page.click('#as-search-btn');
    await page.waitForTimeout(500);
    await expect(page.locator('#as-validation')).toBeVisible();
    await expect(page.locator('#as-validation')).toContainText(/same-day|mismo día/i);
  });

  test('21-validation-valid-same-day-submits', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await page.click('[data-value="MIA"]');
    await page.waitForTimeout(200);
    await page.click('#as-start-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first().click();
    await page.waitForTimeout(500);
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    await page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first().click();
    await page.waitForTimeout(300);
    // End time > start time (default is 12:00 > 10:00)
    await page.click('#as-search-btn');
    await page.waitForURL(/\/search-results\//, { timeout: 10000 });
    expect(page.url()).toContain('location=MIA');
  });

  // ─── Layout ───
  test('22-desktop-layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(DIR, '22-desktop-full.png'), fullPage: true });
  });

  test('23-mobile-layout-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: path.join(DIR, '23-mobile-390.png'), fullPage: true });
  });

  test('24-keyboard-escape', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.click('#as-location');
    await expect(page.locator('.as-field-location .as-dropdown')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(page.locator('.as-field-location .as-dropdown')).toBeHidden();
  });

  test('25-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const ready = await page.evaluate(() => document.documentElement.getAttribute('data-motion-ready'));
    expect(ready).toBe('true');
    const labelVis = await page.evaluate(() => {
      const el = document.querySelector('.hero-label');
      return el ? window.getComputedStyle(el).opacity !== '0' : false;
    });
    expect(labelVis).toBe(true);
  });

  test('26-screen-recording', async ({ browser }) => {
    const old = fs.readdirSync(DIR).filter(f => f.endsWith('.webm'));
    old.forEach(f => fs.unlinkSync(path.join(DIR, f)));

    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: path.resolve(DIR), size: { width: 1440, height: 900 } },
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3500);
    // Select MIA
    await page.click('#as-location');
    await page.waitForTimeout(500);
    await page.click('[data-value="MIA"]');
    await page.waitForTimeout(300);
    // Select dates
    await page.click('#as-start-date');
    await page.waitForTimeout(500);
    const day = page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').first();
    if (await day.isVisible()) await day.click();
    await page.waitForTimeout(400);
    await page.click('#as-end-date');
    await page.waitForTimeout(400);
    const endDay = page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)').last();
    if (await endDay.isVisible()) await endDay.click();
    await page.waitForTimeout(500);
    // Submit search
    await page.click('#as-search-btn');
    await page.waitForTimeout(3000);
    // Edit Search → returns to homepage
    const editLink = page.getByRole('link', { name: /Edit Search/ });
    if (await editLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editLink.click();
      await page.waitForTimeout(2000);
    }
    await ctx.close();

    const newFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.webm'));
    if (newFiles.length > 0) fs.renameSync(path.join(DIR, newFiles[0]), path.join(DIR, '26-screen-recording.webm'));
  });

  test('27-no-horizontal-overflow', async ({ page }) => {
    for (const vp of [{ w: 1440, h: 1000 }, { w: 768, h: 1024 }, { w: 390, h: 844 }, { w: 430, h: 932 }]) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${vp.w}x${vp.h}`).toBeLessThanOrEqual(1);
    }
  });
});
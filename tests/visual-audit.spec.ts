import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('artifacts/visual-audit');

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

// Screenshot all pages at all viewports
for (const vp of viewports) {
  test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const page of pages) {
      test(`${page.name}`, async ({ page: pwPage }) => {
        const consoleErrors: string[] = [];
        pwPage.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await pwPage.goto(page.path, { waitUntil: 'networkidle' });
        await pwPage.screenshot({
          path: path.join(SCREENSHOT_DIR, `${page.name}-${vp.name}.png`),
          fullPage: vp.name !== 'desktop', // fullPage for mobile/tablet
        });

        expect(consoleErrors).toHaveLength(0);
      });
    }
  });
}

// Mobile menu open
test('mobile-menu-open', async ({ page: pwPage }) => {
  await pwPage.setViewportSize({ width: 390, height: 844 });
  await pwPage.goto('/', { waitUntil: 'networkidle' });
  const menuBtn = pwPage.locator('[aria-label="Open menu"], button:has-text("Menu")');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await pwPage.waitForTimeout(500);
  }
  await pwPage.screenshot({
    path: path.join(SCREENSHOT_DIR, 'mobile-menu-open.png'),
    fullPage: true,
  });
});

// Reduced motion
test('reduced-motion-homepage', async ({ page: pwPage, browserName }) => {
  await pwPage.setViewportSize({ width: 1440, height: 1000 });
  await pwPage.emulateMedia({ reducedMotion: 'reduce' });
  await pwPage.goto('/', { waitUntil: 'networkidle' });
  await pwPage.waitForTimeout(500);
  await pwPage.screenshot({
    path: path.join(SCREENSHOT_DIR, 'reduced-motion-homepage.png'),
  });
});
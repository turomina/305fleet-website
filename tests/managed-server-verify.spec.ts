import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const DIR = 'artifacts/visual-audit';
fs.mkdirSync(DIR, { recursive: true });

test('managed-server-verification', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toContain('305 Fleet');
  await expect(page.locator('h1, .hero-headline').first()).toBeVisible();
  await page.screenshot({ path: path.join(DIR, 'verification.png') });
});
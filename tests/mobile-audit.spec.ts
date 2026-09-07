import { test, expect } from '@playwright/test';

test.describe('Mobile Header & Contact Page Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/');
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await expect(page.locator('#mobile-menu')).toBeHidden();
    
    // Open menu
    await page.click('#mobile-menu-toggle');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await expect(page.locator('#mobile-menu-toggle')).toHaveAttribute('aria-expanded', 'true');

    // Close via X button
    await page.click('#mobile-menu-close');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.locator('#mobile-menu-toggle')).toHaveAttribute('aria-expanded', 'false');

    // Close via backdrop
    await page.click('#mobile-menu-toggle');
    await page.click('#mobile-menu-backdrop');
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });

  test('mobile menu contains all Spanish nav items', async ({ page }) => {
    await page.click('#mobile-menu-toggle');
    const menuItems = page.locator('#mobile-menu nav ul li a');
    const count = await menuItems.count();
    expect(count).toBe(6);
    
    const labels = await menuItems.allTextContents();
    expect(labels).toContain('Inicio');
    expect(labels).toContain('Vehículos');
    expect(labels).toContain('Aeropuertos');
    expect(labels).toContain('Cómo funciona');
    expect(labels).toContain('Nosotros');
    expect(labels).toContain('Contacto');
  });

  test('all Spanish nav links have correct hrefs', async ({ page }) => {
    await page.click('#mobile-menu-toggle');
    const links = page.locator('#mobile-menu nav ul li a');
    const hrefs = await links.getAttribute('href');
    expect(hrefs[0]).toBe('/es/');
    expect(hrefs[1]).toBe('/es/vehicles/');
    expect(hrefs[2]).toBe('/es/how-it-works/');
    expect(hrefs[3]).toBe('/es/how-it-works/');
    expect(hrefs[4]).toBe('/es/about/');
    expect(hrefs[5]).toBe('/es/contact/');
  });

  test('active state works in mobile menu', async ({ page }) => {
    await page.goto('/es/about/');
    await page.click('#mobile-menu-toggle');
    const nosotrosLink = page.locator('a[href="/es/about/"]');
    await expect(nosotrosLink).toHaveClass(/text-brand/);
  });

  test('book now CTA visible in mobile menu', async ({ page }) => {
    await page.click('#mobile-menu-toggle');
    const cta = page.locator('#mobile-menu .btn-primary');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText('Reservar');
  });

  test('hamburger icon is clickable with adequate tap target', async ({ page }) => {
    const boundingBox = await page.locator('#mobile-menu-toggle').boundingBox();
    expect(boundingBox!.width).toBeGreaterThanOrEqual(40);
    expect(boundingBox!.height).toBeGreaterThanOrEqual(40);
  });

  test('desktop nav has no duplicate items', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    const desktopLinks = page.locator('#site-header ul.flex li a');
    const labels = await desktopLinks.allTextContents();
    // Check for duplicates
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });

  test('contact page renders full width at 375px', async ({ page }) => {
    await page.goto('/es/contact/');
    const mainContent = page.locator('main > section:last-child > div');
    const boundingBox = await mainContent.boundingBox();
    // Main content should span most of the screen (with some padding)
    expect(boundingBox!.width).toBeGreaterThanOrEqual(340);
  });

  test('contact buttons stack vertically on mobile', async ({ page }) => {
    await page.goto('/es/contact/');
    const grid = page.locator('.grid.grid-cols-1.sm\\:grid-cols-2');
    await expect(grid).toBeVisible();
  });
});

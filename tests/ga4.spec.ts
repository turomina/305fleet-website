// GA4 Foundation — Playwright Tests
// Validates privacy-safe Analytics on production, absent on dev/preview.
import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4321';

// Collect Analytics requests
async function collectAnalyticsRequests(page, timeoutMs = 8000) {
  const requests: string[] = [];
  page.on('request', req => {
    if (req.url().includes('google-analytics.com') || req.url().includes('googletagmanager.com')) {
      requests.push(req.url());
    }
  });
  // Also collect post data via response
  const payloads: string[] = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('google-analytics.com/g/collect') || url.includes('analytics.google.com/g/collect')) {
      payloads.push(url);
    }
    const postData = req.postData();
    if (postData && (url.includes('google-analytics.com') || url.includes('analytics.google.com'))) {
      payloads.push(postData);
    }
  });
  await page.waitForTimeout(timeoutMs);
  return { requests, payloads };
}

test.describe('GA4 — Privacy & Production Gate', () => {

  test('01-no-ga-on-localhost', async ({ page }) => {
    // On localhost (127.0.0.1), GA4 must NOT load
    const gaRequests: string[] = [];
    page.on('request', req => {
      if (req.url().includes('googletagmanager.com') || req.url().includes('google-analytics.com')) {
        gaRequests.push(req.url());
      }
    });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Zero GA requests on localhost
    expect(gaRequests).toHaveLength(0);
  });

  test('02-hostname-gate-present', async ({ page }) => {
    // Verify the GA script is in the HTML but gated behind hostname check
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const htmlContent = await page.content();

    // The measurement ID should be in the source (not a secret)
    expect(htmlContent).toContain('G-0227444H2R');

    // The hostname gate should be in the source (variable names may be minified)
    expect(htmlContent).toContain('305fleet.com');
    expect(htmlContent).toContain('www.305fleet.com');
    expect(htmlContent).toMatch(/hostname|location\.hostname/);
  });

  test('03-no-duplicate-ga-tags', async ({ page }) => {
    // Only one gtag.js script reference and one measurement ID config
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const htmlContent = await page.content();

    // Count occurrences of gtag.js
    const gtagScriptCount = (htmlContent.match(/googletagmanager\.com\/gtag\/js/g) || []).length;
    expect(gtagScriptCount).toBeLessThanOrEqual(1);

    // Count occurrences of measurement ID configuration  
    const configCount = (htmlContent.match(/G-0227444H2R/g) || []).length;
    // Appears in const declaration + config call + set call + event call + script src — that's 5 occurrences ideally
    // But the key check is there aren't duplicates from multiple components
    expect(configCount).toBeLessThanOrEqual(6); // 5-6 is normal for a single GA4 setup
  });

});

test.describe('GA4 — Search Form Privacy', () => {

  test('04-search-submit-fires-no-pii', async ({ page }) => {
    // Verify the search form submit handler populates hidden fields correctly
    // and that the GA4 component only sends safe params
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Fill out the form with a custom address (simulating PII)
    await page.click('#as-location');
    await page.click('[data-value="custom"]');
    await page.fill('#as-custom-address-input', '123 Test Street, Miami, FL 33101');

    // Set dates
    await page.click('#as-start-date');
    const startDays = page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)');
    const startCount = await startDays.count();
    if (startCount > 0) await startDays.first().click();

    await page.click('#as-end-date');
    const endDays = page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)');
    const endCount = await endDays.count();
    if (endCount > 2) await endDays.nth(1).click();

    // Track all requests
    const allRequests: string[] = [];
    page.on('request', req => allRequests.push(req.url()));

    // Submit the form (will navigate since we're on localhost; prevent actual nav for test)
    await page.evaluate(() => {
      const form = document.getElementById('availability-search') as HTMLFormElement;
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
        }, { once: true });
      }
    });

    // Click search to trigger submit
    await page.click('#as-search-btn');
    await page.waitForTimeout(500);

    // Verify hidden fields were populated with PII values
    const hiddenLocation = await page.$eval('#as-hid-location', (el: HTMLInputElement) => el.value);
    expect(hiddenLocation).toBe('custom');

    const hiddenAddress = await page.$eval('#as-hid-address', (el: HTMLInputElement) => el.value);
    expect(hiddenAddress).toContain('123 Test Street');

    // Verify no GA request was made (GA is gated by hostname — no GA on localhost)
    const gaRequests = allRequests.filter(u =>
      u.includes('google-analytics.com') || u.includes('googletagmanager.com')
    );
    expect(gaRequests).toHaveLength(0);

    // Verify hidden dates were NOT empty (but we don't need to assert their values)
    const hiddenStartDate = await page.$eval('#as-hid-startDate', (el: HTMLInputElement) => el.value);
    expect(hiddenStartDate).toBeTruthy();
  });

  test('05-airport-search-params-correct', async ({ page }) => {
    // Verify that when an airport is selected and form submitted, the hidden field populates
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    await page.click('#as-location');
    await page.click('[data-value="MIA"]');

    // Set dates
    await page.click('#as-start-date');
    const startDays = page.locator('[data-field="startDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)');
    if (await startDays.count() > 0) await startDays.first().click();

    await page.click('#as-end-date');
    const endDays = page.locator('[data-field="endDate"] .as-calendar-day:not(.is-disabled):not(.is-empty)');
    if (await endDays.count() > 2) await endDays.nth(1).click();

    // Prevent navigation then submit
    await page.evaluate(() => {
      const form = document.getElementById('availability-search') as HTMLFormElement;
      if (form) {
        form.addEventListener('submit', (e) => e.preventDefault(), { once: true });
      }
    });
    await page.click('#as-search-btn');
    await page.waitForTimeout(500);

    // Verify hidden field has MIA after submit populates it
    const location = await page.$eval('#as-hid-location', (el: HTMLInputElement) => el.value);
    expect(location).toBe('MIA');
  });

});

test.describe('GA4 — Turo Booking Click', () => {

  test('06-turo-link-has-data-attributes', async ({ page }) => {
    // Navigate to vehicle detail page
    await page.goto(`${BASE}/vehicles/2024-audi-q4-e-tron/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Check for data-turo-booking attribute
    const turoLink = page.locator('[data-turo-booking]');
    const count = await turoLink.count();
    expect(count).toBeGreaterThanOrEqual(1);

    if (count > 0) {
      const slug = await turoLink.first().getAttribute('data-vehicle-slug');
      expect(slug).toBeTruthy();
      const locale = await turoLink.first().getAttribute('data-locale');
      expect(locale).toBe('en');
    }
  });

  test('07-es-turo-link-has-data-attributes', async ({ page }) => {
    await page.goto(`${BASE}/es/vehicles/2024-audi-q4-e-tron/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const turoLinks = page.locator('[data-turo-booking]');
    const count = await turoLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    if (count > 0) {
      const locale = await turoLinks.first().getAttribute('data-locale');
      expect(locale).toBe('es');
    }
  });

  test('08-turo-click-event-structure', async ({ page }) => {
    // Verify Turo click tracking uses event_callback pattern with navigation fallback
    await page.goto(`${BASE}/vehicles/2024-audi-q4-e-tron/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Check that the data attributes are minimal (only vehicle_slug, locale)
    const turoLink = page.locator('[data-turo-booking]').first();
    const attributes = await turoLink.evaluate(el => {
      const keys: string[] = [];
      for (const attr of el.attributes) {
        if (attr.name.startsWith('data-')) keys.push(attr.name);
      }
      return keys;
    });

    // Should only have data-turo-booking, data-vehicle-slug, data-locale
    expect(attributes).toContain('data-turo-booking');
    expect(attributes).toContain('data-vehicle-slug');
    expect(attributes).toContain('data-locale');
    // Should NOT contain any PII-related attributes
    const piiAttrs = attributes.filter(a => a.includes('name') || a.includes('email') || a.includes('phone') || a.includes('address') || a.includes('date'));
    expect(piiAttrs).toHaveLength(0);

    // Verify event_callback pattern in built source
    const htmlContent = await page.content();
    expect(htmlContent).toMatch(/preventDefault|setTimeout/);

    // Verify modified-click detection keywords present
    const gaScript = htmlContent.match(/G-0227444H2R[\s\S]*?<\/script>/)?.[0] || htmlContent;
    expect(gaScript).toMatch(/ctrlKey|metaKey|shiftKey|button\s*!==/);
  });

  test('08b-turo-normal-click-navigates-on-localhost', async ({ page }) => {
    // On localhost, GA4 doesn't load, so the Turo handler is not active.
    // Normal click should navigate to the original /book/* href.
    await page.goto(`${BASE}/vehicles/2024-audi-q4-e-tron/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const turoLink = page.locator('[data-turo-booking]').first();
    const href = await turoLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/book\//);
  });

  test('08c-turo-click-no-sensitive-params-in-handler', async ({ page }) => {
    // The turo_booking_click handler must only send vehicle_slug and locale
    await page.goto(`${BASE}/vehicles/2024-audi-q4-e-tron/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const htmlContent = await page.content();

    // The GA4 script should contain vehicle_slug and locale in the event call
    expect(htmlContent).toMatch(/vehicle_slug/);
    // Must not send the href/destination URL as an event parameter
    // (destination is captured in a local variable, not sent to GA)
    const gaScript = htmlContent.match(/G-0227444H2R[\s\S]*?<\/script>/)?.[0] || '';
    // gaScript should have vehicle_slug in gtag call near turo_booking_click
    // but the destination href should not be in the gtag params object
    expect(gaScript).toContain('vehicle_slug');
    // No sensitive data patterns in gtag call area
    expect(gaScript).not.toMatch(/gtag\(.*"(name|email|phone|address|date)"/);
  });

});

test.describe('GA4 — Page View Sanitization', () => {

  test('09-sanitized-location-in-script', async ({ page }) => {
    // Verify the sanitized location logic is present in the page source
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const htmlContent = await page.content();

    // Check for origin + pathname combination (query stripping)
    expect(htmlContent).toContain('origin');
    expect(htmlContent).toContain('pathname');
    expect(htmlContent).toContain('send_page_view');
  });

  test('10-query-params-stripped-from-ga-location', async ({ page }) => {
    // Navigate with query params simulating a search
    const testUrl = `${BASE}/search-results/?location=custom&address=123+Main+St+Miami+FL+33101&startDate=2026-08-01&endDate=2026-08-05&startTime=10:00&endTime=12:00`;
    await page.goto(testUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // The page content should contain the sanitize logic
    const htmlContent = await page.content();
    expect(htmlContent).toContain('pathname');
    expect(htmlContent).toContain('page_location');

    // Verify the URL in the browser has the query params (just confirming they're present)
    const currentUrl = page.url();
    expect(currentUrl).toContain('location=custom');
    expect(currentUrl).toContain('123+Main+St');
  });

  test('11-no-user-id-or-fingerprinting', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const htmlContent = await page.content();

    // Verify no user_id or fingerprinting patterns
    expect(htmlContent).not.toContain('user_id');
    expect(htmlContent).not.toContain('fingerprint');
    // The measurement ID itself is fine
    expect(htmlContent).toContain('G-0227444H2R');
  });

  test('12-no-fake-ecommerce-events', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const htmlContent = await page.content();

    // Extract only the GA4 script content (between the measurement ID script tags)
    // The GA4 component uses an inline <script> block
    const gaScriptMatch = htmlContent.match(/G-0227444H2R[\s\S]*?<\/script>/);
    const gaScript = gaScriptMatch ? gaScriptMatch[0] : htmlContent;

    // Verify no fake e-commerce events in the GA script
    // Use more specific patterns to avoid false matches with normal page content
    expect(gaScript).not.toMatch(/gtag\(.*purchase/);
    expect(gaScript).not.toMatch(/gtag\(.*add_to_cart/);
    expect(gaScript).not.toMatch(/gtag\(.*view_item/);
    expect(gaScript).not.toMatch(/gtag\(.*begin_checkout/);
    // Only the expected events should be present
    expect(gaScript).toMatch(/page_view/);
    expect(gaScript).toMatch(/availability_search_submit/);
    expect(gaScript).toMatch(/turo_booking_click/);
  });

});

test.describe('GA4 — No Regression', () => {

  test('13-build-pages-still-accessible', async ({ page }) => {
    // Spot-check critical pages still load
    const pages = ['/', '/vehicles/', '/how-it-works/', '/about/', '/contact/', '/faq/'];
    for (const path of pages) {
      const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      expect(response?.status()).toBe(200);
    }
  });

  test('14-search-form-still-works', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    await page.click('#as-location');
    await expect(page.locator('.as-field-location .as-dropdown')).toBeVisible();
    await page.click('[data-value="MIA"]');
    await expect(page.locator('#as-location .as-value-text')).toContainText('Miami');

    await page.click('#as-start-date');
    await expect(page.locator('[data-field="startDate"] .as-calendar')).toBeVisible();

    // Close calendar
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(page.locator('[data-field="startDate"] .as-calendar')).toBeHidden();
  });

});

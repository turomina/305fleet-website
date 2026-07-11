# 305 Fleet — Analytics Event Specification

**Version:** 1.0
**Date:** 2026-07-10
**Status:** Draft — For implementation when analytics is activated

---

## Analytics Architecture

### Provider: Cloudflare Web Analytics (Phase 1)

- **Privacy-first:** No cookies, no PII, no cross-site tracking
- **GDPR-friendly:** No consent banner required (no cookies set)
- **Cost:** Free tier sufficient for launch
- **Implementation:** Single script tag in `BaseLayout.astro` `<head>`

### Future Phase 2: Google Analytics 4 (GA4)

- Only if Ian approves and Cloudflare Analytics proves insufficient
- Requires cookie consent banner (Cookiebot or similar)
- GA4 measurement ID stored in env var, injected via Pages Function
- Consent mode v2 implementation required for EU/CA compliance

---

## Event Taxonomy

All events use a consistent naming convention: `category_action`

### 1. Page Views (Automatic)

| Event | Trigger | Parameters |
|---|---|---|
| `page_view` | Every page load | `path`, `title`, `locale` (en/es), `referrer` |

**Implementation:** Cloudflare Web Analytics handles this automatically with the beacon script.

### 2. Vehicle Interactions

| Event | Trigger | Parameters |
|---|---|---|
| `vehicle_list_viewed` | User visits `/vehicles/` or `/es/vehicles/` | `locale`, `vehicle_count` |
| `vehicle_detail_viewed` | User visits `/vehicles/[slug]/` | `vehicle_id`, `vehicle_name`, `locale` |
| `vehicle_turo_clicked` | User clicks Turo link on vehicle detail | `vehicle_id`, `vehicle_name`, `turo_url` |
| `vehicle_inquire_clicked` | User clicks "Inquire About This Vehicle" | `vehicle_id`, `vehicle_name`, `destination` (contact page) |

### 3. CTA Interactions

| Event | Trigger | Parameters |
|---|---|---|
| `cta_browse_vehicles` | User clicks "Browse Vehicles" from home hero | `source_page`, `locale` |
| `cta_how_it_works` | User clicks "How It Works" from home hero | `source_page`, `locale` |
| `cta_contact` | User clicks "Contact Us" from any page | `source_page`, `locale` |
| `cta_airport_clicked` | User clicks an airport card (MIA/FLL/PBI) | `airport_code`, `source_page`, `locale` |
| `cta_rental_option_clicked` | User clicks a rental option (daily/weekly/monthly/business) | `rental_type`, `source_page`, `locale` |

### 4. Navigation Interactions

| Event | Trigger | Parameters |
|---|---|---|
| `nav_menu_opened` | Mobile menu drawer opens | `source_page`, `locale` |
| `nav_item_clicked` | User clicks a nav item | `nav_item`, `source_page`, `locale` |
| `language_switched` | User clicks language switcher | `from_locale`, `to_locale`, `source_page` |

### 5. Search & Filter (Future — when search is implemented)

| Event | Trigger | Parameters |
|---|---|---|
| `search_submitted` | User submits vehicle search | `query`, `filters`, `locale` |
| `filter_applied` | User applies a filter | `filter_type`, `filter_value`, `locale` |
| `search_results_viewed` | Search results render | `result_count`, `query`, `locale` |

### 6. Form Interactions (When Forms Are Live)

| Event | Trigger | Parameters |
|---|---|---|
| `form_started` | User begins filling a form | `form_type`, `source_page`, `locale` |
| `form_abandoned` | User leaves form without submitting | `form_type`, `last_field`, `source_page`, `locale` |
| `form_submitted` | User submits a form | `form_type`, `source_page`, `locale` |
| `form_error` | Form validation error occurs | `form_type`, `error_field`, `error_type`, `locale` |

### 7. Rental Flow (Future — when booking is live)

| Event | Trigger | Parameters |
|---|---|---|
| `rental_dates_selected` | User selects rental dates | `start_date`, `end_date`, `duration_days`, `vehicle_id`, `locale` |
| `rental_location_selected` | User selects pickup location | `location_code` (MIA/FLL/PBI), `vehicle_id`, `locale` |
| `rental_quote_viewed` | Price quote is displayed | `vehicle_id`, `daily_rate`, `total`, `duration_days`, `locale` |
| `rental_requirements_started` | User begins driver verification | `vehicle_id`, `locale` |
| `rental_requirements_completed` | Driver verification complete | `vehicle_id`, `locale` |
| `rental_booking_initiated` | User clicks "Book Now" | `vehicle_id`, `total`, `duration_days`, `locale` |
| `rental_booking_confirmed` | Booking is confirmed by Wheelbase | `vehicle_id`, `reservation_id`, `total`, `locale` |
| `rental_booking_abandoned` | User leaves booking flow | `vehicle_id`, `step` (dates/location/quote/verify/confirm), `locale` |

### 8. External Referrals

| Event | Trigger | Parameters |
|---|---|---|
| `turo_referral` | User clicks Turo link on vehicle or rental page | `vehicle_id`, `source_page`, `locale` |

---

## Implementation

### Phase 1 (Cloudflare Web Analytics — no events)

Just the beacon script. No custom events. Automatic page view tracking only.

```html
<!-- In BaseLayout.astro <head> -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

The token is a Cloudflare Web Analytics token, created in the CF dashboard. Stored as an env var or hardcoded (it's a public token, not secret).

### Phase 2 (Custom Events — when GA4 is added)

Custom events are sent via `dataLayer.push()` or `gtag('event', ...)` depending on implementation.

```typescript
// src/lib/analytics.ts
export function trackEvent(name: string, params: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}
```

### Privacy & Compliance

- **No PII in events:** Never send email, phone, name, driver's license, or payment data in event parameters
- **Vehicle IDs are fine:** Internal vehicle IDs are not PII
- **Aggregate only:** All analytics are aggregate — no individual user tracking
- **Cookie consent:** Phase 1 (Cloudflare) needs no banner. Phase 2 (GA4) requires consent banner.
- **Do Not Track:** Respect `navigator.doNotTrack` header
- **Data retention:** Configure in analytics provider dashboard (default: 90 days for CF, 14 months for GA4)

---

## Key Metrics to Track (Dashboard)

| Metric | Source | Goal |
|---|---|---|
| Total page views | CF Analytics | Baseline traffic |
| Vehicle detail views (per vehicle) | Custom event | Fleet popularity |
| CTA click-through rate (home → vehicles) | Custom event | Home page effectiveness |
| Language switch rate | Custom event | Spanish demand |
| Turo referral clicks | Custom event | Turo pipeline value |
| Mobile vs desktop usage | CF Analytics | Device optimization |
| Top entry pages | CF Analytics | SEO performance |
| Bounce rate (home) | CF Analytics | Content quality |
| Airport page popularity (MIA vs FLL vs PBI) | Custom event | Location demand |
| Form conversion rate (when live) | Custom event | Lead quality |
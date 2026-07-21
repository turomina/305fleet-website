# 305Fleet × Wheelbase — Technical Discovery Report

**Date:** 2026-07-16  
**Status:** Discovery — no production changes  
**Sources:** widget-docs.wheelbasepro.com (official), docs.wheelbasepro.com (legacy), help.wheelbasepro.com, browser inspection of demo widget

---

## 1. Integration Paths Evaluated

Wheelbase offers **four integration tiers**, from zero-code to full widget composition:

### A. Standalone Shop (External Link)
- **What:** Hosted URL — `https://widget.wheelbasepro.com/?dealer_id=YOUR_ID&store_type=auto`
- **Pros:** Zero development. Works immediately. Supports all theming, locales, and filter params via URL query string.
- **Cons:** Off-domain. No native 305Fleet branding chrome. Checkout happens on `widget.wheelbasepro.com`. GA4 tracking is limited to what the widget attributes pass through (no custom events on the host domain).
- **Verdict:** Good as fallback/launch MVP. Not the premium experience Ian wants long-term.

### B. Embedded Storefront Widget (`<wheelbase-store>`)
- **What:** A single web component that renders the full rental experience (hero + filters + listings + detail + checkout) inline on your page.
- **Pros:** One `<script>` tag and one `<wheelbase-store>` element. Full theming via attributes. Can hide hero, filters, locale selector. Mobile responsive. Auto store type.
- **Cons:** Shadow DOM — you cannot override internal component CSS. The Wheelbase hero/branding inside the component is hidden via `hide-hero` but there's no way to inject 305Fleet's own hero into the widget's internal layout. Checkout flow opens inside (or new tab in iframe contexts).
- **Verdict:** Fastest way to get a functional booking page on 305fleet.com. Good for `/book/` page.

### C. Individual Widget Components
- **What:** Compose your own layout using `<wheelbase-rentals-list>` (grid only), `<listing-details>` (detail + booking), `<landing-widget>` (date picker).
- **Pros:** Maximum layout control. You build 305Fleet-branded chrome around the components. `onRentalClick` callback lets you intercept clicks and control navigation. `landing-widget` has a shadow-DOM `<slot name="footer">` for custom branding.
- **Cons:** More code. Must wire up rental click → detail view yourself. The `<listing-details>` component needs a `rental-id` prop, meaning you need to manage state (which rental is selected).
- **Verdict:** Best for premium integration. Can build a 305Fleet-branded `/book/` page with custom hero, the `landing-widget` date picker, and `wheelbase-rentals-list` grid, handing off to Wheelbase checkout.

### D. API Integration
- **What:** Direct REST API calls to Wheelbase servers.
- **Reality:** Wheelbase does **not** publish a public REST API for custom website booking. The API key at `dashboard.wheelbasepro.com/account/integrations` is for Zapier/workflow integrations only — see §2 below. The widget CDN script is the documented integration method.
- **Verdict:** Not available for custom booking UI. Do not invest time here.

### E. Hybrid: 305Fleet Search + Wheelbase Checkout
- **What:** Build a 305Fleet-branded search experience using the `landing-widget` + `wheelbase-rentals-list` components, then pass users into Wheelbase's checkout (either embedded `<listing-details>` or standalone shop URL with pre-filled dates).
- **Pros:** Premium branded front end. Checkout security/PCI handled by Wheelbase. No API key exposure.
- **Cons:** Checkout UX is Wheelbase's, not 305Fleet's. Renter verification, insurance selection, e-signature, and payment are inside Wheelbase's flow.
- **Verdict:** **Recommended first path.** This is the sweet spot.

---

## 2. API Key Analysis

### What the `Account > Integrations` API Key Is
Based on the Wheelbase Help Center ("What is Zapier?" article), the API key section in the dashboard is connected to **Zapier integration workflows**. The help article states:

> "In Wheelbase click the CREATE ZAPIER ACCOUNT button in your Account Settings > API Keys."

This strongly suggests the API key is for:
- Zapier triggers/actions (new booking → CRM, email automation, etc.)
- Webhook-based integrations
- **Not** for custom website booking UI

### What the Widget Uses Instead
The widget uses a **`dealer-id`** (a public numeric identifier) — not an API key. It's passed as an HTML attribute:

```html
<wheelbase-store dealer-id="YOUR_DEALER_ID"></wheelbase-store>
```

The `dealer-id` is embedded in the widget's internal API calls but is **not a secret** — it's analogous to a public storefront ID. All actual booking, payment, and verification logic runs through Wheelbase's servers via the widget.

### Recommendation
- **Do not** put the API key in any front-end code (already confirmed — it's not needed for the widget)
- **Do** confirm with Wheelbase whether there is a server-side REST API for availability queries (unlikely based on docs, but worth asking)
- Any server-side integration (webhooks, booking notifications) should use Cloudflare Functions/Workers, with the API key stored in environment variables

---

## 3. Widget Capability Assessment

### Theming — ✅ Good
All components accept these attributes:
- `primary-color` (default: #212831)
- `secondary-color` (default: #4F5B69)
- `text-color` (default: #1F2937)
- `text-secondary-color` (default: #6B7280)
- `surface-color` (default: #FFFFFF)

305Fleet brand mapping:
| Wheelbase Attribute | 305Fleet Value |
|---|---|
| `primary-color` | `#EA5E2D` (accent orange) |
| `secondary-color` | `#314B6E` (navy) |
| `text-color` | `#0D141C` (near-black) |
| `text-secondary-color` | `#58585A` (grey) |
| `surface-color` | `#F4FBFE` (light tint) |

**Limitation:** These are the only color knobs. You cannot style individual component internals (card borders, font sizes, spacing, typography). Shadow DOM prevents external CSS from penetrating.

### Hero/Branding — ⚠️ Limited
- `hide-hero="true"` removes the Wheelbase hero entirely.
- The `landing-widget` supports `<slot name="footer">` for custom branding in the date picker.
- The `wheelbase-rentals-list` and `listing-details` components have no slot system for custom chrome injection.
- **Bottom line:** Hide Wheelbase's hero, build your own above the widget.

### Mobile Behavior — ✅ Good
- Mobile-first responsive design per docs.
- Viewport meta tag required (already present in 305Fleet BaseLayout).
- Set `width: 100%` on the host element for full-width behavior.

### Shadow DOM / Styling Limits
- All components use Shadow DOM (`#shadow-root`).
- External CSS cannot style internal elements except through the provided theming attributes.
- Font: Widget loads Inter from Google Fonts. Falls back to host page font if CSP blocks it. A `no-default-font` attribute is tracked for future release (per docs).
- **Action:** Ensure CSP allows `fonts.googleapis.com` and `fonts.gstatic.com`, or accept the Inter typeface mismatch.

### Query Parameters (Standalone Shop)
The standalone URL supports extensive query parameters:
- `dealer_id`, `store_type`, `locale`
- `primary_color`, `secondary_color`, `text_color`, `text_secondary_color`, `surface_color`
- `hide_filters`, `hide_hero`, `hide_locale_selector`, `show_reviews`
- `visible_filters`, `visible_nested_filters`

The `landing-widget` passes `pickup` and `return` dates as query params to a target URL:
```
https://yoursite.com/book?pickup=2026-07-12&return=2026-07-18
```
Note: `<wheelbase-store>` does **not** auto-consume these query parameters today. You'd need to read them in your page code.

### Availability Search
- The store component includes a built-in date + location search bar.
- Can be pre-filtered by location using `locations="ID1,ID2"` attribute.
- `visible-filters` and `visible-nested-filters` control which filter pills/modals appear.
- Auto store nested filters: price, guests, vehicle_type, make_model, year, transmission, fuel, drivers_age.

### Checkout Handoff
- In embedded mode, checkout opens within the widget flow.
- In iframe contexts (Wix/Squarespace), checkout opens in new tab.
- No documented way to redirect checkout to a custom URL.

---

## 4. Architecture for Astro + Cloudflare Pages

### Script Loading Strategy

**Best practice: Lazy-load on `/book/` only.**

```astro
// src/pages/book.astro — new page
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Book a Vehicle" description="...">
  <main>
    <!-- 305Fleet-branded hero, trust elements, etc. -->

    <div id="wheelbase-root">
      <wheelbase-store
        dealer-id="YOUR_DEALER_ID"
        store-type="auto"
        hide-hero="true"
        hide-locale-selector="false"
        primary-color="#EA5E2D"
        secondary-color="#314B6E"
        text-color="#0D141C"
        text-secondary-color="#58585A"
        surface-color="#F4FBFE"
        locale="en-us"
      ></wheelbase-store>
    </div>
  </main>
</BaseLayout>

<script>
  // Lazy-load the widget script only on this page
  import("https://d2toxav8qvoos4.cloudfront.net/latest/wheelbase-widget.js");
</script>
```

### Why This Works
- **No impact on homepage:** The widget script (~100-200KB) loads only on `/book/`.
- **Dynamic import:** `import()` is a module expression. The script is fetched asynchronously. The web component registers itself when the module executes.
- **No SSR issues:** The `<wheelbase-store>` custom element is rendered as an unknown HTML element during Astro's static build, then hydrated client-side when the script loads. Astro will not throw errors for unknown custom elements.
- **No API keys in client code:** Only `dealer-id` (public) is exposed.

### Progressive Enhancement Path

For the premium hybrid integration (recommended), the architecture would be:

```
/book/ (Astro page)
  ├── 305Fleet hero section (custom, branded)
  ├── <landing-widget> date picker (Wheelbase)
  │     └── slot="footer" → 305Fleet trust badges
  ├── <wheelbase-rentals-list> grid (Wheelbase)
  │     └── onRentalClick → navigate to /book/[rental-id]/
  └── /book/[rental-id]/ (detail page)
        ├── 305Fleet chrome (back link, vehicle summary)
        └── <listing-details> booking flow (Wheelbase)
```

### GA4 Tracking
- The widget supports `google-analytics-id`, `google-tag-manager-id`, and `segment-token` attributes.
- These pass your measurement IDs into the widget's internal analytics calls.
- **Boundary:** Widget-managed GA4 tracks rental browsing behavior (views, clicks, filter usage). Renter PII (name, email, payment) stays inside Wheelbase's checkout and is **not** passed to your GA4 property through the widget.
- For custom GA4 events (page views on `/book/`, custom conversion goals), use your existing GA4 component in BaseLayout — no changes needed.

### Server-Side Only (If Needed)
If Wheelbase offers a server-side API in the future:
- Use Cloudflare Functions (`/functions/`) for API proxying
- Store API keys in Cloudflare Pages environment variables or 1Password → injected at build
- Never expose API keys in client bundles

---

## 5. Recommended First Integration Path

### **Path: Embedded Widget with Branded Chrome (Hybrid B/C)**

**Why:** Fastest to launch. Premium branded. No API key exposure. Full Wheelbase checkout/PCI compliance. Lower dev risk than building custom search.

**What it looks like:**
1. Create `/book/` page on 305fleet.com
2. Add 305Fleet-branded hero with trust messaging ("Direct booking, verified fleet, contactless pickup")
3. Lazy-load `wheelbase-widget.js`
4. Embed `<wheelbase-store>` with `hide-hero="true"`, 305Fleet colors, `store-type="auto"`
5. Optionally lock to MIA/FLL/PBI locations if Wheelbase location IDs are known
6. Add ES variant at `/es/book/` with `locale="es-es"`

**What users experience:**
- 305Fleet brand throughout
- Date + location search inside widget
- Vehicle grid with filters (type, price, make/model, year, transmission, fuel, driver's age)
- Click vehicle → detail view with photos, specs, pricing
- Checkout: dates, renter info, insurance/protection selection, payment, e-signature
- All booking workflow handled by Wheelbase

---

## 6. Minimal Proof-of-Concept Plan

### Phase 0 — Verification (Ian + Nik together)
1. Ian obtains the 305Fleet `dealer_id` from Wheelbase (likely in onboarding email or dashboard)
2. Ian configures vehicles in Wheelbase dashboard
3. Nik tests standalone URL: `https://widget.wheelbasepro.com/?dealer_id=XXXXX&store_type=auto`
4. Screenshot review — verify vehicles, pricing, availability display correctly
5. Identify which Wheelbase location IDs correspond to MIA, FLL, PBI

### Phase 1 — `/book/` Page (Staging Only)
1. Create `src/pages/book.astro` with lazy-loaded widget
2. Apply 305Fleet brand colors
3. Test on local dev server
4. Screenshot at desktop + mobile viewports
5. **No deploy to production**

### Phase 2 — Ian Review
1. Review widget theming quality
2. Verify checkout flow works end-to-end
3. Decide: stick with `<wheelbase-store>` or graduate to component composition
4. Approve production deployment

---

## 7. Risks & Unknowns

| Risk | Severity | Mitigation |
|---|---|---|
| **dealer_id not yet provisioned** | HIGH | Ian must confirm Wheelbase onboarding is complete |
| **Widget loads Inter font from Google Fonts** | LOW | Non-breaking — falls back to host font. CSP may need update. |
| **No control over checkout UX** | MEDIUM | Acceptable tradeoff — Wheelbase owns PCI/verification |
| **Shadow DOM limits deep styling** | LOW | Theming attributes cover 80%+ of branding needs |
| **`locations` attribute needs Wheelbase IDs** | LOW | Must map MIA/FLL/PBI to Wheelbase internal IDs |
| **No server-side API for availability** | MEDIUM | Blocks custom search UI. Widget-only approach is viable. |
| **Widget versioning — `latest` CDN path** | LOW | Auto-updates. Pin to version if stability concern arises. |
| **Spanish locale is `es-es` not `es-mx`** | LOW | European Spanish — check if Latin American Spanish is needed |
| **Vehicle nicknames in Wheelbase may appear in widget** | MEDIUM | Must use public-facing vehicle names in Wheelbase, not internal nicknames (Kong, Tokyo, Ikea, Mama) |
| **Widget loads from CloudFront CDN** | LOW | Confirm CDN availability; CSP may need `d2toxav8qvoos4.cloudfront.net` |

---

## 8. Questions for Wheelbase

These should be asked before implementation:

1. **API Key Purpose:** Is the API key at `Account > Integrations` only for Zapier/workflow integrations, or does it also support a REST API for programmatic availability queries?

2. **Location IDs:** What are the Wheelbase location IDs for MIA, FLL, and PBI? Can we create location records that correspond to specific airport parking garages?

3. **Vehicle Names:** Can the public-facing vehicle name in the widget differ from the internal fleet name? We must not expose nicknames (Kong, Tokyo, etc.) to customers.

4. **Checkout Domain:** Is there a way to host checkout on a custom subdomain (e.g., `book.305fleet.com`)? Or is it always on `widget.wheelbasepro.com`?

5. **Webhook/Callback for Completed Bookings:** Is there a server-side webhook or callback when a booking is completed? We'd want to trigger confirmation workflows, CRM updates, and analytics events.

6. **Spanish Locale:** Is Latin American Spanish supported, or only European Spanish (`es-es`)? Our market is South Florida (heavy Caribbean/Latin American Spanish).

7. **Google Fonts Opt-Out:** Is the `no-default-font` attribute available yet? Our brand doesn't use Inter.

8. **Custom Checkout Redirect:** Can we redirect to a custom "Thank You" page on 305fleet.com after booking completion?

9. **Pricing Display:** Does the widget show total pricing (including taxes/fees) or daily base rate only? We need transparent pricing.

10. **Airport Parking Fee Disclosure:** Can we inject custom notes about parking fee responsibility? The widget may not surface this.

11. **Multi-Language:** Can we serve EN and ES variants of the same dealer's fleet? Is locale switching supported on a single page?

---

## 9. Proposed Implementation Phases

| Phase | Scope | Risk |
|---|---|---|
| **0 — Verification** | Ian confirms dealer ID, vehicle setup. Nik tests standalone URL. | Low |
| **1 — /book/ Page (Staging)** | Create Astro page with embedded `<wheelbase-store>`. Theming. Screenshots. | Low |
| **2 — Ian Review** | Full walkthrough. Decision on widget vs. component path. | Low |
| **3 — Production Deploy** | Deploy `/book/` to 305fleet.com. Update homepage CTAs from "Book on Turo" to "Book Now → /book/". | Medium |
| **4 — ES Variant** | `/es/book/` with `locale="es-es"`. Update ES homepage CTAs. | Low |
| **5 — Component Upgrade** | Replace `<wheelbase-store>` with `<landing-widget>` + `<wheelbase-rentals-list>` + `<listing-details>` for premium branded experience. | Medium |
| **6 — Server Integration** | If API/webhooks become available: booking confirmations, CRM sync, GA4 conversion events. | High |
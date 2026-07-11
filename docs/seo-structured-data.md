# 305 Fleet — SEO Structured Data Strategy

**Version:** 1.0
**Date:** 2026-07-10
**Status:** Foundation implemented; Vehicle schema prepared but not attached to placeholder

---

## Components Created

| Component | Location | Renders | Status |
|---|---|---|---|
| `OrganizationJsonLd.astro` | `src/components/seo/` | Organization schema on all pages via BaseLayout | ✅ Active |
| `WebSiteJsonLd.astro` | `src/components/seo/` | WebSite schema on all pages via BaseLayout | ✅ Active |
| `BreadcrumbJsonLd.astro` | `src/components/seo/` | BreadcrumbList — pass crumbs as props | ✅ Ready (not yet used) |
| `FaqJsonLd.astro` | `src/components/seo/` | FAQPage — pass FAQs as props | ✅ Ready (not yet used) |
| `VehicleJsonLd.astro` | `src/components/seo/` | Vehicle — pass verified vehicle data as props | ✅ Ready (NOT attached to placeholder) |

---

## Schema Strategy

### Organization (Active)

Renders on every page via BaseLayout. Contains only verified information:
- Name: 305 Fleet
- Legal name: Turomina LLC dba 305Fleet
- Description: verified marketing description
- Area served: Miami, Fort Lauderdale, Palm Beach

**Not included (not yet verified):**
- Telephone — Ian has not provided the public phone number
- Address — business address not confirmed for public listing
- Logo URL — will add when production domain is confirmed
- Aggregate rating — no verified review data
- Same-as social profiles — no confirmed profiles

### WebSite (Active)

Renders on every page via BaseLayout. Minimal:
- Name: 305 Fleet
- URL: production domain

**Not included:**
- SearchAction — site search is not functional

### BreadcrumbList (Ready)

Component is built. Will be added to inner pages when breadcrumbs are implemented in the UI. Currently no pages render breadcrumb navigation.

### FAQPage (Ready)

Component is built. Will be added to the FAQ page when visible FAQ content is written. The component requires that FAQs on the page match the structured data exactly.

**Rule:** FAQPage schema must only appear on pages where the same questions and answers are visibly rendered. Never generate FAQ schema for FAQs that don't exist on the page.

### Vehicle (Ready — Not Attached)

Component is fully built but NOT attached to any page. It will be attached to `/vehicles/[slug].astro` only when:
1. Real vehicle data is available from Airtable
2. The vehicle record has been verified (not a placeholder)
3. `publication_status === "published"`

**Required fields for a real vehicle:**
- name, manufacturer, model, vehicleModelDate, url

**Conditional fields (only with verified data):**
- `offers` — only with verified pricing from Wheelbase or approved manual pricing
- `aggregateRating` — only with verified review data from Turo or direct reviews
- `availability` — only with live Wheelbase inventory status
- `image` — only with real vehicle photography

**Fields that must NEVER be invented:**
- `stockNumber` — not a real stock number
- `VIN` — never expose VIN in structured data
- `vehicleIdentificationNumber` — same as VIN

---

## Prohibited Structured Data

The following must NEVER appear in 305 Fleet structured data:

| Field | Reason |
|---|---|
| Invented prices | Pricing must come from Wheelbase or approved manual pricing |
| Fake availability | Availability must come from Wheelbase live inventory |
| Fake review ratings | Ratings must come from verified Turo or direct customer reviews |
| Unsupported aggregate ratings | Must have real review count and average |
| Offers without verified pricing | Offers require real pricing data |
| Stock numbers | Not confirmed; not applicable to fleet rental |
| VIN in public schema | Security risk; not for public structured data |

---

## Implementation Location

All JSON-LD components are in `src/components/seo/`. The Organization and WebSite schemas are injected via BaseLayout. Other schemas are imported and rendered by individual pages when applicable.

## Validation

Structured data should be validated using:
1. Google Rich Results Test (https://search.google.com/test/rich-results)
2. Schema.org validator (https://validator.schema.org/)
3. Google Search Console structured data report

Validation should be performed after preview deployment and before production launch.
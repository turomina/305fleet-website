# 305 Fleet — Data Ownership Matrix

**Version:** 1.0
**Date:** 2026-07-10
**Status:** Draft — Pending Airtable verification

---

## Purpose

This matrix defines which system owns every material data field used by the website. It prevents conflicts between Airtable, Wheelbase, Turo, and the website, and ensures the right source is authoritative for each type of information.

---

## Ownership Key

| System | Role | Authority Scope |
|---|---|---|
| **Airtable** | Marketing & content source | Non-transactional vehicle data: descriptions, photos, features, SEO content, publication flags |
| **Wheelbase** | Transactional backend | Live availability, prices, deposits, insurance, driver verification, reservations, payments, agreements |
| **Turo** | Third-party booking channel | Turo-originated reservations, Turo-specific pricing/policies |
| **Google Calendar** | Integration bridge | Calendar sync, operational visibility, staff coordination |
| **Website** | Customer-facing presentation | Brand presentation, UX, search, navigation, composed pages, analytics |

---

## Data Element Ownership

| # | Data Element | System of Record | Website Display Source | Editable By | Public? | Sync Method | Conflict Resolution |
|---|---|---|---|---|---|---|---|
| **Vehicle Identity** |
| 1 | Vehicle internal ID | Airtable | Airtable → build-time JSON | Ian, Nik | No | Build-time fetch | Airtable is authoritative until Wheelbase has vehicle records |
| 2 | Year | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Verify against VIN/manufacturer specs |
| 3 | Make | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Manufacturer official |
| 4 | Model | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Manufacturer official |
| 5 | Trim | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Verify against VIN |
| 6 | Exterior color | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Real vehicle verification |
| 7 | Interior color | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Real vehicle verification |
| 8 | VIN | Internal (not in any frontend system) | Never displayed | Ian | **No** | N/A | Not stored in Airtable or website |
| 9 | License plate | Internal (not in any frontend system) | Never displayed | Ian | **No** | N/A | Not stored in Airtable or website |

| **Vehicle Content** |
| 10 | Public vehicle name | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Airtable is authoritative |
| 11 | Description (English) | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Written in 305 Fleet brand voice |
| 12 | Description (Spanish) | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Professional translation required |
| 13 | Tagline / one-liner | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | SEO-optimized |
| 14 | Passenger capacity | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Verify manufacturer specs |
| 15 | Luggage capacity | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Internal estimate; clearly marked as guidance |
| 16 | Fuel type | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Manufacturer official |
| 17 | EV range | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | EPA estimate; update note |
| 18 | Key features | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Highlight trim-specific features |
| 19 | Best use cases | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Marketing judgment |
| 20 | SEO title | Airtable | Airtable → build-time JSON | Nik | Yes | Build-time fetch | Generated from vehicle identity |
| 21 | SEO description | Airtable | Airtable → build-time JSON | Nik | Yes | Build-time fetch | Generated from vehicle content |

| **Vehicle Photography** |
| 22 | Hero photo | Airtable | Airtable → build-time processed | Ian, Nik | Yes (approved only) | Build-time fetch + copy to public/ | Only approved photos displayed |
| 23 | Gallery photos | Airtable | Airtable → build-time processed | Ian, Nik | Yes (approved only) | Build-time fetch | Real vehicle photos only; no stock |
| 24 | Photo credit / source | Airtable | Internal metadata only | Ian, Nik | Internal | Build-time fetch | Internal audit trail |

| **Listing & External References** |
| 25 | Turo listing URL | Airtable | Airtable → build-time JSON | Ian, Nik | Yes | Build-time fetch | Source for spear phishing; display as link |
| 26 | Wheelbase vehicle ID | Wheelbase | Wheelbase API (future) | Wheelbase | No (internal) | API sync when available | Wheelbase is authoritative; do not set manually |
| 27 | Public visibility status | Airtable | Airtable → build-time JSON | Ian, Nik | Internal flag | Build-time fetch | Controls whether vehicle appears on website |
| 28 | Verification status | Airtable | Internal metadata only | Ian, Nik | No | Build-time fetch | Internal quality control |

| **Pricing (Marketing Display)** |
| 29 | Price display (daily) | Wheelbase | Wheelbase API | Wheelbase | Yes | API → display only | ⚠️ **Conflict risk:** Airtable may have price_display field — must NOT duplicate or override Wheelbase once live |
| 30 | Price display (weekly) | Wheelbase | Wheelbase API | Wheelbase | Yes | API → display only | Same as above |
| 31 | Price display (monthly) | Wheelbase | Wheelbase API | Wheelbase | Yes | API → display only | Same as above |
| 32 | Mileage allowance display | Wheelbase | Wheelbase API | Wheelbase | Yes | API → display only | Display only; actual policy from Wheelbase |

| **Live Transactional Data** |
| 33 | Live availability | **Wheelbase** | Wheelbase API (future) | Wheelbase | Yes (real-time) | API call | ⚠️ **Never duplicate in Airtable.** Airtable is NOT the availability authority. |
| 34 | Rental price (actual) | **Wheelbase** | Wheelbase API (future) | Wheelbase | Yes (quote time) | API calculation | Airtable may show "from" display price; Wheelbase price is binding |
| 35 | Taxes and fees | **Wheelbase** | Wheelbase API (future) | Wheelbase | Yes (quote time) | API calculation | Not duplicable in Airtable |
| 36 | Deposit amount | **Wheelbase** | Wheelbase API (future) | Wheelbase | Yes (quote time) | API calculation | May vary by vehicle, renter, insurance selection |
| 37 | Insurance options | **Wheelbase** | Wheelbase API (future) | Wheelbase | Yes (quote time) | API offering | Never duplicate or reinterpret in Airtable or website |
| 38 | Driver verification | **Wheelbase** | Wheelbase API (future) | Wheelbase | No | API processing | Privacy-sensitive; no PII in website layer |
| 39 | Payment processing | **Wheelbase** | Wheelbase API (future) | Wheelbase | No | API processing | PCI-scoped to Wheelbase |
| 40 | Rental agreement | **Wheelbase** | Wheelbase API (future) | Wheelbase | Yes (signed) | API generation | Signed agreement stored in Wheelbase |
| 41 | Direct-booking status | **Wheelbase** | Wheelbase API (future) | Wheelbase | Yes (self-serve) | API status | Reservation-confirmed only when Wheelbase confirms |
| 42 | Payment status | **Wheelbase** | Wheelbase API (future) | Wheelbase | Limited | API status | Never expose raw payment details |

| **Turo Data** |
| 43 | Turo booking status | **Turo** | Not displayed | Turo | No (per-policy) | Calendar sync (future) | Turo authoritative for its own bookings |
| 44 | Turo pricing | **Turo** | Not displayed (internal reference) | Turo | No | N/A | Different pricing model; not comparable to direct |
| 45 | Turo block on calendar | Google Calendar (sync) | Not displayed directly | Turo → Calendar | No | Sync via approved workflow | Must prevent double-booking |

| **Operational Data** |
| 46 | Maintenance block | Google Calendar / Wheelbase | Not displayed | Ian, staff | No | Calendar sync | Visible in staff operational view only |
| 47 | Cleaning / readiness status | Internal operational tool | Not displayed | Ian, staff | No | Internal workflow | Not customer-facing |
| 48 | Vehicle location | Internal / GPS (future) | Not displayed | Ian, staff | No | Internal tracking | Privacy-sensitive |

| **Website Metadata** |
| 49 | OG image / social card | Website-generated | Derived from brand assets | Nik | Yes | Static file | Generated from circular logo |
| 50 | Analytics events | Website → Cloudflare Analytics | N/A | Nik | Aggregate only | Client-side events | No PII in analytics |
| 51 | Site metadata | Website / Astro config | Static rendering | Nik | Yes | Source-controlled | In astro.config.mjs + page frontmatter |

---

## Ownership Principles

1. **System of record is authoritative.** Do not override Wheelbase transactional data with Airtable-managed display values.

2. **Display is not authority.** The website may show a "from $XX/day" marketing price derived from Airtable, but the actual quote price from Wheelbase is binding.

3. **Don't duplicate what you can link.** The Turo URL lives in Airtable and is displayed as a link — the website does not copy Turo's content.

4. **Flag conflicts.** If Airtable and Wheelbase disagree on pricing terms (mileage, deposit, insurance), the website should not render both. Wheelbase wins for transactional terms.

5. **Preview and production use the same data source.** Airtable builds to JSON for both preview and production builds. The difference is production vehicles have `visibility: published` and preview vehicles may include `visibility: preview_only`.

6. **Protect PII.** No customer information, driver's license data, payment data, or insurance details ever enter Airtable or the website build pipeline.

---

## Unresolved Ownership Issues (Flagged for Jon)

| Issue | Description | Current Assumption |
|---|---|---|
| Wheelbase vehicle ID mapping | How do we link Airtable records to Wheelbase vehicle IDs when Wheelbase has them? | Manual mapping column in Airtable; set once during Wheelbase onboarding |
| Airtable pricing fields | If Airtable has price_display fields, they could conflict with Wheelbase live prices | Either remove pricing from Airtable once Wheelbase is active, or clearly label as "from" display |
| Turo calendar sync | Who owns the Turo → Google Calendar sync pipeline? | Jon; calendar sync is technical infrastructure |
| Vehicle photo storage | Where are vehicle photos stored — Airtable attachments, Cloudflare Images, or a CDN folder? | Default to Airtable attachments synced to `public/images/vehicles/` during build |
| Availability truth during transition | Between Airtable-powered display and Wheelbase-live-availability, who shows availability? | Airtable shows "check availability" as a call to action; Wheelbase shows actual live calendar |

---

## Next Steps When Wheelbase Goes Live

1. Remove duplicate pricing fields from Airtable (or mark as display-only)
2. Replace Airtable-sourced availability form CTA with Wheelbase widget or API call
3. Verify no Airtable data is being presented as real-time transactional data
4. Add ownership notes to each field in Airtable's schema
5. Test every field for display/transaction conflict before production
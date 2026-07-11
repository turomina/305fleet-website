# Turo Listing Reconciliation — 305 Fleet

**Date:** 2026-07-10
**Status:** BLOCKED — no Turo URLs in Airtable

---

## Current State

The Airtable Vehicles table (`tblf0sxMz7ErJZnSr`) does not have a Turo URL field. No Turo listing URLs are stored in any existing field across the 7 vehicle records.

## Blockers

| Blocker | Impact | Resolution |
|---|---|---|
| No `Turo URL` field in Airtable schema | Cannot reconcile listings | Ian needs to provide Turo URLs or add field to Airtable |
| No `Trim` field in Airtable | Cannot verify trim vs. Turo | Ian needs to provide trim data |
| No photos in Airtable | Cannot compare visuals | Ian needs to provide vehicle photos |

## Reconciliation Plan (When URLs Available)

For each vehicle with a Turo URL:

1. **Review the listing** — visit the Turo page, note vehicle facts presented
2. **Compare with Airtable** — verify Year, Make, Model, Color, Fuel Type match
3. **Extract reusable factual information** — passenger capacity, luggage space, features
4. **Flag conflicts** — any discrepancy between Airtable and Turo listing
5. **Separate Turo-specific rules** — Turo insurance, Turo mileage limits, Turo delivery zones vs. future direct-rental rules
6. **Rewrite descriptions in 305 Fleet voice** — do not copy Turo listing text directly
7. **Populate `turo_url` field** in vehicles.json for cross-linking

## Turo-Specific vs. Direct-Rental Rules

| Concern | Turo | 305Fleet.com Direct |
|---|---|---|
| Insurance | Turo provides | Will need separate policy (not started) |
| Mileage limits | Set per Turo listing | TBD — do not copy Turo limits |
| Delivery zones | Set in Turo listing | MIA, FLL, PBI (website states this) |
| Pricing | Turo dynamic pricing | Do not copy — direct pricing TBD |
| Driver verification | Turo handles | Will need Wheelbase or manual (not started) |
| Reviews | Turo review system | Website reviews will be separate |

## Vehicle Turo URL Status

| Vehicle | Turo URL | Status |
|---|---|---|
| Kong (2025 Cadillac Escalade ESV) | — | Missing |
| Vader (2021 Toyota Highlander Hybrid) | — | Missing |
| Tokyo (2024 Audi Q4 e-tron) | — | Missing |
| Mosca (2021 Audi Q3) | — | Missing |
| Varela (2025 Mitsubishi Outlander PHEV) | — | Missing |
| Ikea (2025 Volvo XC90 T8 PHEV) | — | Missing |
| Mama (2026 Mercedes GLC300) | — | Missing |

## Next Steps

1. Ian provides Turo listing URLs for each vehicle
2. Add `Turo URL` field to Airtable Vehicles table
3. Run reconciliation for each vehicle
4. Populate vehicles.json `turo_url` field
5. Write 305 Fleet voice descriptions based on verified facts

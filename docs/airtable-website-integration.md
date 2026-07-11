# 305 Fleet — Airtable-to-Website Integration Architecture

**Version:** 1.0
**Date:** 2026-07-10
**Status:** Draft — Approved Architecture from Jon

---

## Architecture Decision

**Build-time synchronization** — approved by Jon for Phase 1.

A script runs during `npm run build` that:
1. Fetches approved vehicle records from Airtable via the Airtable API
2. Writes them to `src/data/vehicles.json`
3. Astro renders the JSON into static vehicle pages

**Future Phase 2 (when Wheelbase is active):** Add Pages Function proxy for live availability/pricing data.

---

## Why Build-Time Sync

| Requirement | How Build-Time Sync Meets It |
|---|---|
| Credentials stay out of frontend | API key only in build env vars on Cloudflare |
| Retrieve only approved fields | Script selects specific fields from Airtable |
| Exclude internal/sensitive fields | Script filters out non-public fields |
| Validate record structure | Script validates against expected schema |
| Handle missing values | Script defaults or skips records with missing required fields |
| Log sync failures | Script writes to build log; fails build on critical errors |
| Don't break site on Airtable outage | If sync fails, use last successful JSON (committed in repo) |
| Support preview and production separately | Same build process; `visibility` field controls publication |
| Allow eventual Wheelbase reconciliation | Vehicle ID column maps Airtable to Wheelbase records |
| Don't make Airtable a live reservation authority | All availability/pricing is static display only; no transactional claims |

---

## Data Flow

```
Airtable (Vehicles base)
    │
    │  API call (read-only, PAT in build env vars)
    ▼
Build Script (src/scripts/sync-vehicles.ts or .js)
    │
    │  Validates, transforms, filters
    ▼
src/data/vehicles.json ← committed to repo
    │
    │  Astro imports at build time
    ▼
Static HTML pages (rendered at npm run build)
    │
    ▼
Cloudflare Pages (deployed dist/)
```

## Security

| Concern | Mitigation |
|---|---|
| Airtable PAT in frontend | **Never.** PAT is set as Cloudflare Pages environment variable (production + preview). Only available during build. |
| PAT in source code | **Never.** Env vars only. `.env.example` documents the variable name without the value. |
| PAT in build logs | Script must not log the PAT. Use `[REDACTED]` in log messages. |
| PAT scope | Minimum: `data.records:read`, `schema.bases:read` for the Vehicles base only. |
| Vehicle data exposure | Script only retrieves fields with `"public": true` in the schema mapping. |
| Commit of stale data | `vehicles.json` is committed as fallback. Build environment may have newer data. |

## Error Handling

| Scenario | Behavior |
|---|---|
| Airtable API unreachable | Build uses last committed `vehicles.json`. Warning in build log. Build continues. |
| Missing required field on a record | That record is skipped with a warning. Build continues. Other records render. |
| All records fail validation | Build fails with clear error. Developer fixes and rebuilds. |
| Invalid field value | Field is nulled with a warning. Record renders with remaining data. |
| Schema mismatch (new/renamed fields) | Script validates against expected field list; logs unrecognized fields for review. |

## Implementation Plan

### Files to Create

| File | Purpose |
|---|---|
| `src/scripts/sync-vehicles.mjs` | Build-time sync script (Node.js, runs at build start) |
| `src/config/vehicle-schema.ts` | Schema mapping: Airtable field → website field, public/internal flag, default values |
| `src/data/vehicles.json` | Committed output file. Fallback when API is unavailable. |
| `src/config/airtable.ts` | Airtable base ID, table ID, field mapping constants |

### Airtable Fields to Sync

**Public fields** (appear on website):
- Vehicle name, year, make, model, trim
- Exterior and interior color
- Passenger capacity
- Fuel type
- Key features (multi-select)
- Turo URL
- Description (English)
- Description (Spanish) — if available
- Hero photo (attachment URL)
- Gallery photos (attachment URLs)
- Price display (daily, weekly, monthly) — "from" marketing display only
- Publication status
- Best use cases (multi-select)

**Internal fields** (NOT synced to website):
- VIN
- Purchase price
- Maintenance records
- License plate
- Insurance policy details
- Owner contact info
- Internal notes
- Cost basis

### Astro Integration

```astro
---
// src/pages/vehicles/index.astro
import { getCollection } from 'astro:content';
---

<!-- Or use vehicles.json directly -->
```

Alternatively, since the data is a flat JSON file:

```astro
---
// src/pages/vehicles/[slug].astro
import vehicles from '../../data/vehicles.json';

export async function getStaticPaths() {
  return vehicles
    .filter(v => v.public_visibility === 'published')
    .map(v => ({
      params: { slug: v.slug },
      props: { vehicle: v },
    }));
}
---
```

## Env Vars Required

| Variable | Value | Source | Used By |
|---|---|---|---|
| `AIRTABLE_PAT` | Personal access token | 1Password (Ian creates) | Build script |
| `AIRTABLE_BASE_ID` | Base ID for Vehicles | Ian after base creation | Build script |
| `AIRTABLE_TABLE_ID` | Table ID for vehicles | Ian after base creation | Build script |

## Transition to Wheelbase

When Wheelbase goes live:
1. Pricing, availability, and booking fields are no longer sourced from Airtable
2. Airtable continues to serve vehicle identity, descriptions, photos, and SEO content
3. The sync script is updated to exclude Airtable fields that Wheelbase now owns
4. A Pages Function proxy is added for Wheelbase API calls (live availability, pricing)
5. The build-time sync continues for marketing content; runtime API calls supplement for live data

## Pre-Requisites

Before the build-time sync can be implemented:

1. [ ] Airtable `305Fleet Vehicles` base exists and is accessible
2. [ ] Airtable PAT created scoped to that base (Ian action)
3. [ ] PAT stored in 1Password (Ian action)
4. [ ] Table schema finalized (Nik designs, Ian/I create in Airtable)
5. [ ] Field names consistent between Airtable and the sync script mapping
6. [ ] Vehicle records populated with at least test data
7. [ ] Photo attachments follow a consistent naming pattern

Until these pre-requisites are met, vehicle data will be manually authored in `src/data/vehicles.json` for the preview site.
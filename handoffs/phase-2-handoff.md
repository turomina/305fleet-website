# 305 Fleet Website — Phase 2 Handoff

**Date:** 2026-07-10
**Prepared by:** Nik (305Fleet Marketing Agent)
**Phase:** 2 — Domain, Cloudflare Preview, Airtable Integration, and Content Population
**Status:** In Progress — Documentation Complete, Infrastructure Blocked on Ian

---

## Summary

Phase 2 documentation and architecture work is complete. The project is blocked on three Ian actions (GitHub repo, CF token, Airtable PAT) for preview deployment and fleet content population. All non-blocked work is done.

---

## Completed This Phase

### Documentation (3 new files)

| Document | Content |
|---|---|
| `docs/data-ownership-matrix.md` | 51 data elements across 5 systems, authority mapping, conflict resolution |
| `docs/domain-cloudflare-plan.md` | Full DNS audit (Jon), two migration options, rollback plan |
| `docs/airtable-website-integration.md` | Build-time sync architecture, error handling, security, transition to Wheelbase |

### Derived Brand Assets (11 files in `public/images/brand/`)

All sourced from originals in `brand assets/` — originals preserved unmodified.

| File | Dimensions | Use |
|---|---|---|
| `header-logo.png` | 200×200 | Header (light backgrounds) |
| `footer-logo.png` | 150×150 | Footer (inverted for dark bg) |
| `mobile-logo.png` | 140×140 | Mobile nav |
| `favicon-16.png` | 16×16 | Browser tab |
| `favicon-32.png` | 32×32 | Browser tab (primary) |
| `favicon-64.png` | 64×64 | Browser tab |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `icon-192.png` | 192×192 | Web app manifest |
| `icon-512.png` | 512×512 | Web app manifest |
| `social-card.png` | 1200×630 | Open Graph sharing |
| `icon-mark.png` | 200×200 | Generic reuse |

### Vehicle Content Architecture

- JSON data source at `src/data/vehicles.json`
- Dynamic vehicle detail template at `src/pages/vehicles/[slug].astro`
- Publication status support: `preview_only`, `published`, `hidden`
- One placeholder vehicle record for testing

### Preview Security

- `functions/_middleware.ts` — no-index via `X-Robots-Tag` on non-main branches
- `src/pages/terms.astro` and `src/pages/privacy.astro` — no-index for placeholder legal pages

### A2A Jon — Complete

Three requests sent, all answered:
- **Git/CF Pages:** Blocked on Ian credentials (details below)
- **DNS Audit:** Complete — full record inventory, Google Workspace confirmed
- **Airtable Integration:** Build-time sync approved

### Git History

| Commit | Message | Files |
|---|---|---|
| `3b78436` | Phase 2: domain plan, Airtable integration, data ownership, brand assets, vehicle detail | 18 files |
| `4853d45` | feat: all core non-transactional pages built (23 pages) | 17 files |
| `f2a63a5` | docs: technical architecture review + phase 1 handoff | 2 files |
| `d9c1e38` | initial scaffold: Astro 7 + Tailwind v4 + i18n | 50 files |

---

## Blockers (Requiring Ian)

| # | What's Needed | Blocks | Instructions |
|---|---|---|---|
| 1 | **GitHub repo** `305fleet-website` — create or provide token | Code push, CF Pages connection | Create repo (or Nik via API with token). Store token in 1Password. |
| 2 | **CF API token** — fine-grained Pages:Edit for turomina | Preview deployment | Create in CF dashboard, scope to Pages:Edit only. Store in 1Password. |
| 3 | **Airtable PAT** — read-only, scoped to 305Fleet Vehicles base | Fleet content population | Create in Airtable. Minimum scopes: `data.records:read`, `schema.bases:read`. Store in 1Password. |

---

## Decisions Required From Ian

| # | Decision | Urgency |
|---|---|---|
| 1 | **GitHub repo** — create `305fleet-website` (or provide token for Nik) | **Now** |
| 2 | **CF token** — create and store in 1Password | **Now** |
| 3 | **Airtable PAT** — create and store in 1Password | **Now** |
| 4 | **Fleet inventory** — which vehicles are currently in the fleet and active? | This week |
| 5 | **Phone number** — public business number for website | This week |
| 6 | **WhatsApp number** — for customer contact | This week |
| 7 | **Google Workspace** — confirm actively used for 305Fleet.com email | Before DNS changes |
| 8 | **DNS migration** — move to Cloudflare DNS or keep GoDaddy + CNAME? | Before production |
| 9 | **Brand asset check** — does the inverted white footer logo look correct on dark bg? | At preview |

---

## Project State

| Aspect | Status |
|---|---|
| Git repository | 4 commits on `main`, no remote |
| Framework | Astro 7 + Tailwind CSS v4 |
| Pages built | 24 (all core non-transactional pages) |
| Build | 0 errors, ~570ms |
| Local dev | `npm run dev` → localhost:4321 |
| Derived brand assets | 11 in `public/images/brand/` |
| Vehicle data source | JSON with dynamic routes |
| Preview deployment | ⛔ Blocked on Ian |
| Airtable access | ⛔ Blocked on Ian |
| Real vehicle content | ⛔ Blocked on Ian |
| Spanish i18n | Structure ready, content pending |
| Production domain | 305Fleet.com — GoDaddy, Google Workspace, audited |

---

## What's Next After Unblocking

1. Airtable audit (fleet records, schema, missing data)
2. Git remote setup → push to GitHub
3. Cloudflare Pages project → preview deployment
4. Turo listing reconciliation
5. Vehicle content population from Airtable
6. Spanish i18n implementation
7. Preview QA across devices
8. Analytics event specification
9. Final Phase 2 handoff with preview URL, test results, and Ian approval gate for attaching production domain
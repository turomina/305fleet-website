# 305 Fleet — Customer Website & Direct-Booking Platform

**Project Status:** Phase 2 — Domain, Cloudflare Preview & Content Population
**Last Updated:** 2026-07-10
**Build:** 24 pages, 0 errors, ~570ms
**Preview Deployment:** Blocked on Ian (GitHub repo + CF token)
**Hosting Plan:** Cloudflare Pages (pages.dev preview confirmed, 305Fleet.com target)
**DNS Status:** Audited by Jon — GoDaddy registrar, Google Workspace email, no Cloudflare yet
**Airtable Access:** Blocked on Ian (PAT for Vehicles base needed)
**Lead:** Nik (Marketing, Content, UX)
**Technical:** Jon (Architecture, Infrastructure, Integration, Security)

## Overview

305 Fleet is a South Florida vehicle fleet operator serving Miami, Fort Lauderdale, Palm Beach, and surrounding areas. This repository will contain the customer-facing website and eventually the direct-booking platform.

### Current Booking Sources
- **Turo** — primary booking source initially
- **Wheelbase** — onboarding in progress, intended as the backend for direct bookings

## Project Structure

```
projects/305Fleet/
├── brand assets/         # Original designer files (READ-ONLY)
├── docs/                 # Project documentation
│   └── brand-asset-manifest.md
├── handoffs/             # Phase handoff documents
├── Ian Folder/           # Ian's reference materials
│   └── Auto rental company examples.docx
├── public/               # Static assets (images, fonts, etc.)
├── src/                  # Source code
└── README.md
```

## Current Phase

**Phase 1 — Workspace and Asset Audit** (IN PROGRESS)
- [x] Project folder inspected
- [x] Brand assets inventoried
- [x] Brand asset manifest created
- [ ] Git repository initialized
- [ ] Framework selected
- [ ] A2A to Jon sent

## Key Documents

- [Brand Asset Manifest](docs/brand-asset-manifest.md) — Complete inventory of all logo files and usage recommendations
- [Project Brief](docs/project-brief.md) — (pending)
- [Design System](docs/design-system.md) — (pending)
- [Site Map](docs/site-map.md) — (pending)
- [Customer Journeys](docs/customer-journeys.md) — (pending)
- [Vehicle Content Model](docs/vehicle-content-model.md) — (pending)
- [Wheelbase Integration Requirements](docs/wheelbase-integration-requirements.md) — (pending)

## Competitor References (from Ian)

- https://prestigeluxuryrentals.com/
- https://toplinerentacar.com/
- https://skyrentcarmiami.com/
- https://supernicerentacar.com/
- https://www.milescarrentalmiami.com/
- https://familyautorental.com/
- https://www.miamirentacar.com/

## Hosting

Not yet configured. Expected direction: Cloudflare Pages (similar to LIPP). Awaiting Jon's technical review.

## Restrictions

- Do not publish to production domain without Ian approval
- Do not enable live payments, reservations, or driver verification
- Do not store secrets in repository
- Do not modify original brand assets

## CI/CD
- **Deployment:** Cloudflare Pages (Git-integrated, auto-deploy on push)
- **Production branch:** `main`
- **Preview branches:** All non-`main` branches
- **Manual fallback:** `npm run deploy:prod`

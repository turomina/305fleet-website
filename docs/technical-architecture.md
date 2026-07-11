# 305 Fleet — Technical Architecture Review

**Prepared by:** Jon (Technical Architecture & Infrastructure Lead)
**Date:** 2026-07-10
**Status:** Confirmed

---

## Summary of Decisions

| # | Decision | Status |
|---|---|---|
| 1 | Framework: Astro 7 + Tailwind CSS v4 | ✅ Confirmed |
| 2 | Hosting: Cloudflare Pages (free tier) | ✅ Confirmed |
| 3 | Server-side: Pages Functions (sufficient for now) | ✅ Confirmed |
| 4 | Git: Trunk-based (main/dev/feat/*) | ✅ Confirmed |
| 5 | i18n: Astro built-in (en at /, es at /es/) | ✅ Confirmed |
| 6 | Analytics: Cloudflare Web Analytics (free) | ✅ Confirmed |
| 7 | Secrets: 1Password → op:// refs → `op run` at deploy | ✅ Confirmed (LIPP pattern) |
| 8 | Workers: Only for cron triggers (separate Worker) | ✅ Confirmed |
| 9 | Domain: TBD — Ian decision needed | ⚠️ Pending |
| 10 | GitHub repo name: `305fleet-website` | ⚠️ Pending Ian confirmation |

## Key Technical Findings

### Wheelbase is NOT a REST API (yet)
Wheelbase provides an **embedded widget SDK** (`wheelbase.startBooking()`) and a standalone shop link — not a raw REST API. This means:
1. Vehicle listings may need to be synced into Astro content manually or via widget embedding
2. Booking flow uses Wheelbase's widget, handing off to their hosted checkout
3. If a REST API exists for inventory sync, Pages Functions will proxy it

### Deployment Model
| Environment | Branch | URL | Trigger |
|---|---|---|---|
| Local | n/a | localhost:4321 | `npm run dev` |
| Feature Preview | feat/* | *.305fleet-website.pages.dev | Git push (auto) |
| Staging/Dev | dev | dev.305fleet-website.pages.dev | Git push (auto) |
| Production | main | 305fleet.com (TBD) | Git push (auto) |

### Security
- CSP via `public/_headers`
- HTTPS enforced by Cloudflare
- Forms: honeypot + rate limiting + server-side validation
- API keys: Pages Functions env vars only, never client-side
- Supply chain: `npm audit` on install, lockfile committed

### Cloudflare Free Tier Sufficiency
| Limit | Value | Sufficient? |
|---|---|---|
| Builds/month | 500 | ✅ |
| Concurrent builds | 1 | ✅ |
| Files per site | 20,000 | ✅ |
| Pages Functions requests | 100K/day | ✅ (until booking goes live) |

### Ian Actions Needed
1. **Domain name** — confirm domain for 305 Fleet
2. **GitHub repo** — confirm name `305fleet-website` and who creates it
3. **Cloudflare token** — create a new fine-grained CF token for this project (Pages:Edit, turomina only). Don't reuse LIPP token.

---

*Full response from Jon received via A2A. This document summarizes his architecture review for project records.*
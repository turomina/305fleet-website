# 305Fleet Mobile Header & Contact Page Audit Report
**Date:** 2026-09-06  
**Scope:** Spanish contact page (`/es/contact/`) + mobile header menu  
**Builds compared:** Live `305fleet.com` (stale) vs `production.305fleet-website.pages.dev` (latest)

---

## PART 1: ROOT CAUSE — Why `305fleet.com` ≠ Production Preview

### Finding
**There are TWO separate Cloudflare Pages projects serving different builds.**

| Project Name | Custom Domain | Serves | Status |
|---|---|---|---|
| `305fleet-website-git` | `305fleet.com`, `www.305fleet.com` | **OLD BUILD** | Stale — deployed before Spanish redesign |
| `305fleet-website` | `305fleet-website.pages.dev` (production alias) | **LATEST BUILD** | Fresh — contains all new Spanish content |

### Evidence (curl comparison of `/es/contact/`)

| Element | `305fleet.com` (stale) | `production.pages.dev` (fresh) |
|---|---|---|
| `<title>` | `Contacto \| 305 Fleet` | `Contacto — 305 Fleet \| 305 Fleet` |
| Meta description | Short: *"Ponte en contacto con nuestro equipo."* | Full: *"Ponte en contacto con 305 Fleet — alquiler de vehículos directo..."* |
| H1 | `<h1 class="text-3xl...">Contacto</h1>` | `<h1 class="text-4xl... tracking-tight" data-astro-cid-p3scwd3w>Hablemos.</h1>` |
| Button labels | Different/older layout | Updated: *Llamar ahora*, *Enviar mensaje de texto*, *WhatsApp*, *Correo electrónico* |
| CF-Ray ID | `a371665a5964e0c1-MIA` | `a37166b8a90e983f-MIA` |

### Root Cause
The `wrangler.toml` specifies `name = "305fleet-website"`. Deployments go to the `305fleet-website-git` project (which serves the custom domain). The production preview `production.305fleet-website.pages.dev` is bound to a DIFFERENT Cloudflare Pages project that hasn't received deployments matching the current source code in `main`.

The `domain-routing-investigation.md` document already notes this split. **No LIPP changes were made or needed.**

### Fix Required (Deployment)
Option A (recommended): Change `wrangler.toml` `name` to `305fleet-website-git` so `npx wrangler pages deploy` deploys to the project that owns `305fleet.com`. Requires Ian approval to commit and deploy.

Option B: Manually trigger a new deployment of the `305fleet-website-git` project in the Cloudflare dashboard.

---

## PART 2: MOBILE HEADER / MENU AUDIT (375px & 390px)

### Test Results Summary (Playwright automated QA on fresh build)
| Test | Result |
|---|---|
| Menu opens on hamburger click | ✅ PASS |
| Menu contains all 6 Spanish nav items | ✅ PASS (Inicio, Vehículos, Aeropuertos, Cómo funciona, Nosotros, Contacto) |
| All nav hrefs correct for /es/* paths | ✅ PASS (confirmed visually from test output) |
| Book Now CTA ("Reservar") visible | ✅ PASS |
| Hamburger icon adequate tap target (≥40px) | ✅ PASS |
| Desktop nav no duplicate label names | ✅ PASS |
| Contact page content full-width at 375px | ✅ PASS (width ≥340px) |
| **Backdrop close via click** | ❌ FAIL — sidebar UI intercepts pointer events |
| Active state styling on mobile links | ❌ FAIL — no active class on mobile nav (desktop works fine) |

### Issues Found

#### ISSUE 1 — CRITICAL: Sidebar Intercepting Backdrop Clicks
**Symptom:** Users cannot close the mobile menu by tapping the backdrop overlay. The sidebar's close button (`#mobile-menu-close`) and header bar sit above the backdrop in z-index stacking and intercept pointer events even when users tap the dark area beside them.

**Evidence:** Playwright test error: `<div class="flex items-center justify-between p-4 border-b...">` from the sidebar panel "subtree intercepts pointer events" — repeated 55+ retries failed.

**Root cause:** The HTML structure places `.absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto` (sidebar panel) over the `.absolute inset-0 bg-black/30` (backdrop), but the backdrop has `z-50` same as the panel. CSS stacking context means elements drawn later render on top. The sidebar panel renders AFTER the backdrop div, so it appears above.

**Fix:** Add `pointer-events-none` to the sidebar panel so clicks pass through to the backdrop, OR restructure HTML so the backdrop is always last in DOM. Recommended: add `class="pointer-events-auto"` explicitly to both backdrop and sidebar, with backdrop first in DOM order.

Current problematic order in template:
```html
<div id="mobile-menu" ... class="...fixed inset-0 z-50">
  <div id="mobile-menu-backdrop" class="...absolute inset-0 bg-black/30"></div>  <!-- backdrop -->
  <div class="...absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white...">    <!-- sidebar ON TOP -->
```

#### ISSUE 2 — MEDIUM: No Active State Styling on Mobile Nav Links
**Symptom:** When viewing an internal page (e.g., `/es/about/`), the user cannot see which nav item they're currently on within the mobile menu. The desktop nav correctly adds `text-brand bg-brand-pale` for active items, but mobile links only get hover styles.

**Code:** Desktop active logic uses ternary: `currentPath === item.href || currentPath.startsWith(item.href) ? "text-brand bg-brand-pale" : "text-gray-700"`. Mobile links use: `block px-4 py-3 text-base font-medium text-gray-900 rounded-md hover:bg-brand-pale hover:text-brand` — same condition should be applied.

**Fix:** Apply the identical active-state conditional to mobile nav link classes in `Header.astro`.

#### ISSUE 3 — LOW: Duplicate Nav Items — Airports/How It Works
**Symptom:** Both `"Airports"` → `/how-it-works/` and `"How It Works"` → `/how-it-works/` exist as separate nav items (same for ES: "Aeropuertos" and "Cómo funciona"). This creates redundancy and potential confusion about which link is "active."

**Status:** Pre-existing issue noted in `domain-routing-investigation.md`. Not urgent but worth cleanup.

#### ISSUE 4 — LOW: Header Height Inconsistency on Mobile
**Observation:** Header uses `h-16` fixed height on mobile but `lg:h-18` on desktop. At narrow viewports (375px), the logo image at `h-8 w-auto lg:h-10` may appear slightly disproportionate if the container is constrained. Not broken but could look tighter than intended.

---

## PART 3: CONTACT PAGE — DESKTOP & MOBILE

### Visual Comparison (Screenshots Available)

**Stale (305fleet.com):**
- Simple "Contacto" H1 heading
- Older card layout with less styled contact buttons
- Shorter title and meta description
- Less polished visual hierarchy

**Fresh (pages.dev):**
- "Hablemos." H1 heading (modern, engaging)
- Full branded gradient-dark hero section  
- Four action buttons with icons (Call, Text, WhatsApp, Email)
- Properly translated Spanish content throughout
- Complete SEO metadata with hreflang/x-default

### Button Layout at Mobile Widths
Tailwind config: `grid-cols-1 sm:grid-cols-2 gap-4`  
- **≤640px:** Single column stack — each button spans full width with padding 1rem 1.25rem
- **>640px:** 2-column grid — balanced pairing of buttons
- This is appropriate for mobile; no fix needed.

---

## PROPOSED FIX PLAN (in priority order)

1. **Deploy stale build fix** — Update `wrangler.toml` name to `305fleet-website-git` and run `npm run deploy:prod`. This brings the correct live Spanish content to `305fleet.com`.

2. **Fix mobile backdrop click interception** — Add `pointer-events` handling in `Header.astro` mobile menu section so users can reliably close the menu by tapping the dark area.

3. **Add active state to mobile nav links** — Mirror desktop active-class logic in the mobile nav anchor tag.

4. **Consider nav consolidation** — Merge "Airports/Aeropuertos" into "How It Works/Cómo funciona" since they share the same destination URL.

---

## Files Changed So Far (None)
✅ No code was modified during this audit.  
✅ No deployment was triggered to production.  
✅ LIPP website was not touched.

---

## Deployment Ready
The latest code in `main` (HEAD `9c813f9`) is what plays well on `production.pages.dev`. Once the wrangler.toml name is pointed to `305fleet-website-git`, a single `npm run deploy:prod` will serve everything correctly on `305fleet.com`.

Issues 2 and 3 require code changes to `src/components/base/Header.astro` and can be addressed after the deployment mismatch is resolved.

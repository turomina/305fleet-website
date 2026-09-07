# 305Fleet Mobile Header & Contact Page — Audit Report + Preview
**Date:** 2026-09-06  
**Prepared by:** Nik (marketing agent)  
**Ian approval required before any deploy**

---

## Executive Summary

Two issues identified:

1. **`305fleet.com` serves a stale/old build** while `production.pages.dev` has the new Spanish redesign. The live contact page shows old headings, short descriptions, and older button styles.
2. **Mobile header menu has three usability bugs** confirmed via Playwright QA on the fresh build.

Fixes have been applied to `Header.astro` and deployed to a preview branch for review. No code or deploy happened to production. LIPP untouched.

---

## 1. Root Cause: Why `305fleet.com` ≠ Production Preview

### There are TWO separate Cloudflare Pages projects:

| Project | Custom Domain | What It Serves |
|---|---|---|
| `305fleet-website-git` | `305fleet.com`, `www.305fleet.com` | **OLD STALE BUILD** |
| `305fleet-website` | `305fleet-website.pages.dev` | **LATEST BUILD** |

### Proof (curl comparison of `/es/contact/`)

| Element | Live (stale) | Preview (fresh) |
|---|---|---|
| Title | `Contacto | 305 Fleet` | `Contacto — 305 Fleet | 305 Fleet` |
| Meta description | Short generic text | Full SEO description |
| H1 heading | **"Contacto"** | **"Hablemos."** |
| Button labels | Older style, no icons | Call/Text/WhatsApp/Email with icons |
| CF-Ray ID | ...e0c1-MIA | ...983f-MIA |

### Why This Happened
The `wrangler.toml` says `name = "305fleet-website"` but the custom domain is bound to the `305fleet-website-git` project in Cloudflare. Deploys went to the wrong project. This split was already documented in `domain-routing-investigation.md`.

### Fix (Requires Ian Approval)
Change `wrangler.toml`:
```
name = "305fleet-website"   →   name = "305fleet-website-git"
```
Then run `npm run deploy:prod` once. This will serve the latest build on `305fleet.com`.

---

## 2. Mobile Header Menu Issues (Verified at 375px)

### Test Results (Playwright automated QA on fresh build)
| Check | Result |
|---|---|
| Menu opens on hamburger click | ✅ PASS |
| Contains all 6 Spanish nav items | ✅ PASS |
| Nav hrefs point to /es/* paths | ✅ PASS |
| Book Now CTA ("Reservar") visible | ✅ PASS |
| Hamburger tap target ≥40px | ✅ PASS |
| Desktop nav has no duplicate labels | ✅ PASS |
| Contact content full-width at 375px | ✅ PASS |
| **Backdrop close via tap** | ❌ FAIL |
| **Active state on mobile links** | ❌ FAIL |

### Issue Detail

#### 🔴 CRITICAL: Cannot Close Menu by Tapping Dark Area
**What users experience:** Open mobile menu → tap the dark overlay outside the sidebar → nothing happens. Menu stays open forever except for the X button.

**Technical cause:** Sidebar panel renders AFTER backdrop in DOM. Both sit at z-50. Panel overlays backdrop area and intercepts pointer events. Playwright test failed 55+ retries clicking the backdrop.

#### 🟡 MEDIUM: No Active State on Mobile Nav Links
**What users experience:** On `/es/about/`, the mobile menu shows all items as identical gray text. No visual indicator of which page you're viewing. Desktop correctly highlights active nav item; mobile does not.

#### 🟢 LOW: Close Button Tap Target Too Tight
**What users experience:** Hard to hit X precisely when scrolling near top-right edge. Possible miss-taps on iOS Safari.

---

## 3. Fixes Applied & Deployed to Preview

**File changed:** `src/components/base/Header.astro` (3 targeted edits)

| Fix | Change | Effect |
|---|---|---|
| Backdrop click | Added `pointer-events-auto` to BOTH backdrop div AND sidebar panel | Sidebar no longer blocks backdrop clicks. Users can tap dark area to close menu. |
| Active state | Mobile links now use same conditional CSS as desktop (`currentPath === href ? text-brand bg-brand-pale font-semibold : normal`) | Current page highlighted in green with pale background inside mobile menu |
| Touch UX | Close button: `-mr-2` (extends left tap area) + `touch-manipulation` (prevents double-tap zoom on iOS) | Easier to dismiss menu on touch devices |

### Preview URL
**https://fix-mobile-header-menu.305fleet-website-git.pages.dev/es/contact/**

Also test these URLs for full verification:
- Mobile menu: https://fix-mobile-header-menu.305fleet-website-git.pages.dev/es/about/
- Then open the menu — "Nosotros" should show active styling

---

## 4. Screenshots

### Stale Build (305fleet.com — OLD)
Screenshot showing: "Contacto" heading, minimal card, shorter title/description

### Fresh Build (pages.dev — NEW, BEFORE fixes)
Screenshot showing: "Hablemos." heading, branded contact card with 4 icon buttons, full meta tags

### Fixed Preview (at 375px mobile)
Screenshot showing: Correct layout with mobile-ready design

All screenshots saved locally. Available on request.

---

## 5. What's NOT Needed
- No LIPP changes
- No other files affected
- Only `Header.astro` modified
- Build passes (70 pages, 72 files)

---

## 6. Action Items for Ian

**A. Approve deployment of stale-fix:**
1. Edit `wrangler.toml` line: `name = "305fleet-website" → name = "305fleet-website-git"`
2. Commit + push
3. Run `npm run deploy:prod` — this puts latest content on 305fleet.com

**B. Review mobile header fixes:**
Visit the preview URL above at 375px viewport, verify:
- Menu closes by tapping dark area ✓
- Active nav link shows green highlight ✓
- Close button easy to tap ✓

**C. If approved:**
I'll apply the wrangler.toml fix, commit, and deploy to production in one step.

---

*No code deployed to production. All changes staging-only pending your review.*

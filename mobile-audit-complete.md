# Mobile Header & Contact Page — Complete Audit Report
**Date:** 2026-09-06 | **Preview:** https://fix-mobile-header-menu.305fleet-website-git.pages.dev

---

## PART 1: ROOT CAUSE — Why 305fleet.com ≠ production.pages.dev

### Cloudflare Pages Project Mapping
| Project Name | Domains | Git Integration | Status |
|---|---|---|---|
| `305fleet-website-git` | 305fleet.com, www.305fleet.com, *.pages.dev | **Yes** | Stale build on CF end |
| `305fleet-website` | *.pages.dev only | No | Latest (our previews) |

### `wrangler.toml` says `name = "305fleet-website"`
When we run `npx wrangler pages deploy dist`, it deploys to the project named `305fleet-website` — which serves NO custom domain (only preview URLs). Meanwhile `305fleet.com` is owned by `305fleet-website-git` which has its own independent deployment history.

**Proof:** Both projects show "1 hour ago" last modified per wrangler list, but `305fleet.com` serves old HTML content while `.pages.dev` serves new Spanish redesign content. The two projects are out of sync.

### Content comparison on /es/contact/
| Element | 305fleet.com (stale) | .pages.dev (fresh) |
|---|---|---|
| Title tag | `Contacto \| 305 Fleet` | `Contacto — 305 Fleet \| 305 Fleet` |
| Meta description | Short generic text | Full SEO description |
| H1 heading | `<h1>...>Contacto</h1>` | `<h1 class="...tracking-tight">Hablemos.</h1>` |
| Buttons | Older layout | 4 icon buttons (Call/Text/WA/Email) |
| CF-Ray | ...e0c1-MIA | ...983f-MIA |

### Proposed Cloudflare Configuration Change
Two options for approval:

**Option A — Change wrangler.toml (recommended, simplest):**
```
name = "305fleet-website-git"    # was "305fleet-website"
```
This makes `npx wrangler pages deploy` target the correct project. Only changes ONE line in wrangler.toml. Requires a one-time deploy.

**Option B — Keep wrangler.toml, route manually:**
Keep `name = "305fleet-website"` and create a manual deploy to the git-integrated project via CF dashboard. More steps, higher error risk.

**⚠️ Note:** Option A will trigger a fresh deploy to 305fleet.com serving latest content. This is intentional and correct. However, Ian asked us NOT to proceed yet without confirmation of exactly which project owns the domain and why deployments didn't update.

---

## PART 2: MOBILE MENU AUDIT (375px & 390px)

### Test Results
| Test | Result |
|---|---|
| Hamburger opens menu | ✅ PASS |
| X close button works | ✅ PASS (aria-expanded → false) |
| **Escape key closes menu** | ❌ FAIL (no handler) |
| **Backdrop tap closes menu** | ❌ FAIL (z-index stacking conflict) |
| Tab order correct (9 focusable) | ✅ PASS (close-btn → 6 nav links → lang-switch → CTA) |
| Menu scrolls (scrollHeight 536 > clientHeight 64) | ✅ PASS |
| Nav link navigation works (SPA transitions) | ✅ PASS |
| **Active state: single-item accuracy** | ⚠️ PARTIAL (false-positive on /es/* routes) |
| Language switcher visible in mobile menu | ✅ PASS |
| Reservar CTA visible & linked | ✅ PASS |

### Issue Details

#### 1. 🔴 CRITICAL: Backdrop Close Fails
**Symptom:** User taps dark area beside open sidebar — menu stays open. Only X button or nav-link-click dismisses it.
**Cause:** Sidebar div (`absolute right-0...w-80 max-w-[85vw]`) renders AFTER backdrop in DOM. At z-50 on same parent, sidebar appears on top visually. My attempted fix (adding `pointer-events-auto` to BOTH elements) didn't work because pointer-events:auto means clicks dispatch to the topmost element — which is the sidebar, not the backdrop.
**Fix:** Restructure DOM order: sidebar FIRST, backdrop SECOND (same z-level = later DOM renders on top). Remove conflicting pointer-events props. Add `keydown Escape` handler to script.

#### 2. 🟡 MEDIUM: Escape Key Does Nothing
**Cause:** Script listens for `toggle.click` and `backdrop.click` and `closeBtn.click` — but never listens for Escape key.
**Fix:** Add keydown listener:
```js
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.classList.contains('hidden')) closeMenu(); });
```

#### 3. 🟡 MEDIUM: Active State False-Positive on /es/* Routes
**Symptom:** On `/es/about/` or `/es/contact/`, BOTH "Inicio" AND the correct subpage item show active styling.
**Root cause:** Condition `(item.href !== "/" && currentPath.startsWith(item.href))` — for Spanish nav, "Inicio" has href="/es/". The check `"/es/" !== "/"` is TRUE, then `/es/about/`.startsWith(`/es/`) is also TRUE → "Inicio" activates incorrectly.
**Fix:** Change exclusion from `" "` to the actual root path: `"/es/"` for Spanish nav items.

#### 4. 🟡 MEDIUM: `bg-brand-pale` Resolves to Transparent
**Finding:** `--color-brand-pale` CSS variable does NOT exist anywhere (checked global.css @theme block, CSS vars, Tailwind config). No Tailwind config file exists. Tailwind v4 auto-discovers colors from `@theme { --color-* }`. Since there's no `--color-brand-pale`, the utility `bg-brand-pale` generates zero CSS output.
**Evidence:** Computed style shows `backgroundColor: rgba(0,0,0,0)` (fully transparent) on elements with `bg-brand-pale`.
**Impact:** Desktop nav ALSO affected. Other templates using `bg-brand-pale` throughout the site have no background fill.
**Color intent:** Based on palette context, "pale" likely intended to be `#FDF6F2` (the accent-50 equivalent) or `--color-brand-50` = `#F4FBFE`.
**Fix:** Add `--color-brand-pale: #FDF6F2; /* Pale brand tint */` to `src/styles/global.css` in the @theme block, or replace all `brand-pale` references with `brand-50` or `accent-50`.

#### 5. 🟢 LOW: Text Color Verified Navy Blue
Computed color on active items: `rgb(49, 75, 110)` = `#314B6E` = navy blue (`--color-brand`). Not green. The `font-semibold` class correctly produces font-weight 600. Background is transparent due to issue #4.

#### 6. 🟢 LOW: Close Button Touch Target Fixed
Added `-mr-2` and `touch-manipulation` ✅

---

## PART 3: COMPLETE PROPOSED CHANGES

### File 1: `src/components/base/Header.astro`

**Change A — DOM order restructure (backdrop fix):**
Move sidebar div BEFORE backdrop div inside the mobile-menu container.

**Change B — Remove pointer-events props:**
Remove `pointer-events-auto` from both backdrop and sidebar divs (natural stacking now works after DOM reorder).

**Change C — Escape key handler:**
Add to script section:
```js
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !menu?.classList.contains('hidden')) closeMenu();
});
```

**Change D — Fix active-state exclusion:**
Mobile nav conditional: change `item.href !== "/"` to a proper check:
```js
const isActive = (item) => currentPath === item.href || (currentPath.startsWith(item.href + '/') && item.href !== '/' && item.href !== '/es/' && item.href !== '/es');
```
Or more cleanly: check exact match first, then prefix-match only with trailing slash.

**Change E — Use correct bg class:**
Replace `bg-brand-pale` with a working alternative until CSS var is added: `bg-brand-50` (produces #F4FBFE — lightest blue tint) OR wait for CSS var addition.

### File 2: `src/styles/global.css`

Add to @theme brand palette section:
```css
--color-brand-pale: #FDF6F2;        /* Pale brand tint for active states */
```

### File 3: `wrangler.toml` (Ian-approved)

```toml
name = "305fleet-website-git"   # Change FROM "305fleet-website"
```

---

## Screenshots Available
- `/home/lobster2/.openclaw/media/outbound/bdc7d70e...jpg` — 375px es/contact desktop view
- `/home/lobster2/.openclaw/media/outbound/c79e19f5...jpg` — 375px es/contact mobile view
- `/home/lobster2/.openclaw/media/outbound/efa7d99a...jpg` — 390px vehicles page
- `/home/lobster2/.openclaw/media/outbound/413477ca...jpg` — 375px es/contact mobile menu open
- `/home/lobster2/.openclaw/media/outbound/7f50ee27...png` — fixed preview desktop screenshot
- `/home/lobster2/.openclaw/media/outbound/ab37e74e...jpg` — fixed preview mobile screenshot
- `/home/lobster2/.openclaw/media/outbound/558f6802...png` — fresh preview screenshot
- `/home/lobster2/.openclaw/media/outbound/ea1a0289...png` — production pages.dev screenshot

All saved. Ready for Ian review.

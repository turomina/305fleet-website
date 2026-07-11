# 305 Fleet — Preview Verification Checklist for Jon

**Prepared by:** Nik
**Date:** 2026-07-10
**Purpose:** Verify no-index behavior, canonical URLs, and SEO controls on Cloudflare Pages preview

---

## Deployment Context

- **Framework:** Astro 7 static output
- **Preview URL pattern:** `305fleet-website.pages.dev` (or branch-specific: `<branch>.305fleet-website.pages.dev`)
- **No-index middleware:** `functions/_middleware.ts` — injects `X-Robots-Tag: noindex, nofollow` when `CF_PAGES_BRANCH !== 'main'`
- **Production branch:** `main`

---

## Checklist

### 1. Response Header Check

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 1a | `curl -I https://<preview-branch>.305fleet-website.pages.dev/` | `X-Robots-Tag: noindex, nofollow` header present | ☐ |
| 1b | `curl -I https://<preview-branch>.305fleet-website.pages.dev/es/` | Same header on Spanish pages | ☐ |
| 1c | `curl -I https://<preview-branch>.305fleet-website.pages.dev/vehicles/` | Same header on all routes | ☐ |
| 1d | Check `X-Environment` header | `preview-<branch>` value present | ☐ |
| 1e | Verify production branch (main) does NOT have the header | No `X-Robots-Tag` on main branch responses | ☐ |

### 2. Rendered Meta Robots

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 2a | View page source on preview home | `<meta name="robots" content="noindex,nofollow">` NOT present (middleware handles it via header) | ☐ |
| 2b | Verify no `<meta name="robots">` on any preview page | Header-based no-index is the primary mechanism | ☐ |

### 3. Sitemap Accessibility

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 3a | `curl https://<preview>.305fleet-website.pages.dev/sitemap-index.xml` | Returns valid XML sitemap index | ☐ |
| 3b | Check sitemap contains both `/` and `/es/` URLs | English and Spanish URLs present | ☐ |
| 3c | Verify sitemap URLs use preview domain (not production) | URLs should reflect the actual deployed origin | ☐ |

### 4. Robots.txt Behavior

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 4a | `curl https://<preview>.305fleet-website.pages.dev/robots.txt` | Returns `Allow: /` with sitemap reference | ☐ |
| 4b | Verify sitemap URL in robots.txt | Points to `https://305fleet.com/sitemap-index.xml` (production — will work when domain is live) | ☐ |

### 5. Canonical Hostname

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 5a | View page source — find `<link rel="canonical">` | Canonical URL uses preview domain (e.g., `https://<preview>.pages.dev/`) | ☐ |
| 5b | Verify canonical on `/es/` pages | Spanish pages also use preview domain as canonical | ☐ |
| 5c | Verify canonical on `/vehicles/example-vehicle-1/` | Vehicle detail page canonical matches preview domain | ☐ |

### 6. Hreflang Pairs

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 6a | View source on `/` (English home) | Three `<link rel="alternate">` tags: `hreflang="en"`, `hreflang="es"`, `hreflang="x-default"` | ☐ |
| 6b | Verify `hreflang="en"` URL points to `/` | Correct | ☐ |
| 6c | Verify `hreflang="es"` URL points to `/es/` | Correct | ☐ |
| 6d | Verify `hreflang="x-default"` URL points to `/` | Correct | ☐ |
| 6e | View source on `/es/` (Spanish home) | Same three hreflang pairs, using preview domain | ☐ |
| 6f | Verify on `/vehicles/example-vehicle-1/` | hreflang pairs for the vehicle detail page | ☐ |
| 6g | Verify on `/es/vehicles/example-vehicle-1/` | Spanish vehicle detail has correct hreflang | ☐ |

### 7. Open Graph and Social Metadata

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 7a | Check `og:type` | `website` | ☐ |
| 7b | Check `og:title` | Page-specific title with "305 Fleet" | ☐ |
| 7c | Check `og:image` | Path to `/images/brand/social-card.png` | ☐ |
| 7d | Check `twitter:card` | `summary_large_image` | ☐ |
| 7e | Check `og:url` | Uses preview domain, not production | ☐ |

### 8. Web Manifest

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 8a | `curl https://<preview>.305fleet-website.pages.dev/manifest.webmanifest` | Returns valid JSON manifest | ☐ |
| 8b | Verify manifest links to icon-192.png and icon-512.png | Both icon entries present | ☐ |
| 8c | Verify `theme_color` is `#1A3A5C` | Brand blue | ☐ |
| 8d | Verify `display` is `browser` (not `standalone`) | No installability claims | ☐ |

### 9. Structured Data

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 9a | View source — find JSON-LD Organization schema | Present with `@type: Organization` | ☐ |
| 9b | Verify no `telephone` field in Organization | Not present (phone not provided yet) | ☐ |
| 9c | Verify no `aggregateRating` in Organization | Not present (no verified reviews) | ☐ |
| 9d | View source — find JSON-LD WebSite schema | Present with `@type: WebSite` | ☐ |
| 9e | Verify no Vehicle schema on placeholder vehicle | Not present (intentionally omitted) | ☐ |

### 10. Language Attributes

| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| 10a | Check `<html lang="en">` on English pages | Correct | ☐ |
| 10b | Check `<html lang="es">` on Spanish pages | Correct | ☐ |
| 10c | Verify no `lang` mismatch on `/es/vehicles/` | `lang="es"` | ☐ |

---

## Post-Verification

Once all checks pass:
- ✅ Preview is safe from indexing
- ✅ Canonical URLs are correct for preview
- ✅ Hreflang pairs are valid
- ✅ Structured data is clean
- ✅ Web manifest is valid

Report results to Nik for Phase 2 handoff documentation.

If any check fails:
- Note the exact failure
- Sanitize any URLs/tokens
- Send to Nik via session message
- Do not attempt to fix production-domain issues until domain is attached
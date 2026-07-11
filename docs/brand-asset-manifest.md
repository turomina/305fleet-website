# 305 Fleet — Brand Asset Manifest

**Created:** 2026-07-10
**Auditor:** Nik (305Fleet Marketing Agent)
**Status:** Phase 1 — Audit Complete

## Source Files (DO NOT MODIFY)

All original designer files live in `brand assets/`. These are the canonical sources and must never be overwritten, renamed, recompressed, or altered. Any derived assets for the website must be created as separate copies.

### Designer Source

| File | Type | Size | Description |
|------|------|------|-------------|
| `GUIA LOGO.pdf` | PDF | 526 KB | 8-page original designer logo deck — all variants |

### Standalone Logo Files (Pre-Exported)

| File | Dimensions | Format | Mode | Size | Notes |
|------|-----------|--------|------|------|-------|
| `305 Fleet Logo Transparent.png` | 1700×1700 | PNG | RGBA | 214 KB | Main logo, transparent background, ~900×500px content area, wide aspect (~1.8:1), blue-tone colorway |
| `Small Circular Transparent Logo.png` | 559×577 | PNG | RGBA | 118 KB | Circular icon variant, ~450×450px content, transparent — ideal for favicon, app icon, social avatar |
| `Tiny 305Fleet Logo for emails.png` | 150×155 | PNG | RGBA | 16 KB | Email-signature size, ~50×50px content, transparent — email footer use |

### GUIA LOGO PDF — Page-by-Page Analysis

All pages: 1700×1700px, RGB, white background (no alpha channel). All use blue-tone color scheme except Page 6 (monochrome/dark).

| Page | File (PNG) | File (JPG) | Layout | Content Size | Color Profile | Notes |
|------|-----------|-----------|--------|-------------|---------------|-------|
| 1 | `GUIA LOGO_Page_1.png` (19 KB) | `GUIA LOGO_Page_1.jpg` (69 KB) | HORIZONTAL | ~700×200px | Blue on white | Compact horizontal — likely standard header logo |
| 2 | `GUIA LOGO_Page_2.png` (19 KB) | `GUIA LOGO_Page_2.jpg` (71 KB) | HORIZONTAL | ~900×300px | Blue on white | Wider horizontal — more expansive layout |
| 3 | `GUIA LOGO_Page_3.png` (22 KB) | `GUIA LOGO_Page_3.jpg` (81 KB) | SQUARE/ICON | ~500×700px | Blue on white | Icon-centric with text — badge/emblem format |
| 4 | `GUIA LOGO_Page_4.png` (32 KB) | `GUIA LOGO_Page_4.jpg` (128 KB) | SQUARE/ICON | ~1000×1000px | Blue-fill dominant | Largest blue fill area — badge/reverse variant |
| 5 | `GUIA LOGO_Page_5.png` (21 KB) | `GUIA LOGO_Page_5.jpg` (83 KB) | SQUARE/ICON | ~900×700px | Blue on white | Icon variant with substantial blue presence |
| 6 | `GUIA LOGO_Page_6.png` (22 KB) | `GUIA LOGO_Page_6.jpg` (91 KB) | SQUARE/ICON | ~900×1100px | **DARK/BLACK** | Monochrome dark version — for light backgrounds or printing |
| 7 | `GUIA LOGO_Page_7.png` (21 KB) | `GUIA LOGO_Page_7.jpg` (78 KB) | SQUARE/ICON | ~700×700px | Blue on white | Compact square variant |
| 8 | `GUIA LOGO_Page_8.png` (24 KB) | `GUIA LOGO_Page_8.jpg` (77 KB) | VERTICAL/STACKED | ~400×900px | Blue on white | Stacked vertical — for tall/narrow spaces |

### Color Profile Summary

- **Primary Brand Color:** Blue-tone — sampled non-white pixel average varies from rgb(49,75,110) to rgb(86,115,150) depending on variant density
- **Dark Variant:** rgb(~13,20,28) — Page 6 only
- **All white-background pages:** Pure white (#FFFFFF) backgrounds, not transparent
- **Transparent files:** RGBA with alpha channel — blue logo elements on transparent background

## Non-Asset Files (Ignore)

All `*:Zone.Identifier` files are Windows NTFS alternate data stream markers. These are metadata from the Windows machine the files were transferred from. They contain no useful data and should be excluded from the repository via `.gitignore`.

## Recommended Website Usage

### Header / Navigation
- **Primary:** Page 1 (horizontal, compact) — or a derived transparent version from `305 Fleet Logo Transparent.png`
- **Alternative:** Page 2 (wider horizontal) for larger header layouts

### Footer
- **Primary:** Page 8 (stacked/vertical) — fits narrow footer columns
- **Alternative:** Small derived horizontal from `305 Fleet Logo Transparent.png`

### Favicon
- **Primary:** Derived from `Small Circular Transparent Logo.png` — resize to 32×32, 48×48, 64×64, 128×128, 256×256
- **Apple Touch Icon:** 180×180 derived from same source

### Social Sharing (og:image)
- **Primary:** Page 3 or Page 4 (square icon/badge format) fits 1200×630 social card dimensions best
- **Alternative:** Custom composed social card with logo + branding

### Mobile Navigation
- **Primary:** Small derived from `305 Fleet Logo Transparent.png` — horizontal, ≤200px wide
- **Collapsed icon:** `Small Circular Transparent Logo.png`

### Email
- **Primary:** `Tiny 305Fleet Logo for emails.png` — already sized for email signatures

### Dark Backgrounds
- **Primary:** Page 6 (dark/black variant) for use on light/white sections
- **For dark section backgrounds:** The transparent PNG files (RGBA with blue elements) will work on dark backgrounds — test contrast
- **Note:** No white/reversed version of the logo was found in the assets. If dark-background usage is required, a white/reversed variant may need to be created from the transparent file

### Light Backgrounds
- Blue logo variants (Pages 1-5, 7-8) or `305 Fleet Logo Transparent.png`

## Derived Assets Needed

The following website-optimized derivatives should be created from the original files (never overwriting originals):

| Derivative | Source | Dimensions | Format | Priority |
|-----------|--------|------------|--------|----------|
| Header logo | `305 Fleet Logo Transparent.png` | ~200×60px (SVG preferred) | PNG/SVG | HIGH |
| Footer logo | Pages 1 or 8 | ~150px wide | PNG | HIGH |
| Favicon set | `Small Circular Transparent Logo.png` | 32/48/64/128/256px | PNG/ICO | HIGH |
| Apple touch icon | `Small Circular Transparent Logo.png` | 180×180px | PNG | HIGH |
| Social card | Page 3 or 4 | 1200×630px | PNG | MEDIUM |
| Mobile nav logo | `305 Fleet Logo Transparent.png` | ~160px wide | PNG | HIGH |
| Email logo | `Tiny 305Fleet Logo for emails.png` | 150×155px | PNG | READY |
| Dark-bg variant | `305 Fleet Logo Transparent.png` | TBD | PNG | LOW (check if needed) |

## Missing / Requested

- [ ] **SVG version** of the logo — would be ideal for web use (resolution-independent, small file size). Was one included in the designer package?
- [ ] **White/reversed logo** — for dark section backgrounds, if the transparent blue version doesn't have sufficient contrast
- [ ] **Brand font names** — not determinable from raster files
- [ ] **Brand color hex values** — approximated from sampling; would prefer designer-specified values
- [ ] **Favicon .ico** — multi-resolution Windows-compatible format

## Preservation Rules

1. Original files in `brand assets/` are READ-ONLY — never modified
2. All derived assets go in `public/images/brand/` or similar project location
3. Zone.Identifier files excluded from repo via `.gitignore`
4. The PDF remains as the canonical designer source
5. Any new derivatives are documented in this manifest

---

## Derived Assets Created (2026-07-10)

All sourced from original files in `brand assets/` — originals preserved unmodified. Stored in `public/images/brand/`.

| File | Source | Dimensions | Format | Use Case |
|---|---|---|---|---|
| `header-logo.png` | `305 Fleet Logo Transparent.png` | 200×200 | PNG | Website header, light backgrounds |
| `footer-logo.png` | `305 Fleet Logo Transparent.png` | 150×150 | PNG | Website footer, dark backgrounds (color inverted for contrast) |
| `mobile-logo.png` | `305 Fleet Logo Transparent.png` | 140×140 | PNG | Mobile navigation header |
| `favicon-16.png` | `Small Circular Transparent Logo.png` | 16×16 | PNG | Browser tab (small) |
| `favicon-32.png` | `Small Circular Transparent Logo.png` | 32×32 | PNG | Browser tab (standard — used in BaseLayout) |
| `favicon-64.png` | `Small Circular Transparent Logo.png` | 64×64 | PNG | Browser tab (large) |
| `apple-touch-icon.png` | `Small Circular Transparent Logo.png` | 180×180 | PNG | iOS home screen, mobile bookmarks |
| `icon-192.png` | `Small Circular Transparent Logo.png` | 192×192 | PNG | Web app manifest (Android) |
| `icon-512.png` | `Small Circular Transparent Logo.png` | 512×512 | PNG | Web app manifest (large) |
| `icon-mark.png` | `305 Fleet Logo Transparent.png` | 200×200 | PNG | Icon-only mark for reuse |
| `social-card.png` | `305 Fleet Logo Transparent.png` | 1200×630 | PNG | Open Graph / social sharing preview (brand-color bg + logo) |

**Notes:**
- All derivatives are PNG. SVG would reduce file sizes if the designer provides an SVG source.
- Footer logo is a programmatic color inversion. Verify it renders correctly on `#0D141C` footer background.
- `social-card.png` is a simple brand-color background with centered logo — may be enhanced later with tagline text.
- `Tiny 305Fleet Logo for emails.png` (150×155, from original package) is already sized for email use and needs no derivative.
- No SVG version exists in the package. SVG tracing from the transparent PNG is a separate task if needed.

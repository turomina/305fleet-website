# 305 Fleet — Design System

**Version:** 1.0
**Date:** 2026-07-10
**Status:** Draft — Implementation Ready

---

## 1. Brand Identity

### Logo

The 305 Fleet logo is a professional designed mark in a blue-tone colorway. All usage references the original designer files in `brand assets/`.

**Primary logo:** Horizontal configuration (Page 1 from designer PDF)
**Icon/Symbol:** Circular mark (`Small Circular Transparent Logo.png`)
**Stacked:** Vertical configuration for narrow spaces (Page 8 from designer PDF)
**Dark variant:** Monochrome near-black version for light backgrounds (Page 6 from designer PDF)

#### Logo Usage Rules

| Context | Variant | File Source |
|---|---|---|
| Website header | Horizontal, transparent BG | Derived from `305 Fleet Logo Transparent.png` |
| Website footer | Stacked or horizontal, small | Derived from Page 1 or Page 8 |
| Favicon | Circular icon mark | Derived from `Small Circular Transparent Logo.png` |
| Mobile nav | Horizontal, compact | Derived from `305 Fleet Logo Transparent.png` |
| Email signature | Mini logo | `Tiny 305Fleet Logo for emails.png` |
| Social sharing (og:image) | Icon/badge format | Derived from Page 3 or 4 |
| Dark backgrounds | Transparent blue | `305 Fleet Logo Transparent.png` (RGBA) |
| Light backgrounds (print style) | Dark/monochrome variant | Page 6 |

#### Logo Clear Space

Preserve clear space around the logo equal to the height of the "305" numerals on all sides. Minimum logo width: 120px on mobile, 180px on desktop.

---

## 2. Color System

### Primary Palette

Colors sampled from the professional logo assets. Values below are the best approximations from raster analysis.

| Token | Hex | Use |
|---|---|---|
| `--color-brand` | `#1A3A5C` | Primary brand blue — buttons, links, accents |
| `--color-brand-light` | `#2E5A8A` | Hover states, lighter accents |
| `--color-brand-dark` | `#0D141C` | Dark variant (from Page 6 logo) — text on light, footer backgrounds |
| `--color-brand-pale` | `#EBF2F8` | Brand-tinted light backgrounds, info boxes |

### Neutral Palette

| Token | Hex | Use |
|---|---|---|
| `--color-white` | `#FFFFFF` | Page backgrounds, cards on gray |
| `--color-gray-50` | `#F9FAFB` | Alt section backgrounds |
| `--color-gray-100` | `#F3F4F6` | Card backgrounds, muted sections |
| `--color-gray-200` | `#E5E7EB` | Borders, dividers |
| `--color-gray-300` | `#D1D5DB` | Disabled states |
| `--color-gray-500` | `#6B7280` | Secondary text, captions |
| `--color-gray-700` | `#374151` | Body text |
| `--color-gray-900` | `#111827` | Headings, primary text |

### Functional Colors

| Token | Hex | Use |
|---|---|---|
| `--color-success` | `#059669` | Confirmation, availability, "online" |
| `--color-warning` | `#D97706` | Alerts, limited availability |
| `--color-error` | `#DC2626` | Error states, unavailable, form validation |
| `--color-info` | `#2563EB` | Information notices |

### Background Assignments

| Context | Background | Text |
|---|---|---|
| Body / main pages | `white` (#FFFFFF) | `gray-900` (#111827) |
| Alt sections | `gray-50` (#F9FAFB) | `gray-900` |
| Footer | `brand-dark` (#0D141C) | `white` (#FFFFFF) |
| Hero overlay | `brand-dark` at 60% opacity | `white` |
| Cards on white | `white` with border or `gray-50` | `gray-900` |
| Cards on gray | `white` with shadow | `gray-900` |
| Alerts | `brand-pale` (#EBF2F8) | `brand` (#1A3A5C) |

---

## 3. Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-display: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

**Rationale:** Inter is the same font used on LIPP — clean, professional, excellent readability at all sizes, strong South Florida technopolis feel without being trendy.

### Type Scale

| Token | Size | Line Height | Weight | Use |
|---|---|---|---|---|
| `text-xs` | 0.75rem (12px) | 1rem | 400/500 | Legal, fine print, captions |
| `text-sm` | 0.875rem (14px) | 1.25rem | 400/500 | Secondary body, labels, meta |
| `text-base` | 1rem (16px) | 1.5rem | 400 | Body text, form inputs |
| `text-lg` | 1.125rem (18px) | 1.75rem | 400/500 | Large body, intro paragraphs |
| `text-xl` | 1.25rem (20px) | 1.75rem | 500/600 | Card titles, feature headings |
| `text-2xl` | 1.5rem (24px) | 2rem | 600 | Section subheadings |
| `text-3xl` | 1.875rem (30px) | 2.25rem | 700 | Page headings (mobile) |
| `text-4xl` | 2.25rem (36px) | 2.5rem | 700 | Page headings (desktop), hero title |
| `text-5xl` | 3rem (48px) | 1.1 | 800 | Hero title (desktop) |

### Heading Hierarchy

```html
<h1> — Page title (one per page)
<h2> — Major section headings
<h3> — Subsection headings, card titles
<h4> — Minor headings inside cards/sections
```

---

## 4. Spacing System

Base unit: 4px (Tailwind default). Use Tailwind spacing scale.

| Token | Value | Use |
|---|---|---|
| `p-2` / `gap-2` | 8px | Tight internal spacing |
| `p-4` / `gap-4` | 16px | Card padding, form fields |
| `p-6` / `gap-6` | 24px | Section padding (mobile) |
| `p-8` / `gap-8` | 32px | Section padding (desktop), card grid gap |
| `p-12` / `p-16` | 48-64px | Major section separation |

Max content width: `max-w-7xl` (1280px) — same as LIPP.

---

## 5. Component Library

### 5.1 Buttons

**Primary Button**
```css
bg-brand (#1A3A5C) → hover:bg-brand-light (#2E5A8A)
text-white, font-semibold, rounded-lg, px-6 py-3
transition-colors duration-200
```

**Secondary Button**
```css
border-2 border-brand, text-brand, bg-transparent
hover:bg-brand, hover:text-white
rounded-lg, px-6, py-3
font-semibold
```

**Ghost Button (tertiary)**
```css
text-brand, bg-transparent
hover:underline, hover:text-brand-light
font-medium
```

**CTA Button (large)**
```css
Primary styling, text-lg, px-8 py-4
Used for main conversion actions (Check Availability, Browse Vehicles, Book Now)
```

**WhatsApp / Call Button**
```css
bg-green-600, text-white, rounded-full
Icon + text, px-5 py-3
Fixed position on mobile? Optional floating action.
```

### 5.2 Links

```css
text-brand, underline-offset-2
hover:underline, hover:text-brand-light
Within body text: font-medium
Navigation: no underline, font-medium
```

### 5.3 Navigation

**Desktop Header**
```
[Logo]  [Vehicles] [Locations ▼] [Rental Options ▼] [How It Works] [About ▼]  [🇺🇸/🇪🇸] [CTA Button]
```

- Sticky on scroll
- Background: white with subtle shadow when scrolled
- Height: ~72px
- Dropdown menus for Locations, Rental Options, About
- Language toggle: flag icon or "EN | ES"

**Mobile Header**
```
[☰] [Logo] [📞/WhatsApp]
```

- Slide-out drawer from right
- Full-height, white background
- All nav links stacked
- Language toggle at bottom
- Close button + backdrop overlay

### 5.4 Footer

**Layout (4-column desktop, stacked mobile)**
```
[Logo + tagline]  [Vehicles]  [Locations]  [Support]
                  [Rental Options]  [MIA]  [Contact]
                  [Deals]  [FLL]  [FAQ]
                  [Reviews]  [PBI]  [Privacy / Terms / Accessibility]
```

- Background: `brand-dark` (#0D141C)
- Text: white / gray-300
- Links: white, underline on hover
- Language toggle bottom
- © 305 Fleet | Turomina LLC at very bottom

### 5.5 Vehicle Card

```
┌─────────────────────────┐
│                         │
│    [Vehicle Photo]      │  ← Hero image, 16:9 or 4:3
│                         │
├─────────────────────────┤
│ Badge: "EV" or "Premium"│  ← Optional
│                         │
│ 2023 Tesla Model Y      │  ← text-xl, semibold
│ Long Range AWD          │  ← text-base, gray-500
│                         │
│ 🧑‍🤝‍🧑 5  │  🧳 2 large │  │  ← Passenger + luggage icons
│                         │
│ From $XX/day            │  ← text-lg, brand color
│                         │
│ [View Details →]        │  ← Primary button or text link
└─────────────────────────┘
```

### 5.6 Vehicle Detail Header

```
┌─────────────────────────────────────────────┐
│ [← Back to Vehicles]                        │
│                                             │
│ ┌──────────────────┐                        │
│ │                  │  2023 Tesla            │
│ │  Vehicle Gallery │  Model Y Long Range    │
│ │                  │  Midnight Silver       │
│ │  [◀] [▶] [●●●]  │                        │
│ │                  │  🧑‍🤝‍🧑 5 Passengers     │
│ │                  │  🧳 2 Large + 2 Carry-on│
│ └──────────────────┘  ⚡ Electric · 330 mi  │
│                       AWD · Autopilot       │
│                                             │
│ From $XX/day  [Check Availability →]       │
└─────────────────────────────────────────────┘
```

### 5.7 Availability Form (Staging/Mock)

```
┌──────────────────────────────────────────────┐
│  Find Your Vehicle                           │
│                                              │
│  ┌────────────┐  ┌────────────┐              │
│  │ Pickup Loc.│  │ Return Loc.│              │
│  │ ▼ MIA      │  │ ▼ Same     │              │
│  └────────────┘  └────────────┘              │
│                                              │
│  ┌──────────┐  ┌──────────┐                  │
│  │ Pickup   │  │ Return   │                  │
│  │ Date     │  │ Date     │                  │
│  └──────────┘  └──────────┘                  │
│                                              │
│  ┌────────────┐                               │
│  │ Driver Age │                               │
│  └────────────┘                               │
│                                              │
│  [Search Vehicles →]                          │
│                                              │
│  ⓘ Mock availability — no live reservations   │
└──────────────────────────────────────────────┘
```

### 5.8 Trust Strip / Benefit Bar

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  🛬      │ │  🚗      │ │  📱      │ │  ⭐      │
│ Airport  │ │ Newer    │ │ Real     │ │ Trusted  │
│ Delivery │ │ Fleet    │ │ Operator │ │ on Turo  │
│ MIA·FLL·PBI│ │ Well-   │ │ Direct   │ │ ★★★★★   │
│          │ │ Maintained│ │ Contact  │ │ Reviews  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### 5.9 Airport Delivery Explanation

A standard card pattern for each airport page:

```
┌────────────────────────────────────────────┐
│ 🛬 Miami International Airport (MIA)       │
│                                            │
│ How airport delivery works:                │
│ 1. You book your vehicle                   │
│ 2. We track your flight (or coordinate     │
│    arrival time)                           │
│ 3. Vehicle delivered to [location TBD]     │
│ 4. Walk-around inspection, keys handed over│
│ 5. Return: same location, coordinated time │
│                                            │
│ [View MIA Vehicles →]                      │
│                                            │
│ ⓘ Delivery details will be confirmed       │
│ at time of booking.                        │
└────────────────────────────────────────────┘
```

### 5.10 Policy Summary Card

Used on vehicle pages, How It Works, and Rental Requirements:

```
┌────────────────────────────────────────────┐
│ Requirements at a Glance                   │
│                                            │
│ 🧑 Age: 21+ (may vary by vehicle)          │
│ 🪪 License: Valid driver's license         │
│ 💳 Deposit: Required (amount varies)       │
│ 🛡️ Insurance: Required — options available │
│ 📋 Agreement: Signed before pickup         │
│                                            │
│ [Full Requirements →]                      │
└────────────────────────────────────────────┘
```

### 5.11 Alert / Notice States

**Info Notice**
```
┌────────────────────────────────────────┐
│ ℹ️  This is an informational message.  │
└────────────────────────────────────────┘
Background: brand-pale, border: brand-light, text: brand-dark
```

**Warning Notice**
```
┌────────────────────────────────────────┐
│ ⚠️  Important policy or requirement.   │
└────────────────────────────────────────┘
Background: amber-50, border: amber-300, text: amber-900
```

**Mock Data Warning (Staging Only)**
```
┌────────────────────────────────────────┐
│ 🧪 STAGING — No live reservations.     │
│    Vehicle availability, pricing, and  │
│    booking features are for preview    │
│    only.                               │
└────────────────────────────────────────┘
Background: yellow-50, border: yellow-400, text: yellow-800
```

### 5.12 Confirmation State (Future)

```
┌────────────────────────────────────────┐
│ ✅ Reservation Request Submitted        │
│                                        │
│ We've received your request.           │
│ Your reservation is NOT yet confirmed. │
│                                        │
│ You'll receive confirmation within     │
│ [timeframe] once your information      │
│ has been verified.                     │
│                                        │
│ Reference: #305F-XXXX                  │
│                                        │
│ [Contact Support]                      │
└────────────────────────────────────────┘
```

### 5.13 Pending State

```
⏳ Checking availability...
   (spinner or skeleton)

⏳ Verifying your information...
⏳ Processing payment...
⏳ Confirming reservation...
```

### 5.14 Error State

```
❌ Something went wrong.

   [Specific error message — not raw technical error]
   [Recovery action: Try again / Contact support]
```

---

## 6. Accessibility Requirements

- **WCAG 2.1 AA minimum** — AAA where practical
- **Color contrast:** 4.5:1 minimum for text, 3:1 for large text (18px+ bold or 24px+)
- **Focus states:** Visible focus ring (2px brand-blue outline) on all interactive elements
- **Keyboard navigation:** All interactive elements reachable via Tab, logical order
- **Screen readers:** Semantic HTML, ARIA labels where needed, alt text on all images
- **Skip to content:** Skip link as first focusable element
- **Forms:** Labels associated with inputs, error messages linked via aria-describedby
- **Language:** `lang="en"` on English pages, `lang="es"` on Spanish pages
- **Reduced motion:** Respect `prefers-reduced-motion` media query
- **Touch targets:** Minimum 44×44px for interactive elements on mobile

### Color Contrast Verification

| Combination | Ratio | Pass? |
|---|---|---|
| `#1A3A5C` on `#FFFFFF` | ~10.9:1 | ✅ AAA |
| `#1A3A5C` on `#F9FAFB` | ~9.8:1 | ✅ AAA |
| `#FFFFFF` on `#0D141C` | ~16.5:1 | ✅ AAA |
| `#374151` on `#FFFFFF` | ~7.6:1 | ✅ AAA |
| `#6B7280` on `#FFFFFF` | ~4.6:1 | ✅ AA |
| `#2E5A8A` on `#FFFFFF` | ~6.8:1 | ✅ AA |

---

## 7. Responsive Breakpoints

| Name | Width | Use |
|---|---|---|
| Base | 0-639px | Mobile (default mobile-first) |
| `sm` | 640px+ | Large phones, small tablets |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Small laptops, landscape tablets |
| `xl` | 1280px+ | Desktop |
| `2xl` | 1536px+ | Large desktop |

---

## 8. Iconography

Use Lucide icons (consistent with LIPP). Key icon mappings:

| Concept | Icon |
|---|---|
| Passengers | `users` or `user` |
| Luggage | `briefcase` or `luggage` |
| Fuel/Electric | `fuel`, `zap`, `battery-charging` |
| Airport | `plane` or `plane-landing` |
| Calendar/Date | `calendar` |
| Location | `map-pin` |
| Phone | `phone` |
| WhatsApp | Custom or `message-circle` |
| Check/Confirm | `check`, `check-circle` |
| Alert/Warning | `alert-triangle`, `alert-circle` |
| Info | `info` |
| Star/Review | `star` |
| Arrow | `arrow-right`, `chevron-right` |
| Close/X | `x` |
| Menu/Hamburger | `menu` |
| Search | `search` |
| Language | `globe` |

---

## 9. Favicon & Social Assets

### Favicon
- Source: `Small Circular Transparent Logo.png`
- Derived sizes needed: 16×16, 32×32, 48×48, 64×64, 128×128, 256×256
- Format: PNG (primary), ICO (legacy fallback)
- Apple Touch Icon: 180×180

### Social Sharing (og:image)
- Dimensions: 1200×630px
- Content: 305 Fleet logo + "South Florida Vehicle Rentals" tagline
- Template: Clean, on-brand background, legible at small sizes

### Social Meta
```html
<meta property="og:title" content="305 Fleet — South Florida Vehicle Rentals" />
<meta property="og:description" content="Newer vehicles, airport delivery, real operator. Miami · Fort Lauderdale · Palm Beach." />
<meta property="og:image" content="https://305fleet.com/images/social-card.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## 10. English / Spanish Layout Behavior

- Language toggle: Always visible in header and footer
- Spanish pages use `/es/` prefix (Astro i18n routing)
- All user-facing text translated (navigation, CTAs, forms, policies, vehicle descriptions)
- Spanish text typically 15-25% longer than English — design must accommodate
- Both languages use the same design system, components, and layout — only text changes
- `lang` attribute correctly set per page
- `hreflang` tags for SEO

---

## 11. Implementation Notes

### CSS Custom Properties

```css
:root {
  --color-brand: #1A3A5C;
  --color-brand-light: #2E5A8A;
  --color-brand-dark: #0D141C;
  --color-brand-pale: #EBF2F8;
  
  /* Tailwind will generate utilities from these via the config */
}
```

### Tailwind Configuration

Extend the default theme with brand colors. Use Tailwind v4 CSS-first config via `@theme` in main stylesheet.

### Component Architecture

```
src/
├── components/
│   ├── base/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── MobileNav.astro
│   │   ├── LanguageToggle.astro
│   │   └── SkipLink.astro
│   ├── ui/
│   │   ├── Button.astro
│   │   ├── Link.astro
│   │   ├── Badge.astro
│   │   ├── Alert.astro
│   │   └── Card.astro
│   ├── vehicles/
│   │   ├── VehicleCard.astro
│   │   ├── VehicleGrid.astro
│   │   ├── VehicleDetailHeader.astro
│   │   └── VehicleFeatures.astro
│   ├── booking/
│   │   ├── AvailabilityForm.astro
│   │   └── PriceDisplay.astro
│   └── sections/
│       ├── HeroSection.astro
│       ├── BenefitStrip.astro
│       ├── HowItWorks.astro
│       ├── AirportCoverage.astro
│       ├── ReviewsPreview.astro
│       └── ContactPanel.astro
```

This matches the pattern Jon will scaffold with Astro 7.
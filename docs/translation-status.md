# 305 Fleet — Translation Status Record

**Last Updated:** 2026-07-10
**Policy:** Spanish content is `draft_translation` until professionally reviewed.

---

## Status Definitions

| Status | Meaning |
|---|---|
| ✅ Complete | Content exists and renders |
| 🔄 Draft | Spanish translation written by Nik, not human-reviewed |
| ⏳ Pending | Human review by approved translator required |
| 🚫 Blocked | Blocked on content or approval |

---

## Route-by-Route Status

### English Pages (Source)

| Route | English Source Complete | Notes |
|---|---|---|
| `/` | ✅ | Home page — full content |
| `/vehicles/` | ✅ | Vehicle listing — renders from JSON |
| `/vehicles/[slug]/` | ✅ | Vehicle detail — renders from JSON |
| `/locations/miami-international-airport/` | ✅ | MIA page |
| `/locations/fort-lauderdale-airport/` | ✅ | FLL page |
| `/locations/palm-beach-airport/` | ✅ | PBI page |
| `/rental-options/daily/` | ✅ | |
| `/rental-options/weekly/` | ✅ | |
| `/rental-options/monthly/` | ✅ | |
| `/rental-options/business-corporate/` | ✅ | |
| `/how-it-works/` | ✅ | |
| `/rental-requirements/` | ✅ | |
| `/rental-policies/` | ✅ | |
| `/optional-extras/` | ✅ | |
| `/deals/` | ✅ | |
| `/reviews/` | ✅ | |
| `/about/` | ✅ | |
| `/contact/` | ✅ | |
| `/faq/` | ✅ | |
| `/support/` | ✅ | |
| `/privacy/` | ✅ | Placeholder legal content |
| `/terms/` | ✅ | Placeholder legal content |
| `/accessibility/` | ✅ | |
| `/404` | ✅ | |

### Spanish Pages (Translation)

| Route | Spanish Draft Complete | Human Review | Approved for Preview | Approved for Production | Notes |
|---|---|---|---|---|---|
| `/es/` | ✅ | ⏳ | ✅ | 🚫 | Full home page — hero, benefits, vehicles, airports, how-it-works, reviews, CTA |
| `/es/vehicles/` | ✅ | ⏳ | ✅ | 🚫 | Vehicle listing — UI strings translated |
| `/es/vehicles/[slug]/` | ✅ | ⏳ | ✅ | 🚫 | Vehicle detail — UI strings translated, content from JSON |
| `/es/locations/miami-international-airport/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page — links to English version |
| `/es/locations/fort-lauderdale-airport/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page — links to English version |
| `/es/locations/palm-beach-airport/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page — links to English version |
| `/es/how-it-works/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/about/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/contact/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/faq/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/support/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/deals/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/reviews/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/rental-requirements/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/rental-policies/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/optional-extras/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/privacy/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/terms/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |
| `/es/accessibility/` | ✅ | ⏳ | ✅ | 🚫 | Bridge page |

---

## Translation Scope

### Fully Translated Pages (Full Spanish Content)
- `/es/` (home page)
- `/es/vehicles/` (vehicle listing — UI strings in Spanish, vehicle data from JSON)
- `/es/vehicles/[slug]/` (vehicle detail — UI strings in Spanish, vehicle data from JSON)

### Bridge Pages (Spanish Shell + English Content Link)
All other Spanish pages show a Spanish-language notice indicating the page is under development and linking to the English version. These are not full translations.

### UI Strings
Navigation, CTAs, footer, vehicle labels, and language switcher are translated in `src/config/i18n.ts`. These are draft translations.

---

## Review Requirements

Before production publication:

1. **Human translator review** of all Spanish UI strings in `src/config/i18n.ts`
2. **Full content translation** of all bridge pages (replace bridge shell with real Spanish content)
3. **Legal page review** (privacy, terms) by qualified translator — legal language requires precision
4. **Vehicle content translation** — descriptions, taglines, features from Airtable need Spanish versions
5. **Cultural review** — ensure tone, formality level, and terminology match South Florida Spanish-speaking market expectations
6. **Final approval** from Ian before production launch

---

## Internal Label

All Spanish pages carry `lang="es"` in the HTML element. The BaseLayout accepts a `lang` prop. No page should declare `lang="es"` without the content being at least draft translation status.

**Current state:** All Spanish content is `draft_translation`. No Spanish page is approved for production.
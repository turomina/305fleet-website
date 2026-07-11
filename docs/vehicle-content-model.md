# 305 Fleet — Vehicle Content Model

**Version:** 1.0
**Date:** 2026-07-10
**Status:** Draft — Pending fleet inventory from Ian

---

## Purpose

This content model defines every field needed to merchandise a 305 Fleet vehicle on the website. It separates marketing-controlled content (descriptions, photos, use cases) from Wheelbase-controlled transactional data (availability, pricing, insurance).

---

## Content Schema

### Vehicle Identifier Block

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Internal vehicle identifier, e.g. `305f-tesla-model-y-2023` |
| `wheelbase_id` | String | When available | Wheelbase vehicle ID for API integration |
| `turo_url` | URL | When available | Link to active Turo listing |
| `status` | Enum | Yes | `active`, `inactive`, `maintenance`, `coming_soon` |

### Public Identity Block

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Public display name, e.g. "2023 Tesla Model Y Long Range" |
| `slug` | String | Yes | URL slug, e.g. `tesla-model-y-2023` |
| `year` | Integer | Yes | Model year |
| `make` | String | Yes | Manufacturer, e.g. "Tesla" |
| `model` | String | Yes | Model name, e.g. "Model Y" |
| `trim` | String | Yes | Trim level, e.g. "Long Range AWD" |
| `exterior_color` | String | Yes | Exterior color name |
| `interior_color` | String | Yes | Interior color name |

### Capacity Block

| Field | Type | Required | Description |
|---|---|---|---|
| `passenger_capacity` | Integer | Yes | Number of passengers (including driver) |
| `luggage_large` | Integer | Yes | Large checked-bag capacity |
| `luggage_carryon` | Integer | No | Carry-on bag capacity |
| `doors` | Integer | No | Number of doors |
| `cargo_notes` | String | No | Notes on cargo configuration, fold-down seats, etc. |

### Powertrain Block

| Field | Type | Required | Description |
|---|---|---|---|
| `fuel_type` | Enum | Yes | `gasoline`, `hybrid`, `plug_in_hybrid`, `electric`, `diesel` |
| `mpg_city` | Integer | No | City MPG (gas/hybrid) |
| `mpg_highway` | Integer | No | Highway MPG (gas/hybrid) |
| `ev_range_miles` | Integer | No | EPA estimated range (electric/plugin) |
| `transmission` | Enum | Yes | `automatic`, `manual` |
| `drivetrain` | Enum | Yes | `fwd`, `rwd`, `awd`, `4wd` |

### Features Block

| Field | Type | Required | Description |
|---|---|---|---|
| `key_features` | String[] | Yes | Top 5-8 key features (Apple CarPlay, sunroof, leather, etc.) |
| `safety_features` | String[] | No | Safety features (backup camera, blind-spot monitoring, etc.) |
| `tech_features` | String[] | No | Tech features (navigation, premium audio, wireless charging) |
| `comfort_features` | String[] | No | Comfort features (heated seats, climate zones, etc.) |

### Marketing Block (Our Content)

| Field | Type | Required | Description |
|---|---|---|---|
| `best_for` | String[] | Yes | Use cases: `airport_traveler`, `family`, `business`, `luxury_suv`, `ev_hybrid`, `road_trip` |
| `airport_suitable` | Boolean | Yes | Suitable for airport delivery? (luggage capacity check) |
| `description_en` | String (Markdown) | Yes | English long description — 150-300 words |
| `description_es` | String (Markdown) | Yes | Spanish long description — 150-300 words |
| `tagline_en` | String | Yes | English one-liner, e.g. "Spacious electric SUV — perfect for family Miami trips" |
| `tagline_es` | String | Yes | Spanish one-liner |
| `seo_title` | String | No | Custom SEO title if different from name |
| `seo_description` | String | No | Meta description for search results |

### Pricing Display Block (Marketing-controlled)

> ⚠️ These are DISPLAY FIELDS for the website only. Actual pricing is controlled by Wheelbase.

| Field | Type | Required | Description |
|---|---|---|---|
| `price_display_daily` | String | No | "From $XX/day" — marketing display only |
| `price_display_weekly` | String | No | "From $XX/week" — marketing display only |
| `price_display_monthly` | String | No | "From $XX/month" — marketing display only |
| `mileage_allowance_display` | String | No | e.g. "200 miles/day included" — display only |
| `deposit_display` | String | No | e.g. "$200 refundable deposit" — display only |

### Transactional Data (Wheelbase-controlled)

> These fields exist in Wheelbase, not in our content model. Listed for awareness and schema alignment only. DO NOT duplicate here — these are Wheelbase's source of truth.

| Concept | Wheelbase Source |
|---|---|
| Live availability calendar | Wheelbase inventory |
| Current pricing (daily, weekly, monthly) | Wheelbase rates |
| Taxes and fees | Wheelbase |
| Deposit amount | Wheelbase |
| Insurance options and pricing | Wheelbase |
| Driver requirements | Wheelbase |
| Booking status | Wheelbase reservations |
| Payment status | Wheelbase |
| Contract status | Wheelbase |
| Mileage limits per booking | Wheelbase rates |

### Media Block

| Field | Type | Required | Description |
|---|---|---|---|
| `hero_image` | String (path) | Yes | Primary vehicle photo — exterior, well-lit, 3/4 angle preferred |
| `gallery` | String[] (paths) | Yes | Additional photos: front, rear, interior, dashboard, cargo, key features |
| `photo_credit` | String | No | Photographer credit |
| `photo_date` | Date | No | Date photos were taken |
| `photo_notes` | String | No | Notes about photo accuracy (e.g., "Stock photo pending real shoot") |

### Verification Block

| Field | Type | Required | Description |
|---|---|---|---|
| `verified_year_make_model` | Boolean | Yes | Year, make, model, trim verified against VIN/registration? |
| `verified_photos_accurate` | Boolean | Yes | Do photos accurately represent CURRENT vehicle condition? |
| `verified_specs` | Boolean | Yes | Capacity, features, fuel type verified? |
| `missing_info` | String[] | No | List of fields needing verification |
| `last_verified` | Date | No | Date of last verification |
| `verified_by` | String | No | Who verified (Ian / staff name) |

---

## Example Vehicle Entry (Template)

```yaml
id: "305f-tesla-model-y-2023"
wheelbase_id: null  # pending onboarding
turo_url: "https://turo.com/us/en/suv-rental/united-states/..." # pending
status: "active"

name: "2023 Tesla Model Y Long Range"
slug: "tesla-model-y-2023"
year: 2023
make: "Tesla"
model: "Model Y"
trim: "Long Range AWD"
exterior_color: "Midnight Silver Metallic"
interior_color: "Black"

passenger_capacity: 5
luggage_large: 2
luggage_carryon: 2
doors: 5
cargo_notes: "Fold-flat rear seats, front trunk (frunk) for additional storage"

fuel_type: "electric"
ev_range_miles: 330
transmission: "automatic"
drivetrain: "awd"

key_features:
  - "Autopilot with adaptive cruise control"
  - "15-inch touchscreen with navigation"
  - "All-glass panoramic roof"
  - "Premium audio system"
  - "Heated front and rear seats"
  - "Wireless phone charging"
  - "Phone key / keyless entry"
  - "Supercharger network access"

safety_features:
  - "360° camera system"
  - "Automatic emergency braking"
  - "Blind-spot monitoring"
  - "Lane-keeping assist"

best_for:
  - "airport_traveler"
  - "family"
  - "ev_hybrid"
  - "business"
  - "road_trip"

airport_suitable: true

tagline_en: "All-electric SUV — zero emissions, full comfort, Miami to Palm Beach on a single charge"
tagline_es: "SUV totalmente eléctrico — cero emisiones, máxima comodidad, de Miami a Palm Beach con una sola carga"

description_en: |
  ## placeholder — to be written when real fleet confirmed

description_es: |
  ## placeholder — to be written when real fleet confirmed

price_display_daily: null  # Ian to provide
price_display_weekly: null
price_display_monthly: null
mileage_allowance_display: null
deposit_display: null

hero_image: null  # pending real photography
gallery: []
photo_credit: null
photo_date: null
photo_notes: "Awaiting real vehicle photography"

verified_year_make_model: false
verified_photos_accurate: false
verified_specs: false
missing_info:
  - "Turo listing URL"
  - "Wheelbase ID"
  - "Real photography"
  - "Pricing"
  - "Insurance options"
last_verified: null
verified_by: null
```

---

## Fleet Inventory Worksheet

> **Ian to complete.** Add one row per vehicle currently in the 305 Fleet.

| # | Year | Make | Model | Trim | Color | Fuel | Passengers | Airport Ready? | Turo URL | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | | |
| 2 | | | | | | | | | | |
| 3 | | | | | | | | | | |
| 4 | | | | | | | | | | |
| 5 | | | | | | | | | | |
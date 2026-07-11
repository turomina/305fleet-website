# Airtable Vehicles Audit — 305 Fleet

**Date:** 2026-07-10
**Base:** 305 Fleet (`appkmBi0ahPC7xWJW`)
**Records:** 7 vehicles
**Status:** DRAFT — awaiting Ian review

---

## Schema Summary

| Field | Type | Notes |
|---|---|---|
| Vehicle Name | Text | Internal nickname — may not be suitable for public website |
| Host/Setup | Select | 305Fleet, FBS, FBS-3rd Party, 305Fleet-3rd Party |
| VIN | Text | ⛔ NEVER expose publicly |
| Tag | Text | ⛔ NEVER expose publicly |
| Year | Number | |
| Make | Text | |
| Model | Text | |
| Color | Text | |
| Type | Multi-select | SUV, Sedan, Convertible, Pickup |
| Fuel Type | Select | Gas-Regular, Gas-Premium, Hybrid, Plug-In Hybrid, Electric |
| Mileage | Number | All records show 0 — not yet populated |
| Availability Status | Select | Available, Rented, Out of Service, In Service |
| Maintenance Logs | Linked | → Maintenance Logs table |

### Missing Fields (Needed for Website)

| Field | Priority | Notes |
|---|---|---|
| Trim | HIGH | Only Model present; trim is critical for vehicle listings |
| Photos | HIGH | No attachment field exists |
| Turo URL | HIGH | No field; need URLs for reconciliation |
| Passenger Capacity | MEDIUM | Standard vehicle spec |
| Luggage Capacity | MEDIUM | Important for airport rentals |
| Transmission | MEDIUM | Automatic/manual |
| Website Publication Status | HIGH | Published / Preview Only / Hidden / Retired |
| Public Description | MEDIUM | Marketing copy |
| Public Name | HIGH | Customer-facing name vs. internal nickname |
| Drivetrain | LOW | AWD/FWD/RWD |
| Interior Color | LOW | |

---

## Vehicle Inventory

### 305Fleet Vehicles (4 records)

| # | Internal Name | Year | Make | Model | Fuel | Color | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Kong | 2025 | Cadillac | Escalade ESV | Gas-Premium | Black | Full-size luxury SUV. No VIN in Airtable. |
| 2 | Tokyo | 2024 | Audi | Q4 e-tron | Electric | Black | Electric compact SUV. |
| 3 | Ikea | 2025 | Volvo | XC90 T8 PHEV | Plug-In Hybrid | Black | Plug-in hybrid 3-row SUV. |
| 4 | Mama | 2026 | Mercedes | GLC300 | Gas-Premium | Black | Late-model compact luxury SUV. |

### FBS Vehicles (2 records)

| # | Internal Name | Year | Make | Model | Fuel | Color | Notes |
|---|---|---|---|---|---|---|---|
| 5 | Vader | 2021 | Toyota | Highlander Hybrid XLE | Gas-Regular ⚠️ | Black | Fuel type likely incorrect — this is a Hybrid. |
| 6 | Mosca | 2021 | Audi | Q3 | Gas-Regular | Black | Compact SUV. |

### FBS-3rd Party Vehicles (1 record)

| # | Internal Name | Year | Make | Model | Fuel | Color | Notes |
|---|---|---|---|---|---|---|---|
| 7 | Varela | 2025 | Mitsubishi | Outlander SEL PHEV | Plug-In Hybrid | Black | 3rd-party operated. |

---

## Data Quality Issues

| Issue | Vehicles Affected | Severity |
|---|---|---|
| Mileage = 0 for all records | All 7 | HIGH — data not populated |
| Fuel type mismatch: "Vader" is a Highlander Hybrid but listed as Gas-Regular | Vader | MEDIUM |
| No Trim data exists in schema | All 7 | HIGH |
| No photos in Airtable | All 7 | HIGH |
| No Turo URL field in schema | All 7 | HIGH |
| All vehicles are Black SUVs — needs verification | All 7 | LOW — plausible but worth confirming |
| "Vader" VIN model year digit: M → 2021 Toyota Highlander. Fuel field is wrong. | Vader | Confirmed — data error |
| "Mama" is listed as "Mercedes" Make but Mercedes-Benz is conventional | Mama | LOW — branding preference |

---

## Publication Recommendations

| Vehicle | Host | Recommendation | Rationale |
|---|---|---|---|
| Kong | 305Fleet | **PUBLISH** — priority 1 | Flagship vehicle: 2025 Escalade ESV, premium |
| Tokyo | 305Fleet | **PUBLISH** | 2024 Audi Q4 e-tron, EV — strong differentiator |
| Ikea | 305Fleet | **PUBLISH** | 2025 Volvo XC90 T8 — plug-in hybrid, family |
| Mama | 305Fleet | **PUBLISH** | 2026 Mercedes GLC300 — newest vehicle |
| Vader | FBS | **AWAITING IAN** | FBS vehicle — needs Ian's decision |
| Mosca | FBS | **AWAITING IAN** | FBS vehicle — needs Ian's decision |
| Varela | FBS-3rd Party | **AWAITING IAN** | Third-party — unlikely for direct website |

---

## Decision Table for Ian

| # | Decision | Context |
|---|---|---|
| D1 | Should FBS vehicles (Vader, Mosca) appear on 305Fleet.com? | FBS is a separate Host/Setup category |
| D2 | Should FBS-3rd Party vehicles (Varela) appear? | Third-party operated; brand/reputation risk |
| D3 | Are internal nicknames (Kong, Vader, Tokyo, etc.) approved as public names? | Current names are internal-only |
| D4 | What public-facing name should each vehicle use? | e.g., "2025 Cadillac Escalade ESV" vs "Kong" |
| D5 | Turo URLs — do they exist? Where are they? | No Turo URL field in Airtable |
| D6 | Trim levels — provide for each vehicle? | Only Model currently populated |
| D7 | Vehicle photos — timeline and source? | No photo attachments in Airtable |
| D8 | Mileage — can this be populated? | All records show 0 |
| D9 | Vader fuel type: Hybrid or Gas-Regular? | Data conflict in Airtable |
| D10 | Public phone number for website? | Currently hidden until provided |
| D11 | Public WhatsApp number for website? | Currently hidden until provided |
| D12 | Public email address for website? | Currently using placeholder |
| D13 | Vehicle descriptions — who writes? | Airtable has no description field |

---

## Next Steps After Ian Review

1. Add missing Airtable fields (Trim, Photos, Turo URL, Website Status, Description)
2. Populate Mileage for all vehicles
3. Obtain Turo listing URLs
4. Normalize public vehicle data file (no VINs, tags, internal notes)
5. Source real vehicle photos
6. Write marketing descriptions in 305 Fleet voice
7. Deploy real vehicle content to preview

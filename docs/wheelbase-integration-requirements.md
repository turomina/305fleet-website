# 305 Fleet — Wheelbase Integration Requirements

**Version:** 1.0
**Date:** 2026-07-10
**Prepared by:** Nik (Marketing, UX)
**For:** Jon (Technical Architecture & Integration)
**Status:** Draft — For Jon's Technical Review

---

## Purpose

This document identifies the data and actions the 305 Fleet website will eventually require from Wheelbase. It serves as a requirements baseline for Jon's technical integration planning.

**Important:** Do not assume any endpoint or capability exists until verified against current Wheelbase documentation or sandbox access.

---

## Current Wheelbase Understanding

Based on initial research (docs.wheelbasepro.com):

- Wheelbase provides an **embedded widget/SDK** (`wheelbase.startBooking()`) for rental websites
- They offer a **standalone shop link** for hosted booking pages
- An API is reportedly in development — status and capabilities need verification
- The embedded approach uses JavaScript components injected into the host page

---

## Integration Modes (In Priority Order)

### Mode 1: API-First (Preferred Long-Term)

The website calls Wheelbase APIs server-side (via Pages Functions), receives JSON data, and renders the complete booking experience within the 305 Fleet brand and layout.

**Advantages:**
- Full control over UX, design, copy, and customer journey
- Consistent 305 Fleet brand throughout booking
- No third-party branding or navigation leakage
- Bilingual support fully controlled by us
- Analytics and conversion tracking integrated

**Requires:**
- Wheelbase REST/JSON API availability
- API key management (server-side via Pages Functions)
- Comprehensive integration testing against sandbox

### Mode 2: Hybrid Widget (Interim Bridge)

Use Wheelbase's embedded widget for the booking transaction while wrapping it in the 305 Fleet website shell (header, footer, vehicle browsing). The booking flow hands off to the widget at the transaction stage.

**Advantages:**
- Faster to implement if API is immature
- Wheelbase handles booking logic, payments, agreements
- Proven path — many rental operators use this

**Disadvantages:**
- Less control over UX within the widget
- Third-party UI elements within brand experience
- May not support bilingual natively
- Limited analytics visibility inside widget

### Mode 3: Standalone Shop Link (Fallback)

"Book Now" links to a Wheelbase-hosted booking page. Minimal integration effort but weakest brand experience.

---

## Data Requirements

### 1. Vehicle Inventory

| Requirement | API Concept | Priority |
|---|---|---|
| List all active vehicles | `GET /vehicles` or equivalent | Critical |
| Get single vehicle details | `GET /vehicles/{id}` | Critical |
| Vehicle specifications (year, make, model, trim, color) | Vehicle object fields | Critical |
| Passenger and luggage capacity | Vehicle object fields | Critical |
| Vehicle photos | Image URLs | Critical |
| Vehicle status (active/inactive/maintenance) | Status field | High |
| Vehicle features and amenities | Features array/list | High |
| Fuel type / EV range | Vehicle specs | High |
| Location availability (which airports/locations) | Location associations | High |

### 2. Availability & Rates

| Requirement | API Concept | Priority |
|---|---|---|
| Check vehicle availability for date range | `POST /availability` or `GET /vehicles/{id}/availability` | Critical |
| Get daily rate for vehicle | Rate field in availability response | Critical |
| Get weekly rate | Rate calculation or separate field | Critical |
| Get monthly rate | Rate calculation or separate field | High |
| Multi-vehicle availability search | `POST /search` with filters | High |
| Minimum rental duration per vehicle | Policy field | High |
| Blackout dates | Calendar block data | High |
| Same-day booking cutoff time | Policy field | Medium |

### 3. Locations

| Requirement | API Concept | Priority |
|---|---|---|
| List delivery/pickup locations | `GET /locations` | Critical |
| Location details (address, hours, instructions) | Location object | Critical |
| Location-to-vehicle availability mapping | Vehicle-location association | High |
| Delivery fee by location | Location fee field | High |
| One-way rental support (different pickup/return) | Booking capability | Medium |

### 4. Pricing & Fees

| Requirement | API Concept | Priority |
|---|---|---|
| Base rental rate (daily/weekly/monthly) | Rate fields | Critical |
| Taxes | Tax calculation | Critical |
| Fees (airport, delivery, cleaning, etc.) | Fee breakdown | Critical |
| Deposit amount | Deposit field | Critical |
| Mileage allowance and overage rate | Mileage policy | High |
| Optional extras pricing | Add-on pricing | High |
| Promo/discount codes | Discount API | Medium |
| Total quote with breakdown | Quote calculation endpoint | Critical |

### 5. Booking Creation

| Requirement | API Concept | Priority |
|---|---|---|
| Create booking hold (temporary reservation) | `POST /bookings/hold` | Critical |
| Convert hold to confirmed booking | `POST /bookings/{id}/confirm` | Critical |
| Release/expire hold | Booking hold timeout or `DELETE` | Critical |
| Booking status | Status field on booking object | Critical |
| Idempotency support | Idempotency key header | High |

### 6. Renter Information

| Requirement | API Concept | Priority |
|---|---|---|
| Submit renter personal information | Renter object in booking | Critical |
| Driver's license information | License fields | Critical |
| Date of birth / age verification | Age field + validation | Critical |
| Contact information (phone, email) | Contact fields | Critical |
| Additional drivers | Additional driver array | Medium |
| International license support | License country field | Medium |

### 7. Driver Verification

| Requirement | API Concept | Priority |
|---|---|---|
| Driver verification status | Verification status field | Critical |
| Required documents | Document requirements metadata | Critical |
| Verification webhook | `POST /webhooks/verification` | High |
| Verification failure reason | Failure reason field | Medium |

### 8. Insurance

| Requirement | API Concept | Priority |
|---|---|---|
| Available insurance options | Insurance products list | Critical |
| Insurance pricing per option | Price per insurance product | Critical |
| Insurance selection on booking | Insurance selection field | Critical |
| Personal insurance verification | Insurance verification workflow | High |
| Insurance coverage details | Coverage description per product | High |
| Declined coverage acknowledgment | Waiver/declination field | High |

### 9. Payments & Deposits

| Requirement | API Concept | Priority |
|---|---|---|
| Deposit amount calculation | Deposit field in quote | Critical |
| Payment authorization | Payment authorization endpoint | Critical |
| Payment capture | Payment capture endpoint | Critical |
| Payment status | Payment status field | Critical |
| Refund processing | Refund endpoint | High |
| Payment methods accepted | Payment method metadata | Medium |
| Payment failure handling | Failure reason + retry | High |

### 10. Rental Agreements

| Requirement | API Concept | Priority |
|---|---|---|
| Generate rental agreement | Agreement generation endpoint | Critical |
| Agreement terms/document | Agreement document URL or content | Critical |
| Signature capture | Signature submission endpoint | Critical |
| Agreement status | Agreement status field | Critical |
| Agreement version/history | Version tracking | Medium |

### 11. Booking Management (Post-Booking)

| Requirement | API Concept | Priority |
|---|---|---|
| View booking details | `GET /bookings/{id}` | Critical |
| Modify booking dates | `PUT /bookings/{id}` or specific endpoint | High |
| Extend rental | Extension endpoint | High |
| Cancel booking | `DELETE /bookings/{id}` or cancellation endpoint | High |
| Cancellation policy / fees | Cancellation rules metadata | Critical |
| Refund on cancellation | Refund calculation | High |
| Booking modification history | Audit log | Medium |

### 12. Webhooks

| Requirement | Event | Priority |
|---|---|---|
| Booking confirmed | `booking.confirmed` | Critical |
| Booking modified | `booking.updated` | High |
| Booking cancelled | `booking.cancelled` | Critical |
| Payment succeeded | `payment.succeeded` | Critical |
| Payment failed | `payment.failed` | Critical |
| Verification complete | `verification.complete` | High |
| Verification failed | `verification.failed` | High |
| Agreement signed | `agreement.signed` | High |
| Booking reminder triggers | `booking.reminder` (pre-pickup) | Medium |
| Return due | `booking.return_due` | Medium |
| Late return | `booking.late_return` | Medium |

### 13. Customer Records

| Requirement | API Concept | Priority |
|---|---|---|
| Customer profile | Customer object | High |
| Booking history per customer | Booking list endpoint | High |
| Repeat customer recognition | Returning-customer flag | Medium |
| Customer communication preferences | Preferences object | Low |

### 14. Calendar & Synchronization

| Requirement | API Concept | Priority |
|---|---|---|
| Vehicle availability calendar | Calendar data (iCal or API) | Critical |
| Maintenance block creation | Manual block endpoint | High |
| Turo booking synchronization | Integration requirement (separate from Wheelbase) | Critical |
| Google Calendar integration | Calendar sync (operational visibility) | High |
| Turnaround buffer time | Buffer configuration | High |

---

## Technical Requirements

### API Qualities

| Requirement | Description |
|---|---|
| REST/JSON | Standard HTTP REST with JSON responses |
| Authentication | API key or OAuth2 — server-side only (Pages Functions) |
| Rate limiting | Documented limits — Pages Functions should queue/retry gracefully |
| Idempotency | Support for idempotency keys on booking, payment, and modification endpoints |
| Error responses | Structured error objects with machine-readable codes and human-readable messages |
| Sandbox | Test environment with mock data for development/staging |
| Versioning | API version in URL or header — protect against breaking changes |

### Security Requirements

| Requirement | Description |
|---|---|
| API keys never in frontend | All Wheelbase calls proxied through Pages Functions |
| HTTPS only | All API communication encrypted in transit |
| Input validation | Server-side validation in Pages Functions before proxying to Wheelbase |
| Rate limiting | Pages Functions rate limiting to prevent abuse |
| No PII in URLs | All renter data sent in request body, never query parameters |

---

## Open Questions for Jon

1. What is the current status of Wheelbase's API? REST/JSON? GraphQL? Still in development?
2. Does Wheelbase provide a sandbox/test environment?
3. What is the authentication model (API key, OAuth)?
4. Does Wheelbase support webhooks? What events?
5. Can the embedded widget be styled/customized to match our brand?
6. Does the widget support bilingual (English/Spanish)?
7. What is the idempotency model for booking creation?
8. Are there documented rate limits?
9. Does Wheelbase support calendar export (iCal feed) for external synchronization?
10. What is the recommended approach for Turo → Wheelbase calendar synchronization?

---

## Next Steps

1. **Jon:** Verify Wheelbase API availability, documentation, and sandbox access
2. **Jon:** Set up test credentials and sandbox environment
3. **Jon:** Document actual API endpoints (vs. this requirements document)
4. **Nik:** Design booking UX pages and states (pending, confirmed, error)
5. **Ian:** Confirm Wheelbase onboarding status and account access
6. **Team:** Staging integration test after website foundation is built
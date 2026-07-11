# 305 Fleet — Project Brief

**Version:** 1.0
**Date:** 2026-07-10
**Author:** Nik (305Fleet Marketing Agent)
**Status:** Draft — Pending Ian Review

---

## 1. Business Objective

Launch a professionally designed, mobile-first customer website for 305 Fleet that builds direct-customer relationships, merchandise the fleet, and eventually supports direct booking through Wheelbase — while Turo remains the primary booking source initially.

## 2. Company

**Legal Entity:** Turomina LLC dba 305Fleet
**Operator:** Ian
**Service Area:** South Florida — Miami, Fort Lauderdale, Palm Beach, and surrounding areas
**Fleet Type:** Newer, well-maintained vehicles — family, business, premium, hybrid, and electric options
**Rental Periods:** Daily, weekly, and monthly

## 3. Primary Customer Groups

| Group | Primary Need | Key Concern |
|---|---|---|
| Airport Traveler | Convenient airport pickup/drop-off at MIA, FLL, or PBI | Reliability, clear pickup instructions, flight-delay flexibility |
| Family Renter | Spacious, safe vehicle for family trips | Passenger capacity, luggage space, child-seat availability, value |
| Business Traveler | Professional vehicle, minimal friction | Quick booking, airport delivery, clean presentation, receipt/invoice |
| Luxury SUV Renter | Premium vehicle for special occasions or comfort | Vehicle condition, real photos, specified trim level |
| EV / Hybrid Renter | Electric or fuel-efficient option | Range, charging access, fuel savings, environmental preference |
| Weekly Renter | Extended stay or temporary vehicle | Weekly pricing transparency, mileage limits, no long-term-contract feel |
| Monthly Renter | Temporary replacement or extended project | Competitive monthly rate, maintenance, insurance continuity |
| International Visitor | Rental from US airports with foreign license | Driver requirements, insurance, documentation, clear policies |
| Returning Customer | Repeat booking with known preferences | Fast rebooking, account/profile, loyalty recognition |
| Turo → Direct | Customer who discovered 305 Fleet on Turo and later books direct | Better pricing, personal relationship, consistent experience |

## 4. Service Area

### Airport Delivery
- Miami International Airport (MIA)
- Fort Lauderdale-Hollywood International Airport (FLL)
- Palm Beach International Airport (PBI)

### Potential Future Delivery Points
- PortMiami
- Port Everglades
- Hotel and residential delivery
- South Florida metro area

## 5. Brand Positioning

> "A locally operated South Florida fleet offering newer, well-maintained vehicles, straightforward pricing, airport delivery, and responsive personal service."

### Brand Attributes
- **Local** — not a faceless national chain
- **Professional** — serious about vehicle quality and service
- **Transparent** — clear policies, no hidden fees
- **Accessible** — real human operator, responsive communication
- **Practical** — family, business, and specialty vehicles for real South Florida use
- **Polished** — clean design, real photography, trustworthy presentation

### Brand Voice
- Direct and helpful, not flashy
- South Florida-aware but not clichéd
- Confident without being arrogant
- Warm without being informal
- English primary, Spanish supported

### NOT
- "Exotic car rental" vibe
- Stereotypical Miami luxury excess
- Discount/generic rental template
- Overpromising or inflating vehicle status

## 6. Turo's Role

Turo remains the primary booking source initially. The website should:
- Acknowledge Turo credibility (reviews, trust) as social proof
- Not discourage Turo bookings
- Build brand recognition so repeat customers seek direct booking
- Not duplicate or conflict with Turo terms

## 7. Wheelbase's Role

Wheelbase is onboarding as the backend for direct bookings. Intended functions include:
- Vehicle availability management
- Direct reservations
- Rental pricing
- Insurance offerings
- Driver verification
- Payments and deposits
- Rental agreements
- Reservation management

The Wheelbase embedded widget/SDK may be used as an interim bridge. Long-term, the native booking experience should follow the 305 Fleet brand, layout, and customer journey using Wheelbase's API when available.

## 8. Direct-Booking Objective

The long-term goal is a branded, native booking experience that:
1. Starts with date + location search
2. Shows real-time vehicle availability
3. Presents clear pricing with taxes and fees
4. Collects renter information
5. Completes driver verification
6. Offers insurance selection
7. Handles deposit and payment
8. Signs rental agreement
9. Confirms reservation (authority: Wheelbase)
10. Sends pickup instructions

## 9. Initial Launch Scope (Milestone 1)

### IN SCOPE
- Branded website foundation (Astro 7 + Tailwind CSS v4)
- Responsive, mobile-first layout
- Home page, Vehicle inventory, Individual vehicle pages
- Airport/location pages (MIA, FLL, PBI)
- Rental options pages (Daily, Weekly, Monthly, Business)
- How It Works, Rental Requirements, Rental Policies
- Optional Extras, FAQ, About, Contact, Support
- Privacy Policy, Terms, Accessibility
- English and Spanish versions
- Design system with reusable components
- Local development and staging deployment → Cloudflare Pages preview

### DEFERRED
- Live booking form (mock/staging only)
- Wheelbase integration (API or widget)
- Payment processing
- Driver verification
- Insurance selection
- Rental agreement signing
- Reservation management
- Calendar synchronization (Turo + Wheelbase + Google Calendar)
- Customer accounts/portals
- Corporate accounts
- Referral program
- Replacement rentals
- Port delivery pages
- Hotel/residential delivery

## 10. Key Customer Concerns (to address in copy/design)

1. "Is this a real company or a scam?"
2. "Will the vehicle look like the photos?"
3. "What happens if my flight is delayed?"
4. "What insurance do I need?"
5. "Can I drive with a foreign license?"
6. "What if something goes wrong with the vehicle?"
7. "Are there hidden fees?"
8. "How does pickup actually work at the airport?"
9. "Can I extend my rental?"
10. "What's the cancellation policy?"

## 11. Success Metrics (Milestone 1)

- Site loads under 2 seconds on mobile (Lighthouse score ≥ 90)
- All core pages built and responsive
- Design system documented and implemented
- English and Spanish pages functional
- Brand assets correctly deployed
- Preview/staging environment operational
- Clear handoff to Milestone 2

## 12. Major Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Wheelbase API not ready when needed | Medium | High | Design booking UI with abstraction layer; fallback to widget |
| Turo + Wheelbase double-booking | Medium | Critical | Require calendar sync testing before enabling direct booking |
| Domain not secured | Low | Medium | Flag to Ian early; can deploy to .pages.dev preview in meantime |
| Real vehicle photography unavailable | Medium | Medium | Design templates that work with placeholder images; plan photo shoot |
| Spanish content quality issues | Medium | Medium | Use professional translation; label as beta if needed |

## 13. Technical Dependencies

- **Jon:** Repository setup, Cloudflare Pages project, Git workflow, deployment configuration
- **Jon:** Local dev environment scaffolding (Astro 7 + Tailwind v4)
- **Jon:** Pages Functions for API proxying (when Wheelbase integration begins)
- **Ian:** Domain decision, GitHub repo creation, Cloudflare account access

## 14. Customer Data Considerations

At this stage:
- No customer data collected
- No forms that store PII
- No payment-card information
- No driver-license images
- Future: All PII must follow 1Password/OpenClaw secret-management workflow
- Future: Wheelbase should remain the authority for rental transactions

## 15. Decisions Requiring Ian

| # | Decision | Context | Urgency |
|---|---|---|---|
| D1 | **Domain name** | What domain will 305 Fleet use? (e.g., 305fleet.com, drive305fleet.com) | Medium — needed before production, not before preview |
| D2 | **GitHub repo name** | Jon suggests `305fleet-website` | Low — can rename |
| D3 | **Who creates GitHub repo** | Nik via token or Ian manually | Low |
| D4 | **Real vehicle photography** | Timeline for getting actual vehicle photos vs. placeholder images | Medium — affects launch readiness |
| D5 | **Wheelbase account status** | Current onboarding stage, sandbox access availability | Medium — informs integration planning |
| D6 | **Turo listing URLs** | List of active Turo listings for fleet vehicles | Medium — needed for vehicle content pages |
| D7 | **Fleet inventory list** | Current vehicles: year, make, model, trim, color | Medium — needed for vehicle content |
| D8 | **Pricing strategy** | Daily/weekly/monthly pricing — publish or show "starting at" ranges only? | Deferred to Milestone 2 |
| D9 | **Insurance provider** | What insurance options are offered? Through Wheelbase or separate? | Deferred to Milestone 2+ |

---

## 16. Phase 1 Checklist

- [x] Project folder audited
- [x] Brand assets inventoried
- [x] Brand asset manifest created
- [x] A2A to Jon sent (technical architecture & hosting)
- [ ] Jon's response received and documented
- [ ] Git initialized
- [ ] Framework configured
- [ ] Local dev environment running
- [ ] Project brief (this document) reviewed
- [ ] Site map created
- [ ] Customer journeys documented
- [ ] Vehicle content model defined
- [ ] Design system created
- [ ] Core components built
- [ ] Local website shell built
- [ ] Preview deployment ready
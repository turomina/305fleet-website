# 305Fleet Automation Boundary and Calendar Coordination

## Status: Documented — Not Activated

## Calendar Coordination Boundary

- Wheelbase will coordinate direct-rental availability
- Turo reservations should block corresponding vehicle dates
- Direct reservations should prevent overlapping availability
- Turo calendar data is for conflict prevention only
- Turo guests must NOT be imported into the direct-rental CRM unless authorized and necessary
- No guest messaging should be triggered from a calendar-only block
- Source-of-truth and conflict-resolution rules must be defined before activation

## Future Automation Flow (Documented — Not Activated)

Potential direct-rental triggers:

1. **Reservation confirmed** → Send welcome message
2. **12 hours before pickup** → Send airport preparation message
3. **Shortly before pickup** → Send private exact-location and access instructions
4. **12 hours before return** → Send airport-specific return instructions
5. **Missing location photo** → Send guest reminder and internal alert
6. **Incorrect return location** → Trigger exception workflow
7. **Retrieval complete** → Parking-charge reconciliation
8. **Trip closed** → Send separate feedback request

## Activation Gates

Do NOT activate until Ian provides approval for:
- Wheelbase integration
- Calendar sync
- External messaging
- Payments
- Parking charges
- Direct booking
- Final rental-agreement terms

## Trip Source Values

- 305Fleet Direct
- Wheelbase
- Manual
- Turo Calendar Block (unavailable dates only — NOT a 305Fleet rental reservation)
- Other Calendar Block

A `Turo Calendar Block` represents unavailable dates only. It must NOT trigger 305Fleet guest messages.

## Message Template Placeholders

```
{{guest_first_name}}
{{vehicle_name}}
{{airport_code}}
{{garage_name}}
{{level}}
{{zone}}
{{row_or_letter}}
{{space_number}}
{{trip_start_time}}
{{trip_end_time}}
{{pickup_parking_disclosure}}
{{retrieval_parking_disclosure}}
{{premium_parking_status}}
```

## Access Asset Security

Never store in Airtable, GitHub, website code, or message templates:
- Actual static lockbox combinations
- Credentials
- Access codes
- Guest location data in public APIs

The combination in Ian's historical message is confidential operational information.

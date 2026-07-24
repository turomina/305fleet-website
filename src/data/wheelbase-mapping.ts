/**
 * Wheelbase Rental ID Mapping
 *
 * Maps each public 305Fleet vehicle slug to its Wheelbase rental ID.
 * Used by W1.1 comparison variants and any future Wheelbase integration.
 *
 * Contains ONLY public vehicle identifiers. No internal nicknames, codes,
 * or private fleet designations.
 */

import vehicles from "./vehicles.json";

export const DEALER_ID = "5011907";

/** Public slug → Wheelbase rental ID */
export const WHEELBASE_RENTAL_IDS: Record<string, number> = {
  "2025-cadillac-escalade-esv": 526486,
  "2024-audi-q4-e-tron": 544341,
  "2025-volvo-xc90-t8-phev": 540520,
  "2026-mercedes-glc300": 544295,
  "2021-toyota-highlander-hybrid": 540525,
  "2021-audi-q3": 544327,
  "2025-mitsubishi-outlander-phev": 544339,
};

/** Returns vehicles that have a Wheelbase rental ID mapped */
export function getWheelbaseVehicles() {
  return vehicles.filter(
    (v) => WHEELBASE_RENTAL_IDS[v.slug as keyof typeof WHEELBASE_RENTAL_IDS]
  );
}

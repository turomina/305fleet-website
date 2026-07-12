// Centralized display labels for vehicle data enums
// Used across EN and ES pages to avoid raw enum values in the UI

export const FUEL_LABELS: Record<string, { en: string; es: string }> = {
  premium_gasoline: { en: "Premium Gasoline", es: "Gasolina premium" },
  electric: { en: "Electric", es: "Eléctrico" },
  plug_in_hybrid: { en: "Plug-in Hybrid", es: "Híbrido enchufable" },
  hybrid: { en: "Hybrid", es: "Híbrido" },
  gasoline: { en: "Gasoline", es: "Gasolina" },
  diesel: { en: "Diesel", es: "Diésel" },
};

export const BEST_FOR_LABELS: Record<string, { en: string; es: string }> = {
  airport_traveler: { en: "Airport Travelers", es: "Viajeros de aeropuerto" },
  family: { en: "Families", es: "Familias" },
  luxury: { en: "Luxury", es: "Lujo" },
  eco_conscious: { en: "Eco-Conscious", es: "Conciencia ecológica" },
  business: { en: "Business Travelers", es: "Viajeros de negocios" },
  groups: { en: "Groups", es: "Grupos" },
  couples: { en: "Couples", es: "Parejas" },
  long_term: { en: "Long-Term Rentals", es: "Alquileres largos" },
};

export function getFuelLabel(value: string, lang: "en" | "es" = "en"): string {
  return FUEL_LABELS[value]?.[lang] ?? value;
}

export function getBestForLabels(values: string[], lang: "en" | "es" = "en"): { en: string; es: string }[] {
  return values
    .map((v) => BEST_FOR_LABELS[v])
    .filter(Boolean);
}

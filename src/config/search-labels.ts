// Availability Search — i18n labels
export const SEARCH_LABELS = {
  en: {
    where: "Where",
    from: "From",
    until: "Until",
    startTime: "Start time",
    endTime: "End time",
    search: "Search",
    searching: "Searching…",
    selectLocation: "Select pickup location",
    airports: "Airports",
    custom: "Custom Delivery Address",
    customPlaceholder: "Enter delivery address",
    customNotice: "Custom delivery is subject to confirmation.",
    validationRequired: "Please complete all fields before searching.",
    validationDateOrder: "End date must be after start date.",
    validationSameDay: "For same-day rentals, end time must be after start time.",
    locationMIA: "Miami International Airport — MIA",
    locationFLL: "Fort Lauderdale-Hollywood International Airport — FLL",
    locationPBI: "Palm Beach International Airport — PBI",
    locationCustom: "Custom delivery address",
  },
  es: {
    where: "Dónde",
    from: "Desde",
    until: "Hasta",
    startTime: "Hora de inicio",
    endTime: "Hora de fin",
    search: "Buscar",
    searching: "Buscando…",
    selectLocation: "Seleccione lugar de recogida",
    airports: "Aeropuertos",
    custom: "Dirección de Entrega Personalizada",
    customPlaceholder: "Ingrese la dirección de entrega",
    customNotice: "La entrega personalizada está sujeta a confirmación.",
    validationRequired: "Complete todos los campos antes de buscar.",
    validationDateOrder: "La fecha de fin debe ser posterior a la de inicio.",
    validationSameDay: "Para alquileres el mismo día, la hora de fin debe ser posterior a la de inicio.",
    locationMIA: "Aeropuerto Internacional de Miami — MIA",
    locationFLL: "Aeropuerto Internacional de Fort Lauderdale-Hollywood — FLL",
    locationPBI: "Aeropuerto Internacional de Palm Beach — PBI",
    locationCustom: "Dirección de entrega personalizada",
  },
} as const;

export type SearchLang = keyof typeof SEARCH_LABELS;

export function t(lang: SearchLang, key: keyof typeof SEARCH_LABELS.en): string {
  return SEARCH_LABELS[lang]?.[key] ?? SEARCH_LABELS.en[key];
}
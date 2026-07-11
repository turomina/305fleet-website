// 305 Fleet — i18n UI Translation Strings
// Centralized translations for all UI elements

export type Locale = "en" | "es";

export const translations = {
  en: {
    // Site
    siteName: "305 Fleet",
    tagline: "South Florida Vehicle Rentals",

    // Navigation
    nav: {
      vehicles: "Vehicles",
      locations: "Locations",
      rentalOptions: "Rental Options",
      howItWorks: "How It Works",
      reviews: "Reviews",
      deals: "Deals",
      about: "About",
      contact: "Contact",
      faq: "FAQ",
      support: "Support",
      rentalRequirements: "Rental Requirements",
      rentalPolicies: "Rental Policies",
      optionalExtras: "Optional Extras",
      daily: "Daily Rentals",
      weekly: "Weekly Rentals",
      monthly: "Monthly Rentals",
      business: "Business & Corporate",
      mia: "Miami International Airport (MIA)",
      fll: "Fort Lauderdale Airport (FLL)",
      pbi: "Palm Beach Airport (PBI)",
    },

    // CTAs
    cta: {
      browseVehicles: "Browse Vehicles",
      inquire: "Inquire About This Vehicle",
      viewRequirements: "View Requirements",
      callUs: "Call Us",
      whatsapp: "WhatsApp",
      contactUs: "Contact Us",
      getQuote: "Get a Quote",
      bookNow: "Book Now",
      learnMore: "Learn More",
      viewAll: "View All",
    },

    // Vehicle labels
    vehicle: {
      passengers: "Passengers",
      fuel: "Fuel",
      luggage: "Luggage",
      exterior: "Exterior",
      interior: "Interior",
      drivetrain: "Drivetrain",
      startingFrom: "Starting from",
      pricingTBD: "Pricing TBD",
      finalPricingNote: "Final pricing confirmed at booking",
      aboutThisVehicle: "About This Vehicle",
      keyFeatures: "Key Features",
      viewOnTuro: "View on Turo",
      photoPending: "Photo pending",
      photoPendingDesc: "Real vehicle photography coming soon",
      previewNote: "Preview — specifications and pricing shown here are not final.",
      backToVehicles: "Back to Vehicles",
    },

    // Footer
    footer: {
      rentals: "Rentals",
      locations: "Locations",
      support: "Support",
      aboutFleet: "About 305 Fleet",
      requirements: "Requirements",
      policies: "Policies",
      privacy: "Privacy",
      terms: "Terms",
      accessibility: "Accessibility",
      rights: "All rights reserved.",
    },

    // Language switcher
    language: {
      switch: "Switch language",
      english: "English",
      spanish: "Español",
      current: "Current language",
    },

    // Home page
    home: {
      heroTitle: "South Florida's Trusted Vehicle Fleet",
      heroSubtitle: "Airport delivery · Newer vehicles · Straightforward pricing",
      heroCta: "Browse Available Vehicles",
      benefitsTitle: "Why Choose 305 Fleet",
      vehiclesTitle: "Available Vehicles",
      vehiclesSubtitle: "Browse our fleet of well-maintained, newer vehicles",
    },
  },

  es: {
    // Site
    siteName: "305 Fleet",
    tagline: "Alquiler de Vehículos en el Sur de Florida",

    // Navigation
    nav: {
      vehicles: "Vehículos",
      locations: "Ubicaciones",
      rentalOptions: "Opciones de Alquiler",
      howItWorks: "Cómo Funciona",
      reviews: "Reseñas",
      deals: "Ofertas",
      about: "Acerca de",
      contact: "Contacto",
      faq: "Preguntas Frecuentes",
      support: "Soporte",
      rentalRequirements: "Requisitos de Alquiler",
      rentalPolicies: "Políticas de Alquiler",
      optionalExtras: "Extras Opcionales",
      daily: "Alquiler Diario",
      weekly: "Alquiler Semanal",
      monthly: "Alquiler Mensual",
      business: "Empresarial y Corporativo",
      mia: "Aeropuerto Internacional de Miami (MIA)",
      fll: "Aeropuerto de Fort Lauderdale (FLL)",
      pbi: "Aeropuerto de Palm Beach (PBI)",
    },

    // CTAs
    cta: {
      browseVehicles: "Ver Vehículos",
      inquire: "Consultar Sobre Este Vehículo",
      viewRequirements: "Ver Requisitos",
      callUs: "Llámanos",
      whatsapp: "WhatsApp",
      contactUs: "Contáctanos",
      getQuote: "Solicitar Cotización",
      bookNow: "Reservar",
      learnMore: "Más Información",
      viewAll: "Ver Todos",
    },

    // Vehicle labels
    vehicle: {
      passengers: "Pasajeros",
      fuel: "Combustible",
      luggage: "Equipaje",
      exterior: "Exterior",
      interior: "Interior",
      drivetrain: "Tracción",
      startingFrom: "Desde",
      pricingTBD: "Precio por Confirmar",
      finalPricingNote: "El precio final se confirma al reservar",
      aboutThisVehicle: "Sobre Este Vehículo",
      keyFeatures: "Características Principales",
      viewOnTuro: "Ver en Turo",
      photoPending: "Foto pendiente",
      photoPendingDesc: "Próximamente fotografías reales del vehículo",
      previewNote: "Vista previa — las especificaciones y precios mostrados aquí no son definitivos.",
      backToVehicles: "Volver a Vehículos",
    },

    // Footer
    footer: {
      rentals: "Alquileres",
      locations: "Ubicaciones",
      support: "Soporte",
      aboutFleet: "Acerca de 305 Fleet",
      requirements: "Requisitos",
      policies: "Políticas",
      privacy: "Privacidad",
      terms: "Términos",
      accessibility: "Accesibilidad",
      rights: "Todos los derechos reservados.",
    },

    // Language switcher
    language: {
      switch: "Cambiar idioma",
      english: "English",
      spanish: "Español",
      current: "Idioma actual",
    },

    // Home page
    home: {
      heroTitle: "Flota de Vehículos de Confianza en el Sur de Florida",
      heroSubtitle: "Entrega en aeropuerto · Vehículos recientes · Precios transparentes",
      heroCta: "Ver Vehículos Disponibles",
      benefitsTitle: "Por Qué Elegir 305 Fleet",
      vehiclesTitle: "Vehículos Disponibles",
      vehiclesSubtitle: "Explora nuestra flota de vehículos bien mantenidos y recientes",
    },
  },
} as const;

// Helper to get current locale from URL path
export function getLocale(pathname: string): Locale {
  if (pathname.startsWith("/es/")) return "es";
  return "en";
}

// Helper to get the equivalent path in the other locale
export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  const currentLocale = getLocale(pathname);
  let path = pathname;

  // Remove current locale prefix
  if (currentLocale === "es" && path.startsWith("/es/")) {
    path = path.replace("/es/", "/");
  } else if (currentLocale === "es" && path === "/es") {
    path = "/";
  }

  // Add target locale prefix
  if (targetLocale === "es") {
    path = `/es${path === "/" ? "" : path}`;
    if (path === "/es") path = "/es/";
  }

  return path;
}

// Helper to get translation for a locale
export function t(locale: Locale) {
  return translations[locale];
}
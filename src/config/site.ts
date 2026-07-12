// 305 Fleet — Site Configuration
// Central place for site-wide constants, navigation, and metadata

export const SITE = {
  name: "305 Fleet",
  legalName: "Turomina LLC dba 305Fleet",
  tagline: "South Florida Vehicle Rentals",
  description:
    "A locally operated South Florida fleet offering carefully selected, well-maintained vehicles, clear rental expectations, and contactless airport pickup from designated parking facilities at MIA, FLL, and PBI.",
  url: "https://305fleet.com",
  locale: "en",
  locales: ["en", "es"],
  phone: "", // pending Ian approval for public display
  whatsapp: "", // pending Ian approval
  email: "", // pending Ian approval for public business email
  serviceArea: ["Miami", "Fort Lauderdale", "Palm Beach"],
  airports: ["MIA", "FLL", "PBI"],
} as const;

export const NAV = {
  primary: [
    { label: "Vehicles", href: "/vehicles/" },
    { label: "Airports", href: "/how-it-works/" },
    { label: "How It Works", href: "/how-it-works/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
  footer: {
    rentals: [
      { label: "Vehicles", href: "/vehicles/" },
      { label: "Daily Rentals", href: "/rental-options/daily/" },
      { label: "Weekly Rentals", href: "/rental-options/weekly/" },
      { label: "Monthly Rentals", href: "/rental-options/monthly/" },
      { label: "Business & Corporate", href: "/rental-options/business-corporate/" },
      { label: "Deals", href: "/deals/" },
    ],
    locations: [
      { label: "Miami International (MIA)", href: "/locations/miami-international-airport/" },
      { label: "Fort Lauderdale (FLL)", href: "/locations/fort-lauderdale-airport/" },
      { label: "Palm Beach (PBI)", href: "/locations/palm-beach-airport/" },
    ],
    info: [
      { label: "How It Works", href: "/how-it-works/" },
      { label: "Rental Requirements", href: "/rental-requirements/" },
      { label: "Rental Policies", href: "/rental-policies/" },
      { label: "Optional Extras", href: "/optional-extras/" },
      { label: "Reviews", href: "/reviews/" },
    ],
    support: [
      { label: "Contact", href: "/contact/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Support", href: "/support/" },
      { label: "About 305 Fleet", href: "/about/" },
    ],
  },
  utility: [],
  legal: [
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms", href: "/terms/" },
    { label: "Accessibility", href: "/accessibility/" },
  ],
} as const;

export const BENEFITS = [
  {
    icon: "plane",
    title: "Airport Pickup",
    description: "MIA · FLL · PBI — contactless pickup from designated parking facilities",
  },
  {
    icon: "car",
    title: "Quality Fleet",
    description: "Carefully selected, well-maintained vehicles, professionally presented",
  },
  {
    icon: "phone",
    title: "Real Operator",
    description: "Direct communication with a local South Florida team",
  },
  {
    icon: "star",
    title: "Trusted Reputation",
    description: "Established rental reputation — direct and reliable",
  },
] as const;

export const CTA = {
  primary: "Book Now",
  primaryEs: "Reservar ahora",
  disclosure: "Direct booking experience under development. Browse our fleet and contact us for availability.",
  disclosureEs: "Sistema de reservación directa en desarrollo. Explore nuestra flota y contáctenos para disponibilidad.",
} as const;
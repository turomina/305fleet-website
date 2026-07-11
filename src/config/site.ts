// 305 Fleet — Site Configuration
// Central place for site-wide constants, navigation, and metadata

export const SITE = {
  name: "305 Fleet",
  legalName: "Turomina LLC dba 305Fleet",
  tagline: "South Florida Vehicle Rentals",
  description:
    "A locally operated South Florida fleet offering newer, well-maintained vehicles, straightforward pricing, airport delivery, and responsive personal service.",
  url: "https://305fleet.com", // placeholder — Ian to confirm
  locale: "en",
  locales: ["en", "es"],
  phone: "305-439-1247", // Ian — temporary
  whatsapp: "", // Ian to provide
  email: "nik@305fleet.com", // temporary contact email
  serviceArea: ["Miami", "Fort Lauderdale", "Palm Beach"],
  airports: ["MIA", "FLL", "PBI"],
} as const;

export const NAV = {
  primary: [
    { label: "Vehicles", href: "/vehicles/" },
    {
      label: "Locations",
      href: "/locations/",
      children: [
        { label: "Miami International Airport (MIA)", href: "/locations/miami-international-airport/" },
        { label: "Fort Lauderdale Airport (FLL)", href: "/locations/fort-lauderdale-airport/" },
        { label: "Palm Beach Airport (PBI)", href: "/locations/palm-beach-airport/" },
      ],
    },
    {
      label: "Rental Options",
      href: "/rental-options/",
      children: [
        { label: "Daily Rentals", href: "/rental-options/daily/" },
        { label: "Weekly Rentals", href: "/rental-options/weekly/" },
        { label: "Monthly Rentals", href: "/rental-options/monthly/" },
        { label: "Business & Corporate", href: "/rental-options/business-corporate/" },
      ],
    },
    {
      label: "How It Works",
      href: "/how-it-works/",
      children: [
        { label: "Rental Requirements", href: "/rental-requirements/" },
        { label: "Rental Policies", href: "/rental-policies/" },
        { label: "Optional Extras", href: "/optional-extras/" },
      ],
    },
    { label: "Reviews", href: "/reviews/" },
    { label: "Deals", href: "/deals/" },
    { label: "About", href: "/about/" },
  ],
  utility: [
    { label: "Contact", href: "/contact/" },
    { label: "FAQ", href: "/faq/" },
    { label: "Support", href: "/support/" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms", href: "/terms/" },
    { label: "Accessibility", href: "/accessibility/" },
  ],
} as const;

export const BENEFITS = [
  {
    icon: "plane",
    title: "Airport Delivery",
    description: "MIA · FLL · PBI — we meet you at the terminal",
  },
  {
    icon: "car",
    title: "Newer Fleet",
    description: "Well-maintained vehicles, professionally presented",
  },
  {
    icon: "phone",
    title: "Real Operator",
    description: "Direct contact with a local South Florida team",
  },
  {
    icon: "star",
    title: "Trusted on Turo",
    description: "Established reputation — now booking direct",
  },
] as const;
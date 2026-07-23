/**
 * Configurable Site & Branding Identity Settings
 * 
 * Centralized site configuration ensuring brand identity, application name,
 * taglines, and platform fees can be dynamically customized via environment
 * variables or updated here without rewriting application UI code.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "HomeFix Marketplace",
  shortName: "HomeFix",
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Trusted Local Professionals for Home Repairs, Cleaning & Maintenance",
  description: "Book certified plumbers, electricians, house cleaners, AC technicians, and home repair professionals in seconds with upfront pricing and satisfaction guarantee.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultCity: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Jakarta",
  
  // Financial & Commission settings
  defaultCommissionRate: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_COMMISSION_RATE || "0.15"),
  currencySymbol: "Rp",
  currencyCode: "IDR",

  // Contact & Support Configuration
  contactEmail: "support@homefix-marketplace.local",
  supportPhone: "+62 812 3456 7890",

  // Branding Theme Colors (CSS Variables dynamic defaults)
  colors: {
    primary: "#0284c7",
    primaryHover: "#0369a1",
    accent: "#f59e0b",
    darkBg: "#0f172a",
  },

  // Main navigation categories for dynamic headers/footers
  navItems: [
    { label: "Find Services", href: "/services" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Become a Provider", href: "/provider/register" },
  ],

  // Platform capabilities
  supportedCities: [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Bali (Denpasar)",
    "Tangerang",
    "Bekasi"
  ]
};

export default siteConfig;

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteColors {
  primary: string;
  primaryHover: string;
  accent: string;
  darkBg: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  defaultCity: string;
  defaultCommissionRate: number;
  currencySymbol: string;
  currencyCode: string;
  contactEmail: string;
  supportPhone: string;
  colors: SiteColors;
  navItems: NavItem[];
  supportedCities: string[];
}

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "HomeFix Marketplace",
  shortName: "HomeFix",
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Trusted Local Professionals for Home Repairs, Cleaning & Maintenance",
  description: "Book certified plumbers, electricians, house cleaners, AC technicians, and home repair professionals in seconds with upfront pricing and satisfaction guarantee.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultCity: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Jakarta",
  
  defaultCommissionRate: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_COMMISSION_RATE || "0.15"),
  currencySymbol: "Rp",
  currencyCode: "IDR",

  contactEmail: "support@homefix-marketplace.local",
  supportPhone: "+62 812 3456 7890",

  colors: {
    primary: "#0284c7",
    primaryHover: "#0369a1",
    accent: "#f59e0b",
    darkBg: "#0f172a",
  },

  navItems: [
    { label: "Find Services", href: "/services" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Become a Provider", href: "/provider/register" },
  ],

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

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
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Solusi Jasa Rumah Tangga, Perbaikan & Perawatan Terpercaya",
  description: "Pesan jasa profesional, mitra ahli listrik, jasa pembersih rumah, pengasuh anak, dan mitra terverifikasi lainnya dalam hitungan detik dengan harga transparan dan garansi kepuasan.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultCity: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Bandung",
  
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
    { label: "Cari Layanan", href: "/services" },
    { label: "Cara Kerja", href: "/#how-it-works" },
    { label: "Jadi Mitra", href: "/provider/register" },
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

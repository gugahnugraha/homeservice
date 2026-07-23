'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type LanguageCode = 'id' | 'en';

export interface Translations {
  [key: string]: string;
}

const dictionaries: Record<LanguageCode, Translations> = {
  id: {
    // Header & Navigation
    findServices: 'Cari Layanan',
    howItWorks: 'Cara Kerja',
    becomeProvider: 'Jadi Mitra Teknisi',
    login: 'Masuk',
    register: 'Daftar Sekarang',
    serviceArea: 'Area Layanan:',
    
    // Hero Section
    heroBadge: '✨ Marketplace Jasa Rumah Terpercaya',
    heroTitle: 'Butuh bantuan apa untuk rumah Anda hari ini?',
    heroTagline: 'Teknisi & profesional terverifikasi untuk perbaikan, pembersihan, dan perawatan rumah Anda dengan harga transparan.',
    searchPlaceholder: 'Cari misal "keran bocor", "cuci AC", "cuci sofa"...',
    searchButton: 'Cari',
    popularKeywords: 'Populer:',

    // Categories
    categoriesTitle: 'Jelajahi Kategori Jasa',
    categoriesSubtitle: 'Temukan profesional terverifikasi dan lulus cek latar belakang untuk segala kebutuhan rumah',
    bookService: 'Pesan Jasa',

    // Popular Services
    popularTitle: 'Jasa Paling Banyak Dipesan',
    popularSubtitle: 'Solusi terbaik berdasarkan ulasan pelanggan dan harga transparan',
    viewDetails: 'Lihat Detail & Pesan',

    // Why Choose Us
    whyTitle: 'Mengapa Pemilik Rumah Memilih Kami',
    whySubtitle: 'Dirancang untuk kenyamanan, keamanan, dan garansi kualitas pengerjaan',
    vettingTitle: 'Profesional Terverifikasi',
    vettingDesc: 'Setiap mitra melalui verifikasi identitas (KTP) dan uji kompetensi sebelum menerima pekerjaan.',
    pricingTitle: 'Harga Transparan',
    pricingDesc: 'Tanpa biaya tersembunyi. Biaya estimasi, tarif per jam, atau paket harga dapat dilihat sejak awal.',
    guaranteeTitle: 'Garansi & Layanan Pelanggan',
    guaranteeDesc: 'Pembayaran baru diteruskan setelah Anda mengonfirmasi pekerjaan telah selesai dengan baik.',

    // Provider CTA
    providerCtaBadge: 'Apakah Anda Teknisi atau Usaha Jasa?',
    providerCtaTitle: 'Tingkatkan Pendapatan Anda Bersama Kami',
    providerCtaDesc: 'Hubungi ribuan pelanggan yang membutuhkan jasa Anda. Jam kerja fleksibel dan komisi transparan.',
    registerAsProvider: 'Daftar Sebagai Mitra Teknisi',

    // Footer
    footerRights: 'Hak cipta dilindungi undang-undang.',
    privacyPolicy: 'Kebijakan Privasi',
    termsOfService: 'Syarat & Ketentuan',
    adminPortal: 'Portal Admin',
  },
  en: {
    // Header & Navigation
    findServices: 'Find Services',
    howItWorks: 'How It Works',
    becomeProvider: 'Become a Provider',
    login: 'Log In',
    register: 'Get Started',
    serviceArea: 'Service Area:',
    
    // Hero Section
    heroBadge: '✨ Verified Home Services Marketplace',
    heroTitle: 'What do you need help with today?',
    heroTagline: 'Book background-checked technicians for home repairs, cleaning, and maintenance with upfront transparent pricing.',
    searchPlaceholder: 'Search e.g. "faucet repair", "AC cleaning", "sofa wash"...',
    searchButton: 'Search',
    popularKeywords: 'Popular:',

    // Categories
    categoriesTitle: 'Explore Service Categories',
    categoriesSubtitle: 'Find verified, background-checked professionals for all your home needs',
    bookService: 'Book Service',

    // Popular Services
    popularTitle: 'Most Requested Services',
    popularSubtitle: 'Top-rated solutions backed by customer reviews and transparent pricing',
    viewDetails: 'View Details & Book',

    // Why Choose Us
    whyTitle: 'Why Homeowners Trust Us',
    whySubtitle: 'Built for convenience, safety, and guaranteed quality craftsmanship',
    vettingTitle: 'Vetted & Verified Professionals',
    vettingDesc: 'Every service provider submits identity verification and skill assessment before accepting jobs.',
    pricingTitle: 'Upfront & Transparent Pricing',
    pricingDesc: 'No hidden costs. View estimated costs, hourly rates, or fixed package prices upfront before booking.',
    guaranteeTitle: 'Service Guarantee & Dispute Support',
    guaranteeDesc: 'Payment is completed only after you confirm job satisfaction.',

    // Provider CTA
    providerCtaBadge: 'Are you a Technician or Service Business?',
    providerCtaTitle: 'Grow your income with us',
    providerCtaDesc: 'Connect with thousands of customers. Flexible working hours, transparent commissions, and direct payouts.',
    registerAsProvider: 'Register as Service Provider',

    // Footer
    footerRights: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    adminPortal: 'Admin Portal',
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('id');

  useEffect(() => {
    const savedLang = (localStorage.getItem('lang_preference') as LanguageCode) || 'id';
    setLanguageState(savedLang);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('lang_preference', lang);
  };

  const t = (key: string): string => {
    const dict = dictionaries[language] || dictionaries.id;
    return dict[key] || dictionaries.id[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

'use client';

import React, { useState, ComponentType } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Droplets,
  Zap,
  Wind,
  Wrench,
  Trees,
  Bug,
  Paintbrush,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  Tag,
  Baby,
  HeartHandshake,
  Utensils,
  Dog
} from 'lucide-react';
import siteConfig from '../lib/config/site';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useLanguage } from '../context/LanguageContext';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '../components/ui/MotionWrapper';

interface CategoryItem {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  description: string;
  count: string;
}

interface PopularService {
  id: string;
  title: string;
  category: string;
  priceText: string;
  priceModel: string;
  rating: number;
  reviewsCount: number;
  duration: string;
  badge: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useLanguage();

  const categories: CategoryItem[] = [
    {
      id: 'childcare',
      name: 'Baby Sitter & Childcare',
      icon: Baby,
      color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200',
      description: 'Baby sitter harian, nanny & perawatan newborn',
      count: '6 Services'
    },
    {
      id: 'elderly-care',
      name: 'Perawatan Lansia',
      icon: HeartHandshake,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200',
      description: 'Pendamping lansia harian & home care nurse',
      count: '4 Services'
    },
    {
      id: 'home-cook',
      name: 'Masak & Asisten Dapur',
      icon: Utensils,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200',
      description: 'Jasa koki harian & meal prep keluarga',
      count: '5 Services'
    },
    {
      id: 'pet-care',
      name: 'Pet Care & Grooming',
      icon: Dog,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200',
      description: 'Grooming anjing & kucing panggilan rumah',
      count: '3 Services'
    },
    {
      id: 'cleaning',
      name: 'House Cleaning',
      icon: Sparkles,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200',
      description: 'Deep cleaning, sofa, kitchen & bathroom',
      count: '12 Services'
    },
    {
      id: 'plumbing',
      name: 'Plumbing Repair',
      icon: Droplets,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200',
      description: 'Keran bocor, instalasi saluran & jet pump',
      count: '8 Services'
    },
    {
      id: 'electrical',
      name: 'Kelistrikan',
      icon: Zap,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200',
      description: 'Korsleting, tambah titik lampu & MCB',
      count: '9 Services'
    },
    {
      id: 'ac-service',
      name: 'Servis AC',
      icon: Wind,
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200',
      description: 'Cuci AC, isi freon, bongkar pasang unit',
      count: '7 Services'
    },
    {
      id: 'garden',
      name: 'Taman & Eksterior',
      icon: Trees,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200',
      description: 'Potong rumput, perawatan tanaman & kolam',
      count: '5 Services'
    },
    {
      id: 'pest-control',
      name: 'Pengendalian Hama',
      icon: Bug,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200',
      description: 'Basmi rayap, kecoa, tikus & fogging',
      count: '4 Services'
    },
    {
      id: 'home-improvement',
      name: 'Renovasi & Pertukangan',
      icon: Paintbrush,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200',
      description: 'Pengecatan dinding, perbaikan atap & mebel',
      count: '10 Services'
    }
  ];

  const popularServices: PopularService[] = [
    {
      id: '1',
      title: 'Baby Sitter & Pengasuh Anak Harian (8 Jam)',
      category: 'Childcare',
      priceText: 'Rp 200.000',
      priceModel: 'Per Hari',
      rating: 4.9,
      reviewsCount: 142,
      duration: '480 menit',
      badge: 'Bintang Laris'
    },
    {
      id: '2',
      title: 'Cuci AC Rutin & Maintenance Jet Washer',
      category: 'Servis AC',
      priceText: 'Rp 90.000',
      priceModel: 'Harga Pas',
      rating: 4.9,
      reviewsCount: 310,
      duration: '60 menit',
      badge: 'Terlaris'
    },
    {
      id: '3',
      title: 'Pendamping & Caregiver Lansia Harian',
      category: 'Perawatan Lansia',
      priceText: 'Rp 250.000',
      priceModel: 'Per Hari',
      rating: 4.95,
      reviewsCount: 88,
      duration: '480 menit',
      badge: 'Favorit Keluarga'
    },
    {
      id: '4',
      title: 'Pembersihan Keran Bocor & Saluran Wastafel',
      category: 'Plumbing',
      priceText: 'Rp 150.000',
      priceModel: 'Harga Pas',
      rating: 4.8,
      reviewsCount: 195,
      duration: '45 menit',
      badge: 'Cepat & Rapi'
    },
    {
      id: '5',
      title: 'Koki Rumah & Asisten Dapur Harian',
      category: 'Home Cook',
      priceText: 'Rp 175.000',
      priceModel: 'Per Panggilan',
      rating: 4.88,
      reviewsCount: 76,
      duration: '180 menit',
      badge: 'Pilihan Populer'
    },
    {
      id: '6',
      title: 'Deep Cleaning Kasur & Sofa Anti-Tungau',
      category: 'Cleaning',
      priceText: 'Rp 220.000',
      priceModel: 'Mulai Dari',
      rating: 4.92,
      reviewsCount: 240,
      duration: '120 menit',
      badge: 'Garansi Bersih'
    }
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* Hero Section with Framer Motion & Glassmorphism */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-brand-900 text-white p-8 sm:p-16 shadow-2xl border border-slate-800">
            
            {/* Background Glow Accents */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('heroSubtitle')}</span>
              </div>

              <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Pesan <strong className="text-white font-bold">Baby Sitter, Perawatan Lansia, Koki Rumah, Servis AC, Kebersihan</strong> & pertukangan terpercaya dalam hitungan menit di kota Bandung.
              </p>

              {/* Glassmorphism Floating Search Bar */}
              <div className="relative max-w-2xl mx-auto pt-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-4.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari layanan e.g. Baby Sitter, Cuci AC, Koki Rumah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 text-sm text-white placeholder:text-slate-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
                  />
                  <Link
                    href={`/services${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
                    className="absolute right-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <span>Cari Layanan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Stat Highlights */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-center max-w-xl mx-auto">
                <div>
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-[11px] text-slate-400">Mitra Terverifikasi</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-400">4.9 ★</p>
                  <p className="text-[11px] text-slate-400">Kepuasan Pelanggan</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-300">Garansi</p>
                  <p className="text-[11px] text-slate-400">Resmi 100% Pengerjaan</p>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <Badge variant="primary" className="mb-2">Kategori Jasa</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Pilih Berdasarkan Kategori</h2>
          </div>
          <Link href="/services" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            <span>Lihat Semua Katalog →</span>
          </Link>
        </div>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/services?category=${cat.id}`}
                  className="block p-4 rounded-2xl glass-card hover:-translate-y-1.5 transition-all duration-200 group text-center space-y-2 border border-slate-200 dark:border-slate-800"
                >
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">{cat.count}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* Popular Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Badge variant="primary" className="mb-2">Layanan Terpopuler</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Layanan Paling Banyak Dipesan</h2>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map((srv) => (
            <StaggerItem key={srv.id}>
              <Card className="flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-400/50 transition-all duration-200 glass-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-lg">
                      {srv.category}
                    </span>
                    <Badge variant="success">{srv.badge}</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      {srv.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{srv.rating} ({srv.reviewsCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{srv.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{srv.priceModel}</span>
                      <span className="text-lg font-black text-brand-600 dark:text-brand-400">{srv.priceText}</span>
                    </div>
                    <Link href="/services">
                      <Button variant="primary" size="sm" className="gap-1 font-bold">
                        <span>Pesan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScaleIn>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Mitra Terverifikasi KTP & SKCK</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seluruh teknisi, baby sitter, dan penyedia jasa melewati seleksi ketat serta verifikasi identitas resmi.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Harga Transparan Tanpa Biaya Tersembunyi</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rincian biaya ditampilkan dengan jelas sebelum Anda memesan. Tidak ada biaya siluman di lokasi.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Garansi Pengerjaan Ulang 100%</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jika hasil pengerjaan tidak sesuai standar, kami garansi pengerjaan ulang gratis tanpa biaya tambahan.
              </p>
            </div>

          </div>
        </ScaleIn>
      </section>

    </div>
  );
}

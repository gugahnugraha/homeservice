'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Clock,
  Tag,
  ArrowRight,
  Wrench,
  Sparkles,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Star,
  Baby,
  HeartHandshake,
  Droplets,
  Zap,
  Wind,
  Utensils,
  Dog,
  Trees,
  Bug,
  Paintbrush
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { FormattedCategory, FormattedService } from '../../lib/services/serviceCatalogService';
import { useLanguage } from '../../context/LanguageContext';

function ServiceCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams ? searchParams.get('category') || '' : '';
  const { t } = useLanguage();

  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [services, setServices] = useState<FormattedService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.categories) {
        setCategories(catData.categories);
      }

      let serviceUrl = '/api/services';
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('q', searchQuery);
      if (params.toString()) serviceUrl += `?${params.toString()}`;

      const srvRes = await fetch(serviceUrl);
      const srvData = await srvRes.json();
      if (srvData.services) {
        setServices(srvData.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'childcare':
        return <Baby className="w-4 h-4 text-pink-500" />;
      case 'elderly-care':
        return <HeartHandshake className="w-4 h-4 text-rose-500" />;
      case 'cleaning':
        return <Sparkles className="w-4 h-4 text-sky-500" />;
      case 'plumbing':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'electrical':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'ac-service':
        return <Wind className="w-4 h-4 text-teal-500" />;
      case 'home-cook':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'pet-care':
        return <Dog className="w-4 h-4 text-indigo-500" />;
      case 'garden':
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'pest-control':
        return <Bug className="w-4 h-4 text-rose-500" />;
      case 'home-improvement':
        return <Paintbrush className="w-4 h-4 text-orange-500" />;
      default:
        return <Wrench className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* WOW Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-brand-900 text-white p-8 sm:p-14 shadow-2xl border border-slate-800">
        
        {/* Background Decorative Lighting Gradients */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Katalog Jasa & Perawatan Rumah Terlengkap</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Solusi Praktis & Profesional untuk Semua Urusan Rumah
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Temukan mitra terverifikasi untuk <strong className="text-white">Baby Sitter, Service AC, Kebersihan, Kelistrikan, Pertukangan, hingga Koki Rumah</strong> dengan garansi kepuasan & harga transparan.
          </p>

          {/* Floating Search Input */}
          <div className="relative max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari jasa e.g. Baby Sitter, Cuci AC, Keran Bocor, Deep Cleaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 text-sm text-white placeholder:text-slate-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
              />
              <button
                type="button"
                className="absolute right-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Cari Jasa
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Filter className="w-4 h-4 text-brand-500" />
            <span>Filter Kategori Jasa:</span>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
            >
              Reset Filter (Tampilkan Semua)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedCategory === ''
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semua Layanan</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.slug
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {getCategoryIcon(cat.slug)}
              <span>{cat.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {cat.servicesCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm animate-pulse">Memuat katalog layanan profesional...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Wrench className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Layanan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada layanan yang sesuai dengan kriteria pencarian Anda. Silakan coba kata kunci lain atau pilih kategori berbeda.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}>
            Tampilkan Semua Katalog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <Card
              key={srv.id}
              className="flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-400/50 transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Header & Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-900 flex items-center gap-1.5">
                      {getCategoryIcon(srv.categorySlug || '')}
                      <span>{srv.categoryName}</span>
                    </span>
                    <Badge variant="primary">{srv.priceModelBadge}</Badge>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {srv.description || 'Layanan perbaikan & perawatan rumah profesional terpercaya.'}
                    </p>
                  </div>
                </div>

                {/* Footer Info & Pricing */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span>{srv.durationMinutes} menit</span>
                    </div>

                    <div className="flex items-center gap-1 font-extrabold text-slate-900 dark:text-white text-base">
                      <Tag className="w-4 h-4 text-brand-500" />
                      <span className="text-brand-600 dark:text-brand-400">{srv.priceFormatted}</span>
                    </div>
                  </div>

                  <Link href={`/services/${srv.slug}`} className="block w-full">
                    <Button variant="primary" className="w-full justify-center gap-1.5 text-xs font-bold shadow-sm">
                      <span>Pesan Layanan Ini</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}

export default function ServiceCatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><p className="text-slate-500 text-sm">Memuat katalog layanan...</p></div>}>
      <ServiceCatalogContent />
    </Suspense>
  );
}

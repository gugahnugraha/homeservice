'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Clock, Tag, ArrowRight, Wrench, Sparkles, Filter } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" className="px-3 py-1 text-xs">
          {t('categoriesTitle')}
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Katalog Jasa & Layanan Rumah
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Temukan teknisi dan profesional terverifikasi dengan rincian harga transparan tanpa biaya tersembunyi
        </p>

        {/* Live Search */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search className="absolute left-4 top-5 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari jasa e.g. Cuci AC, Keran Bocor, Deep Cleaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === ''
              ? 'bg-brand-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Semua Layanan
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.slug
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat.name} ({cat.servicesCount})
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm">Memuat katalog layanan...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">Layanan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada layanan yang sesuai dengan pencarian "{searchQuery}". Coba kata kunci lain atau pilih kategori berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <Card key={srv.id} className="flex flex-col justify-between group hover:-translate-y-1 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{srv.priceModelBadge}</Badge>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {srv.categoryName}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {srv.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Estimasi: {srv.durationMinutes} menit</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    <Tag className="w-4 h-4 text-brand-500" />
                    <span>{srv.priceFormatted}</span>
                  </div>
                </div>

                <Link href={`/services/${srv.slug}`} className="block w-full pt-2">
                  <Button variant="outline" className="w-full justify-center gap-1 text-xs">
                    <span>Lihat Detail & Pesan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
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
    <Suspense fallback={<div className="text-center py-16"><p className="text-slate-500 text-sm">Loading catalog...</p></div>}>
      <ServiceCatalogContent />
    </Suspense>
  );
}

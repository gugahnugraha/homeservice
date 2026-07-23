'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Tag, ShieldCheck, CheckCircle2, AlertCircle, Calendar, MapPin, ArrowLeft, Wrench } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { FormattedService } from '../../../lib/services/serviceCatalogService';
import siteConfig from '../../../lib/config/site';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [service, setService] = useState<FormattedService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchServiceDetail();
    }
  }, [slug]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/services/${slug}`);
      const data = await res.json();
      if (data.service) {
        setService(data.service);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Memuat detail layanan...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <Wrench className="w-12 h-12 text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Layanan Tidak Ditemukan</h1>
        <p className="text-xs text-slate-500 max-w-sm">Layanan yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link href="/services">
          <Button variant="primary">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/services" className="flex items-center gap-1 hover:text-brand-600 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400">{service.categoryName}</span>
        <span>/</span>
        <span className="font-semibold text-slate-900 dark:text-white">{service.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Service Details */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary">{service.priceModelBadge}</Badge>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {service.categoryName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {service.name}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {service.description}
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>Estimasi Durasi: <strong>{service.durationMinutes} Menit</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Garansi Pengerjaan & Mitra Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Included / Scope of Work */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Cakupan Pekerjaan yang Termasuk</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Pemeriksaan awal dan diagnosa masalah oleh teknisi profesional.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Penggunaan peralatan kerja lengkap dan aman sesuai standar K3.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Pemberian penjelasan transparan mengenai estimasi biaya tambahan atau suku cadang (jika diperlukan).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Garansi pengerjaan ulang jika masalah kembali terjadi dalam masa garansi.</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Pricing & Booking Summary */}
        <div className="space-y-6">
          <Card className="border-brand-200 dark:border-brand-900 shadow-md">
            <CardHeader className="bg-brand-500/5">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Rincian Biaya</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Skema Harga:</span>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block mt-1">
                  {service.priceFormatted}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {service.priceModel === 'FIXED_PRICE' && 'Harga pas untuk pengerjaan standar.'}
                  {service.priceModel === 'STARTING_FROM' && 'Harga dasar, dapat disesuaikan dengan tingkat kesulitan lokasi.'}
                  {service.priceModel === 'HOURLY' && 'Tarif dihitung per jam waktu pengerjaan.'}
                  {service.priceModel === 'QUOTATION' && 'Biaya akhir ditentukan setelah survei teknisi.'}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Tersedia untuk wilayah <strong>{siteConfig.defaultCity}</strong> & sekitarnya</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Pilih tanggal & jam fleksibel sesuai keinginan</span>
                </div>
              </div>

              <Link href={`/book/create?serviceId=${service.id}`} className="block w-full">
                <Button variant="primary" size="lg" className="w-full justify-center font-bold py-3.5">
                  Pesan Layanan Ini Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, MapPin, ArrowRight, Wrench, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card, { CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { FadeIn, StaggerContainer, StaggerItem } from '../../../components/ui/MotionWrapper';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ACTIVE') {
      return ['PENDING', 'CONFIRMED', 'PROVIDER_ASSIGNED', 'PROVIDER_ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.bookingStatus);
    }
    if (filter === 'COMPLETED') {
      return ['COMPLETED', 'CUSTOMER_CONFIRMED'].includes(b.bookingStatus);
    }
    if (filter === 'CANCELLED') {
      return b.bookingStatus.startsWith('CANCELLED');
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat riwayat pesanan Anda..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <FadeIn direction="up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pesanan Saya</h1>
            <p className="text-xs text-slate-500 mt-0.5">Kelola dan lacak status pengerjaan jasa rumah tangga Anda</p>
          </div>

          <Link href="/services">
            <Button variant="primary" size="sm" className="font-bold">
              + Pesan Layanan Baru
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f
                ? 'bg-brand-600 text-white shadow-md'
                : 'glass-pill text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {f === 'ALL' && 'Semua Pesanan'}
            {f === 'ACTIVE' && 'Sedang Berjalan'}
            {f === 'COMPLETED' && 'Selesai'}
            {f === 'CANCELLED' && 'Dibatalkan'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl space-y-3">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">Tidak Ada Pesanan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Anda belum memiliki pesanan jasa dalam kategori ini. Silakan pilih layanan dari katalog.
          </p>
          <Link href="/services">
            <Button variant="outline" size="sm">Eksplor Layanan Katalog</Button>
          </Link>
        </div>
      ) : (
        <StaggerContainer className="space-y-4">
          {filteredBookings.map((b) => (
            <StaggerItem key={b.id}>
              <Card className="glass-card hover:shadow-lg transition-all border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <StatusBadge status={b.bookingStatus} />
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {b.id.slice(0, 8)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {b.service?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Jadwal: {b.scheduledDate} ({b.scheduledTime})
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      <span>{b.address?.label} - {b.address?.city}</span>
                    </div>

                    <Link href={`/customer/bookings/${b.id}`}>
                      <Button variant="outline" size="sm" className="gap-1 text-xs font-bold">
                        <span>Lacak & Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

    </div>
  );
}

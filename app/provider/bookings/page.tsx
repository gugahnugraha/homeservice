'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, MapPin, ArrowRight, Wrench, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card, { CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { FadeIn, StaggerContainer, StaggerItem } from '../../../components/ui/MotionWrapper';

export default function ProviderBookingsDashboard() {
  const [availableBookings, setAvailableBookings] = useState<any[]>([]);
  const [assignedBookings, setAssignedBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('AVAILABLE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch available jobs
      const availRes = await fetch('/api/provider/bookings/available');
      const availData = await availRes.json();
      if (availData.availableBookings) setAvailableBookings(availData.availableBookings);

      // Fetch assigned jobs
      const assignRes = await fetch('/api/bookings');
      const assignData = await assignRes.json();
      if (assignData.bookings) setAssignedBookings(assignData.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAssigned = () => {
    if (filter === 'ACTIVE') {
      return assignedBookings.filter((b) => 
        ['PROVIDER_ASSIGNED', 'PROVIDER_ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.bookingStatus)
      );
    }
    if (filter === 'COMPLETED') {
      return assignedBookings.filter((b) => 
        ['COMPLETED', 'CUSTOMER_CONFIRMED'].includes(b.bookingStatus)
      );
    }
    return [];
  };

  const displayedList = filter === 'AVAILABLE' ? availableBookings : getFilteredAssigned();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dasbor pekerjaan mitra..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      <FadeIn direction="up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dasbor Pekerjaan Mitra</h1>
            <p className="text-xs text-slate-500 mt-0.5">Terima pesanan baru dan perbarui status pengerjaan ke pelanggan</p>
          </div>
        </div>
      </FadeIn>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilter('AVAILABLE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'AVAILABLE'
              ? 'bg-brand-600 text-white shadow-md'
              : 'glass-pill text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Pesanan Masuk (Bisa Diambil) ({availableBookings.length})
        </button>

        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'ACTIVE'
              ? 'bg-brand-600 text-white shadow-md'
              : 'glass-pill text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Sedang Ditangani
        </button>

        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'COMPLETED'
              ? 'bg-brand-600 text-white shadow-md'
              : 'glass-pill text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Selesai
        </button>
      </div>

      {/* Job List */}
      {displayedList.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl space-y-3">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">Belum Ada Pekerjaan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada pesanan aktif atau tersedia saat ini. Periksa kembali beberapa saat lagi.
          </p>
        </div>
      ) : (
        <StaggerContainer className="space-y-4">
          {displayedList.map((b) => (
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

                    <Link href={`/provider/bookings/${b.id}`}>
                      <Button variant="primary" size="sm" className="gap-1 text-xs font-bold">
                        <span>Buka & Ambil Pekerjaan</span>
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

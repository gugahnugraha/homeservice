'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, MapPin, ArrowRight, Wrench, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card, { CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/Badge';

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pekerjaan Saya</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola jadwal pengerjaan dan cari pesanan baru di sekitar Anda</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'AVAILABLE', label: `Pekerjaan Tersedia (${availableBookings.length})` },
          { key: 'ACTIVE', label: 'Pekerjaan Aktif' },
          { key: 'COMPLETED', label: 'Riwayat Selesai' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.key
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm">Memuat data pekerjaan...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">Tidak Ada Pekerjaan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filter === 'AVAILABLE' 
              ? 'Belum ada pesanan masuk yang sesuai dengan layanan Anda. Pastikan Anda telah menambahkan keahlian di menu Layanan.'
              : 'Anda tidak memiliki pekerjaan aktif saat ini.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((booking) => (
            <Card key={booking.id} className="hover:border-brand-300 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-600 dark:text-brand-400">{booking.bookingNumber}</span>
                    <StatusBadge status={booking.bookingStatus} />
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{booking.service?.name}</h3>
                  <div className="flex items-start gap-1.5 mt-1 text-slate-500">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-xs">{booking.address?.fullAddress}, {booking.address?.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4 text-brand-500" />
                    <span>Jadwal: <strong>{new Date(booking.scheduledDate).toLocaleDateString('id-ID')} ({booking.scheduledTime})</strong></span>
                  </div>
                </div>

                <Link href={`/provider/bookings/${booking.id}`} className="block w-full">
                  <Button variant={filter === 'AVAILABLE' ? 'primary' : 'outline'} className="w-full justify-center text-xs gap-1">
                    <span>{filter === 'AVAILABLE' ? 'Lihat & Terima Pekerjaan' : 'Detail Pengerjaan'}</span>
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

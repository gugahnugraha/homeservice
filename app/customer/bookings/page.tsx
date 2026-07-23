'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, MapPin, ArrowRight, Wrench, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card, { CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/Badge';

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pesanan Saya</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola dan lacak status pengerjaan jasa rumah tangga Anda</p>
        </div>

        <Link href="/services">
          <Button variant="primary" size="sm">
            + Pesan Layanan Baru
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { key: 'ALL', label: 'Semua Pesanan' },
          { key: 'ACTIVE', label: 'Aktif / Berjalan' },
          { key: 'COMPLETED', label: 'Selesai' },
          { key: 'CANCELLED', label: 'Dibatalkan' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filter === tab.key
                ? 'bg-brand-500 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm">Memuat daftar pesanan Anda...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">Belum Ada Pesanan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Anda belum memiliki pesanan dengan status ini. Pilih layanan dari katalog untuk membuat pesanan baru.
          </p>
          <Link href="/services">
            <Button variant="outline" size="sm">Jelajahi Katalog</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:border-brand-300 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brand-600 dark:text-brand-400">{booking.bookingNumber}</span>
                    <StatusBadge status={booking.bookingStatus} />
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(booking.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{booking.service?.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{booking.address?.fullAddress}, {booking.address?.city}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-4 h-4 text-brand-500" />
                    <span>Jadwal: <strong>{new Date(booking.scheduledDate).toLocaleDateString('id-ID')} ({booking.scheduledTime})</strong></span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Rp {booking.price?.toLocaleString('id-ID')}
                  </span>
                </div>

                <Link href={`/customer/bookings/${booking.id}`} className="block w-full">
                  <Button variant="outline" className="w-full justify-center text-xs gap-1">
                    <span>Lacak Progress & Detail</span>
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

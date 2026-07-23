'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, TrendingUp, Calendar } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge, { StatusBadge } from '../../../components/ui/Badge';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat statistik platform...</p>;
  }

  const { stats, recentBookings } = data || {};

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Ikhtisar</h1>
        <p className="text-sm text-slate-500">Metrik kinerja platform HomeFix saat ini.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Total Pelanggan</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Total Mitra</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalProviders || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Total Pesanan</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalBookings || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-50 border-brand-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-brand-600 font-bold uppercase">Pendapatan Bersih</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Rp {(stats?.totalRevenue || 0).toLocaleString('id-ID')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {recentBookings?.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">Belum ada transaksi.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">ID Pesanan</th>
                  <th className="px-6 py-4">Layanan</th>
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4">Mitra</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentBookings?.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-brand-600">{booking.bookingNumber}</td>
                    <td className="px-6 py-4">{booking.service?.name}</td>
                    <td className="px-6 py-4">{booking.customer?.user?.name}</td>
                    <td className="px-6 py-4">{booking.provider?.user?.name || '-'}</td>
                    <td className="px-6 py-4"><StatusBadge status={booking.bookingStatus} /></td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(booking.createdAt).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

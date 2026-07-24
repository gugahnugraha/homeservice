'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, TrendingUp, Calendar } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge, { StatusBadge } from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '../../../components/ui/MotionWrapper';

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
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat statistik ikhtisar platform Admin..." />
      </div>
    );
  }

  const { stats, recentBookings } = data || {};

  return (
    <div className="space-y-8 max-w-6xl">
      <FadeIn direction="up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Ikhtisar Admin</h1>
          <p className="text-xs text-slate-500 mt-0.5">Metrik kinerja dan statistik aktivitas transaksi platform saat ini.</p>
        </div>
      </FadeIn>

      {/* Metrics Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StaggerItem>
          <Card className="glass-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Pengguna</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || 0}</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        
        <StaggerItem>
          <Card className="glass-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Mitra Aktif</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalProviders || 0}</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="glass-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Pesanan</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalBookings || 0}</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="glass-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Est. Volume Rp</p>
                <p className="text-xl font-black text-brand-600 dark:text-brand-400">{stats?.totalRevenueFormatted || 'Rp 0'}</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Recent Activity Table */}
      <FadeIn direction="up" delay={0.2}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-bold">Pesanan Terbaru di Platform</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">ID / Layanan</th>
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">Jadwal</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentBookings && recentBookings.length > 0 ? (
                  recentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {b.service?.name}
                        <span className="block text-[10px] font-mono text-slate-400 font-normal">{b.id.slice(0, 8)}</span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        {b.customer?.user?.name || 'Pelanggan'}
                      </td>
                      <td className="p-4 text-slate-500">
                        {b.scheduledDate} ({b.scheduledTime})
                      </td>
                      <td className="p-4">
                        <StatusBadge status={b.bookingStatus} />
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/bookings/${b.id}`} className="text-brand-600 font-bold hover:underline">
                          Kelola →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">Belum ada pesanan terbaru.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </FadeIn>

    </div>
  );
}

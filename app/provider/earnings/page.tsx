'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wallet, DollarSign, CheckCircle2, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export default function ProviderEarningsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/provider/earnings');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setHistory(data.history);
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
        <p className="text-slate-500 text-sm">Memuat data pendapatan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dasbor Pendapatan</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ringkasan transaksi dan pencairan dana Anda</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-brand-200 bg-brand-50 dark:bg-brand-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-600 font-bold uppercase tracking-wider">Total Saldo Bersih</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Rp {(stats?.totalEarnings || 0).toLocaleString('id-ID')}
                </h3>
              </div>
            </div>
            <Button variant="primary" size="sm" className="w-full mt-4 justify-center">
              Tarik Dana (Withdraw)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Menunggu Pembayaran</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Rp {(stats?.pendingPayouts || 0).toLocaleString('id-ID')}
                </h3>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4">Dana dari pesanan selesai namun belum dibayar pelanggan.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pekerjaan Selesai</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {stats?.completedJobsCount || 0}
                </h3>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4">Total pekerjaan yang berhasil Anda selesaikan.</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Riwayat Transaksi Pekerjaan</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 text-sm">Belum ada riwayat transaksi.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID Pesanan</th>
                  <th className="px-6 py-4">Layanan</th>
                  <th className="px-6 py-4">Status Pembayaran</th>
                  <th className="px-6 py-4 text-right">Total Transaksi</th>
                  <th className="px-6 py-4 text-right">Potongan Platform (15%)</th>
                  <th className="px-6 py-4 text-right">Pendapatan Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-brand-600">
                      <Link href={`/provider/bookings/${row.id}`}>{row.bookingNumber}</Link>
                    </td>
                    <td className="px-6 py-4">{row.service?.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant={row.paymentStatus === 'PAID' ? 'success' : 'warning'}>{row.paymentStatus}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">Rp {row.price?.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-right text-rose-500">- Rp {row.commissionAmount?.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">Rp {row.providerEarnings?.toLocaleString('id-ID')}</td>
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

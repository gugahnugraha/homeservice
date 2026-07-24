'use client';

import React, { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { AlertTriangle, CheckCircle2, XCircle, Search, FileText } from 'lucide-react';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/disputes');
      const data = await res.json();
      if (data.success) {
        setDisputes(data.disputes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (status: string) => {
    if (!selectedDispute) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/disputes/${selectedDispute.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes,
          resolution,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedDispute(null);
        setAdminNotes('');
        setResolution('');
        fetchDisputes();
      } else {
        alert(data.error || 'Gagal mengupdate sengketa');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat data sengketa pesanan...</p>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Penyelesaian Sengketa (Dispute Resolution)</h1>
        <p className="text-sm text-slate-500">Tinjau laporan kendala pelanggan/mitra dan berikan solusi administratif.</p>
      </div>

      {/* Resolution Modal/Form */}
      {selectedDispute && (
        <Card className="border-amber-300 bg-amber-50/40 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Tinjau Sengketa #{selectedDispute.booking?.bookingNumber}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <p><strong>Pelapor:</strong> {selectedDispute.reporterRole} ({selectedDispute.reporterId})</p>
              <p><strong>Layanan:</strong> {selectedDispute.booking?.service?.name}</p>
              <p><strong>Alasan:</strong> {selectedDispute.reason}</p>
              <p><strong>Rincian Masalah:</strong> "{selectedDispute.description}"</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Catatan Internal Admin</label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Catatan peninjauan internal..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Keputusan & Solusi untuk Pelanggan / Mitra</label>
              <textarea
                rows={2}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Misal: Pengembalian dana 50% atau pengerjaan ulang gratis..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                isLoading={submitting}
                onClick={() => handleResolveDispute('RESOLVED')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Selesaikan (RESOLVED)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-200"
                isLoading={submitting}
                onClick={() => handleResolveDispute('REJECTED')}
              >
                <XCircle className="w-4 h-4 mr-1" /> Tolak Laporan (REJECTED)
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDispute(null)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disputes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Daftar Laporan Kendala</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {disputes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Belum ada sengketa pesanan yang dilaporkan.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Pesanan</th>
                  <th className="px-6 py-4">Pelapor</th>
                  <th className="px-6 py-4">Alasan</th>
                  <th className="px-6 py-4">Status Sengketa</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {disputes.map((disp) => (
                  <tr key={disp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{disp.booking?.bookingNumber}</p>
                      <p className="text-xs text-slate-500">{disp.booking?.service?.name}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-brand-600">
                      {disp.reporterRole}
                    </td>
                    <td className="px-6 py-4 text-xs max-w-xs truncate">
                      {disp.reason}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={disp.status === 'RESOLVED' ? 'success' : disp.status === 'REJECTED' ? 'danger' : 'warning'}>
                        {disp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDispute(disp);
                          setAdminNotes(disp.adminNotes || '');
                          setResolution(disp.resolution || '');
                        }}
                      >
                        Tinjau Sengketa
                      </Button>
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

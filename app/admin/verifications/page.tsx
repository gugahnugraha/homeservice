'use client';

import React, { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { CheckCircle2, XCircle, Search, FileText } from 'lucide-react';

export default function AdminVerificationsPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/verifications');
      const json = await res.json();
      if (json.success) setProviders(json.providers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (providerId: string, status: string) => {
    try {
      setUpdatingId(providerId);
      const res = await fetch(`/api/admin/verifications/${providerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: `Diperbarui oleh Admin ke ${status}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Optimistic update
        setProviders(prev => prev.map(p => 
          p.id === providerId ? { ...p, verificationStatus: status } : p
        ));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengupdate status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat data mitra...</p>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verifikasi Mitra (KYC)</h1>
        <p className="text-sm text-slate-500">Tinjau dan setujui pendaftaran mitra baru agar mereka dapat menerima pesanan.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-base font-bold">Daftar Pengajuan Mitra</CardTitle>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              className="pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Mitra</th>
                <th className="px-6 py-4">Status Verifikasi</th>
                <th className="px-6 py-4">Dokumen Identitas</th>
                <th className="px-6 py-4">Tanggal Daftar</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {providers.map((provider: any) => {
                const latestDoc = provider.verifications?.[0];
                return (
                  <tr key={provider.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{provider.user?.name}</p>
                      <p className="text-xs text-slate-500">{provider.user?.email}</p>
                      <p className="text-xs text-slate-500">{provider.user?.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          provider.verificationStatus === 'VERIFIED' ? 'success' : 
                          provider.verificationStatus === 'REJECTED' ? 'danger' : 
                          provider.verificationStatus === 'PENDING' ? 'warning' : 'default'
                        }
                      >
                        {provider.verificationStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {latestDoc ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <a href={latestDoc.documentUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline text-xs">
                            Lihat {latestDoc.documentType}
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada dokumen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(provider.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={updatingId === provider.id || provider.verificationStatus === 'VERIFIED'}
                        onClick={() => handleUpdateStatus(provider.id, 'VERIFIED')}
                        className="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Setujui
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={updatingId === provider.id || provider.verificationStatus === 'REJECTED'}
                        onClick={() => handleUpdateStatus(provider.id, 'REJECTED')}
                        className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Tolak
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {providers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">Tidak ada data mitra.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, CheckCircle2, Plus, Tag, ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { FormattedService } from '../../../lib/services/serviceCatalogService';

export default function ProviderServicesPage() {
  const router = useRouter();
  const [allServices, setAllServices] = useState<FormattedService[]>([]);
  const [offeredServices, setOfferedServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const srvRes = await fetch('/api/services');
      const srvData = await srvRes.json();
      if (srvData.services) setAllServices(srvData.services);

      const provRes = await fetch('/api/provider/services');
      const provData = await provRes.json();
      if (provData.offeredServices) setOfferedServices(provData.offeredServices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;

    setMessage('');
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/provider/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          customPrice: customPrice ? Number(customPrice) : null,
          isAvailable: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add service');

      setMessage('Service offering added successfully!');
      setSelectedServiceId('');
      setCustomPrice('');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Memuat penawaran layanan mitra...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Kelola Keahlian & Jasa Mitra</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pilih layanan yang Anda kuasai untuk menerima order pekerjaan dari pelanggan</p>
        </div>

        <Button variant="outline" size="sm" onClick={() => router.push('/provider/profile')} className="gap-1 text-xs">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Profil</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Add Skill */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Tambah Penawaran Layanan</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleAddService} className="space-y-4">
                
                {message && <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl">{message}</div>}
                {error && <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-xl">{error}</div>}

                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Layanan</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none"
                    required
                  >
                    <option value="">-- Pilih dari Katalog --</option>
                    {allServices.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} ({srv.priceFormatted})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Tarif Kustom (Opsional)"
                  type="number"
                  placeholder="Isi jika harga berbeda dari standar"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  min="0"
                />

                <Button type="submit" variant="primary" className="w-full justify-center" isLoading={saving}>
                  Tambah Layanan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Offered List */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Daftar Layanan Aktif Anda</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {offeredServices.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Wrench className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">Anda belum memilih layanan. Tambahkan keahlian Anda di formulir samping.</p>
                </div>
              ) : (
                offeredServices.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.service?.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tarif Standar: Rp {item.service?.basePrice?.toLocaleString('id-ID')}
                        {item.customPrice && ` | Tarif Anda: Rp ${item.customPrice?.toLocaleString('id-ID')}`}
                      </p>
                    </div>
                    <Badge variant={item.isAvailable ? 'success' : 'default'}>
                      {item.isAvailable ? 'Aktif' : 'Non-aktif'}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

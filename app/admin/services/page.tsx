'use client';

import React, { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Plus, Wrench, Search, Layers, DollarSign } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('150000');
  const [priceModel, setPriceModel] = useState('FIXED_PRICE');
  const [durationMinutes, setDurationMinutes] = useState('60');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [srvRes, catRes] = await Promise.all([
        fetch('/api/admin/services'),
        fetch('/api/admin/categories'),
      ]);

      const srvData = await srvRes.json();
      const catData = await catRes.json();

      if (srvData.success) setServices(srvData.services);
      if (catData.success) {
        setCategories(catData.categories);
        if (catData.categories.length > 0) setCategoryId(catData.categories[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          name,
          description,
          basePrice,
          priceModel,
          durationMinutes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat layanan baru');
      }

      setName('');
      setDescription('');
      setShowAddModal(false);
      fetchInitialData();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat data layanan...</p>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Layanan Jasa</h1>
          <p className="text-sm text-slate-500">Kelola daftar layanan, penetapan harga dasar, dan durasi pengerjaan.</p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan Baru</span>
        </Button>
      </div>

      {showAddModal && (
        <Card className="border-brand-300 dark:border-brand-900 bg-brand-50/40 dark:bg-brand-950/20">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-600" />
              <span>Tambah Layanan Jasa Baru</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateService} className="space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Kategori</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Nama Layanan (e.g. Cuci AC Standard / Perbaikan Wastafel)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Harga Dasar (Rp)"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  required
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Model Harga</label>
                  <select
                    value={priceModel}
                    onChange={(e) => setPriceModel(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="FIXED_PRICE">FIXED_PRICE (Harga Pasti)</option>
                    <option value="STARTING_FROM">STARTING_FROM (Mulai Dari)</option>
                    <option value="HOURLY">HOURLY (Per Jam)</option>
                    <option value="QUOTATION">QUOTATION (Survei/Penawaran)</option>
                  </select>
                </div>

                <Input
                  label="Estimasi Durasi (Menit)"
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Deskripsi Layanan</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rincian yang didapatkan pelanggan dalam layanan ini..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                  Simpan Layanan Baru
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Daftar Layanan Terdaftar</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Model Harga</th>
                <th className="px-6 py-4 text-right">Harga Dasar</th>
                <th className="px-6 py-4 text-center">Durasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-white">{srv.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{srv.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg">
                      {srv.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{srv.priceModel}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                    Rp {srv.basePrice?.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-slate-500">{srv.durationMinutes} menit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

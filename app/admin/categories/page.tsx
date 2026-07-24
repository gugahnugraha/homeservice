'use client';

import React, { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Plus, FolderPlus, Search, Wrench, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Wrench');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, icon }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat kategori baru');
      }

      setName('');
      setDescription('');
      setShowAddModal(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat data kategori...</p>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Kategori Layanan</h1>
          <p className="text-sm text-slate-500">Kelola katalog kategori dinamis platform tanpa perlu mengubah kode.</p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </Button>
      </div>

      {showAddModal && (
        <Card className="border-brand-300 dark:border-brand-900 bg-brand-50/40 dark:bg-brand-950/20">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-brand-600" />
              <span>Tambah Kategori Layanan Baru</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateCategory} className="space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Kategori (e.g. Perbaikan AC / Kebersihan)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Icon Identifier (Lucide Icon e.g. Wrench, Sparkles, Zap)"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan singkat mengenai kategori layanan ini..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                  Simpan Kategori
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="hover:border-brand-300 transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <Badge variant={cat.isActive ? 'success' : 'default'}>
                  {cat.isActive ? 'Aktif' : 'Non-aktif'}
                </Badge>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description || 'Tidak ada deskripsi'}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>{cat._count?.services || 0} Layanan Terdaftar</span>
                <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                  {cat.slug}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

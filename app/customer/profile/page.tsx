'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, LogOut, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { FadeIn, ScaleIn } from '../../../components/ui/MotionWrapper';

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        setName(data.user.name || '');
        setPhone(data.user.phone || '');
      } else {
        router.push('/login');
      }
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setUpdating(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage('Profil berhasil diperbarui!');
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat profil Anda..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header Profile Title */}
      <FadeIn direction="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{user?.name}</h1>
                <Badge variant="primary">Pelanggan</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <Button variant="danger" size="sm" onClick={handleLogout} className="gap-2 font-bold z-10 self-start sm:self-auto">
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </Button>
        </div>
      </FadeIn>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Details Form */}
        <div className="md:col-span-2">
          <ScaleIn>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-500" />
                  <span>Pengaturan Informasi Akun</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {message && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">
                  <Input
                    label="Nama Lengkap"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    label="Alamat Email (Tidak Dapat Diubah)"
                    icon={Mail}
                    value={user?.email || ''}
                    disabled
                  />

                  <Input
                    label="Nomor Telepon / WhatsApp"
                    icon={Phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08123456789"
                  />

                  <Button type="submit" variant="primary" className="font-bold py-3 px-6" isLoading={updating}>
                    Simpan Perubahan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <ScaleIn delay={0.1}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Status Verifikasi Akun</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500">Verifikasi Email:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Aktif ✅</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500">Peran Akses:</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">Customer</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kota Domisili:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Bandung</span>
                </div>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>

      </div>

    </div>
  );
}

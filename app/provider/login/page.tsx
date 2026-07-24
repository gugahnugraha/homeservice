'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Wrench, ArrowRight, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import siteConfig from '../../../lib/config/site';

export default function ProviderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');

  // Auto-redirect if active provider session exists in cookie
  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user?.role === 'PROVIDER') {
        router.push('/provider/bookings');
      } else {
        setCheckingSession(false);
      }
    } catch (err) {
      setCheckingSession(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal. Periksa email & kata sandi Anda.');
      }

      if (data.user?.role !== 'PROVIDER') {
        throw new Error('Akun Anda terdaftar sebagai Pelanggan. Silakan login melalui portal Utama.');
      }

      router.push('/provider/bookings');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs font-semibold">Memeriksa sesi aktif Mitra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-brand-200 dark:border-brand-900">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">
            Portal Mitra Jasa
          </CardTitle>
          <p className="text-xs text-slate-500">
            Masuk ke dasbor mitra {siteConfig.name} untuk menerima & mengelola pesanan
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <Input
              label="Email Terdaftar Mitra"
              type="email"
              icon={Mail}
              placeholder="mitra@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Kata Sandi"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full justify-center font-bold" isLoading={loading}>
              <span>Masuk Portal Mitra</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
            <p>
              Belum mendaftar sebagai Mitra Jasa?{' '}
              <Link href="/provider/register" className="text-brand-600 font-bold hover:underline">
                Daftar Jadi Mitra Baru
              </Link>
            </p>
            <p>
              Login sebagai Pelanggan?{' '}
              <Link href="/login" className="text-slate-700 dark:text-slate-300 font-semibold hover:underline">
                Klik di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

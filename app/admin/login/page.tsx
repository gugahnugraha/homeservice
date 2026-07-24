'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Loader2 } from 'lucide-react';
import siteConfig from '../../../lib/config/site';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent } from '../../../components/ui/Card';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Auto-redirect if active admin session exists in cookie
  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        setCheckingSession(false);
      }
    } catch (err) {
      setCheckingSession(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Admin login failed');
      }

      if (data.user?.role !== 'ADMIN') {
        throw new Error('Akses ditolak. Peran Anda bukan Administrator.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat verifikasi admin.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-xs font-semibold">Memeriksa sesi aktif Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6 text-brand-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Portal Admin Platform
          </h1>
          <p className="text-xs text-slate-500">
            Akses khusus tim administrator {siteConfig.name}
          </p>
        </div>

        {/* Card Form */}
        <Card className="border-slate-300 dark:border-slate-700">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Email Admin"
                type="email"
                placeholder="admin@domain.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Kata Sandi"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="secondary"
                className="w-full justify-center font-bold pt-3 pb-3"
                isLoading={loading}
              >
                Masuk Dasbor Admin
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
              <Link href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                ← Kembali ke Beranda Utama
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

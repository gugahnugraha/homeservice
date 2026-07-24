'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Wrench, AlertCircle, Info } from 'lucide-react';
import siteConfig from '../../lib/config/site';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardContent } from '../../components/ui/Card';
import { useLanguage } from '../../context/LanguageContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams ? searchParams.get('redirect') : null;

  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        throw new Error(data.error || 'Login gagal. Silakan periksa email & password.');
      }

      const role = data.user?.role;

      if (redirectPath) {
        router.push(redirectPath);
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'PROVIDER') {
        router.push('/provider/profile');
      } else {
        router.push('/customer/profile');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setLoading(false);
    }
  };

  const registerLink = redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register';

  return (
    <Card className="shadow-xl border-slate-200 dark:border-slate-800">
      <CardContent className="p-6 sm:p-8 space-y-4">
        
        {redirectPath && redirectPath.includes('/book') && (
          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-800 dark:text-brand-300 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Login Diperlukan untuk Pemesanan Jasa</span>
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Silakan masuk atau buat akun baru. Setelah masuk, Anda akan otomatis diarahkan kembali untuk melanjutkan formulir pemesanan.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. email@domain.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Masukkan kata sandi"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center font-bold py-3.5"
            isLoading={loading}
          >
            Masuk Akun
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs space-y-2">
          <p className="text-slate-600 dark:text-slate-400">
            Belum memiliki akun?{' '}
            <Link href={registerLink} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
          <p className="text-slate-400">
            Mitra Jasa?{' '}
            <Link href="/provider/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Login Portal Mitra
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              {siteConfig.name}
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Masuk ke Akun Anda
          </h1>
          <p className="text-xs text-slate-500">
            Akses riwayat pemesanan, alamat, dan profil Anda
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-xs text-slate-500">Memuat formulir...</p>}>
          <LoginForm />
        </Suspense>

      </div>
    </div>
  );
}

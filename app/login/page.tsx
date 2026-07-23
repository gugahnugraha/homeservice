'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Wrench } from 'lucide-react';
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
        throw new Error(data.error || 'Login failed');
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
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. user@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center font-semibold pt-3 pb-3"
            isLoading={loading}
          >
            Log In
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs space-y-2">
          <p className="text-slate-500">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-slate-400">
            Are you a Service Provider?{' '}
            <Link href="/provider/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Join as Provider
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Log In to your Account
          </h1>
          <p className="text-xs text-slate-500">
            Access your bookings, profile, or provider dashboard
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-xs text-slate-500">Loading form...</p>}>
          <LoginForm />
        </Suspense>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Wrench } from 'lucide-react';
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
        throw new Error('Access denied. Administrator privileges required.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during admin authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6 text-brand-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Platform Admin Portal
          </h1>
          <p className="text-xs text-slate-500">
            Authorized administrative personnel only
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
                label="Admin Email"
                type="email"
                placeholder="admin@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Admin Password"
                type="password"
                placeholder="Enter admin password"
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
                Authenticate Admin Access
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
              <Link href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                ← Return to Public Homepage
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

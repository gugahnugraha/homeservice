'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, Wrench, Briefcase, Award, MapPin } from 'lucide-react';
import siteConfig from '../../../lib/config/site';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent } from '../../../components/ui/Card';

export default function ProviderRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('2');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role: 'PROVIDER',
          bio,
          yearsExperience: Number(yearsExperience) || 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Provider registration failed');
      }

      router.push('/provider/profile');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
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
            Become a Service Provider
          </h1>
          <p className="text-xs text-slate-500">
            Join thousands of technicians and home service businesses earning in {siteConfig.defaultCity}
          </p>
        </div>

        {/* Card Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Full Name / Business Name"
                type="text"
                placeholder="e.g. Ahmad Teknik / CV Bersih Utama"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. provider@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Phone / WhatsApp"
                  type="tel"
                  placeholder="e.g. 08123456789"
                  icon={Phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Input
                  label="Years of Experience"
                  type="number"
                  placeholder="e.g. 3"
                  icon={Award}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Bio / Business Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your skills, services offered, certification, or team..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full justify-center font-bold pt-3 pb-3 text-white"
                isLoading={loading}
              >
                Register as Service Provider
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs space-y-2">
              <p className="text-slate-500">
                Already registered as a Provider?{' '}
                <Link href="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Log In Here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

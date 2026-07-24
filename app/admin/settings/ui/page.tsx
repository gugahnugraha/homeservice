'use client';

import React, { useEffect, useState } from 'react';
import {
  Palette,
  Sparkles,
  Check,
  Save,
  Wrench,
  Building2,
  Layout,
  Sliders,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Sun,
  ShieldCheck,
  Tag
} from 'lucide-react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import { FadeIn, ScaleIn } from '../../../../components/ui/MotionWrapper';
import siteConfig from '../../../../lib/config/site';

interface ColorPreset {
  id: string;
  name: string;
  gradient: string;
  badgeBg: string;
  badgeText?: string;
  buttonBg: string;
  hex: string;
}

export default function AdminUISettingsPage() {
  const [brandName, setBrandName] = useState(siteConfig.name);
  const [brandTagline, setBrandTagline] = useState(siteConfig.tagline);
  const [primaryColorTheme, setPrimaryColorTheme] = useState('ocean');
  const [defaultCity, setDefaultCity] = useState(siteConfig.defaultCity);
  const [borderRadius, setBorderRadius] = useState('rounded-2xl');
  const [glassmorphismIntensity, setGlassmorphismIntensity] = useState('high');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const colorPresets: ColorPreset[] = [
    {
      id: 'ocean',
      name: 'Ocean Blue (Standar)',
      gradient: 'from-sky-600 to-blue-700',
      badgeBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
      buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white',
      hex: '#0284c7',
    },
    {
      id: 'emerald',
      name: 'Emerald Green (Segar)',
      gradient: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      hex: '#059669',
    },
    {
      id: 'purple',
      name: 'Royal Purple (Mewah)',
      gradient: 'from-purple-600 to-indigo-700',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white',
      hex: '#7c3aed',
    },
    {
      id: 'amber',
      name: 'Sunset Amber (Hangat)',
      gradient: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      hex: '#d97706',
    },
    {
      id: 'rose',
      name: 'Rose Pink (Elegan)',
      gradient: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
      hex: '#e11d48',
    },
    {
      id: 'slate',
      name: 'Midnight Slate (Pro)',
      gradient: 'from-slate-700 to-slate-900',
      badgeBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      buttonBg: 'bg-slate-800 hover:bg-slate-900 text-white',
      hex: '#334155',
    },
  ];

  useEffect(() => {
    fetchUISettings();
  }, []);

  const fetchUISettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings/ui');
      const data = await res.json();
      if (data.success && data.settings) {
        setBrandName(data.settings.brandName || siteConfig.name);
        setBrandTagline(data.settings.brandTagline || siteConfig.tagline);
        setPrimaryColorTheme(data.settings.primaryColorTheme || 'ocean');
        setDefaultCity(data.settings.defaultCity || siteConfig.defaultCity);
        setBorderRadius(data.settings.borderRadius || 'rounded-2xl');
        setGlassmorphismIntensity(data.settings.glassmorphismIntensity || 'high');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings/ui', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          brandTagline,
          primaryColorTheme,
          defaultCity,
          borderRadius,
          glassmorphismIntensity,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengaturan');

      setMessage('Pengaturan Tema & Kustomisasi UI Platform berhasil disimpan!');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat kustomisasi tema UI..." />
      </div>
    );
  }

  const selectedPreset = colorPresets.find((p) => p.id === primaryColorTheme) || colorPresets[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Page Header */}
      <FadeIn direction="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-600 dark:text-brand-400 text-xs font-bold mb-2">
              <Palette className="w-3.5 h-3.5" />
              <span>UI Theme & Branding Customizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Kustomisasi Tema Warna & Tampilan UI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Atur skema warna utama, nama brand platform, tagline, dan gaya elemen antarmuka di seluruh aplikasi
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            className="gap-2 font-bold shadow-lg shadow-brand-500/25"
            isLoading={saving}
            onClick={handleSaveSettings}
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Tema</span>
          </Button>
        </div>
      </FadeIn>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Theme Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Color Presets */}
          <ScaleIn>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-brand-500" />
                  <span>1. Skema Warna Utama Platform (Brand Color Palette)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-slate-500">
                  Pilih warna aksen utama yang akan digunakan untuk tombol aksi, lencana, banner hero, dan sorotan antarmuka:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colorPresets.map((preset) => {
                    const isSelected = primaryColorTheme === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setPrimaryColorTheme(preset.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-28 ${
                          isSelected
                            ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-lg scale-[1.02] bg-white dark:bg-slate-900'
                            : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${preset.gradient} shadow-sm border border-white/20`} />
                          {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{preset.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{preset.hex}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </ScaleIn>

          {/* Section 2: Brand Identity Configurator */}
          <ScaleIn delay={0.1}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-brand-500" />
                  <span>2. Identitas Brand & Tagline Platform</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Input
                  label="Nama Brand Aplikasi / Platform"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. HomeFix Marketplace"
                />

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tagline / Subtitle Banner Utama</label>
                  <textarea
                    rows={2}
                    value={brandTagline}
                    onChange={(e) => setBrandTagline(e.target.value)}
                    placeholder="e.g. Solusi Jasa Rumah Tangga, Perbaikan & Perawatan Terpercaya"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </CardContent>
            </Card>
          </ScaleIn>

          {/* Section 3: Layout & Radius Styling */}
          <ScaleIn delay={0.15}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layout className="w-4 h-4 text-brand-500" />
                  <span>3. Gaya Layout & Kelengkungan Sudut (Border Radius)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'rounded-xl', label: 'Compact (rounded-xl)', desc: 'Sudut melengkung standar ringkas' },
                    { id: 'rounded-2xl', label: 'Modern (rounded-2xl)', desc: 'Sudut melengkung modern populer' },
                    { id: 'rounded-3xl', label: 'Smooth Pill (rounded-3xl)', desc: 'Sudut ekstra bulat & lembut' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setBorderRadius(style.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        borderRadius === style.id
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 font-bold ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">{style.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{style.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Kota Default Layanan</label>
                  <select
                    value={defaultCity}
                    onChange={(e) => setDefaultCity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer font-semibold"
                  >
                    {siteConfig.supportedCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </ScaleIn>

        </div>

        {/* Right 1 Column: Live Preview Panel */}
        <div className="space-y-6">
          <ScaleIn delay={0.2}>
            <div className="sticky top-20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Eye className="w-4 h-4 text-brand-500" />
                  <span>Pratinjau Langsung (Live Preview)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">Real-Time</span>
              </div>

              {/* Dynamic Live Preview Card Box */}
              <div className={`p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 transition-all duration-300 ${borderRadius}`}>
                
                {/* Brand Preview */}
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${selectedPreset.gradient} text-white flex items-center justify-center shadow-md`}>
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">{brandName}</h4>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{brandTagline}</p>
                  </div>
                </div>

                {/* Badge Preview */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Elemen Lencana & Tag:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${selectedPreset.badgeBg}`}>
                      {selectedPreset.name.split(' ')[0]} Theme
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      City: {defaultCity}
                    </span>
                  </div>
                </div>

                {/* Sample Service Card Preview */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Cuci AC & Servis Rutin</span>
                    <span className="font-extrabold text-amber-500">4.9 ★</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">Pembersihan unit indoor dan outdoor AC menggunakan jet washer.</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-black text-slate-900 dark:text-white text-sm">Rp 90.000</span>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all ${selectedPreset.buttonBg}`}>
                      Pesan Jasa
                    </button>
                  </div>
                </div>

                {/* Security Guarantee */}
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Garansi Resmi 100% Terverifikasi</span>
                </div>

              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Pengaturan warna dan teks brand di atas akan langsung diterapkan di seluruh portal publik pelanggan, mitra, dan dasbor admin.
              </p>
            </div>
          </ScaleIn>
        </div>

      </div>

    </div>
  );
}

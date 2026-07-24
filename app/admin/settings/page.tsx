'use client';

import React, { useEffect, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const defaultKeys = [
    { key: 'platform_commission_rate', value: '0.15', description: 'Persentase komisi platform (misal 0.15 untuk 15%)' },
    { key: 'platform_name', value: 'HomeFix Marketplace', description: 'Nama platform publik' },
    { key: 'support_email', value: 'support@homefix.local', description: 'Email dukungan pelanggan' },
    { key: 'default_city', value: 'Bandung', description: 'Kota default lokasi layanan' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const json = await res.json();

      if (json.success) {
        const merged = defaultKeys.map((dk) => {
          const found = json.settings?.find((s: any) => s.key === dk.key);
          return found || dk;
        });
        setSettings(merged);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = async (setting: any) => {
    try {
      setSaving(true);
      setMessage('');
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Pengaturan ${setting.key} berhasil disimpan.`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat pengaturan platform...</p>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Global Platform</h1>
        <p className="text-sm text-slate-500">Atur variabel utama platform (komisi, nama brand, kota default) secara dinamis.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-500" /> Variabel Sistem
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {settings.map((setting) => (
            <div key={setting.key} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex-1">
                <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{setting.key}</label>
                <p className="text-xs text-slate-500 mt-1 mb-3">{setting.description}</p>
                <input
                  type="text"
                  value={setting.value}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  className="w-full sm:w-1/2 p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="sm:mt-8">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={saving}
                  onClick={() => handleSave(setting)}
                  className="w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-1" /> Simpan
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

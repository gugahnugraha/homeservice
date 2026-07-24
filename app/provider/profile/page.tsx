'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Briefcase, Award, Star, CheckCircle, LogOut, MessageSquare, Send } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge, { StatusBadge } from '../../../components/ui/Badge';

export default function ProviderProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('1');
  const [availabilityStatus, setAvailabilityStatus] = useState('OFFLINE');
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
        if (data.user.providerProfile) {
          setBio(data.user.providerProfile.bio || '');
          setYearsExperience(String(data.user.providerProfile.yearsExperience || 1));
          setAvailabilityStatus(data.user.providerProfile.availabilityStatus || 'OFFLINE');
        }

        const reviewRes = await fetch('/api/provider/reviews');
        const reviewData = await reviewRes.json();
        if (reviewData.success) {
          setReviews(reviewData.reviews);
        }
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
        body: JSON.stringify({
          name,
          phone,
          bio,
          yearsExperience,
          availabilityStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update provider profile');
      }

      setMessage('Profil penyedia jasa berhasil diperbarui!');
      fetchProfile();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleAvailability = async (newStatus: string) => {
    setAvailabilityStatus(newStatus);
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availabilityStatus: newStatus }),
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);

    try {
      const res = await fetch('/api/provider/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          responseText: replyText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyingReviewId(null);
        setReplyText('');
        fetchProfile();
      } else {
        alert(data.error || 'Gagal menyimpan balasan ulasan');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim balasan');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Memuat profil penyedia jasa...</p>
      </div>
    );
  }

  const profile = user?.providerProfile;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
              <StatusBadge status={profile?.verificationStatus || 'PENDING'} />
              <StatusBadge status={availabilityStatus} />
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50">
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>

      {/* Quick Availability Toggle */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Status Pekerjaan</span>
            <h3 className="text-lg font-bold">Atur Ketersediaan Anda</h3>
          </div>
          <div className="flex items-center gap-2">
            {[
              { status: 'ONLINE', label: 'Online / Ready', color: 'bg-emerald-600 hover:bg-emerald-700' },
              { status: 'OFFLINE', label: 'Offline', color: 'bg-slate-700 hover:bg-slate-800' },
              { status: 'BUSY', label: 'Busy / On Job', color: 'bg-amber-600 hover:bg-amber-700' },
            ].map((item) => (
              <button
                key={item.status}
                onClick={() => handleToggleAvailability(item.status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  availabilityStatus === item.status ? 'ring-2 ring-white ' + item.color : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Detail Profil Penyedia Jasa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdate} className="space-y-4">
                {message && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl font-medium">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <Input
                  label="Nama Usaha / Nama Teknisi"
                  type="text"
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Nomor Telepon / WhatsApp"
                  type="tel"
                  icon={Phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                />

                <Input
                  label="Pengalaman (Tahun)"
                  type="number"
                  icon={Award}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  min="0"
                />

                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Deskripsi & Keahlian Usaha
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Jelaskan keahlian, garansi pengerjaan, serta peralatan profesional yang Anda gunakan..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <Button type="submit" variant="primary" isLoading={updating}>
                  Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Rating, Reviews & Reply */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Statistik Kinerja</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs text-slate-500">Rata-rata Rating</span>
                <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{profile?.ratingAvg ? profile.ratingAvg.toFixed(1) : '0.0'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Pekerjaan Selesai</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{profile?.totalJobs || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews & Reply Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                Ulasan Pelanggan ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 max-h-96 overflow-y-auto space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">Belum ada ulasan dari pelanggan.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.customer?.user?.name || 'Pelanggan'}</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-brand-600 font-semibold">{rev.service?.name} ({rev.booking?.bookingNumber})</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{rev.comment}"</p>

                    {/* Show existing reply or reply button */}
                    {rev.responseText ? (
                      <div className="bg-brand-50/60 dark:bg-brand-950/40 p-2.5 rounded-xl text-xs space-y-1 border border-brand-200 dark:border-brand-900">
                        <span className="font-bold text-brand-700 dark:text-brand-300 block">Tanggapan Anda:</span>
                        <p className="text-slate-700 dark:text-slate-300">{rev.responseText}</p>
                      </div>
                    ) : (
                      <div>
                        {replyingReviewId === rev.id ? (
                          <div className="pt-2 space-y-2">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Tuliskan ucapan terima kasih atau tanggapan profesional..."
                              className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="primary"
                                className="text-[10px] py-1 px-3"
                                isLoading={submittingReply}
                                onClick={() => handleSendReply(rev.id)}
                              >
                                <Send className="w-3 h-3 mr-1" /> Kirim Balasan
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] py-1 px-3"
                                onClick={() => {
                                  setReplyingReviewId(null);
                                  setReplyText('');
                                }}
                              >
                                Batal
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingReviewId(rev.id);
                              setReplyText('');
                            }}
                            className="text-[11px] text-brand-600 font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" /> Balas Ulasan
                          </button>
                        )}
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 mt-1">{new Date(rev.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

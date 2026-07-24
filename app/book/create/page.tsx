'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Tag,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Plus,
  Check,
  X,
  ChevronRight,
  LogIn,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { FormattedService } from '../../../lib/services/serviceCatalogService';
import siteConfig from '../../../lib/config/site';

interface PhotoItem {
  id: string;
  url: string;
  previewUrl: string;
}

interface FieldErrors {
  date?: string;
  time?: string;
  address?: string;
  form?: string;
  unauthorized?: boolean;
}

function BookingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams ? searchParams.get('serviceId') || '' : '';

  const [step, setStep] = useState<number>(1);
  const [service, setService] = useState<FormattedService | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // New Address State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newAddressLabel, setNewAddressLabel] = useState('Rumah');

  // Schedule State - Initialized empty to force explicit selection by user
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');

  // Notes & Upload State
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoItem[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Field level validation error messages
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const timeSlots = [
    { time: '08:00 - 10:00', label: 'Pagi' },
    { time: '10:00 - 12:00', label: 'Siang' },
    { time: '13:00 - 15:00', label: 'Siang' },
    { time: '15:00 - 17:00', label: 'Sore' },
    { time: '17:00 - 19:00', label: 'Malam' },
  ];

  useEffect(() => {
    fetchInitialData();
  }, [serviceIdParam]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Check if user is logged in
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.authenticated) {
        setIsLoggedIn(false);
        setShowAddAddress(true);
      } else {
        setIsLoggedIn(true);
      }

      // Fetch user addresses if logged in
      const addrRes = await fetch('/api/customer/addresses');
      if (addrRes.ok) {
        const addrData = await addrRes.json();
        if (addrData.addresses) {
          setAddresses(addrData.addresses);
          if (addrData.addresses.length > 0) {
            setSelectedAddressId(addrData.addresses[0].id);
            setShowAddAddress(false);
          } else {
            setShowAddAddress(true);
          }
        }
      } else {
        setShowAddAddress(true);
      }

      // Fetch service details
      if (serviceIdParam) {
        const srvRes = await fetch('/api/services');
        const srvData = await srvRes.json();
        if (srvData.services) {
          const match = srvData.services.find((s: any) => s.id === serviceIdParam);
          if (match) setService(match);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async (e?: React.FormEvent): Promise<string | null> => {
    if (e) e.preventDefault();
    if (!newFullAddress.trim()) {
      setFieldErrors((prev) => ({ ...prev, address: 'Harap isi alamat lengkap lokasi rumah Anda.' }));
      return null;
    }

    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newAddressLabel || 'Rumah',
          fullAddress: newFullAddress.trim(),
          city: siteConfig.defaultCity,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setFieldErrors({
          address: 'Anda perlu masuk (login) terlebih dahulu untuk menyimpan alamat dan membuat pesanan.',
          unauthorized: true,
        });
        return null;
      }

      if (res.ok && data.address) {
        setAddresses((prev) => [...prev, data.address]);
        setSelectedAddressId(data.address.id);
        setShowAddAddress(false);
        setFieldErrors((prev) => ({ ...prev, address: undefined, unauthorized: undefined }));
        return data.address.id;
      } else {
        setFieldErrors((prev) => ({ ...prev, address: data.error || 'Gagal menyimpan alamat.' }));
      }
    } catch (err) {
      console.error('Error creating address:', err);
    }
    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const photoId = Math.random().toString(36).substring(7);

    // Use FileReader for guaranteed local Data URL preview (never breaks or 404s)
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      const newPhotoItem: PhotoItem = {
        id: photoId,
        url: dataUrl,
        previewUrl: dataUrl,
      };

      setUploadedPhotos((prev) => [...prev, newPhotoItem]);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.fileUrl) {
          // If server returned valid URL, store server URL for database submission while retaining dataUrl preview
          setUploadedPhotos((prev) =>
            prev.map((item) => (item.id === photoId ? { ...item, url: data.fileUrl, previewUrl: dataUrl } : item))
          );
        }
      } catch (err) {
        console.error('File upload error:', err);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const validateStep1 = (): boolean => {
    const errors: FieldErrors = {};

    if (!scheduledDate) {
      errors.date = 'Wajib memilih tanggal pengerjaan.';
    }
    if (!scheduledTime) {
      errors.time = 'Wajib memilih slot jam kedatangan mitra.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleStep1Next = () => {
    if (!validateStep1()) {
      return;
    }
    setStep(2);
  };

  const handleStep2Next = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    const errors: FieldErrors = {};
    let activeAddressId = selectedAddressId;

    if (!isLoggedIn) {
      setFieldErrors({
        address: 'Silakan masuk (login) terlebih dahulu untuk melanjutkan pemesanan.',
        unauthorized: true,
      });
      return;
    }

    if (!activeAddressId && newFullAddress.trim()) {
      const createdId = await handleCreateAddress();
      if (createdId) {
        activeAddressId = createdId;
      } else {
        return;
      }
    } else if (!activeAddressId && addresses.length > 0) {
      activeAddressId = addresses[0].id;
      setSelectedAddressId(activeAddressId);
    }

    if (!activeAddressId && !newFullAddress.trim()) {
      errors.address = 'Harap pilih atau masukkan alamat lokasi pengerjaan.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStep(3);
  };

  const handleSubmitBooking = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    if (!isLoggedIn) {
      setFieldErrors({
        address: 'Silakan masuk (login) terlebih dahulu untuk membuat pesanan.',
        unauthorized: true,
      });
      setStep(2);
      return;
    }

    let activeAddressId = selectedAddressId;

    if (!activeAddressId && newFullAddress.trim()) {
      const createdId = await handleCreateAddress();
      if (createdId) activeAddressId = createdId;
    } else if (!activeAddressId && addresses.length > 0) {
      activeAddressId = addresses[0].id;
      setSelectedAddressId(activeAddressId);
    }

    if (!activeAddressId) {
      setFieldErrors({ address: 'Alamat lokasi rumah wajib dipilih.' });
      setStep(2);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});

    try {
      const photoUrls = uploadedPhotos.map((p) => p.url);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service?.id,
          addressId: activeAddressId,
          scheduledDate,
          scheduledTime,
          customerNotes,
          attachments: photoUrls,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setFieldErrors({
          form: 'Sesi Anda telah berakhir. Silakan login kembali.',
          unauthorized: true,
        });
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat pesanan');
      }

      router.push(`/customer/bookings/${data.booking.id}`);
      router.refresh();
    } catch (err: any) {
      setFieldErrors({ form: err.message || 'Terjadi kesalahan saat memproses pesanan.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm animate-pulse">Memuat formulir pemesanan...</p>
      </div>
    );
  }

  const selectedAddressObj = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Lightbox Modal Preview */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-rose-400 bg-white/10 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewModalUrl}
              alt="Full Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog Layanan</span>
      </Link>

      {/* Header Wizard Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-600 dark:text-brand-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pemesanan Langsung Garansi Resmi</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Formulir Pemesanan Jasa</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Atur jadwal kedatangan mitra, tentukan lokasi rumah, dan konfirmasi rincian biaya secara transparan.
        </p>
      </div>

      {/* Modern Stepper Progress Bar */}
      <div className="relative max-w-xl mx-auto px-4">
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full">
          <div
            className="h-full bg-brand-500 transition-all duration-300 rounded-full"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />
        </div>

        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-200 ${
                step === 1
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/20 scale-105'
                  : step > 1
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400'
              }`}
            >
              {step > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : '1'}
            </div>
            <span className={`text-xs font-bold transition-colors ${step >= 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              Jadwal & Jam
            </span>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-200 ${
                step === 2
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/20 scale-105'
                  : step > 2
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400'
              }`}
            >
              {step > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
            </div>
            <span className={`text-xs font-bold transition-colors ${step >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              Lokasi Rumah
            </span>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) handleStep2Next();
            }}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-200 ${
                step === 3
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/20 scale-105'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400'
              }`}
            >
              3
            </div>
            <span className={`text-xs font-bold transition-colors ${step >= 3 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              Konfirmasi
            </span>
          </button>
        </div>
      </div>

      {/* STEP 1: SCHEDULE SELECTION */}
      {step === 1 && (
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span>Langkah 1: Pilih Tanggal & Waktu Kedatangan Mitra</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {/* Selected Service Card */}
            {service && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50 via-brand-50/40 to-slate-50 dark:from-brand-950/40 dark:to-slate-900 border border-brand-200 dark:border-brand-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {service.categoryName}
                  </span>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{service.name}</h4>
                  <p className="text-xs text-slate-500">Estimasi pengerjaan: {service.durationMinutes} menit</p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <Badge variant="primary">{service.priceModelBadge}</Badge>
                  <p className="text-lg font-black text-brand-600 dark:text-brand-400 block">{service.priceFormatted}</p>
                </div>
              </div>
            )}

            {/* Date Picker Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Pilih Tanggal Pengerjaan</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => {
                    setScheduledDate(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                  min={new Date().toISOString().slice(0, 10)}
                  className={`w-full rounded-2xl border bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none transition-all ${
                    fieldErrors.date
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                />
              </div>
              {fieldErrors.date && (
                <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{fieldErrors.date}</span>
                </p>
              )}
            </div>

            {/* Time Slot Selection Grid */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Pilih Slot Jam Kedatangan Mitra <span className="text-rose-500">*</span></span>
                {scheduledTime && <span className="text-brand-600 font-semibold">Terpilih: {scheduledTime}</span>}
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = scheduledTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => {
                        setScheduledTime(slot.time);
                        setFieldErrors((prev) => ({ ...prev, time: undefined }));
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-brand-500 bg-brand-600 text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-400 scale-[1.02]'
                          : fieldErrors.time
                          ? 'border-rose-300 bg-rose-50/40 text-slate-800 hover:bg-rose-50'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-brand-300 hover:bg-brand-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-brand-200' : 'text-slate-400'}`}>
                          {slot.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <p className="text-sm font-extrabold mt-1">{slot.time}</p>
                    </button>
                  );
                })}
              </div>

              {fieldErrors.time && (
                <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{fieldErrors.time}</span>
                </p>
              )}
            </div>

            <Button variant="primary" className="w-full justify-center font-bold py-3.5 text-sm" onClick={handleStep1Next}>
              <span>Lanjut ke Langkah 2: Lokasi Rumah</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: ADDRESS & DETAILS */}
      {step === 2 && (
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span>Langkah 2: Pilih Alamat & Deskripsi Masalah</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {/* Address Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Pilih Alamat Lokasi Rumah <span className="text-rose-500">*</span>
                </label>
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs text-brand-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alamat Lain</span>
                  </button>
                )}
              </div>

              {showAddAddress || addresses.length === 0 ? (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <Input
                    label="Label Alamat (misal: Rumah Utama / Kantor / Rumah Orang Tua)"
                    value={newAddressLabel}
                    onChange={(e) => setNewAddressLabel(e.target.value)}
                  />
                  <Input
                    label="Alamat Lengkap (Jalan, No. Rumah, RT/RW, Kelurahan)"
                    value={newFullAddress}
                    onChange={(e) => {
                      setNewFullAddress(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, address: undefined, unauthorized: undefined }));
                    }}
                    placeholder="Contoh: Jl. Asia Afrika No. 12, RT 02/RW 05, Pasirkaliki, Bandung"
                    required
                  />
                  {isLoggedIn ? (
                    <Button type="button" onClick={handleCreateAddress} variant="primary" size="sm" className="font-bold">
                      Simpan Alamat Ini
                    </Button>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs space-y-2">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Akun Belum Log In</span>
                      </p>
                      <p>Alamat sudah Anda ketik. Silakan masuk (login) agar alamat dapat tersimpan ke akun Anda & pesanan dapat diproses.</p>
                      <Link href={`/login?redirect=/book/create?serviceId=${serviceIdParam}`}>
                        <Button variant="primary" size="sm" className="gap-1.5 font-bold mt-1">
                          <LogIn className="w-4 h-4" />
                          <span>Login Sekarang untuk Lanjut Pemesanan</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setFieldErrors((prev) => ({ ...prev, address: undefined, unauthorized: undefined }));
                        }}
                        className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 font-bold ring-2 ring-brand-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 dark:text-white text-sm">{addr.label}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono">
                              {addr.city}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-xs font-normal leading-relaxed">{addr.fullAddress}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Inline Address Error */}
              {fieldErrors.address && (
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{fieldErrors.address}</span>
                  </p>
                  {fieldErrors.unauthorized && (
                    <Link href={`/login?redirect=/book/create?serviceId=${serviceIdParam}`}>
                      <Button variant="primary" size="sm" className="gap-1.5 font-bold">
                        <LogIn className="w-4 h-4" />
                        <span>Login Sekarang ke Akun Anda</span>
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-white">Catatan Masalah (Opsional)</label>
              <textarea
                rows={3}
                placeholder="Jelaskan rincian masalah, petunjuk patokan rumah, atau instruksi khusus untuk mitra..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Photo Upload Card with Guaranteed Thumbnail Previews */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-brand-500" />
                  <span>Upload Foto Kerusakan / Kendala (Opsional)</span>
                </label>
                {uploadedPhotos.length > 0 && (
                  <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    {uploadedPhotos.length} Foto Terunggah
                  </span>
                )}
              </div>
              
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center hover:border-brand-400 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  id="photo-upload"
                  className="hidden"
                />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Klik di sini untuk memilih & unggah foto</span>
                  <span className="text-[10px] text-slate-400">Dukungan format PNG, JPG, WEBP (Pratinjau Langsung)</span>
                </label>
                {uploading && <p className="text-xs text-brand-500 font-semibold mt-3 animate-pulse">Mengunggah & memproses foto...</p>}
              </div>

              {/* Photo Thumbnail Preview Grid */}
              {uploadedPhotos.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pratinjau Thumbnail Foto:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {uploadedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800"
                      >
                        <img
                          src={photo.previewUrl}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setPreviewModalUrl(photo.previewUrl)}
                        />
                        
                        {/* Hover Overlay with Eye Icon */}
                        <div
                          onClick={() => setPreviewModalUrl(photo.previewUrl)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <Eye className="w-5 h-5 text-white" />
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(photo.id);
                          }}
                          className="absolute top-1.5 right-1.5 bg-rose-500/90 text-white rounded-full p-1 shadow-md hover:bg-rose-600 hover:scale-110 transition-all cursor-pointer z-10"
                          title="Hapus foto ini"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="w-1/2 justify-center py-3 text-xs" onClick={() => setStep(1)}>
                ← Kembali ke Jadwal
              </Button>
              <Button variant="primary" className="w-1/2 justify-center font-bold py-3 text-xs" onClick={handleStep2Next}>
                <span>Lanjut ke Konfirmasi</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {step === 3 && (
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Langkah 3: Tinjau & Konfirmasi Pesanan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {fieldErrors.form && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-4 rounded-2xl font-medium flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{fieldErrors.form}</span>
                </div>
                {fieldErrors.unauthorized && (
                  <Link href={`/login?redirect=/book/create?serviceId=${serviceIdParam}`}>
                    <Button variant="primary" size="sm" className="gap-1.5 font-bold mt-1">
                      <LogIn className="w-4 h-4" />
                      <span>Login Sekarang</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Receipt Summary Card */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-slate-500 font-semibold">Layanan Dipesan:</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{service?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-slate-500 font-semibold">Jadwal Kedatangan Mitra:</span>
                <span className="font-bold text-slate-900 dark:text-white">{scheduledDate} ({scheduledTime})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-slate-500 font-semibold">Alamat Lokasi:</span>
                <span className="font-bold text-slate-900 dark:text-white text-right max-w-[240px] leading-tight">
                  {selectedAddressObj
                    ? `${selectedAddressObj.fullAddress}, ${selectedAddressObj.city}`
                    : newFullAddress.trim()
                    ? `${newFullAddress.trim()}, Bandung`
                    : '-'}
                </span>
              </div>
              {customerNotes && (
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-slate-500 font-semibold">Catatan Masalah:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 italic max-w-[240px] text-right">"{customerNotes}"</span>
                </div>
              )}
              
              {/* Photo Thumbnails in Summary */}
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-slate-500 font-semibold">Foto Terlampir:</span>
                <span className="font-bold text-slate-900 dark:text-white">{uploadedPhotos.length} Foto Terlampir</span>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="flex gap-2 pt-1 flex-wrap">
                  {uploadedPhotos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.previewUrl}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700 cursor-pointer"
                      onClick={() => setPreviewModalUrl(photo.previewUrl)}
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-600 dark:text-slate-300 font-bold text-sm">Estimasi Total Biaya:</span>
                <span className="font-black text-brand-600 dark:text-brand-400 text-lg">{service?.priceFormatted}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="w-1/2 justify-center py-3 text-xs" onClick={() => setStep(2)}>
                ← Edit Pemesanan
              </Button>
              <Button variant="primary" className="w-1/2 justify-center font-bold py-3.5 text-xs shadow-lg shadow-brand-500/25" isLoading={submitting} onClick={handleSubmitBooking}>
                Konfirmasi & Buat Pesanan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function BookingWizardPage() {
  return (
    <Suspense fallback={<div className="text-center py-16"><p className="text-slate-500 text-sm animate-pulse">Loading booking wizard...</p></div>}>
      <BookingWizardContent />
    </Suspense>
  );
}

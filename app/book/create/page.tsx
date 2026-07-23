'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Upload, CheckCircle2, ArrowLeft, Tag, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { FormattedService } from '../../../lib/services/serviceCatalogService';
import siteConfig from '../../../lib/config/site';

function BookingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams ? searchParams.get('serviceId') || '' : '';

  const [step, setStep] = useState<number>(1);
  const [service, setService] = useState<FormattedService | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  
  // New Address State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newAddressLabel, setNewAddressLabel] = useState('Rumah');

  // Schedule State
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [scheduledTime, setScheduledTime] = useState<string>('09:00 - 11:00');

  // Notes & Upload State
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
  ];

  useEffect(() => {
    fetchInitialData();
  }, [serviceIdParam]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch user addresses
      const addrRes = await fetch('/api/customer/addresses');
      const addrData = await addrRes.json();
      if (addrData.addresses) {
        setAddresses(addrData.addresses);
        if (addrData.addresses.length > 0) {
          setSelectedAddressId(addrData.addresses[0].id);
        } else {
          setShowAddAddress(true);
        }
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

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newAddressLabel,
          fullAddress: newFullAddress,
          city: siteConfig.defaultCity,
        }),
      });

      const data = await res.json();
      if (res.ok && data.address) {
        setAddresses([...addresses, data.address]);
        setSelectedAddressId(data.address.id);
        setShowAddAddress(false);
        setNewFullAddress('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.fileUrl) {
        setUploadedPhotos([...uploadedPhotos, data.fileUrl]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!service || !selectedAddressId || !scheduledDate || !scheduledTime) {
      setError('Harap lengkapi tanggal, jam, dan lokasi rumah.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          addressId: selectedAddressId,
          scheduledDate,
          scheduledTime,
          customerNotes,
          attachments: uploadedPhotos,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat pesanan');
      }

      router.push(`/customer/bookings/${data.booking.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Memuat form pemesanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header Wizard */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Formulir Pemesanan Jasa</h1>
        <p className="text-xs text-slate-500">Pilih jadwal, alamat lokasi rumah, dan deskripsi masalah</p>
      </div>

      {/* Stepper Steps */}
      <div className="flex items-center justify-between max-w-md mx-auto text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">1</span>
          <span>Jadwal & Jam</span>
        </div>
        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">2</span>
          <span>Lokasi Rumah</span>
        </div>
        <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">3</span>
          <span>Konfirmasi</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* STEP 1: SCHEDULE SELECTION */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>Langkah 1: Pilih Tanggal & Waktu Kedatangan Mitra</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {service && (
              <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{service.name}</h4>
                  <p className="text-xs text-slate-500">{service.priceFormatted}</p>
                </div>
                <Badge variant="primary">{service.priceModelBadge}</Badge>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Tanggal Pengerjaan</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Slot Jam Kedatangan</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setScheduledTime(slot)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      scheduledTime === slot
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" className="w-full justify-center" onClick={() => setStep(2)}>
              Lanjut ke Langkah 2: Lokasi Rumah →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: ADDRESS & DETAILS */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>Langkah 2: Pilih Alamat & Foto Deskripsi Masalah</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Address Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Alamat Rumah</label>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs text-brand-600 font-semibold hover:underline cursor-pointer"
                >
                  + Tambah Alamat Baru
                </button>
              </div>

              {showAddAddress ? (
                <form onSubmit={handleCreateAddress} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-3">
                  <Input
                    label="Label Alamat (e.g. Rumah / Kantor)"
                    value={newAddressLabel}
                    onChange={(e) => setNewAddressLabel(e.target.value)}
                  />
                  <Input
                    label="Alamat Lengkap (Jalan, No. Rumah, RT/RW, Kelurahan)"
                    value={newFullAddress}
                    onChange={(e) => setNewFullAddress(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="primary" size="sm">
                    Simpan Alamat Ini
                  </Button>
                </form>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="font-bold text-slate-900 dark:text-white block">{addr.label}</span>
                      <span className="text-slate-500 block mt-0.5">{addr.fullAddress}, {addr.city}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Catatan Masalah (Opsional)</label>
              <textarea
                rows={3}
                placeholder="Jelaskan kondisi kerusakan atau instruksi khusus untuk mitra..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none"
              />
            </div>

            {/* Photo Upload Cloudflare R2 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Foto Kerusakan (Cloudflare R2 Storage)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
              />
              {uploading && <p className="text-xs text-brand-500">Mengunggah foto ke Cloudflare R2...</p>}

              {uploadedPhotos.length > 0 && (
                <div className="flex gap-2 pt-2 flex-wrap">
                  {uploadedPhotos.map((url, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100">
                      <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="w-1/2 justify-center" onClick={() => setStep(1)}>
                ← Kembali
              </Button>
              <Button variant="primary" className="w-1/2 justify-center" onClick={() => setStep(3)}>
                Lanjut ke Review →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Langkah 3: Tinjau & Konfirmasi Pesanan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Layanan:</span>
                <span className="font-bold text-slate-900 dark:text-white">{service?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Tanggal & Waktu:</span>
                <span className="font-bold text-slate-900 dark:text-white">{scheduledDate} ({scheduledTime})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Estimasi Biaya:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">{service?.priceFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Foto Terlampir:</span>
                <span className="font-bold text-slate-900 dark:text-white">{uploadedPhotos.length} Foto (Cloudflare R2)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="w-1/2 justify-center" onClick={() => setStep(2)}>
                ← Edit Pemesanan
              </Button>
              <Button variant="primary" className="w-1/2 justify-center font-bold" isLoading={submitting} onClick={handleSubmitBooking}>
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
    <Suspense fallback={<div className="text-center py-16"><p className="text-slate-500 text-sm">Loading booking wizard...</p></div>}>
      <BookingWizardContent />
    </Suspense>
  );
}

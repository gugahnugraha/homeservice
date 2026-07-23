'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Calendar, MapPin, ArrowLeft, CheckCircle2, User, Camera } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import Badge, { StatusBadge } from '../../../../components/ui/Badge';

export default function ProviderJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Upload state for completion proof
  const [uploading, setUploading] = useState(false);
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (data.booking) {
        setBooking(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async () => {
    setUpdating(true);
    setError('');
    try {
      const res = await fetch(`/api/provider/bookings/${id}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchBookingDetails();
    } catch (err: any) {
      setError(err.message || 'Gagal menerima pekerjaan');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string, note: string) => {
    setUpdating(true);
    setError('');
    try {
      const payload: any = { newStatus, note };
      
      // If marking as completed and there's a proof photo, attach it
      if (newStatus === 'COMPLETED' && proofPhotoUrl) {
        payload.attachments = [proofPhotoUrl];
      }

      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowCompletionForm(false);
      fetchBookingDetails();
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate status');
    } finally {
      setUpdating(false);
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
        setProofPhotoUrl(data.fileUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Memuat detail pekerjaan...</p>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <Link href="/provider/bookings" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Pekerjaan Saya</span>
      </Link>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{booking.bookingNumber}</h1>
            <StatusBadge status={booking.bookingStatus} />
          </div>
          <p className="text-sm font-semibold text-brand-600 mt-1">{booking.service?.name}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Potensi Pendapatan</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">Rp {booking.providerEarnings?.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Actions & Details */}
        <div className="md:col-span-2 space-y-6">
          
          <Card>
            <CardHeader className="bg-brand-50/50 dark:bg-brand-950/20">
              <CardTitle className="text-base font-bold">Aksi Pekerjaan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {booking.bookingStatus === 'PENDING' && (
                <Button variant="primary" className="w-full justify-center" size="lg" isLoading={updating} onClick={handleAcceptJob}>
                  Terima Pekerjaan Ini
                </Button>
              )}

              {['PROVIDER_ASSIGNED', 'PROVIDER_ACCEPTED'].includes(booking.bookingStatus) && (
                <Button variant="primary" className="w-full justify-center" isLoading={updating} onClick={() => handleUpdateStatus('ON_THE_WAY', 'Mitra dalam perjalanan ke lokasi pelanggan.')}>
                  Berangkat ke Lokasi (On The Way)
                </Button>
              )}

              {booking.bookingStatus === 'ON_THE_WAY' && (
                <Button variant="primary" className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white border-transparent" isLoading={updating} onClick={() => handleUpdateStatus('ARRIVED', 'Mitra telah tiba di lokasi.')}>
                  Tiba di Lokasi (Arrived)
                </Button>
              )}

              {booking.bookingStatus === 'ARRIVED' && (
                <Button variant="primary" className="w-full justify-center bg-orange-600 hover:bg-orange-700 text-white border-transparent" isLoading={updating} onClick={() => handleUpdateStatus('IN_PROGRESS', 'Mitra mulai mengerjakan pesanan.')}>
                  Mulai Pekerjaan (In Progress)
                </Button>
              )}

              {booking.bookingStatus === 'IN_PROGRESS' && !showCompletionForm && (
                <Button variant="primary" className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" onClick={() => setShowCompletionForm(true)}>
                  Selesaikan Pekerjaan (Upload Bukti)
                </Button>
              )}

              {showCompletionForm && (
                <div className="space-y-4 p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
                  <h4 className="font-bold text-emerald-800 text-sm">Upload Bukti Pekerjaan Selesai</h4>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-emerald-700">Foto Hasil Pengerjaan (Wajib)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    {uploading && <p className="text-xs text-emerald-600">Mengunggah...</p>}
                  </div>

                  {proofPhotoUrl && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-emerald-200">
                      <img src={proofPhotoUrl} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowCompletionForm(false)}>Batal</Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      disabled={!proofPhotoUrl} 
                      isLoading={updating}
                      onClick={() => handleUpdateStatus('COMPLETED', 'Pekerjaan telah diselesaikan oleh mitra.')}
                    >
                      Konfirmasi Selesai
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Rincian Lokasi & Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{booking.address?.label || 'Alamat'}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{booking.address?.fullAddress}, {booking.address?.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Calendar className="w-5 h-5 text-brand-500 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Jadwal Kedatangan</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{new Date(booking.scheduledDate).toLocaleDateString('id-ID')} ({booking.scheduledTime})</p>
                </div>
              </div>
              
              {booking.providerId && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <User className="w-5 h-5 text-brand-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Kontak Pelanggan</p>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{booking.customer?.user?.name}</p>
                    <p className="text-slate-600 dark:text-slate-300">{booking.customer?.user?.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Photos & Notes */}
        <div className="space-y-6">
          {booking.customerNotes && (
             <Card>
               <CardHeader>
                 <CardTitle className="text-base font-bold">Catatan Pelanggan</CardTitle>
               </CardHeader>
               <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/20 m-2 rounded-xl">
                 "{booking.customerNotes}"
               </CardContent>
             </Card>
          )}

          {booking.attachments && booking.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Foto Masalah (Dari Pelanggan)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-wrap gap-2">
                {booking.attachments.filter((a: any) => a.uploadedByRole === 'CUSTOMER').map((att: any) => (
                  <a key={att.id} href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 block">
                    <img src={att.fileUrl} alt="Problem" className="w-full h-full object-cover" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

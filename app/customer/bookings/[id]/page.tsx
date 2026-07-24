'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Calendar, MapPin, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck, Phone, FileText, Star, CreditCard } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import Badge, { StatusBadge } from '../../../../components/ui/Badge';
import Input from '../../../../components/ui/Input';

export default function BookingTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const handleCancelBooking = async () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: 'CANCELLED_BY_CUSTOMER',
          note: 'Dibatalkan oleh pelanggan.',
        }),
      });

      if (res.ok) fetchBookingDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePayment = async () => {
    setUpdating(true);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBookingDetails();
      } else {
        alert(data.error || 'Gagal memproses pembayaran');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat pembayaran');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBookingDetails();
      } else {
        alert(data.error || 'Gagal mengirim ulasan');
      }
    } catch (err) {
      alert('Terjadi kesalahan pengiriman ulasan');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Memuat detail dan pelacakan pesanan...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pesanan Tidak Ditemukan</h1>
        <Link href="/customer/bookings">
          <Button variant="primary">Kembali ke Daftar Pesanan</Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { status: 'PENDING', label: 'Dibuat' },
    { status: 'CONFIRMED', label: 'Dikonfirmasi' },
    { status: 'IN_PROGRESS', label: 'Dikerjakan' },
    { status: 'CUSTOMER_CONFIRMED', label: 'Selesai' },
  ];

  const getStepIndex = () => {
    const s = booking.bookingStatus;
    if (s === 'PENDING') return 0;
    if (['CONFIRMED', 'PROVIDER_ASSIGNED', 'PROVIDER_ACCEPTED', 'ON_THE_WAY', 'ARRIVED'].includes(s)) return 1;
    if (s === 'IN_PROGRESS') return 2;
    if (['COMPLETED', 'CUSTOMER_CONFIRMED'].includes(s)) return 3;
    return -1;
  };

  const currentStep = getStepIndex();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <Link href="/customer/bookings" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Daftar Pesanan Saya</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{booking.bookingNumber}</h1>
            <StatusBadge status={booking.bookingStatus} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Dibuat pada {new Date(booking.createdAt).toLocaleString('id-ID')}</p>
        </div>

        {!booking.bookingStatus.startsWith('CANCELLED') && !['COMPLETED', 'CUSTOMER_CONFIRMED'].includes(booking.bookingStatus) && (
          <Button variant="danger" size="sm" isLoading={updating} onClick={handleCancelBooking}>
            Batalkan Pesanan
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Progress Pengerjaan Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            {steps.map((st, i) => (
              <div key={st.status} className="space-y-1">
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                  currentStep >= i
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}>
                  {i + 1}
                </div>
                <span className={`font-semibold block ${currentStep >= i ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Rincian Layanan & Lokasi</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Layanan Dipesan:</span>
                <span className="font-bold text-slate-900 dark:text-white">{booking.service?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Jadwal Kedatangan:</span>
                <span className="font-bold text-slate-900 dark:text-white">{new Date(booking.scheduledDate).toLocaleDateString('id-ID')} ({booking.scheduledTime})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Alamat Pengerjaan:</span>
                <span className="font-bold text-slate-900 dark:text-white text-right max-w-[200px] leading-tight">
                  {booking.address?.fullAddress}, {booking.address?.city}
                </span>
              </div>
              {booking.customerNotes && (
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500">Catatan Masalah:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{booking.customerNotes}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cloudflare R2 Uploaded Photos */}
          {booking.attachments && booking.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Foto Lampiran Kerusakan</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-3 flex-wrap">
                  {booking.attachments.map((att: any) => (
                    <a key={att.id} href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 block bg-slate-100">
                      <img src={att.fileUrl} alt="Attachment" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Transition History Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Lini Masa Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {booking.statusHistory && booking.statusHistory.map((hist: any) => (
                <div key={hist.id} className="flex items-start gap-3 text-xs border-l-2 border-brand-500 pl-4 py-1">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{hist.newStatus}</span>
                    <span className="text-slate-500 block">{hist.note || 'Pembaruan status otomatis'}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(hist.createdAt).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Action Box (Payment / Review) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Biaya:</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">Rp {booking.price?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Bayar:</span>
                <Badge variant={booking.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                  {booking.paymentStatus}
                </Badge>
              </div>

              {/* Payment Action */}
              {['COMPLETED', 'CUSTOMER_CONFIRMED'].includes(booking.bookingStatus) && booking.paymentStatus !== 'PAID' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-slate-500 mb-3 text-center">Pesanan selesai. Silakan lakukan pembayaran.</p>
                  <Button variant="primary" className="w-full justify-center" onClick={handlePayment} isLoading={updating}>
                    <CreditCard className="w-4 h-4 mr-2" /> Bayar Sekarang (Mock)
                  </Button>
                </div>
              )}

              {/* Review Action */}
              {booking.paymentStatus === 'PAID' && !booking.review && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-sm text-slate-900 dark:text-white mb-2">Beri Ulasan Mitra</p>
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className={`${rating >= star ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500"
                      placeholder="Bagaimana pelayanan mitra kami?"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <Button type="submit" variant="primary" size="sm" className="w-full justify-center" isLoading={submittingReview}>
                      Kirim Ulasan
                    </Button>
                  </form>
                </div>
              )}

              {booking.review && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-bold text-slate-900 dark:text-white">Ulasan Terkirim</p>
                  <div className="flex justify-center text-amber-400">
                    {[...Array(booking.review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-500 italic">"{booking.review.comment}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

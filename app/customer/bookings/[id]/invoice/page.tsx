'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck, Download, MapPin, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import siteConfig from '@/lib/config/site';

export default function BookingInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Memuat kwitansi pembayaran...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <p className="text-slate-500 text-sm">Kwitansi pembayaran tidak ditemukan.</p>
        <Link href="/customer/bookings">
          <Button variant="primary">Kembali ke Pesanan Saya</Button>
        </Link>
      </div>
    );
  }

  const payment = booking.payments?.[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/customer/bookings/${booking.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Pesanan</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="w-4 h-4" />
            <span>Cetak / Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Printable Invoice Receipt Card */}
      <Card className="bg-white text-slate-900 shadow-lg border border-slate-200 p-8 space-y-8 rounded-2xl print:shadow-none print:border-none">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-sm">
                HS
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">{siteConfig.name}</span>
            </div>
            <p className="text-xs text-slate-500">{siteConfig.tagline}</p>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {booking.paymentStatus === 'PAID' ? 'LUNAS / PAID' : 'BELUM DIBAYAR'}
            </span>
            <h2 className="text-sm font-bold text-slate-700 block mt-1">FAKTUR PEMBAYARAN</h2>
            <p className="text-xs text-slate-500 font-mono">{booking.bookingNumber}</p>
          </div>
        </div>

        {/* Invoice Info Grid */}
        <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Diterbitkan Untuk:</span>
            <p className="font-bold text-slate-900">{booking.customer?.user?.name}</p>
            <p className="text-slate-600">{booking.customer?.user?.email}</p>
            <p className="text-slate-600">{booking.customer?.user?.phone}</p>
            <p className="text-slate-500 mt-2">{booking.address?.fullAddress}, {booking.address?.city}</p>
          </div>

          <div className="space-y-1 text-right">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Rincian Transaksi:</span>
            <p className="text-slate-600">Tanggal Faktur: <strong>{new Date(booking.createdAt).toLocaleDateString('id-ID')}</strong></p>
            <p className="text-slate-600">Metode Bayar: <strong>{payment?.paymentMethod || 'QRIS / Transfer'}</strong></p>
            <p className="text-slate-600">Ref Pembayaran: <strong className="font-mono">{payment?.paymentReference || '-'}</strong></p>
            <p className="text-slate-600">Jadwal Kedatangan: <strong>{new Date(booking.scheduledDate).toLocaleDateString('id-ID')} ({booking.scheduledTime})</strong></p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Deskripsi Layanan Jasa</th>
                <th className="p-3 text-center">Model Harga</th>
                <th className="p-3 text-right rounded-r-xl">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  {booking.service?.name}
                  {booking.provider?.user?.name && (
                    <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                      Penyedia Jasa: {booking.provider.user.name}
                    </span>
                  )}
                </td>
                <td className="p-3 text-center text-slate-600 font-mono text-[11px]">FIXED_PRICE</td>
                <td className="p-3 text-right font-bold text-slate-900">Rp {booking.price?.toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Layanan:</span>
              <span>Rp {booking.price?.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Biaya Penanganan / Pajak:</span>
              <span className="text-emerald-600 font-semibold">Gratis</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-300 pt-2">
              <span>Total Pembayaran:</span>
              <span className="text-brand-600">Rp {booking.price?.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-50 p-4 rounded-xl text-center space-y-1 text-xs text-slate-500 border border-slate-100">
          <p className="font-semibold text-slate-700">Terima kasih telah mempercayakan perbaikan rumah Anda kepada {siteConfig.name}!</p>
          <p className="text-[10px]">Simpan kwitansi digital ini sebagai bukti garansi pengerjaan dan transaksi resmi.</p>
        </div>

      </Card>
    </div>
  );
}

import React from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="p-8 rounded-3xl glass-card border border-white/40 dark:border-slate-800 shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs">
        <LoadingSpinner size="lg" text="Memuat halaman..." />
      </div>
    </div>
  );
}

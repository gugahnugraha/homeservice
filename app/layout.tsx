import './globals.css';
import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import siteConfig from '../lib/config/site';
import AppProviders from '../components/providers/AppProviders';

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: ['home service', 'house cleaning', 'plumbing repair', 'electrician', 'AC cleaning', 'appliance repair', 'handyman'],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <AppProviders>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}

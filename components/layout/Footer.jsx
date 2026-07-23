import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck, HeartHandshake, Phone, Mail } from 'lucide-react';
import siteConfig from '@/lib/config/site';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Verified Pros
              </span>
              <span className="inline-flex items-center gap-1 text-amber-400">
                <HeartHandshake className="w-4 h-4" /> Satisfaction Guarantee
              </span>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services/cleaning" className="hover:text-white transition-colors">Home Cleaning</Link></li>
              <li><Link href="/services/plumbing" className="hover:text-white transition-colors">Plumbing & Leaks</Link></li>
              <li><Link href="/services/electrical" className="hover:text-white transition-colors">Electrical & Wiring</Link></li>
              <li><Link href="/services/ac-service" className="hover:text-white transition-colors">AC Repair & Service</Link></li>
              <li><Link href="/services/appliances" className="hover:text-white transition-colors">Appliance Repair</Link></li>
              <li><Link href="/services/pest-control" className="hover:text-white transition-colors">Pest Control</Link></li>
            </ul>
          </div>

          {/* Column 3: For Providers & Partners */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Service Providers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/provider/register" className="hover:text-white transition-colors">Become a Provider</Link></li>
              <li><Link href="/provider/login" className="hover:text-white transition-colors">Provider Dashboard</Link></li>
              <li><Link href="/provider/verification" className="hover:text-white transition-colors">Verification Requirements</Link></li>
              <li><Link href="/provider/pricing-guide" className="hover:text-white transition-colors">Pricing & Commissions</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Cities */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Contact & Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>{siteConfig.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>{siteConfig.supportPhone}</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">Serving Cities:</span>
              <p className="text-[11px] text-slate-400 leading-tight">
                {siteConfig.supportedCities.join(', ')}
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/admin/login" className="hover:text-slate-300">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

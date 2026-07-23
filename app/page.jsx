'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Droplets,
  Zap,
  Wind,
  Wrench,
  Trees,
  Bug,
  Paintbrush,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Tag
} from 'lucide-react';
import siteConfig from '@/lib/config/site';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'cleaning',
      name: 'House Cleaning',
      icon: Sparkles,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200',
      description: 'Deep cleaning, sofa, kitchen & bathroom',
      count: '12 Services'
    },
    {
      id: 'plumbing',
      name: 'Plumbing Repair',
      icon: Droplets,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200',
      description: 'Faucet leaks, pipe unclogging, toilet repair',
      count: '8 Services'
    },
    {
      id: 'electrical',
      name: 'Electrical & Wiring',
      icon: Zap,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200',
      description: 'Socket installation, wiring, breakers',
      count: '10 Services'
    },
    {
      id: 'ac-service',
      name: 'AC Service & Repair',
      icon: Wind,
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200',
      description: 'AC washing, freon refill, installation',
      count: '6 Services'
    },
    {
      id: 'appliances',
      name: 'Appliance Repair',
      icon: Wrench,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200',
      description: 'Washing machine, fridge, dispenser',
      count: '9 Services'
    },
    {
      id: 'garden',
      name: 'Garden & Exterior',
      icon: Trees,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200',
      description: 'Grass cutting, tree pruning, yard maintenance',
      count: '5 Services'
    },
    {
      id: 'pest-control',
      name: 'Pest Control',
      icon: Bug,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200',
      description: 'Termite, cockroach, rodent control',
      count: '4 Services'
    },
    {
      id: 'home-improvement',
      name: 'Home Improvement',
      icon: Paintbrush,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200',
      description: 'Painting, furniture assembly, doors & locks',
      count: '11 Services'
    },
  ];

  const popularServices = [
    {
      id: 'srv-1',
      title: 'Faucet & Leaking Pipe Repair',
      category: 'Plumbing',
      priceText: 'From Rp 150.000',
      priceModel: 'STARTING_FROM',
      rating: 4.9,
      reviewsCount: 142,
      duration: '45 mins',
      badge: 'Popular Choice'
    },
    {
      id: 'srv-2',
      title: 'Full House Deep Cleaning',
      category: 'Cleaning',
      priceText: 'Rp 75.000 / hr',
      priceModel: 'HOURLY',
      rating: 4.85,
      reviewsCount: 310,
      duration: '2-4 hours',
      badge: 'Best Value'
    },
    {
      id: 'srv-3',
      title: 'AC Washing & Maintenance',
      category: 'Air Conditioning',
      priceText: 'Rp 90.000',
      priceModel: 'FIXED_PRICE',
      rating: 4.92,
      reviewsCount: 520,
      duration: '60 mins',
      badge: 'Top Rated'
    },
    {
      id: 'srv-4',
      title: 'Electrical Troubleshooting & Socket Repair',
      category: 'Electrical',
      priceText: 'From Rp 120.000',
      priceModel: 'STARTING_FROM',
      rating: 4.88,
      reviewsCount: 98,
      duration: '60 mins',
      badge: 'Fast Response'
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <Badge variant="primary" className="bg-brand-500/20 text-brand-200 border-brand-400/30 px-4 py-1 text-xs sm:text-sm">
            ✨ Verified Home Services Marketplace in {siteConfig.defaultCity}
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            What do you need <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-amber-300">help with today?</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            {siteConfig.tagline}
          </p>

          {/* Hero Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center shadow-premium rounded-2xl overflow-hidden bg-white p-2 text-slate-900">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder='Search e.g. "keran bocor", "AC cleaning", "cuci sofa"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-none"
              />
              <Button variant="primary" size="md" className="shrink-0 px-6 font-semibold">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-300">
              <span className="font-medium text-slate-400">Popular:</span>
              {['AC Cleaning', 'Faucet Repair', 'Deep Cleaning', 'Furniture Assembly'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SERVICE CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Service Categories
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Find verified, background-checked professionals for all your home needs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <Link key={cat.id} href={`/services/${cat.id}`}>
                <Card className="h-full hover:-translate-y-1 transition-all duration-200 cursor-pointer group border-slate-200/80 dark:border-slate-800">
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl border ${cat.color} group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-brand-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:underline">
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Most Requested Services
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Top-rated solutions backed by customer reviews and transparent pricing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((service) => (
            <Card key={service.id} className="flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{service.badge}</Badge>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{service.rating}</span>
                    <span className="text-slate-400 font-normal">({service.reviewsCount})</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {service.category}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mt-0.5">
                    {service.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est: {service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    <Tag className="w-3.5 h-3.5 text-brand-500" />
                    <span>{service.priceText}</span>
                  </div>
                </div>

                <Link href={`/book/${service.id}`} className="block w-full pt-2">
                  <Button variant="outline" className="w-full justify-center text-xs">
                    View Details & Book
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE PLATFORM */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold">Why Homeowners Trust {siteConfig.shortName}</h2>
            <p className="text-slate-400 text-sm">Built for convenience, safety, and guaranteed quality craftsmanship</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Vetted & Verified Professionals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every service provider submits identity verification, background check documentation, and skill assessment before accepting customer jobs.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Upfront & Transparent Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No hidden costs. View estimated costs, hourly rates, or fixed package prices upfront before confirming your booking.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Service Guarantee & Dispute Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Payment is only completed after you confirm job completion. Platform dispute mediation ensures total peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOR PROVIDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-brand-300 uppercase tracking-widest">
              Are you a Technician or Service Business?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Grow your income with {siteConfig.name}
            </h2>
            <p className="text-slate-300 text-sm">
              Connect with thousands of customers in {siteConfig.defaultCity}. Flexible working hours, transparent commissions, and direct payouts.
            </p>
          </div>
          <Link href="/provider/register">
            <Button variant="accent" size="lg" className="shrink-0 font-bold">
              Register as Service Provider
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

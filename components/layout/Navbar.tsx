'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Menu,
  X,
  User,
  MapPin,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Sparkles,
  Droplets,
  Zap,
  Wind,
  Baby,
  HeartHandshake,
  Utensils,
  Dog,
  Trees,
  Bug,
  Paintbrush,
  Grid
} from 'lucide-react';
import siteConfig from '../../lib/config/site';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>(siteConfig.defaultCity);
  const [categories, setCategories] = useState<any[]>([]);

  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories in navbar:', err);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'childcare':
        return <Baby className="w-4 h-4 text-pink-500" />;
      case 'elderly-care':
        return <HeartHandshake className="w-4 h-4 text-rose-500" />;
      case 'cleaning':
        return <Sparkles className="w-4 h-4 text-sky-500" />;
      case 'plumbing':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'electrical':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'ac-service':
        return <Wind className="w-4 h-4 text-teal-500" />;
      case 'home-cook':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'pet-care':
        return <Dog className="w-4 h-4 text-indigo-500" />;
      case 'garden':
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'pest-control':
        return <Bug className="w-4 h-4 text-rose-500" />;
      case 'home-improvement':
        return <Paintbrush className="w-4 h-4 text-orange-500" />;
      default:
        return <Wrench className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-medium text-brand-600 dark:text-brand-400">
                {siteConfig.shortName} Marketplace
              </span>
            </div>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            <span>{t('serviceArea')}</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              {siteConfig.supportedCities.map((city) => (
                <option key={city} value={city} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 relative">
            
            {/* Categories Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2 cursor-pointer font-semibold"
              >
                <Grid className="w-4 h-4 text-brand-500" />
                <span>{language === 'id' ? 'Kategori Layanan' : 'Categories'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-[540px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/services?category=${cat.slug}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform shrink-0">
                        {getCategoryIcon(cat.slug)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-600 truncate">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {cat.description || 'Layanan profesional terpercaya'}
                        </p>
                      </div>
                    </Link>
                  ))}
                  
                  <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      href="/services"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Lihat Semua Layanan Katalog →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t('howItWorks')}
            </Link>
          </nav>

          {/* Controls: Theme & Language Switchers */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <button
                onClick={() => setLanguage('id')}
                className={`px-1.5 py-0.5 rounded-md transition-colors ${
                  language === 'id' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded-md transition-colors ${
                  language === 'en' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Toggle Theme Mode"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Auth Actions */}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <User className="w-4 h-4" />
                <span>{t('login')}</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                {t('register')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>City: {selectedCity}</span>
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-lg text-xs">
              <button
                onClick={() => setLanguage('id')}
                className={`px-1.5 py-0.5 rounded ${language === 'id' ? 'bg-brand-500 text-white font-bold' : ''}`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-brand-500 text-white font-bold' : ''}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Categories List */}
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Kategori Layanan</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/services?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  {getCategoryIcon(cat.slug)}
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm">
              {t('howItWorks')}
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                {t('login')}
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                {t('register')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

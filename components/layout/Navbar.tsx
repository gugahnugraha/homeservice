'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wrench, Menu, X, User, MapPin, Sun, Moon, Globe } from 'lucide-react';
import siteConfig from '../../lib/config/site';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>(siteConfig.defaultCity);

  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

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
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/services" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t('findServices')}
            </Link>
            <Link href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t('howItWorks')}
            </Link>
            <Link href="/provider/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t('becomeProvider')}
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
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
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

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm">
              {t('findServices')}
            </Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm">
              {t('howItWorks')}
            </Link>
            <Link href="/provider/register" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm">
              {t('becomeProvider')}
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

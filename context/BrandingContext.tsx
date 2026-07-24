'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import siteConfig from '../lib/config/site';

interface BrandingSettings {
  brandName: string;
  brandTagline: string;
  primaryColorTheme: string;
  defaultCity: string;
  borderRadius: string;
  glassmorphismIntensity: string;
}

interface BrandingContextType {
  settings: BrandingSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: BrandingSettings = {
  brandName: siteConfig.name,
  brandTagline: siteConfig.tagline,
  primaryColorTheme: 'ocean',
  defaultCity: siteConfig.defaultCity,
  borderRadius: 'rounded-2xl',
  glassmorphismIntensity: 'high',
};

const BrandingContext = createContext<BrandingContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<BrandingSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/ui');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Error fetching branding settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandingContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}

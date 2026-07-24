'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { BrandingProvider } from '../../context/BrandingContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrandingProvider>
          {children}
        </BrandingProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default AppProviders;

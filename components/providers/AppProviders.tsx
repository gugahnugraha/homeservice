'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default AppProviders;

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const iconSizeMap = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        
        {/* Outer Pulsing Glow */}
        <div className={`absolute rounded-full bg-brand-500/20 blur-lg animate-pulse ${sizeMap[size]}`} />

        {/* Framer Motion Rotating Gradient Spinner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className={`rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-brand-500 border-r-brand-400 ${sizeMap[size]}`}
        />

        {/* Center Icon */}
        <div className="absolute text-brand-500">
          <Wrench className={iconSizeMap[size]} />
        </div>
      </div>

      {text && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export default LoadingSpinner;

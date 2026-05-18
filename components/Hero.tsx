'use client';

import { ArrowDown, Zap, Shield, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-yellow dark:bg-neo-purple border-neo border-neo-black dark:border-white rounded-full shadow-neo mb-6">
          <Sparkles className="w-4 h-4 text-neo-black dark:text-white" />
          <span className="text-sm font-bold text-neo-black dark:text-white">Free & Unlimited Downloads</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-neo-black dark:text-white mb-6 leading-tight">
          Download YouTube Videos dengan{' '}
          <span className="text-neo-blue dark:text-neo-purple">Style</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
          Neo Brutalism YouTube Downloader modern. Konversi video ke MP4 atau ekstrak audio ke MP3 dengan cepat dan mudah.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-neo border-neo-black dark:border-white rounded-lg shadow-neo">
            <Zap className="w-4 h-4 text-neo-yellow" />
            <span className="text-sm font-semibold text-neo-black dark:text-white">Fast</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-neo border-neo-black dark:border-white rounded-lg shadow-neo">
            <Shield className="w-4 h-4 text-neo-green" />
            <span className="text-sm font-semibold text-neo-black dark:text-white">Secure</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-neo border-neo-black dark:border-white rounded-lg shadow-neo">
            <ArrowDown className="w-4 h-4 text-neo-blue" />
            <span className="text-sm font-semibold text-neo-black dark:text-white">Free</span>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChangeEvent } from 'react';
import { Locale, locales } from '@/lib/i18n';
import { useTranslations } from '@/components/LanguageProvider';

export default function Header() {
  const { locale, setLocale, t } = useTranslations();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    setLocale(nextLocale);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center group">
            <div className="relative w-32 h-12 md:w-40 md:h-14 transition-transform group-hover:scale-105">
              <Image
                src="/megreen-logo.png"
                alt="Gemeente Maassluis Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <label htmlFor="language-switcher" className="text-sm font-medium text-gray-600 hidden sm:inline">
              {t.common.languageLabel}:
            </label>
            <div className="relative">
              <select
                id="language-switcher"
                value={locale}
                onChange={handleChange}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
              >
                {locales.map((option) => (
                  <option key={option} value={option}>
                    {t.common.languageNames[option]}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

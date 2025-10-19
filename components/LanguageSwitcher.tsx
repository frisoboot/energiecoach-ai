'use client';

import { ChangeEvent } from 'react';
import { Locale, locales } from '@/lib/i18n';
import { useTranslations } from '@/components/LanguageProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslations();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    setLocale(nextLocale);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-md backdrop-blur">
      <label htmlFor="language-switcher" className="text-sm font-medium text-gray-700">
        {t.common.languageLabel}
      </label>
      <select
        id="language-switcher"
        value={locale}
        onChange={handleChange}
        className="rounded-full border border-gray-300 bg-transparent px-3 py-1 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {locales.map((option) => (
          <option key={option} value={option} className="text-gray-900">
            {t.common.languageNames[option]}
          </option>
        ))}
      </select>
    </div>
  );
}

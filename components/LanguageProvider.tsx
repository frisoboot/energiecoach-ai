'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Locale, defaultLocale, isLocale, translations } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: defaultLocale,
  setLocale: () => undefined,
});

const STORAGE_KEY = 'energiecoach-locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (nextLocale: Locale) => {
        setLocale(nextLocale);
      },
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslations() {
  const { locale, setLocale } = useLanguage();
  return {
    locale,
    setLocale,
    t: translations[locale],
  };
}

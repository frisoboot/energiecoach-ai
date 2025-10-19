'use client';

import { useState, useEffect, useRef } from 'react';
import { BAGAdres } from '@/lib/types';
import { useTranslations } from '@/components/LanguageProvider';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: BAGAdres) => void;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
}: AddressAutocompleteProps) {
  const { t } = useTranslations();
  const { scan, address } = t;
  const [suggestions, setSuggestions] = useState<BAGAdres[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.bag.kadaster.nl/esd/bevragen/adres?zoekterm=${encodeURIComponent(value)}`
        );
        const data = await response.json();

        if (data._embedded?.adressen) {
          const addresses: BAGAdres[] = data._embedded.adressen.map((item: {
            adres?: {
              weergavenaam?: string;
              identificatie?: string;
              bouwjaar?: number;
              gebruiksdoel?: string[];
            };
          }) => ({
            weergavenaam: item.adres?.weergavenaam || '',
            identificatie: item.adres?.identificatie || '',
            bouwjaar: item.adres?.bouwjaar || undefined,
            gebruiksdoel: item.adres?.gebruiksdoel?.[0] || undefined,
          }));
          setSuggestions(addresses);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Fout bij ophalen BAG data:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const handleSelectAddress = (selected: BAGAdres) => {
    onChange(selected.weergavenaam);
    onAddressSelect(selected);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={scan.addressPlaceholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((addressSuggestion, index) => (
            <button
              key={`${addressSuggestion.identificatie}-${index}`}
              onClick={() => handleSelectAddress(addressSuggestion)}
              className="w-full text-start px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{addressSuggestion.weergavenaam}</div>
              {addressSuggestion.bouwjaar && (
                <div className="text-sm text-gray-500">
                  {address.constructionYearLabel} {addressSuggestion.bouwjaar}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

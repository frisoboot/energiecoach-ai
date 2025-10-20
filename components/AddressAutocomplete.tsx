'use client';

import { useState, useEffect, useRef } from 'react';
import { BAGAdres } from '@/lib/types';
import { useTranslations } from '@/components/LanguageProvider';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: BAGAdres) => void;
}

interface Suggestion {
  label: string;
  identificatie: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
}: AddressAutocompleteProps) {
  const { t } = useTranslations();
  const { scan } = t;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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

    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/bag?query=${encodeURIComponent(value)}`);
        if (!response.ok) {
          throw new Error('BAG search failed');
        }
        const data: { suggestions?: Suggestion[] } = await response.json();
        const newSuggestions = data.suggestions ?? [];
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
      } catch (error) {
        console.error('Fout bij ophalen BAG data:', error);
        setSuggestions([]);
        setShowSuggestions(false);
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

  const handleSelectAddress = async (selected: Suggestion) => {
    const fallbackAddress: BAGAdres = {
      weergavenaam: selected.label,
      identificatie: selected.identificatie,
    };

    setShowSuggestions(false);
    setSuggestions([]);
    onChange(selected.label);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/bag?identificatie=${encodeURIComponent(selected.identificatie)}`
      );
      if (!response.ok) {
        throw new Error('BAG detail fetch failed');
      }
      const data: { address?: BAGAdres } = await response.json();
      if (data.address) {
        onChange(data.address.weergavenaam || selected.label);
        onAddressSelect(data.address);
        return;
      }
    } catch (error) {
      console.error('Fout bij ophalen BAG details:', error);
    } finally {
      setIsLoading(false);
    }

    onAddressSelect(fallbackAddress);
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
              <div className="font-medium text-gray-900">{addressSuggestion.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

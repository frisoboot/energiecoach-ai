'use client';

import { useState, useEffect, useRef } from 'react';
import { BAGAdres } from '@/lib/types';
import { useTranslations } from '@/components/LanguageProvider';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: BAGAdres) => void;
}

type BAGAddressSuggestion = BAGAdres & {
  detailUrl?: string;
  woonplaats?: string;
  postcode?: string;
};

const ACCEPT_HEADER = { Accept: 'application/hal+json' } as const;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function getRecord(source: UnknownRecord | undefined, key: string): UnknownRecord | undefined {
  if (!source) {
    return undefined;
  }
  const value = source[key];
  return isRecord(value) ? value : undefined;
}

function getRecords(source: UnknownRecord | undefined, key: string): UnknownRecord[] {
  if (!source) {
    return [];
  }
  const value = source[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is UnknownRecord => isRecord(item));
}

function getLinkedRecord(source: UnknownRecord, key: string): UnknownRecord | undefined {
  return getRecord(getRecord(source, '_links'), key);
}

function getEmbeddedRecord(source: UnknownRecord, key: string): UnknownRecord | undefined {
  return getRecord(getRecord(source, '_embedded'), key);
}

function getLinkedRecords(source: UnknownRecord, key: string): UnknownRecord[] {
  return getRecords(getRecord(source, '_links'), key);
}

function getEmbeddedRecords(source: UnknownRecord | undefined, key: string): UnknownRecord[] {
  return getRecords(getRecord(source, '_embedded'), key);
}

function getStringValue(source: UnknownRecord | undefined, key: string): string | undefined {
  if (!source) {
    return undefined;
  }
  const value = source[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function getNumberValue(source: UnknownRecord | undefined, key: string): number | undefined {
  if (!source) {
    return undefined;
  }
  const value = source[key];
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  return undefined;
}

function ensureStringArray(value: unknown): string[] | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const sanitized = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    return sanitized.length ? sanitized : undefined;
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return undefined;
}

function extractEarliestBouwjaar(...sources: unknown[]): number | undefined {
  const years: number[] = [];

  const visit = (source: unknown) => {
    if (!source) {
      return;
    }

    if (typeof source === 'number' && Number.isFinite(source)) {
      years.push(Math.trunc(source));
      return;
    }

    if (Array.isArray(source)) {
      source.forEach((item) => visit(item));
      return;
    }

    if (isRecord(source)) {
      if (typeof source['oorspronkelijkBouwjaar'] === 'number') {
        years.push(Math.trunc(source['oorspronkelijkBouwjaar'] as number));
      }

      if (typeof source['bouwjaar'] === 'number') {
        years.push(Math.trunc(source['bouwjaar'] as number));
      }

      if (source['_embedded']) {
        visit(source['_embedded']);
      }
    }
  };

  sources.forEach((source) => visit(source));

  if (!years.length) {
    return undefined;
  }

  return years.reduce((earliest, current) => (current < earliest ? current : earliest), years[0]);
}

function collectPandenUsage(panden: unknown): string[] | undefined {
  if (!panden) {
    return undefined;
  }

  const usages: string[] = [];

  const addUsage = (usage: string[] | undefined) => {
    if (!usage) {
      return;
    }
    usage.forEach((item) => {
      if (!usages.includes(item)) {
        usages.push(item);
      }
    });
  };

  const visit = (source: unknown) => {
    if (!source) {
      return;
    }

    if (Array.isArray(source)) {
      source.forEach((item) => visit(item));
      return;
    }

    if (isRecord(source)) {
      addUsage(ensureStringArray(source['gebruiksdoelen']));
      addUsage(ensureStringArray(source['gebruiksdoel']));

      if (source['_embedded']) {
        visit(source['_embedded']);
      }
    }
  };

  visit(panden);

  return usages.length ? usages : undefined;
}

function formatWeergavenaam(item: UnknownRecord): string {
  const weergavenaam = getStringValue(item, 'weergavenaam');
  if (weergavenaam) {
    return weergavenaam;
  }

  const openbareRuimte = getRecord(item, 'openbareRuimte');
  const streetName =
    getStringValue(openbareRuimte, 'naam') || getStringValue(item, 'openbareruimteNaam') || getStringValue(item, 'straatnaam');

  const huisnummerParts: string[] = [];

  const huisnummer = item['huisnummer'];
  if (typeof huisnummer === 'number' || typeof huisnummer === 'string') {
    huisnummerParts.push(String(huisnummer));
  }

  const huisletter = item['huisletter'];
  if (typeof huisletter === 'string') {
    huisnummerParts.push(huisletter);
  }

  const huisnummertoevoeging = item['huisnummertoevoeging'];
  if (typeof huisnummertoevoeging === 'string') {
    huisnummerParts.push(huisnummertoevoeging);
  }

  const woonplaatsRecord = getRecord(item, 'woonplaats');
  const woonplaats =
    getStringValue(woonplaatsRecord, 'naam') || getStringValue(item, 'woonplaatsNaam') || getStringValue(item, 'woonplaats');

  const streetAndNumber = [streetName, huisnummerParts.join('')].filter(Boolean).join(' ').trim();

  if (!streetAndNumber && woonplaats) {
    return woonplaats;
  }

  const postcode = item['postcode'];

  return [streetAndNumber, typeof postcode === 'string' ? postcode : undefined, woonplaats]
    .filter((part) => typeof part === 'string' && part.length > 0)
    .join(', ');
}

function mapNewApiAddress(item: UnknownRecord): BAGAddressSuggestion | null {
  const detailLink = getLinkedRecord(item, 'adresseerbaarObject');
  const adresseerbaarObject = getEmbeddedRecord(item, 'adresseerbaarObject');

  const suggestion: BAGAddressSuggestion = {
    weergavenaam: formatWeergavenaam(item),
    identificatie:
      (typeof item['identificatie'] === 'string' && item['identificatie']) ||
      (typeof item['nummeraanduidingIdentificatie'] === 'string' ? (item['nummeraanduidingIdentificatie'] as string) : ''),
    bouwjaar: extractEarliestBouwjaar(adresseerbaarObject, getRecord(item, '_embedded'), item),
    gebruiksdoelen:
      ensureStringArray(adresseerbaarObject?.['gebruiksdoelen']) ||
      ensureStringArray(adresseerbaarObject?.['gebruiksdoel']) ||
      collectPandenUsage(getEmbeddedRecords(adresseerbaarObject, 'panden')) ||
      collectPandenUsage(getEmbeddedRecords(item, 'panden')),
    oppervlakte: getNumberValue(adresseerbaarObject, 'oppervlakte'),
    bagObjectType:
      getStringValue(adresseerbaarObject, 'typeAdresseerbaarObject') || getStringValue(adresseerbaarObject, 'type'),
    detailUrl:
      getStringValue(detailLink, 'href') ||
      getLinkedRecords(item, 'adresseerbaarObjecten')
        .map((linkItem) => getStringValue(linkItem, 'href'))
        .find((href): href is string => typeof href === 'string' && href.length > 0),
  };

  if (!suggestion.weergavenaam || !suggestion.identificatie) {
    return null;
  }

  if (suggestion.gebruiksdoelen && suggestion.gebruiksdoelen.length > 0) {
    suggestion.gebruiksdoel = suggestion.gebruiksdoelen[0];
  }

  return suggestion;
}

function mapLegacyApiAddress(item: UnknownRecord): BAGAddressSuggestion | null {
  const adresData = isRecord(item['adres']) ? (item['adres'] as UnknownRecord) : item;

  const usage = ensureStringArray(adresData['gebruiksdoel']) || ensureStringArray(adresData['gebruiksdoelen']);

  const suggestion: BAGAddressSuggestion = {
    weergavenaam: formatWeergavenaam(adresData),
    identificatie:
      (typeof adresData['identificatie'] === 'string' && (adresData['identificatie'] as string)) ||
      (typeof item['identificatie'] === 'string' ? (item['identificatie'] as string) : ''),
    bouwjaar: typeof adresData['bouwjaar'] === 'number' ? Math.trunc(adresData['bouwjaar'] as number) : undefined,
    gebruiksdoelen: usage,
    gebruiksdoel: usage && usage.length > 0 ? usage[0] : undefined,
  };

  if (!suggestion.weergavenaam || !suggestion.identificatie) {
    return null;
  }

  return suggestion;
}

async function fetchNewApiSuggestions(
  searchTerm: string,
  signal: AbortSignal
): Promise<BAGAddressSuggestion[]> {
  const response = await fetch(
    `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?zoekterm=${encodeURIComponent(searchTerm)}`,
    {
      headers: ACCEPT_HEADER,
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(`BAG API (v2) gaf status ${response.status}`);
  }

  const data = await response.json();
  const embedded = isRecord(data) ? getEmbeddedRecords(data, 'adressen') : [];
  const addresses = embedded.map((item) => mapNewApiAddress(item)).filter((item): item is BAGAddressSuggestion => item !== null);

  return addresses;
}

async function fetchLegacySuggestions(
  searchTerm: string,
  signal: AbortSignal
): Promise<BAGAddressSuggestion[]> {
  const response = await fetch(
    `https://api.bag.kadaster.nl/esd/bevragen/adres?zoekterm=${encodeURIComponent(searchTerm)}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(`Legacy BAG API gaf status ${response.status}`);
  }

  const data = await response.json();

  const embedded = isRecord(data) ? getEmbeddedRecords(data, 'adressen') : [];

  const addresses = embedded.map((item) => mapLegacyApiAddress(item)).filter((item): item is BAGAddressSuggestion => item !== null);

  return addresses;
}

async function fetchBagSuggestions(searchTerm: string, signal: AbortSignal): Promise<BAGAddressSuggestion[]> {
  try {
    const newApiResults = await fetchNewApiSuggestions(searchTerm, signal);
    if (newApiResults.length) {
      return newApiResults;
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Fout bij BAG API v2:', error);
    }
  }

  try {
    return await fetchLegacySuggestions(searchTerm, signal);
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw error;
    }
    console.error('Fout bij legacy BAG API:', error);
    return [];
  }
}

async function fetchAddressDetails(detailUrl: string): Promise<Partial<BAGAdres>> {
  const response = await fetch(detailUrl, {
    headers: ACCEPT_HEADER,
  });

  if (!response.ok) {
    throw new Error(`Detail request gaf status ${response.status}`);
  }

  const detailData = await response.json();
  const detail = isRecord(detailData) ? detailData : {};

  const usage =
    ensureStringArray(detail['gebruiksdoelen']) ||
    ensureStringArray(detail['gebruiksdoel']) ||
    collectPandenUsage(getEmbeddedRecords(detail, 'panden'));

  const bouwjaar = extractEarliestBouwjaar(
    getNumberValue(detail, 'oorspronkelijkBouwjaar'),
    getNumberValue(detail, 'bouwjaar'),
    getEmbeddedRecords(detail, 'panden')
  );

  return {
    bouwjaar: bouwjaar,
    gebruiksdoelen: usage,
    gebruiksdoel: usage && usage.length > 0 ? usage[0] : undefined,
    oppervlakte: getNumberValue(detail, 'oppervlakte'),
    bagObjectType:
      getStringValue(detail, 'typeAdresseerbaarObject') || getStringValue(detail, 'type'),
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
}: AddressAutocompleteProps) {
  const { t } = useTranslations();
  const { scan, address } = t;
  const [suggestions, setSuggestions] = useState<BAGAddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      try {
        const addresses = await fetchBagSuggestions(value, controller.signal);
        setSuggestions(addresses);
        setShowSuggestions(addresses.length > 0);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Fout bij ophalen BAG data:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const handleSelectAddress = async (selected: BAGAddressSuggestion) => {
    onChange(selected.weergavenaam);
    setShowSuggestions(false);
    setSuggestions([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    let enriched: Partial<BAGAdres> = {};

    if (selected.detailUrl) {
      setIsFetchingDetails(true);
      try {
        enriched = await fetchAddressDetails(selected.detailUrl);
      } catch (error) {
        console.error('Fout bij ophalen BAG detaildata:', error);
      } finally {
        setIsFetchingDetails(false);
      }
    }

    const { detailUrl, ...baseAddress } = selected;
    void detailUrl;
    onAddressSelect({ ...baseAddress, ...enriched });
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

      {(isLoading || isFetchingDetails) && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((addressSuggestion, index) => (
            <button
              key={`${addressSuggestion.identificatie}-${index}`}
              onClick={() => void handleSelectAddress(addressSuggestion)}
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

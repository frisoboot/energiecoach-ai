'use client';

import { useState } from 'react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { BAGAdres, ScanFormData, AnalyseResult } from '@/lib/types';
import Link from 'next/link';

export default function ScanPage() {
  const [formData, setFormData] = useState<Partial<ScanFormData>>({
    adres: '',
    bouwjaar: 0,
    woningtype: '',
    energielabel: '',
    verwarming: '',
    isolatie: [],
  });

  const [analyseResult, setAnalyseResult] = useState<AnalyseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressSelect = (address: BAGAdres) => {
    setFormData({
      ...formData,
      adres: address.weergavenaam,
      bouwjaar: address.bouwjaar || 0,
    });
  };

  const handleIsolatieToggle = (type: string) => {
    const currentIsolatie = formData.isolatie || [];
    if (currentIsolatie.includes(type)) {
      setFormData({
        ...formData,
        isolatie: currentIsolatie.filter(i => i !== type),
      });
    } else {
      setFormData({
        ...formData,
        isolatie: [...currentIsolatie, type],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Er ging iets mis bij het analyseren van je woning');
      }

      const result = await response.json();
      setAnalyseResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const queryParams = new URLSearchParams({
      adres: formData.adres || '',
      bouwjaar: formData.bouwjaar?.toString() || '',
      woningtype: formData.woningtype || '',
      energielabel: formData.energielabel || '',
      verwarming: formData.verwarming || '',
      isolatie: (formData.isolatie || []).join(','),
      advies: analyseResult?.advies || '',
    });

    window.open(`/api/pdf?${queryParams.toString()}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Energiescan</h1>
          <p className="text-xl text-gray-600 mt-2">Vul de gegevens van je woning in voor een persoonlijk advies</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Adres */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adres *
                </label>
                <AddressAutocomplete
                  value={formData.adres || ''}
                  onChange={(value) => setFormData({ ...formData, adres: value })}
                  onAddressSelect={handleAddressSelect}
                />
              </div>

              {/* Bouwjaar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bouwjaar *
                </label>
                <input
                  type="number"
                  value={formData.bouwjaar || ''}
                  onChange={(e) => setFormData({ ...formData, bouwjaar: parseInt(e.target.value) })}
                  placeholder="Bijv. 1990"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Woningtype */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type woning *
                </label>
                <select
                  value={formData.woningtype || ''}
                  onChange={(e) => setFormData({ ...formData, woningtype: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecteer type woning</option>
                  <option value="vrijstaand">Vrijstaande woning</option>
                  <option value="tussenwoning">Tussenwoning</option>
                  <option value="hoekwoning">Hoekwoning</option>
                  <option value="appartement">Appartement</option>
                  <option value="benedenwoning">Benedenwoning</option>
                  <option value="bovenwoning">Bovenwoning</option>
                </select>
              </div>

              {/* Energielabel */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Energielabel *
                </label>
                <select
                  value={formData.energielabel || ''}
                  onChange={(e) => setFormData({ ...formData, energielabel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecteer energielabel</option>
                  <option value="A++++">A++++ (nieuwbouw)</option>
                  <option value="A+++">A+++</option>
                  <option value="A++">A++</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="onbekend">Onbekend</option>
                </select>
              </div>

              {/* Verwarmingstype */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verwarmingstype *
                </label>
                <select
                  value={formData.verwarming || ''}
                  onChange={(e) => setFormData({ ...formData, verwarming: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecteer verwarmingstype</option>
                  <option value="cv-ketel">CV-ketel (gas)</option>
                  <option value="warmtepomp">Warmtepomp</option>
                  <option value="stadsverwarming">Stadsverwarming</option>
                  <option value="elektrisch">Elektrische verwarming</option>
                  <option value="pelletkachel">Pelletkachel</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              {/* Isolatie */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aanwezige isolatie
                </label>
                <div className="space-y-2">
                  {['muurisolatie', 'dakisolatie', 'vloerisolatie', 'dubbel glas', 'HR++ glas'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.isolatie || []).includes(type)}
                        onChange={() => handleIsolatieToggle(type)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-3 text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Analyseren...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Analyseer mijn woning
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Results Card */}
          {analyseResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Jouw Energierapport</h2>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6 rounded-r-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{analyseResult.advies}</p>
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download mijn rapport als PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


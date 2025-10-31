'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { BAGAdres, ScanFormData, AnalyseResult } from '@/lib/types';
import { useTranslations } from '@/components/LanguageProvider';

const insulationOptionsOrder: Array<'muurisolatie' | 'dakisolatie' | 'vloerisolatie' | 'dubbel glas' | 'HR++ glas'> = [
  'muurisolatie',
  'dakisolatie',
  'vloerisolatie',
  'dubbel glas',
  'HR++ glas',
];

export default function ScanPage() {
  const { t } = useTranslations();
  const { common, scan } = t;
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
        isolatie: currentIsolatie.filter((item) => item !== type),
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
        throw new Error(scan.analysisError);
      }

      const result = await response.json();
      setAnalyseResult(result);
    } catch (err) {
      console.error('Analyse error:', err);
      if (err instanceof Error && err.message === scan.analysisError) {
        setError(err.message);
      } else {
        setError(scan.genericError);
      }
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
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {common.backToHome}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{scan.title}</h1>
          <p className="text-xl text-gray-600 mt-2">{scan.description}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{scan.addressLabel}</label>
                <AddressAutocomplete
                  value={formData.adres || ''}
                  onChange={(value) => setFormData({ ...formData, adres: value })}
                  onAddressSelect={handleAddressSelect}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{scan.yearLabel}</label>
                <input
                  type="number"
                  value={formData.bouwjaar || ''}
                  onChange={(e) => setFormData({ ...formData, bouwjaar: parseInt(e.target.value, 10) })}
                  placeholder={scan.yearPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{scan.typeLabel}</label>
                <select
                  value={formData.woningtype || ''}
                  onChange={(e) => setFormData({ ...formData, woningtype: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">{scan.typePlaceholder}</option>
                  {Object.entries(scan.propertyTypes).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{scan.energyLabel}</label>
                <select
                  value={formData.energielabel || ''}
                  onChange={(e) => setFormData({ ...formData, energielabel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">{scan.energyPlaceholder}</option>
                  {Object.entries(scan.energyLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{scan.heatingLabel}</label>
                <select
                  value={formData.verwarming || ''}
                  onChange={(e) => setFormData({ ...formData, verwarming: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">{scan.heatingPlaceholder}</option>
                  {Object.entries(scan.heatingOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{scan.insulationLabel}</label>
                <div className="space-y-2">
                  {insulationOptionsOrder.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.isolatie || []).includes(type)}
                        onChange={() => handleIsolatieToggle(type)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-3 text-gray-700">{scan.insulationOptions[type]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    {scan.analyzing}
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {scan.submit}
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

          {analyseResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{scan.resultTitle}</h2>
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
                {scan.downloadReport}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

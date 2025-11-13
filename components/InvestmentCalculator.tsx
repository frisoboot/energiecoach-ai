'use client';

import { useState, useEffect } from 'react';
import { Investment, ROICalculation, CalculatorResult } from '@/lib/types';
import { useTranslations } from '@/components/LanguageProvider';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentCalculatorProps {
  initialInvesteringen?: ROICalculation[];
  formData?: {
    bouwjaar?: number;
    energielabel?: string;
    woningtype?: string;
    isolatie?: string[];
    verwarming?: string;
  };
}

export default function InvestmentCalculator({ initialInvesteringen, formData }: InvestmentCalculatorProps) {
  const { t } = useTranslations();
  const { scan } = t;
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([]);
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allInvestments, setAllInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    // Haal alle beschikbare investeringen op
    fetch('/api/calculator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.alleInvesteringen) {
          setAllInvestments(data.alleInvesteringen);
        }
      });

    // Als er initial investeringen zijn, selecteer die
    if (initialInvesteringen && initialInvesteringen.length > 0) {
      setSelectedInvestments(initialInvesteringen.map((inv) => inv.investment.id));
    }
  }, [initialInvesteringen]);

  useEffect(() => {
    if (selectedInvestments.length > 0) {
      calculateROI();
    } else {
      setCalculatorResult(null);
    }
  }, [selectedInvestments]);

  const calculateROI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investmentIds: selectedInvestments,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCalculatorResult(result);
      }
    } catch (error) {
      console.error('Fout bij berekening:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInvestment = (investmentId: string) => {
    setSelectedInvestments((prev) =>
      prev.includes(investmentId)
        ? prev.filter((id) => id !== investmentId)
        : [...prev, investmentId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{scan.calculateInvestment}</h3>
      <p className="text-gray-600 mb-6">
        {scan.investmentDescription}
      </p>

      {/* Investeringsopties */}
      <div className="space-y-3 mb-8">
        {allInvestments.map((investment) => {
          const isSelected = selectedInvestments.includes(investment.id);
          const initialCalc = initialInvesteringen?.find(
            (calc) => calc.investment.id === investment.id
          );

          return (
            <label
              key={investment.id}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleInvestment(investment.id)}
                className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{investment.naam}</span>
                  {initialCalc && (
                    <span className="text-sm text-green-600 font-medium">
                      {scan.recommended}
                    </span>
                  )}
                </div>
                {initialCalc && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">{scan.costs}: {formatCurrency(initialCalc.totaleKosten)}</span>
                    {' • '}
                    <span className="font-medium">{scan.savingsPerYear}: {formatCurrency(initialCalc.jaarlijkseBesparing)}</span>
                    {' • '}
                    <span>{scan.paybackTime}: {initialCalc.terugverdientijd} jaar</span>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Resultaten */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Berekenen...</p>
        </div>
      )}

      {calculatorResult && !isLoading && (
        <div className="space-y-6">
          {/* Totaal overzicht */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Totaal overzicht</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">{scan.totalInvestment}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculatorResult.totaalKosten)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{scan.savings10Years}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculatorResult.totaalBesparing10Jaar)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{scan.averagePaybackTime}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calculatorResult.gemiddeldeTerugverdientijd} jaar
                </p>
              </div>
            </div>
          </div>

          {/* Grafiek: Besparing over de jaren */}
          {calculatorResult.investeringen.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                {scan.cumulativeSavings}
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={calculatorResult.investeringen[0].besparingsProjectie}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jaar" />
                  <YAxis tickFormatter={(value) => `€${value / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Jaar ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cumulatieveBesparing"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Cumulatieve besparing"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Grafiek: ROI vergelijking */}
          {calculatorResult.investeringen.length > 1 && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                {scan.roiComparison}
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calculatorResult.investeringen}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="investment.naam" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                  <Bar dataKey="roiPercentage" fill="#10b981" name="ROI % (10 jaar)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Detailtabel per investering */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">{scan.detailOverview}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {scan.investment}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {scan.costs}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {scan.savingsPerYear}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {scan.paybackTime}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {scan.roi10Years}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculatorResult.investeringen.map((calc) => (
                    <tr key={calc.investment.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {calc.investment.naam}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatCurrency(calc.totaleKosten)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(calc.jaarlijkseBesparing)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {calc.terugverdientijd} jaar
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {calc.roiPercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedInvestments.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          {scan.selectInvestments}
        </div>
      )}
    </div>
  );
}


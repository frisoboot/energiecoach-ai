import { Investment, ROICalculation, CalculatorResult } from './types';

// Gemiddelde Nederlandse energieprijzen (2024)
const GAS_PRIJS_PER_KWH = 0.25; // €/kWh
const ELEKTRICITEIT_PRIJS_PER_KWH = 0.30; // €/kWh

// Standaard investeringsopties met gemiddelde kosten en besparingen
export const standaardInvesteringen: Investment[] = [
  {
    id: 'radiator-folie',
    naam: 'Radiator folie',
    type: 'radiator-folie',
    kostenPerEenheid: 25, // € per stuk (gemiddeld 10 radiatoren = €250)
    besparingPerEenheid: 30, // kWh per radiator per jaar (gas)
    eenheid: 'stuk',
    gemiddeldeOppervlakte: 10, // Gemiddeld 10 radiatoren per woning
    quickWin: true, // Beste stap om mee te beginnen
  },
  {
    id: 'radiator-ventilator',
    naam: 'Radiator ventilator',
    type: 'radiator-ventilator',
    kostenPerEenheid: 40, // € per stuk
    besparingPerEenheid: 50, // kWh per ventilator per jaar (gas)
    eenheid: 'stuk',
    gemiddeldeOppervlakte: 5, // Gemiddeld 5 radiatoren met ventilator
    quickWin: true, // Beste stap om mee te beginnen
  },
  {
    id: 'muurisolatie',
    naam: 'Muurisolatie',
    type: 'muurisolatie',
    kostenPerEenheid: 45, // € per m²
    besparingPerEenheid: 8, // kWh per m² per jaar (gas)
    eenheid: 'm²',
    gemiddeldeOppervlakte: 100, // Gemiddelde muuroppervlakte voor schatting
  },
  {
    id: 'dakisolatie',
    naam: 'Dakisolatie',
    type: 'dakisolatie',
    kostenPerEenheid: 35, // € per m²
    besparingPerEenheid: 12, // kWh per m² per jaar (gas)
    eenheid: 'm²',
    gemiddeldeOppervlakte: 80, // Gemiddelde dakoppervlakte
  },
  {
    id: 'vloerisolatie',
    naam: 'Vloerisolatie',
    type: 'vloerisolatie',
    kostenPerEenheid: 30, // € per m²
    besparingPerEenheid: 6, // kWh per m² per jaar (gas)
    eenheid: 'm²',
    gemiddeldeOppervlakte: 60, // Gemiddelde vloeroppervlakte
  },
  {
    id: 'hr-glas',
    naam: 'HR++ glas',
    type: 'hr-glas',
    kostenPerEenheid: 200, // € per m²
    besparingPerEenheid: 15, // kWh per m² per jaar (gas)
    eenheid: 'm²',
    gemiddeldeOppervlakte: 20, // Gemiddelde glasoppervlakte
  },
  {
    id: 'zonnepanelen',
    naam: 'Zonnepanelen',
    type: 'zonnepanelen',
    kostenPerEenheid: 0.85, // € per Wp
    besparingPerEenheid: 0.85, // kWh per Wp per jaar (elektriciteit)
    eenheid: 'Wp',
    gemiddeldeOppervlakte: 3000, // Gemiddeld 3kWp systeem
  },
  {
    id: 'warmtepomp',
    naam: 'Warmtepomp',
    type: 'warmtepomp',
    kostenPerEenheid: 15000, // € per stuk
    besparingPerEenheid: 2000, // kWh per jaar (gas besparing)
    eenheid: 'stuk',
    gemiddeldeOppervlakte: 1,
  },
];

// Berekent ROI voor een enkele investering
export function berekenROI(
  investment: Investment,
  oppervlakte?: number
): ROICalculation {
  const oppervlakteTeGebruiken = oppervlakte || investment.gemiddeldeOppervlakte || 1;
  
  // Bepaal energieprijs op basis van type investering
  const energiePrijs = 
    investment.type === 'zonnepanelen' 
      ? ELEKTRICITEIT_PRIJS_PER_KWH 
      : GAS_PRIJS_PER_KWH;

  // Bereken totale kosten
  const totaleKosten = investment.kostenPerEenheid * oppervlakteTeGebruiken;

  // Bereken jaarlijkse besparing
  const jaarlijkseBesparing = 
    investment.besparingPerEenheid * oppervlakteTeGebruiken * energiePrijs;

  // Bereken terugverdientijd (in jaren)
  const terugverdientijd = jaarlijkseBesparing > 0 
    ? totaleKosten / jaarlijkseBesparing 
    : 999;

  // Bereken besparing over 10 jaar
  const besparing10Jaar = jaarlijkseBesparing * 10;

  // Bereken ROI percentage (over 10 jaar)
  const roiPercentage = totaleKosten > 0
    ? ((besparing10Jaar - totaleKosten) / totaleKosten) * 100
    : 0;

  // Maak besparingsprojectie (cumulatief per jaar)
  const besparingsProjectie = [];
  for (let jaar = 1; jaar <= 10; jaar++) {
    besparingsProjectie.push({
      jaar,
      cumulatieveBesparing: jaarlijkseBesparing * jaar - totaleKosten,
    });
  }

  return {
    investment,
    totaleKosten: Math.round(totaleKosten),
    jaarlijkseBesparing: Math.round(jaarlijkseBesparing),
    terugverdientijd: Math.round(terugverdientijd * 10) / 10,
    besparing10Jaar: Math.round(besparing10Jaar),
    roiPercentage: Math.round(roiPercentage * 10) / 10,
    besparingsProjectie,
  };
}

// Berekent ROI voor meerdere investeringen
export function berekenMeerdereROI(
  investmentIds: string[],
  customOppervlaktes?: Record<string, number>
): CalculatorResult {
  const geselecteerdeInvesteringen = standaardInvesteringen.filter((inv) =>
    investmentIds.includes(inv.id)
  );

  const berekeningen = geselecteerdeInvesteringen.map((inv) => {
    const oppervlakte = customOppervlaktes?.[inv.id];
    return berekenROI(inv, oppervlakte);
  });

  const totaalKosten = berekeningen.reduce((sum, calc) => sum + calc.totaleKosten, 0);
  const totaalBesparing10Jaar = berekeningen.reduce(
    (sum, calc) => sum + calc.besparing10Jaar,
    0
  );

  // Gewogen gemiddelde terugverdientijd
  const gemiddeldeTerugverdientijd =
    berekeningen.length > 0
      ? berekeningen.reduce((sum, calc) => sum + calc.terugverdientijd, 0) /
        berekeningen.length
      : 0;

  return {
    investeringen: berekeningen,
    totaalKosten: Math.round(totaalKosten),
    totaalBesparing10Jaar: Math.round(totaalBesparing10Jaar),
    gemiddeldeTerugverdientijd: Math.round(gemiddeldeTerugverdientijd * 10) / 10,
  };
}

// Bepaal aanbevolen investeringen op basis van woninggegevens
export function getAanbevolenInvesteringen(filters: {
  energielabel?: string;
  isolatie?: string[];
  verwarming?: string;
  bouwjaar?: number;
}): Investment[] {
  const aanbevelingen: Investment[] = [];

  // Voeg altijd quick wins toe als eerste (beste stap om mee te beginnen)
  const quickWins = standaardInvesteringen.filter((inv) => inv.quickWin);
  aanbevelingen.push(...quickWins);

  // Check welke isolatie ontbreekt
  const huidigeIsolatie = filters.isolatie || [];
  
  if (!huidigeIsolatie.includes('dakisolatie')) {
    const dak = standaardInvesteringen.find((inv) => inv.id === 'dakisolatie');
    if (dak) aanbevelingen.push(dak);
  }

  if (!huidigeIsolatie.includes('muurisolatie')) {
    const muur = standaardInvesteringen.find((inv) => inv.id === 'muurisolatie');
    if (muur) aanbevelingen.push(muur);
  }

  if (!huidigeIsolatie.includes('vloerisolatie')) {
    const vloer = standaardInvesteringen.find((inv) => inv.id === 'vloerisolatie');
    if (vloer) aanbevelingen.push(vloer);
  }

  if (!huidigeIsolatie.includes('HR++ glas') && !huidigeIsolatie.includes('dubbel glas')) {
    const glas = standaardInvesteringen.find((inv) => inv.id === 'hr-glas');
    if (glas) aanbevelingen.push(glas);
  }

  // Warmtepomp aanbevelen als CV-ketel
  if (filters.verwarming === 'cv-ketel') {
    const warmtepomp = standaardInvesteringen.find((inv) => inv.id === 'warmtepomp');
    if (warmtepomp) aanbevelingen.push(warmtepomp);
  }

  // Zonnepanelen altijd aanbevelen
  const zonnepanelen = standaardInvesteringen.find((inv) => inv.id === 'zonnepanelen');
  if (zonnepanelen) aanbevelingen.push(zonnepanelen);

  // Sorteer: quick wins eerst, dan op ROI (beste eerst)
  const berekeningen = aanbevelingen.map((inv) => berekenROI(inv));
  berekeningen.sort((a, b) => {
    // Quick wins altijd eerst
    if (a.investment.quickWin && !b.investment.quickWin) return -1;
    if (!a.investment.quickWin && b.investment.quickWin) return 1;
    // Dan op ROI
    return b.roiPercentage - a.roiPercentage;
  });

  // Retourneer top 5 (quick wins + 3 andere)
  return berekeningen.slice(0, 5).map((calc) => calc.investment);
}


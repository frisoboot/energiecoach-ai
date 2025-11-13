export interface ScanFormData {
  adres: string;
  bouwjaar: number;
  woningtype: string;
  energielabel: string;
  verwarming: string;
  isolatie: string[];
  fotos?: File[];
}

export interface AnalyseResult {
  advies: string;
  besparing: string;
  tips: string[];
  subsidies?: Subsidie[];
  aanbevolenInvesteringen?: ROICalculation[];
}

export interface BAGAdres {
  weergavenaam: string;
  identificatie: string;
  bouwjaar?: number;
  gebruiksdoel?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Subsidie {
  id: string;
  naam: string;
  beschrijving: string;
  bedrag: string; // Bijv. "€500" of "30%" of "Tot €5.000"
  voorwaarden: string[];
  link: string;
  categorieen: ('isolatie' | 'warmtepomp' | 'zonnepanelen' | 'verwarming' | 'algemeen')[];
  prioriteit: number; // 1-10, hoger = relevanter
}

export interface Investment {
  id: string;
  naam: string;
  type: 'muurisolatie' | 'dakisolatie' | 'vloerisolatie' | 'hr-glas' | 'zonnepanelen' | 'warmtepomp' | 'radiator-folie' | 'radiator-ventilator';
  kostenPerEenheid: number; // € per m² of € per Wp
  besparingPerEenheid: number; // kWh per jaar per eenheid
  eenheid: 'm²' | 'Wp' | 'stuk';
  gemiddeldeOppervlakte?: number; // Voor schattingen
  quickWin?: boolean; // Beste stap om mee te beginnen
}

export interface ROICalculation {
  investment: Investment;
  totaleKosten: number;
  jaarlijkseBesparing: number;
  terugverdientijd: number; // in jaren
  besparing10Jaar: number;
  roiPercentage: number; // ROI over 10 jaar
  besparingsProjectie: Array<{ jaar: number; cumulatieveBesparing: number }>;
}

export interface CalculatorResult {
  investeringen: ROICalculation[];
  totaalKosten: number;
  totaalBesparing10Jaar: number;
  gemiddeldeTerugverdientijd: number;
}


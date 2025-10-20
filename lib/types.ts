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
}

export interface BAGAdres {
  weergavenaam: string;
  identificatie: string;
  bouwjaar?: number;
  gebruiksdoel?: string;
  gebruiksdoelen?: string[];
  oppervlakte?: number;
  bagObjectType?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}


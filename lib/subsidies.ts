import { Subsidie } from './types';

// Statische database van Nederlandse subsidies
// Flexibele structuur zodat gemeenten later eigen subsidies kunnen toevoegen
export const subsidies: Subsidie[] = [
  {
    id: 'isde',
    naam: 'ISDE (Investeringssubsidie Duurzame Energie)',
    beschrijving: 'Subsidie voor warmtepompen, zonneboilers, biomassaketels en warmtenetten. Bedrag hangt af van het type apparaat en vermogen.',
    bedrag: 'Tot €2.500',
    voorwaarden: [
      'Voor warmtepompen, zonneboilers, biomassaketels',
      'Minimaal vermogen vereist',
      'Apparaat moet op de ISDE-lijst staan',
      'Aanvraag binnen 1 jaar na aankoop',
    ],
    link: 'https://www.rvo.nl/subsidies-financiering/isde',
    categorieen: ['warmtepomp', 'verwarming', 'algemeen'],
    prioriteit: 9,
  },
  {
    id: 'seeh',
    naam: 'SEEH (Subsidie Energiebesparing Eigen Huis)',
    beschrijving: 'Subsidie voor energiebesparende maatregelen zoals isolatie, HR++ glas en zonnepanelen. Bedrag is 20% van de kosten, met een maximum.',
    bedrag: '20% van de kosten, max €5.000',
    voorwaarden: [
      'Voor isolatie, HR++ glas, zonnepanelen',
      'Minimaal 2 maatregelen uitvoeren',
      'Woning moet voor 2001 gebouwd zijn',
      'Aanvraag voor start werkzaamheden',
    ],
    link: 'https://www.rvo.nl/subsidies-financiering/seeh',
    categorieen: ['isolatie', 'zonnepanelen', 'algemeen'],
    prioriteit: 10,
  },
  {
    id: 'btw-teruggave',
    naam: 'BTW-teruggave op zonnepanelen',
    beschrijving: 'Je kunt de BTW (21%) terugvragen over de aanschaf en installatie van zonnepanelen via de Belastingdienst.',
    bedrag: '21% BTW terug',
    voorwaarden: [
      'Alleen voor zonnepanelen',
      'Aanmelden bij Belastingdienst als ondernemer',
      'BTW-aangifte doen',
      'Geldt voor particulieren die stroom terugleveren',
    ],
    link: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/particulier/content/btw-terugvragen-zonnepanelen',
    categorieen: ['zonnepanelen'],
    prioriteit: 8,
  },
  {
    id: 'gemeente-isolatie',
    naam: 'Gemeentelijke isolatiesubsidie',
    beschrijving: 'Veel gemeenten bieden extra subsidies voor isolatiemaatregelen. Bedrag en voorwaarden verschillen per gemeente.',
    bedrag: 'Variabel per gemeente',
    voorwaarden: [
      'Verschilt per gemeente',
      'Vaak alleen voor bepaalde wijken',
      'Soms in combinatie met SEEH',
      'Check je gemeentewebsite',
    ],
    link: 'https://www.energiebesparen.nl/subsidies',
    categorieen: ['isolatie', 'algemeen'],
    prioriteit: 7,
  },
  {
    id: 'warmtepomp-subsidie',
    naam: 'Warmtepomp subsidie (ISDE)',
    beschrijving: 'Specifieke subsidie voor warmtepompen via ISDE. Hoeveel je krijgt hangt af van het type en vermogen van de warmtepomp.',
    bedrag: '€1.200 - €2.500',
    voorwaarden: [
      'Warmtepomp moet op ISDE-lijst staan',
      'Minimaal vermogen vereist',
      'Aanvraag binnen 1 jaar na aankoop',
      'Installatie door erkend installateur',
    ],
    link: 'https://www.rvo.nl/subsidies-financiering/isde/warmtepomp',
    categorieen: ['warmtepomp', 'verwarming'],
    prioriteit: 9,
  },
  {
    id: 'zonnepanelen-subsidie',
    naam: 'Zonnepanelen subsidie (SEEH)',
    beschrijving: 'Via SEEH kun je 20% subsidie krijgen op zonnepanelen, mits je ook andere maatregelen neemt.',
    bedrag: '20% van de kosten',
    voorwaarden: [
      'Minimaal 2 energiebesparende maatregelen',
      'Woning gebouwd voor 2001',
      'Aanvraag voor start werkzaamheden',
      'Zonnepanelen op ISDE-lijst',
    ],
    link: 'https://www.rvo.nl/subsidies-financiering/seeh',
    categorieen: ['zonnepanelen'],
    prioriteit: 8,
  },
  {
    id: 'energielening',
    naam: 'Energielening (Duurzaamheidslening)',
    beschrijving: 'Gunstige lening voor energiebesparende maatregelen. Lage rente en lange looptijd. Via gemeente of Nationaal Warmtefonds.',
    bedrag: 'Tot €50.000, rente vanaf 1,9%',
    voorwaarden: [
      'Voor energiebesparende maatregelen',
      'Eigen woning',
      'Via gemeente of Nationaal Warmtefonds',
      'Aanvraag voor start werkzaamheden',
    ],
    link: 'https://www.nationaalwarmtefonds.nl',
    categorieen: ['algemeen'],
    prioriteit: 6,
  },
];

// Functie om relevante subsidies te filteren op basis van woninggegevens
export function getRelevanteSubsidies(filters: {
  bouwjaar?: number;
  energielabel?: string;
  woningtype?: string;
  isolatie?: string[];
  verwarming?: string;
}): Subsidie[] {
  let relevanteSubsidies = [...subsidies];

  // Filter op basis van aanwezige isolatie
  if (filters.isolatie && filters.isolatie.length > 0) {
    // Als er al isolatie is, zijn isolatie-subsidies minder relevant
    relevanteSubsidies = relevanteSubsidies.map((sub) => {
      if (sub.categorieen.includes('isolatie') && filters.isolatie!.length >= 2) {
        return { ...sub, prioriteit: sub.prioriteit - 2 };
      }
      return sub;
    });
  } else {
    // Geen isolatie = isolatie-subsidies zijn zeer relevant
    relevanteSubsidies = relevanteSubsidies.map((sub) => {
      if (sub.categorieen.includes('isolatie')) {
        return { ...sub, prioriteit: sub.prioriteit + 1 };
      }
      return sub;
    });
  }

  // Filter op basis van verwarmingstype
  if (filters.verwarming) {
    if (filters.verwarming === 'warmtepomp') {
      // Heeft al warmtepomp, warmtepomp subsidie minder relevant
      relevanteSubsidies = relevanteSubsidies.map((sub) => {
        if (sub.categorieen.includes('warmtepomp')) {
          return { ...sub, prioriteit: sub.prioriteit - 3 };
        }
        return sub;
      });
    } else if (filters.verwarming === 'cv-ketel') {
      // CV-ketel = warmtepomp subsidie zeer relevant
      relevanteSubsidies = relevanteSubsidies.map((sub) => {
        if (sub.categorieen.includes('warmtepomp')) {
          return { ...sub, prioriteit: sub.prioriteit + 1 };
        }
        return sub;
      });
    }
  }

  // Filter op basis van energielabel
  if (filters.energielabel) {
    const slechteLabels = ['E', 'F', 'G'];
    if (slechteLabels.includes(filters.energielabel)) {
      // Slecht label = alle subsidies zeer relevant
      relevanteSubsidies = relevanteSubsidies.map((sub) => ({
        ...sub,
        prioriteit: sub.prioriteit + 1,
      }));
    }
  }

  // Filter op basis van bouwjaar (voor SEEH)
  if (filters.bouwjaar && filters.bouwjaar < 2001) {
    relevanteSubsidies = relevanteSubsidies.map((sub) => {
      if (sub.id === 'seeh') {
        return { ...sub, prioriteit: sub.prioriteit + 1 };
      }
      return sub;
    });
  }

  // Sorteer op prioriteit (hoogste eerst) en retourneer top 5
  return relevanteSubsidies
    .sort((a, b) => b.prioriteit - a.prioriteit)
    .slice(0, 5);
}


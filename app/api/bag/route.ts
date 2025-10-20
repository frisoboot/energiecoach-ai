import { NextRequest, NextResponse } from 'next/server';

const BAG_BASE_URL = 'https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2';

type ZoekResultaat = {
  omschrijving?: string;
  identificatie?: string;
};

type AdresDetail = {
  adresregel5?: string;
  adresregel6?: string;
  openbareRuimteNaam?: string;
  huisnummer?: number;
  huisletter?: string;
  huisnummertoevoeging?: string;
  postcode?: string;
  woonplaatsNaam?: string;
  nummeraanduidingIdentificatie?: string;
  adresseerbaarObjectIdentificatie?: string;
  pandIdentificaties?: string[];
};

type VerblijfsobjectDetail = {
  verblijfsobject?: {
    gebruiksdoelen?: string[];
    maaktDeelUitVan?: string[];
  };
};

type PandDetail = {
  pand?: {
    oorspronkelijkBouwjaar?: string;
  };
};

async function bagRequestJSON<T>(
  path: string,
  apiKey: string,
  options?: { acceptCrs?: string }
): Promise<T> {
  const headers = new Headers({
    'X-Api-Key': apiKey,
    Accept: 'application/hal+json',
  });

  if (options?.acceptCrs) {
    headers.set('Accept-Crs', options.acceptCrs);
  }

  const response = await fetch(`${BAG_BASE_URL}${path}`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BAG API ${response.status}: ${errorText}`);
  }

  return (await response.json()) as T;
}

function formatDisplayName(adres: AdresDetail, fallback?: string) {
  if (adres.adresregel5 && adres.adresregel6) {
    const sanitizedLine2 = adres.adresregel6.replace(/\s{2,}/g, ' ').trim();
    return `${adres.adresregel5}, ${sanitizedLine2}`;
  }

  const parts = [
    adres.openbareRuimteNaam,
    [adres.huisnummer, adres.huisletter, adres.huisnummertoevoeging]
      .filter(Boolean)
      .join(''),
    adres.postcode,
    adres.woonplaatsNaam,
  ].filter((part) => Boolean(part && `${part}`.trim().length > 0));

  if (parts.length > 0) {
    return parts.join(' ').replace(/\s{2,}/g, ' ').trim();
  }

  return fallback ?? 'Onbekend adres';
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.BAG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'BAG_API_KEY environment variable is not configured.' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get('query');
  const identificatie = searchParams.get('identificatie');

  if (!searchTerm && !identificatie) {
    return NextResponse.json(
      { error: 'Provide either query or identificatie parameter.' },
      { status: 400 }
    );
  }

  if (searchTerm) {
    try {
      const data = await bagRequestJSON<{ _embedded?: { zoekresultaten?: ZoekResultaat[] } }>(
        `/adressen/zoek?zoek=${encodeURIComponent(searchTerm)}`,
        apiKey
      );

      const suggestions =
        data._embedded?.zoekresultaten
          ?.filter((entry) => entry.omschrijving && entry.identificatie)
          .map((entry) => ({
            label: entry.omschrijving as string,
            identificatie: entry.identificatie as string,
          })) ?? [];

      return NextResponse.json({ suggestions });
    } catch (error) {
      console.error('Fout bij het zoeken naar BAG adressen:', error);
      return NextResponse.json(
        { error: 'Kan BAG-adressen niet ophalen.' },
        { status: 502 }
      );
    }
  }

  if (identificatie) {
    try {
      const adresData = await bagRequestJSON<{ _embedded?: { adressen?: AdresDetail[] } }>(
        `/adressen?zoekresultaatIdentificatie=${encodeURIComponent(identificatie)}`,
        apiKey
      );

      const adres = adresData._embedded?.adressen?.[0];

      if (!adres) {
        return NextResponse.json(
          { error: 'Adres niet gevonden.' },
          { status: 404 }
        );
      }

      const displayName = formatDisplayName(adres, identificatie);
      let gebruiksdoel: string | undefined;
      let bouwjaar: number | undefined;

      if (adres.adresseerbaarObjectIdentificatie) {
        try {
          const verblijfsobjectData = await bagRequestJSON<VerblijfsobjectDetail>(
            `/verblijfsobjecten/${encodeURIComponent(adres.adresseerbaarObjectIdentificatie)}`,
            apiKey,
            { acceptCrs: 'epsg:28992' }
          );

          const doelen = verblijfsobjectData.verblijfsobject?.gebruiksdoelen;
          if (doelen && doelen.length > 0) {
            gebruiksdoel = doelen[0];
          }

          const pandIds =
            verblijfsobjectData.verblijfsobject?.maaktDeelUitVan ??
            adres.pandIdentificaties ??
            [];

          const eerstePand = pandIds[0];
          if (eerstePand) {
            try {
              const pandData = await bagRequestJSON<PandDetail>(
                `/panden/${encodeURIComponent(eerstePand)}`,
                apiKey,
                { acceptCrs: 'epsg:28992' }
              );

              const jaar = pandData.pand?.oorspronkelijkBouwjaar;
              if (jaar && /^\d{4}$/.test(jaar)) {
                bouwjaar = Number(jaar);
              }
            } catch (pandError) {
              console.error('Fout bij ophalen pandgegevens:', pandError);
            }
          }
        } catch (verblijfsobjectError) {
          console.error('Fout bij ophalen verblijfsobject:', verblijfsobjectError);
        }
      }

      return NextResponse.json({
        address: {
          weergavenaam: displayName,
          identificatie: adres.nummeraanduidingIdentificatie ?? identificatie,
          bouwjaar,
          gebruiksdoel,
        },
      });
    } catch (error) {
      console.error('Fout bij het ophalen van BAG details:', error);
      return NextResponse.json(
        { error: 'Kan BAG-details niet ophalen.' },
        { status: 502 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Onbekende aanvraag.' },
    { status: 400 }
  );
}

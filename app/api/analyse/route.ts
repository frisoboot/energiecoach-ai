import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { getAanbevolenInvesteringen, berekenROI } from '@/lib/calculator';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { adres, bouwjaar, woningtype, energielabel, verwarming, isolatie } = data;

    // Validatie
    if (!adres || !bouwjaar || !energielabel || !verwarming) {
      return NextResponse.json(
        { error: 'Ontbrekende vereiste velden' },
        { status: 400 }
      );
    }

    // Haal aanbevolen investeringen op
    const aanbevolenInvesteringen = getAanbevolenInvesteringen({
      energielabel,
      isolatie,
      verwarming,
      bouwjaar,
    });

    // Bereken ROI voor aanbevolen investeringen
    const investeringsBerekeningen = aanbevolenInvesteringen.map((inv) => berekenROI(inv));

    // Bouw de prompt voor GPT-4o
    const isolatieText = isolatie && isolatie.length > 0 
      ? isolatie.join(', ') 
      : 'geen isolatie aangegeven';

    const prompt = `Je bent een Nederlandse energieadviseur voor MeGreen.
Geef kort en concreet advies op basis van de volgende woninggegevens:

- Adres: ${adres}
- Bouwjaar: ${bouwjaar}
- Type woning: ${woningtype || 'niet opgegeven'}
- Energielabel: ${energielabel}
- Verwarmingstype: ${verwarming}
- Aanwezige isolatie: ${isolatieText}

Geef in je advies:
1. Een korte analyse van de huidige situatie
2. Realistische besparing in euro's per jaar (gebaseerd op gemiddelde Nederlandse energieprijzen)
3. 3 concrete en praktische tips voor energiebesparing, prioriteit op snelle wins
4. Verwijs naar de investeringsmogelijkheden

Houd het advies helder en to-the-point (max 300 woorden).`;

    // Aanroep OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Je bent een deskundige Nederlandse energieadviseur die bewoners helpt met energiebesparing. Je geeft praktisch, concreet advies met realistische besparingen.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const advies = completion.choices[0]?.message?.content || 'Geen advies beschikbaar';

    return NextResponse.json({
      advies,
      besparing: 'Zie advies',
      tips: [],
      aanbevolenInvesteringen: investeringsBerekeningen,
    });
  } catch (error) {
    console.error('Fout bij analyse:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het analyseren van de woning' },
      { status: 500 }
    );
  }
}


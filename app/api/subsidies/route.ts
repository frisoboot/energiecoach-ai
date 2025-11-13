import { NextRequest, NextResponse } from 'next/server';
import { getRelevanteSubsidies } from '@/lib/subsidies';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const bouwjaar = searchParams.get('bouwjaar');
    const energielabel = searchParams.get('energielabel');
    const woningtype = searchParams.get('woningtype');
    const isolatie = searchParams.get('isolatie');
    const verwarming = searchParams.get('verwarming');

    const filters = {
      bouwjaar: bouwjaar ? parseInt(bouwjaar, 10) : undefined,
      energielabel: energielabel || undefined,
      woningtype: woningtype || undefined,
      isolatie: isolatie ? isolatie.split(',') : undefined,
      verwarming: verwarming || undefined,
    };

    const relevanteSubsidies = getRelevanteSubsidies(filters);

    return NextResponse.json({ subsidies: relevanteSubsidies });
  } catch (error) {
    console.error('Fout bij ophalen subsidies:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het ophalen van subsidies' },
      { status: 500 }
    );
  }
}


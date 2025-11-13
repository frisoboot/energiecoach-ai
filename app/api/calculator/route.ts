import { NextRequest, NextResponse } from 'next/server';
import { berekenMeerdereROI, getAanbevolenInvesteringen, standaardInvesteringen, berekenROI } from '@/lib/calculator';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { investmentIds, customOppervlaktes, filters } = data;

    // Als er investmentIds zijn, bereken die
    if (investmentIds && Array.isArray(investmentIds)) {
      const result = berekenMeerdereROI(investmentIds, customOppervlaktes);
      return NextResponse.json(result);
    }

    // Als er filters zijn, geef aanbevolen investeringen
    if (filters) {
      const aanbevelingen = getAanbevolenInvesteringen(filters);
      const berekeningen = aanbevelingen.map((inv) => {
        const oppervlakte = customOppervlaktes?.[inv.id];
        return berekenROI(inv, oppervlakte);
      });

      return NextResponse.json({
        aanbevelingen,
        berekeningen,
        alleInvesteringen: standaardInvesteringen,
      });
    }

    // Geef alle beschikbare investeringen
    return NextResponse.json({
      alleInvesteringen: standaardInvesteringen,
    });
  } catch (error) {
    console.error('Fout bij calculator:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij de berekening' },
      { status: 500 }
    );
  }
}


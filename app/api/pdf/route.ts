import { NextRequest, NextResponse } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import { EnergyReportPDF } from '@/components/EnergyReportPDF';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const adres = searchParams.get('adres') || '';
    const bouwjaar = searchParams.get('bouwjaar') || '';
    const woningtype = searchParams.get('woningtype') || '';
    const energielabel = searchParams.get('energielabel') || '';
    const verwarming = searchParams.get('verwarming') || '';
    const isolatie = searchParams.get('isolatie') || '';
    const advies = searchParams.get('advies') || '';

    // Genereer PDF
    const pdfDoc = EnergyReportPDF({
      adres,
      bouwjaar,
      woningtype,
      energielabel,
      verwarming,
      isolatie,
      advies,
    });

    // Genereer PDF stream
    const stream = await pdf(pdfDoc).toBlob();
    
    // Converteer blob naar buffer
    const buffer = await stream.arrayBuffer();

    // Return PDF als download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="energierapport-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Fout bij PDF generatie:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het genereren van de PDF' },
      { status: 500 }
    );
  }
}


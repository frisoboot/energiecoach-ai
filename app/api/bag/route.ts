import { NextResponse } from 'next/server';

const BAG_API_BASE_URL = 'https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zoekterm = searchParams.get('zoekterm');

  if (!zoekterm) {
    return NextResponse.json({ error: 'Missing zoekterm parameter' }, { status: 400 });
  }

  const apiKey = process.env.BAG_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'BAG API key is not configured' }, { status: 500 });
  }

  const upstreamUrl = `${BAG_API_BASE_URL}/adressen?zoekterm=${encodeURIComponent(zoekterm)}`;

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        'X-Api-Key': apiKey,
        Accept: 'application/hal+json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('BAG API error:', response.status, text);
      return NextResponse.json({ error: 'Failed to fetch BAG data' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected BAG API error:', error);
    return NextResponse.json({ error: 'Unexpected error fetching BAG data' }, { status: 500 });
  }
}

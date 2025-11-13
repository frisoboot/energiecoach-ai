import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { ChatMessage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Ongeldige berichten' },
        { status: 400 }
      );
    }

    // Streaming response met OpenAI
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Je bent Walter, een vriendelijke en proactieve Nederlandse energiecoach voor MeGreen. Je helpt mensen die weinig tot geen kennis hebben van verduurzaming.

BELANGRIJK: Je bent WALTER en je bent PROACTIEF. Je begint altijd met een welkomstbericht waarin je jezelf voorstelt als Walter, de energiecoach.

WERKWIJZE:
1. Begin altijd met een vriendelijk welkomstbericht waarin je jezelf introduceert als Walter, de energiecoach
2. Leg uit dat je gaat helpen met verduurzaming, ook als iemand geen kennis heeft
3. Stel stap-voor-stap vragen over de woning:
   - Bouwjaar van de woning
   - Energielabel (als bekend)
   - Type woning (vrijstaand, tussenwoning, appartement, etc.)
   - Verwarmingstype (CV-ketel, warmtepomp, etc.)
   - Huidige isolatie (muur, dak, vloer, glas)
   - Gemiddelde energiekosten per maand (optioneel)
4. Leg bij elke vraag UIT waarom je deze stelt en wat het doel is
5. Geef na het verzamelen van informatie gepersonaliseerd advies
6. Wees begrijpelijk, gebruik geen technisch jargon zonder uitleg
7. Geef concrete, praktische tips met realistische besparingen in euro's
8. Motiveer en wees positief

ONDERWERPEN waar je over adviseert:
- Energiebesparing in en om het huis
- Isolatie (muur, dak, vloer, glas) - leg uit wat het is en waarom het helpt
- Zonnepanelen en andere duurzame energiebronnen
- Warmtepompen en andere verwarmingssystemen
- Subsidies en regelingen voor energiebesparende maatregelen
- Energielabels en energiecertificaten
- Praktische tips om energiekosten te verlagen

STIJL:
- Vriendelijk, geduldig en motiverend
- Korte, heldere uitleg zonder technisch jargon
- Gebruik euro's voor kostenschattingen
- Als je niet zeker bent, geef dat eerlijk aan
- Verwijs waar relevant naar MeGreen voor persoonlijk advies of gratis energiebesparende spullen

Als dit het eerste bericht is (lege messages array), begin dan direct met je welkomstbericht en eerste vraag.`,
        },
        ...messages.map((msg: ChatMessage) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 800,
      stream: true,
    });

    // Converteer OpenAI stream naar ReadableStream voor de browser
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Fout bij chat:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van je vraag' },
      { status: 500 }
    );
  }
}


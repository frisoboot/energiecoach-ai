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
          content: `Je bent een vriendelijke en deskundige Nederlandse energieadviseur voor MeGreen. 
          
Je helpt bewoners met vragen over:
- Energiebesparing in en om het huis
- Isolatie (muur, dak, vloer, glas)
- Zonnepanelen en andere duurzame energiebronnen
- Warmtepompen en andere verwarmingssystemen
- Subsidies en regelingen voor energiebesparende maatregelen
- Energielabels en energiecertificaten
- Praktische tips om energiekosten te verlagen

Geef korte, heldere en praktische antwoorden. Wees vriendelijk en motiverend. 
Gebruik euro's voor kostenschattingen. Als je niet zeker bent, geef dat eerlijk aan.
Verwijs waar relevant naar MeGreen voor persoonlijk advies of gratis energiebesparende spullen.`,
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


# AI Energiecoach Webapp

Een moderne Next.js 14 webapp waarmee bewoners gepersonaliseerd energieadvies krijgen via AI, met BAG-API adresherkenning, GPT-4o advies, PDF-rapportage en Cal.com afspraakboeking.

## 🚀 Features

- **Energiescan**: Analyseer je woning en ontvang direct een persoonlijk energierapport met besparingstips
- **AI Chat**: Stel vragen aan de AI energiecoach en krijg direct antwoord
- **PDF Rapport**: Download je energierapport als professionele PDF
- **Afspraak maken**: Plan een gesprek met een MeGreen energiecoach
- **BAG-API Integratie**: Automatische adresherkenning en woninggegevens

## 🛠️ Technologie Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **AI**: OpenAI GPT-4o
- **PDF**: @react-pdf/renderer
- **API's**: BAG-API (Kadaster), OpenAI API
- **TypeScript**: Voor type-safety

## 📦 Installatie

1. Clone de repository:
```bash
git clone <repository-url>
cd energiecoach-website
```

2. Installeer dependencies:
```bash
npm install
```

3. Configureer environment variabelen:
Maak een `.env.local` bestand in de root met:
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

> **Let op**: Je hebt een OpenAI API key nodig. Verkrijg deze via [platform.openai.com](https://platform.openai.com)

4. Start de development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in je browser

## 📁 Project Structuur

```
energiecoach-website/
├── app/
│   ├── page.tsx                 # HomePage met hero en navigatie
│   ├── scan/page.tsx            # Energiescan formulier
│   ├── chat/page.tsx            # AI Chat interface
│   ├── afspraak/page.tsx        # Afspraak/booking pagina
│   ├── api/
│   │   ├── analyse/route.ts     # GPT-4o analyse endpoint
│   │   ├── pdf/route.ts         # PDF generatie endpoint
│   │   └── chat/route.ts        # Chat streaming endpoint
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   └── AddressAutocomplete.tsx  # BAG-API adres zoeker
├── lib/
│   ├── openai.ts                # OpenAI client configuratie
│   └── types.ts                 # TypeScript type definitions
└── .env.local                   # Environment variabelen (niet in git)
```

## 🎨 Pagina's

### 1. HomePage (`/`)
- Hero sectie met gradient achtergrond
- Drie hoofdknoppen: Energiescan, AI Chat, Afspraak maken
- Responsive design met moderne UI

### 2. Energiescan (`/scan`)
- Formulier met BAG-API adres autocomplete
- Automatische invulling van bouwjaar en woningtype
- Energielabel, verwarmingstype en isolatie opties
- AI-analyse met GPT-4o
- PDF download functionaliteit

### 3. AI Chat (`/chat`)
- Real-time streaming chat met GPT-4o
- Energie-specifieke AI assistent
- Voorbeeldvragen voor snelle start
- Auto-scroll en typing indicators

### 4. Afspraak maken (`/afspraak`)
- Cal.com integratie placeholder
- Informatie over MeGreen diensten
- Contact informatie

## 🔧 API Endpoints

### POST `/api/analyse`
Analyseert woninggegevens en geeft energieadvies via GPT-4o.

**Request body:**
```json
{
  "adres": "Kerkstraat 1, Amsterdam",
  "bouwjaar": 1990,
  "woningtype": "tussenwoning",
  "energielabel": "C",
  "verwarming": "cv-ketel",
  "isolatie": ["dakisolatie", "dubbel glas"]
}
```

**Response:**
```json
{
  "advies": "Gedetailleerd energieadvies...",
  "besparing": "Zie advies",
  "tips": []
}
```

### GET `/api/pdf`
Genereert en download een PDF rapport.

**Query parameters:**
- `adres`, `bouwjaar`, `woningtype`, `energielabel`, `verwarming`, `isolatie`, `advies`

### POST `/api/chat`
Streaming chat endpoint voor AI conversaties.

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hoe kan ik energie besparen?" }
  ]
}
```

**Response:** Server-Sent Events stream met GPT-4o antwoord

## 🎯 BAG-API Integratie

De app gebruikt de openbare BAG-API van het Kadaster voor adresherkenning:
- Endpoint: `https://api.bag.kadaster.nl/esd/bevragen/adres`
- Geen API key vereist
- Debounced search (300ms)
- Automatische parsing van woninggegevens

## 📝 Cal.com Integratie

Voor afspraakboeking is een Cal.com account vereist:

1. Maak een account op [cal.com](https://cal.com)
2. Creëer een booking event
3. Voeg de embed code toe aan `app/afspraak/page.tsx`

Voorbeeld:
```tsx
<Cal
  calLink="megreen/energiecoach"
  style={{ width: "100%", height: "100%", overflow: "scroll" }}
  config={{ layout: "month_view" }}
/>
```

## 🚀 Deployment

### Vercel (Aanbevolen)
1. Push je code naar GitHub
2. Importeer project op [vercel.com](https://vercel.com)
3. Voeg `OPENAI_API_KEY` toe aan Environment Variables
4. Deploy!

### Andere platforms
De app werkt op elk platform dat Next.js 14 ondersteunt:
- Vercel
- Netlify
- Railway
- AWS
- Docker

**Vergeet niet de environment variabelen toe te voegen!**

## 🔒 Security

- `.env.local` staat in `.gitignore` (commit nooit je API keys!)
- API routes draaien server-side
- Validatie van user input
- CORS headers voor API endpoints

## 🎨 Styling & Design

- **TailwindCSS**: Utility-first CSS framework
- **Groene kleurenschema**: Energie/duurzaamheid thema
- **Gradients**: Moderne, aantrekkelijke UI
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions en hover effects

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobiele browsers

## 🐛 Troubleshooting

### "OpenAI API error"
- Check of je `OPENAI_API_KEY` correct is ingesteld in `.env.local`
- Restart de development server na het toevoegen van env variabelen
- Controleer of je OpenAI account credit heeft

### "BAG-API timeout"
- De BAG-API kan soms traag zijn, probeer opnieuw
- Check je internetverbinding
- Voer minimaal 3 karakters in voor suggesties

### "PDF generatie faalt"
- Check of `@react-pdf/renderer` correct is geïnstalleerd
- Restart development server
- Check browser console voor errors

## 📄 License

MIT License - Vrij te gebruiken voor persoonlijke en commerciële projecten.

## 🤝 Contributing

Suggesties en pull requests zijn welkom!

## 📞 Support

Voor vragen over MeGreen diensten:
- Email: info@megreen.nl
- Tel: 020 - 123 4567

---

**Gemaakt met ❤️ voor duurzame energie**

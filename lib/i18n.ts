export const locales = ["nl", "en", "tr", "ar"] as const;
export type Locale = (typeof locales)[number];

export interface TranslationContent {
  common: {
    languageLabel: string;
    languageNames: Record<Locale, string>;
    backToHome: string;
    errors: {
      analysis: string;
      generic: string;
      chat: string;
      noStream: string;
    };
  };
  home: {
    title: string;
    subtitleLine1: string;
    subtitleLine2: string;
    scanCard: {
      title: string;
      description: string;
      cta: string;
    };
    chatCard: {
      title: string;
      description: string;
      cta: string;
    };
    appointmentCard: {
      title: string;
      description: string;
      cta: string;
    };
    footer: string;
  };
  scan: {
    title: string;
    description: string;
    addressLabel: string;
    addressPlaceholder: string;
    yearLabel: string;
    yearPlaceholder: string;
    typeLabel: string;
    typePlaceholder: string;
    propertyTypes: Record<
      "vrijstaand" | "tussenwoning" | "hoekwoning" | "appartement" | "benedenwoning" | "bovenwoning",
      string
    >;
    energyLabel: string;
    energyPlaceholder: string;
    energyLabels: Record<
      "A++++" | "A+++" | "A++" | "A+" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "onbekend",
      string
    >;
    heatingLabel: string;
    heatingPlaceholder: string;
    heatingOptions: Record<
      "cv-ketel" | "warmtepomp" | "stadsverwarming" | "elektrisch" | "pelletkachel" | "anders",
      string
    >;
    insulationLabel: string;
    insulationOptions: Record<
      "muurisolatie" | "dakisolatie" | "vloerisolatie" | "dubbel glas" | "HR++ glas",
      string
    >;
    submit: string;
    analyzing: string;
    resultTitle: string;
    downloadReport: string;
    analysisError: string;
    genericError: string;
  };
  chat: {
    title: string;
    subtitle: string;
    welcomeTitle: string;
    welcomeDescription: string;
    examples: string[];
    inputPlaceholder: string;
    retryMessage: string;
  };
  appointment: {
    title: string;
    subtitle: string;
    personalAdviceTitle: string;
    personalAdviceDescription: string;
    benefits: { title: string; description: string }[];
    calTitle: string;
    calDescription: string;
    calDeveloperNote: string;
    calCodeHint: string;
    calLinkText: string;
    contactIntro: string;
    contactEmail: string;
    contactPhone: string;
  };
  address: {
    constructionYearLabel: string;
  };
}

export const translations: Record<Locale, TranslationContent> = {
  nl: {
    common: {
      languageLabel: "Taal",
      languageNames: {
        nl: "Nederlands",
        en: "Engels",
        tr: "Turks",
        ar: "Arabisch",
      },
      backToHome: "Terug naar home",
      errors: {
        analysis: "Er ging iets mis bij het analyseren van je woning",
        generic: "Er is een fout opgetreden",
        chat: "Er ging iets mis",
        noStream: "Geen response stream",
      },
    },
    home: {
      title: "AI Energiecoach",
      subtitleLine1: "Ontvang persoonlijk energieadvies met behulp van AI.",
      subtitleLine2:
        "Doe de energiescan, stel je vragen of maak direct een afspraak met een energiecoach van MeGreen voor gratis energiebesparende spullen.",
      scanCard: {
        title: "Doe de Energiescan",
        description:
          "Analyseer je woning en ontvang direct een persoonlijk energierapport met besparingstips.",
        cta: "Start scan",
      },
      chatCard: {
        title: "Ga naar AI-advies",
        description:
          "Stel direct je vragen aan onze AI energiecoach en krijg meteen antwoord.",
        cta: "Start chat",
      },
      appointmentCard: {
        title: "Maak een afspraak",
        description:
          "Plan een gesprek met een MeGreen energiecoach voor persoonlijk advies en gratis energiebesparende spullen.",
        cta: "Plan afspraak",
      },
      footer: "Powered by AI • MeGreen Energiecoach",
    },
    scan: {
      title: "Energiescan",
      description: "Vul de gegevens van je woning in voor een persoonlijk advies",
      addressLabel: "Adres *",
      addressPlaceholder: "Bijv. Kerkstraat 1, Amsterdam",
      yearLabel: "Bouwjaar *",
      yearPlaceholder: "Bijv. 1990",
      typeLabel: "Type woning *",
      typePlaceholder: "Selecteer type woning",
      propertyTypes: {
        vrijstaand: "Vrijstaande woning",
        tussenwoning: "Tussenwoning",
        hoekwoning: "Hoekwoning",
        appartement: "Appartement",
        benedenwoning: "Benedenwoning",
        bovenwoning: "Bovenwoning",
      },
      energyLabel: "Energielabel *",
      energyPlaceholder: "Selecteer energielabel",
      energyLabels: {
        "A++++": "A++++ (nieuwbouw)",
        "A+++": "A+++",
        "A++": "A++",
        "A+": "A+",
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "F",
        G: "G",
        onbekend: "Onbekend",
      },
      heatingLabel: "Verwarmingstype *",
      heatingPlaceholder: "Selecteer verwarmingstype",
      heatingOptions: {
        "cv-ketel": "CV-ketel (gas)",
        warmtepomp: "Warmtepomp",
        stadsverwarming: "Stadsverwarming",
        elektrisch: "Elektrische verwarming",
        pelletkachel: "Pelletkachel",
        anders: "Anders",
      },
      insulationLabel: "Aanwezige isolatie",
      insulationOptions: {
        muurisolatie: "Muurisolatie",
        dakisolatie: "Dakisolatie",
        vloerisolatie: "Vloerisolatie",
        "dubbel glas": "Dubbel glas",
        "HR++ glas": "HR++ glas",
      },
      submit: "Analyseer mijn woning",
      analyzing: "Analyseren...",
      resultTitle: "Jouw Energierapport",
      downloadReport: "Download mijn rapport als PDF",
      analysisError: "Er ging iets mis bij het analyseren van je woning",
      genericError: "Er is een fout opgetreden",
    },
    chat: {
      title: "AI Energiecoach Chat",
      subtitle: "Stel je vragen over energiebesparing",
      welcomeTitle: "Welkom bij de AI Energiecoach",
      welcomeDescription:
        "Stel een vraag over energie besparen, isolatie, zonnepanelen of andere energievraagstukken!",
      examples: [
        "Hoe kan ik het beste mijn huis isoleren?",
        "Zijn zonnepanelen nog steeds rendabel?",
        "Wat zijn de beste manieren om energie te besparen?",
      ],
      inputPlaceholder: "Stel een vraag over energie besparen...",
      retryMessage: "Sorry, er ging iets mis. Probeer het opnieuw.",
    },
    appointment: {
      title: "Maak een afspraak",
      subtitle: "Plan een gesprek met een MeGreen energiecoach voor persoonlijk advies",
      personalAdviceTitle: "Persoonlijk Energieadvies",
      personalAdviceDescription:
        "Onze energiecoaches helpen je graag verder met advies op maat en informeren je over gratis energiebesparende spullen.",
      benefits: [
        {
          title: "Gratis adviesgesprek",
          description: "Geen kosten, vrijblijvend kennismaken",
        },
        {
          title: "Persoonlijk advies",
          description: "Op maat gemaakt voor jouw situatie",
        },
        {
          title: "Gratis energiebesparende spullen",
          description: "Krijg gratis spullen om direct te besparen",
        },
        {
          title: "Subsidie-informatie",
          description: "We helpen je de juiste subsidies te vinden",
        },
      ],
      calTitle: "Cal.com Integratie",
      calDescription: "Voeg hier je Cal.com booking link toe.",
      calDeveloperNote: "Voor developers: voeg hier je Cal.com booking link toe.",
      calCodeHint: "Je kunt ook de Cal.com embed code direct toevoegen via hun platform:",
      calLinkText: "cal.com →",
      contactIntro: "Liever direct contact?",
      contactEmail: "info@megreen.nl",
      contactPhone: "020 - 123 4567",
    },
    address: {
      constructionYearLabel: "Bouwjaar:",
    },
  },
  en: {
    common: {
      languageLabel: "Language",
      languageNames: {
        nl: "Dutch",
        en: "English",
        tr: "Turkish",
        ar: "Arabic",
      },
      backToHome: "Back to home",
      errors: {
        analysis: "Something went wrong while analysing your home",
        generic: "An error occurred",
        chat: "Something went wrong",
        noStream: "No response stream",
      },
    },
    home: {
      title: "AI Energy Coach",
      subtitleLine1: "Receive personalised energy advice powered by AI.",
      subtitleLine2:
        "Run the energy scan, ask your questions or schedule a free appointment with a MeGreen energy coach to receive complimentary energy-saving products.",
      scanCard: {
        title: "Start the Energy Scan",
        description:
          "Analyse your home and instantly receive a personalised energy report with saving tips.",
        cta: "Start scan",
      },
      chatCard: {
        title: "Go to AI advice",
        description:
          "Ask our AI energy coach your questions and get instant answers.",
        cta: "Start chat",
      },
      appointmentCard: {
        title: "Book an appointment",
        description:
          "Schedule a conversation with a MeGreen energy coach for tailored advice and free energy-saving products.",
        cta: "Plan meeting",
      },
      footer: "Powered by AI • MeGreen Energy Coach",
    },
    scan: {
      title: "Energy scan",
      description: "Enter your home details for personalised advice",
      addressLabel: "Address *",
      addressPlaceholder: "e.g. Church Street 1, Amsterdam",
      yearLabel: "Construction year *",
      yearPlaceholder: "e.g. 1990",
      typeLabel: "Home type *",
      typePlaceholder: "Select home type",
      propertyTypes: {
        vrijstaand: "Detached house",
        tussenwoning: "Terraced house",
        hoekwoning: "End-terrace house",
        appartement: "Apartment",
        benedenwoning: "Ground-floor apartment",
        bovenwoning: "Upper-floor apartment",
      },
      energyLabel: "Energy label *",
      energyPlaceholder: "Select energy label",
      energyLabels: {
        "A++++": "A++++ (new build)",
        "A+++": "A+++",
        "A++": "A++",
        "A+": "A+",
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "F",
        G: "G",
        onbekend: "Unknown",
      },
      heatingLabel: "Heating type *",
      heatingPlaceholder: "Select heating type",
      heatingOptions: {
        "cv-ketel": "Gas boiler",
        warmtepomp: "Heat pump",
        stadsverwarming: "District heating",
        elektrisch: "Electric heating",
        pelletkachel: "Pellet stove",
        anders: "Other",
      },
      insulationLabel: "Existing insulation",
      insulationOptions: {
        muurisolatie: "Wall insulation",
        dakisolatie: "Roof insulation",
        vloerisolatie: "Floor insulation",
        "dubbel glas": "Double glazing",
        "HR++ glas": "HR++ glazing",
      },
      submit: "Analyse my home",
      analyzing: "Analysing...",
      resultTitle: "Your energy report",
      downloadReport: "Download my report as PDF",
      analysisError: "Something went wrong while analysing your home",
      genericError: "An error occurred",
    },
    chat: {
      title: "AI Energy Coach Chat",
      subtitle: "Ask your questions about saving energy",
      welcomeTitle: "Welcome to the AI Energy Coach",
      welcomeDescription:
        "Ask a question about saving energy, insulation, solar panels or any other energy topic!",
      examples: [
        "What is the best way to insulate my home?",
        "Are solar panels still profitable?",
        "What are the best ways to save energy?",
      ],
      inputPlaceholder: "Ask a question about saving energy...",
      retryMessage: "Sorry, something went wrong. Please try again.",
    },
    appointment: {
      title: "Book an appointment",
      subtitle: "Schedule a conversation with a MeGreen energy coach for personal advice",
      personalAdviceTitle: "Personal energy advice",
      personalAdviceDescription:
        "Our energy coaches are happy to help you with tailored advice and inform you about free energy-saving products.",
      benefits: [
        {
          title: "Free consultation",
          description: "No costs, obligation-free introduction",
        },
        {
          title: "Tailored advice",
          description: "Customised to your situation",
        },
        {
          title: "Free energy-saving products",
          description: "Receive free items to start saving right away",
        },
        {
          title: "Subsidy guidance",
          description: "We help you find the right subsidies",
        },
      ],
      calTitle: "Cal.com integration",
      calDescription: "Add your Cal.com booking link here.",
      calDeveloperNote: "For developers: add your Cal.com booking link here.",
      calCodeHint: "You can also add the Cal.com embed code directly via their platform:",
      calLinkText: "cal.com →",
      contactIntro: "Prefer direct contact?",
      contactEmail: "info@megreen.nl",
      contactPhone: "020 - 123 4567",
    },
    address: {
      constructionYearLabel: "Construction year:",
    },
  },
  tr: {
    common: {
      languageLabel: "Dil",
      languageNames: {
        nl: "Hollandaca",
        en: "İngilizce",
        tr: "Türkçe",
        ar: "Arapça",
      },
      backToHome: "Ana sayfaya dön",
      errors: {
        analysis: "Eviniz analiz edilirken bir hata oluştu",
        generic: "Bir hata oluştu",
        chat: "Bir şeyler ters gitti",
        noStream: "Yanıt akışı yok",
      },
    },
    home: {
      title: "Yapay Zeka Enerji Koçu",
      subtitleLine1: "Yapay zekâ destekli kişisel enerji tavsiyeleri alın.",
      subtitleLine2:
        "Enerji taramasını yapın, sorularınızı sorun veya MeGreen enerji koçu ile ücretsiz enerji tasarrufu ürünleri için hemen randevu planlayın.",
      scanCard: {
        title: "Enerji taramasını başlat",
        description:
          "Evinizi analiz edin ve tasarruf önerileri içeren kişisel enerji raporunuzu hemen alın.",
        cta: "Taramayı başlat",
      },
      chatCard: {
        title: "Yapay zekâ tavsiyesine git",
        description:
          "Sorularınızı yapay zekâ enerji koçumuza sorun ve anında yanıt alın.",
        cta: "Sohbete başla",
      },
      appointmentCard: {
        title: "Randevu alın",
        description:
          "MeGreen enerji koçuyla kişiye özel tavsiye ve ücretsiz enerji tasarrufu ürünleri için görüşme planlayın.",
        cta: "Randevu planla",
      },
      footer: "Yapay zekâ tarafından desteklenir • MeGreen Enerji Koçu",
    },
    scan: {
      title: "Enerji taraması",
      description: "Kişisel tavsiye için ev bilgilerinizi girin",
      addressLabel: "Adres *",
      addressPlaceholder: "Örn. Kilise Caddesi 1, Amsterdam",
      yearLabel: "Yapım yılı *",
      yearPlaceholder: "Örn. 1990",
      typeLabel: "Konut tipi *",
      typePlaceholder: "Konut tipi seçin",
      propertyTypes: {
        vrijstaand: "Müstakil ev",
        tussenwoning: "Sıra ev",
        hoekwoning: "Köşe sıra ev",
        appartement: "Daire",
        benedenwoning: "Zemin kat dairesi",
        bovenwoning: "Üst kat dairesi",
      },
      energyLabel: "Enerji etiketi *",
      energyPlaceholder: "Enerji etiketini seçin",
      energyLabels: {
        "A++++": "A++++ (yeni bina)",
        "A+++": "A+++",
        "A++": "A++",
        "A+": "A+",
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "F",
        G: "G",
        onbekend: "Bilinmiyor",
      },
      heatingLabel: "Isıtma türü *",
      heatingPlaceholder: "Isıtma türünü seçin",
      heatingOptions: {
        "cv-ketel": "Gaz kazanı",
        warmtepomp: "Isı pompası",
        stadsverwarming: "Merkezi ısıtma",
        elektrisch: "Elektrikli ısıtma",
        pelletkachel: "Pelet sobası",
        anders: "Diğer",
      },
      insulationLabel: "Mevcut yalıtım",
      insulationOptions: {
        muurisolatie: "Duvar yalıtımı",
        dakisolatie: "Çatı yalıtımı",
        vloerisolatie: "Zemin yalıtımı",
        "dubbel glas": "Çift cam",
        "HR++ glas": "HR++ cam",
      },
      submit: "Evimi analiz et",
      analyzing: "Analiz ediliyor...",
      resultTitle: "Enerji raporunuz",
      downloadReport: "Raporumun PDF'ini indir",
      analysisError: "Eviniz analiz edilirken bir hata oluştu",
      genericError: "Bir hata oluştu",
    },
    chat: {
      title: "Yapay Zeka Enerji Koçu Sohbeti",
      subtitle: "Enerji tasarrufu hakkında sorularınızı sorun",
      welcomeTitle: "Yapay Zeka Enerji Koçu'na hoş geldiniz",
      welcomeDescription:
        "Enerji tasarrufu, yalıtım, güneş panelleri veya diğer enerji konuları hakkında soru sorun!",
      examples: [
        "Evimde yalıtımı en iyi nasıl yapabilirim?",
        "Güneş panelleri hâlâ kârlı mı?",
        "Enerji tasarrufu yapmanın en iyi yolları nelerdir?",
      ],
      inputPlaceholder: "Enerji tasarrufu hakkında bir soru sorun...",
      retryMessage: "Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.",
    },
    appointment: {
      title: "Randevu alın",
      subtitle: "MeGreen enerji koçuyla kişisel tavsiye için görüşme planlayın",
      personalAdviceTitle: "Kişisel enerji tavsiyesi",
      personalAdviceDescription:
        "Enerji koçlarımız size özel tavsiyelerle yardımcı olur ve ücretsiz enerji tasarrufu ürünleri hakkında bilgi verir.",
      benefits: [
        {
          title: "Ücretsiz danışma",
          description: "Ücretsiz, bağlayıcı olmayan tanışma",
        },
        {
          title: "Kişiye özel tavsiye",
          description: "Durumunuza uygun olarak hazırlanır",
        },
        {
          title: "Ücretsiz enerji tasarrufu ürünleri",
          description: "Hemen tasarrufa başlamak için ücretsiz ürünler alın",
        },
        {
          title: "Teşvik desteği",
          description: "Doğru teşvikleri bulmanıza yardımcı oluyoruz",
        },
      ],
      calTitle: "Cal.com entegrasyonu",
      calDescription: "Cal.com rezervasyon bağlantınızı buraya ekleyin.",
      calDeveloperNote: "Geliştiriciler için: Cal.com rezervasyon bağlantınızı buraya ekleyin.",
      calCodeHint: "Cal.com gömme kodunu doğrudan platformlarından da ekleyebilirsiniz:",
      calLinkText: "cal.com →",
      contactIntro: "Doğrudan iletişim tercih edilir mi?",
      contactEmail: "info@megreen.nl",
      contactPhone: "020 - 123 4567",
    },
    address: {
      constructionYearLabel: "Yapım yılı:",
    },
  },
  ar: {
    common: {
      languageLabel: "اللغة",
      languageNames: {
        nl: "الهولندية",
        en: "الإنجليزية",
        tr: "التركية",
        ar: "العربية",
      },
      backToHome: "العودة إلى الصفحة الرئيسية",
      errors: {
        analysis: "حدث خطأ أثناء تحليل منزلك",
        generic: "حدث خطأ",
        chat: "حدث خطأ ما",
        noStream: "لا يوجد تدفق للاستجابة",
      },
    },
    home: {
      title: "مدرب الطاقة بالذكاء الاصطناعي",
      subtitleLine1: "احصل على نصائح طاقة شخصية مدعومة بالذكاء الاصطناعي.",
      subtitleLine2:
        "أجرِ فحص الطاقة، اطرح أسئلتك أو حدد موعدًا مجانيًا مع مدرب الطاقة من MeGreen للحصول على منتجات لتوفير الطاقة مجانًا.",
      scanCard: {
        title: "ابدأ فحص الطاقة",
        description:
          "حلل منزلك واحصل فورًا على تقرير طاقة شخصي مع نصائح للتوفير.",
        cta: "ابدأ الفحص",
      },
      chatCard: {
        title: "انتقل إلى نصائح الذكاء الاصطناعي",
        description:
          "اطرح أسئلتك على مدرب الطاقة بالذكاء الاصطناعي واحصل على إجابات فورية.",
        cta: "ابدأ المحادثة",
      },
      appointmentCard: {
        title: "احجز موعدًا",
        description:
          "حدد محادثة مع مدرب طاقة من MeGreen للحصول على نصيحة شخصية ومنتجات مجانية لتوفير الطاقة.",
        cta: "خطط للموعد",
      },
      footer: "مدعوم بالذكاء الاصطناعي • مدرب الطاقة MeGreen",
    },
    scan: {
      title: "فحص الطاقة",
      description: "أدخل تفاصيل منزلك للحصول على نصيحة شخصية",
      addressLabel: "العنوان *",
      addressPlaceholder: "مثال: شارع الكنيسة 1، أمستردام",
      yearLabel: "سنة البناء *",
      yearPlaceholder: "مثال: 1990",
      typeLabel: "نوع السكن *",
      typePlaceholder: "اختر نوع السكن",
      propertyTypes: {
        vrijstaand: "منزل منفصل",
        tussenwoning: "منزل متلاصق",
        hoekwoning: "منزل زاوية متلاصق",
        appartement: "شقة",
        benedenwoning: "شقة بالطابق الأرضي",
        bovenwoning: "شقة بالطابق العلوي",
      },
      energyLabel: "تصنيف الطاقة *",
      energyPlaceholder: "اختر تصنيف الطاقة",
      energyLabels: {
        "A++++": "A++++ (بناء جديد)",
        "A+++": "A+++",
        "A++": "A++",
        "A+": "A+",
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "F",
        G: "G",
        onbekend: "غير معروف",
      },
      heatingLabel: "نوع التدفئة *",
      heatingPlaceholder: "اختر نوع التدفئة",
      heatingOptions: {
        "cv-ketel": "غلاية غاز",
        warmtepomp: "مضخة حرارية",
        stadsverwarming: "تدفئة مركزية",
        elektrisch: "تدفئة كهربائية",
        pelletkachel: "مدفأة حبيبات",
        anders: "أخرى",
      },
      insulationLabel: "العزل المتوفر",
      insulationOptions: {
        muurisolatie: "عزل الجدران",
        dakisolatie: "عزل السقف",
        vloerisolatie: "عزل الأرضية",
        "dubbel glas": "زجاج مزدوج",
        "HR++ glas": "زجاج HR++",
      },
      submit: "حلّل منزلي",
      analyzing: "جارٍ التحليل...",
      resultTitle: "تقرير الطاقة الخاص بك",
      downloadReport: "حمّل تقريري بصيغة PDF",
      analysisError: "حدث خطأ أثناء تحليل منزلك",
      genericError: "حدث خطأ",
    },
    chat: {
      title: "محادثة مدرب الطاقة بالذكاء الاصطناعي",
      subtitle: "اطرح أسئلتك حول توفير الطاقة",
      welcomeTitle: "مرحبًا بك في مدرب الطاقة بالذكاء الاصطناعي",
      welcomeDescription:
        "اطرح سؤالًا حول توفير الطاقة أو العزل أو الألواح الشمسية أو أي موضوع آخر يتعلق بالطاقة!",
      examples: [
        "ما هي أفضل طريقة لعزل منزلي؟",
        "هل الألواح الشمسية ما زالت مربحة؟",
        "ما أفضل الطرق لتوفير الطاقة؟",
      ],
      inputPlaceholder: "اكتب سؤالًا حول توفير الطاقة...",
      retryMessage: "عذرًا، حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    },
    appointment: {
      title: "احجز موعدًا",
      subtitle: "حدد محادثة مع مدرب طاقة من MeGreen للحصول على نصيحة شخصية",
      personalAdviceTitle: "نصيحة طاقة شخصية",
      personalAdviceDescription:
        "يسعد مدربونا بالطاقة بمساعدتك بنصائح مصممة خصيصًا لك وإبلاغك بالمنتجات المجانية لتوفير الطاقة.",
      benefits: [
        {
          title: "استشارة مجانية",
          description: "بدون تكلفة، تعارف بلا التزام",
        },
        {
          title: "نصيحة مخصصة",
          description: "مصممة لتناسب وضعك",
        },
        {
          title: "منتجات مجانية لتوفير الطاقة",
          description: "احصل على منتجات مجانية للبدء في التوفير فورًا",
        },
        {
          title: "إرشاد حول الدعم المالي",
          description: "نساعدك في العثور على برامج الدعم المناسبة",
        },
      ],
      calTitle: "تكامل Cal.com",
      calDescription: "أضف رابط الحجز الخاص بك من Cal.com هنا.",
      calDeveloperNote: "للمطورين: أضف رابط الحجز من Cal.com هنا.",
      calCodeHint: "يمكنك أيضًا إضافة كود التضمين من Cal.com مباشرة عبر منصتهم:",
      calLinkText: "cal.com →",
      contactIntro: "تفضّل التواصل المباشر؟",
      contactEmail: "info@megreen.nl",
      contactPhone: "020 - 123 4567",
    },
    address: {
      constructionYearLabel: "سنة البناء:",
    },
  },
};

export const defaultLocale: Locale = "nl";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

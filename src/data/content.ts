import type { Project, ServiceArea, TimelineItem, FaqItem } from '../types';

export const PERSONAL_INFO = {
  name: 'Giorgio Di Cristofalo',
  role: {
    it: 'Software Engineer | Automazione, Delivery & AI Applicata',
    en: 'Software Engineer | Automation, Delivery & Applied AI',
  },
  location: 'Palermo, Sicilia / Remote',
  email: 'giorgiodicristofalo77@gmail.com',
  github: 'https://github.com/Horghe20',
  linkedin: 'https://www.linkedin.com/in/giorgiodicristofalo/',
  community: 'https://faiddatechlab.com/',
  currentWork: {
    it: 'Software Engineer @ ENAV Group • Tesoriere Faidda Tech Lab',
    en: 'Software Engineer @ ENAV Group • Treasurer at Faidda Tech Lab',
  },
  availability: {
    it: 'Disponibile per progetti di automazione & consulenza',
    en: 'Available for automation & consulting projects',
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'harbor-manager',
    slug: 'harbor-manager',
    title: 'Harbor Manager',
    category: 'ai',
    status: 'in_development',
    statusLabel: {
      it: 'In sviluppo · Demo',
      en: 'In Development · Demo',
    },
    year: '2025',
    tagline: {
      it: "L'AI assegna automaticamente ogni barca al posto giusto in porto, ottimizzando lo spazio disponibile.",
      en: 'AI automatically allocates every boat to the optimal berth, maximizing marina spatial capacity.',
    },
    problem: {
      it: 'Le piccole associazioni nautiche e i porticcioli turistici gestiscono gli ormeggi a mano su fogli cartacei o tabelle statiche, generando frequenti colli di bottiglia, conflitti di pescaggio e fino al 25% di spazio banchina sprecato.',
      en: 'Small nautical clubs and tourist marinas assign boat berths manually using paper charts or static spreadsheets, leading to bottlenecks, draft conflicts, and up to 25% wasted dock space.',
    },
    howItWorks: {
      it: 'Piattaforma gestionale completa: mappa banchina interattiva (Leaflet), anagrafica clienti/imbarcazioni, contratti stagionali, fatturazione e notifiche automatiche. Il gestore carica la flotta in arrivo e il sistema calcola la planimetria ideale in pochi secondi.',
      en: 'Complete marina management platform: interactive dock map (Leaflet), customer/boat registries, seasonal contracts, invoicing, and automated notifications. The harbor master loads incoming fleet requests and the engine outputs the optimal layout in seconds.',
    },
    aiRole: {
      it: 'Modellazione del posizionamento come problema di ottimizzazione vincolata (Constraint Satisfaction / 2D Bin Packing) risolto con Google OR-Tools (CP-SAT solver). Converte coordinate geografiche (PostGIS) in piano cartesiano normalizzato, applicando vincoli rigidi (pescaggio fondale, larghezza canale, distanze di rispetto prua/poppa, sovrapposizioni zero) e massimizzando il numero di barche ormeggiate e il gettito economico.',
      en: 'Formulated berth allocation as a Constrained Optimization problem (Constraint Satisfaction / 2D Bin Packing) solved via Google OR-Tools (CP-SAT). Converts PostGIS geographic coordinates into a normalized 2D cartesian grid, enforcing hard constraints (depth draft, fairway clearance, bow/stern buffers, zero overlap) while maximizing dock capacity and revenue yield.',
    },
    whyItMatters: {
      it: 'Dimostra come la ricerca operativa e i solver matematici risolvano problemi fisici concreti meglio di un LLM generico, garantendo correttezza deterministica e zero allucinazioni su vincoli critici di sicurezza marina.',
      en: 'Demonstrates how operations research and mathematical constraint solvers solve real-world spatial problems with deterministic correctness and zero hallucinations on safety-critical constraints.',
    },
    architectureNotes: {
      it: 'Python / Flask REST API, PostgreSQL con estensione PostGIS per geometrie e banchine, worker asincroni Celery con Redis broker per calcoli pesanti OR-Tools CP-SAT, frontend Angular 21 con Signals e Tailwind CSS.',
      en: 'Python / Flask backend, PostgreSQL + PostGIS for spatial queries, asynchronous Celery workers backed by Redis for heavy OR-Tools CP-SAT computation, Angular 21 frontend with Signals and Tailwind CSS.',
    },
    stack: ['Python', 'Flask', 'PostgreSQL', 'PostGIS', 'Google OR-Tools', 'Celery', 'Redis', 'Angular 21', 'Signals', 'Leaflet', 'Docker'],
    metrics: [
      { label: { it: 'Spazio recuperato', en: 'Space recovered' }, value: '+22%' },
      { label: { it: 'Tempo calcolo piano', en: 'Plan calculation time' }, value: '< 2.4s' },
      { label: { it: 'Vincoli gestiti', en: 'Constraints handled' }, value: '100% hard' }
    ],
    abstractDiagramType: 'packing',
    image: '/images/projects/harbor-manager.webp'
  },
  {
    id: 'central-parking',
    slug: 'central-parking',
    title: 'Central Parking',
    category: 'fullstack',
    status: 'production',
    statusLabel: {
      it: 'In produzione',
      en: 'In Production',
    },
    year: '2024',
    tagline: {
      it: 'Gestione completa delle prenotazioni parcheggio per le partenze crociera, dal booking al check-in con QR code.',
      en: 'End-to-end cruise parking management system, from multi-agency booking to QR code gate check-in.',
    },
    problem: {
      it: 'Le agenzie partner che gestiscono i parcheggi dedicati ai crocieristi (MSC, Costa) al porto faticavano a sincronizzare le prenotazioni, con lunghi tempi di attesa al cancello per identificare i veicoli e frequenti errori di overbooking nei giorni di imbarco massivo.',
      en: 'Partner agencies managing cruise passenger parking (MSC, Costa) struggled to sync booking flows, creating gate bottlenecks during high-volume embarkation days and manual paper reconciliation errors.',
    },
    howItWorks: {
      it: 'Piattaforma multi-ruolo (Admin centrale, Agenzie di viaggio, Operatori di varco). Permette prenotazione rapida con generazione istantanea di voucher PDF (ReportLab) e QR Code univoco cifrato. All\'arrivo, l\'operatore scansiona il QR con fotocamera tablet/smartphone in <0.5s registrando ingresso, targa e chiavi.',
      en: 'Multi-tenant architecture (Central Admin, Travel Agencies, Gate Operators). Generates instant PDF vouchers (ReportLab) with encrypted QR codes. At gate arrival, operators scan the QR code via mobile camera in <0.5s, recording entry timestamp, license plate, and key locker ID.',
    },
    whyItMatters: {
      it: 'Un esempio concreto di delivery affidabile e automazione end-to-end: azzera il carico manuale per le agenzie, integra WhatsApp API (Meta/Twilio) per invio immediato voucher ai passeggeri ed export reportistica contabile per la direzione.',
      en: 'A solid real-world example of bulletproof delivery: eliminates manual agency coordination, integrates WhatsApp Meta API for instant passenger ticket dispatch, and automates accounting audit exports.',
    },
    architectureNotes: {
      it: 'Flask, SQLAlchemy ORM, autenticazione JWT stateless con RBAC granulare, integrazione Twilio/WhatsApp Cloud API, ReportLab per rendering vettoriale PDF, Frontend Angular 17, Tailwind CSS e modulo scanner fotocamera ngx-scanner.',
      en: 'Flask, SQLAlchemy ORM, JWT stateless auth with granular RBAC, WhatsApp Cloud API integration, ReportLab vector PDF rendering, Angular 17 SPA, Tailwind CSS and ngx-scanner camera integration.',
    },
    stack: ['Python', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'JWT', 'WhatsApp API', 'ReportLab', 'Angular 17', 'Tailwind CSS', 'Docker'],
    metrics: [
      { label: { it: 'Check-in al varco', en: 'Gate check-in time' }, value: '< 0.5s' },
      { label: { it: 'Voucher inviati/mese', en: 'Vouchers sent/mo' }, value: '3,000+' },
      { label: { it: 'Disponibilità', en: 'Uptime' }, value: '99.9%' }
    ],
    demoUrl: 'https://parking-manager-fe.vercel.app/',
    abstractDiagramType: 'qr_pipeline',
    image: '/images/projects/central-parking.webp'
  },
  {
    id: 'esn-buddy-program',
    slug: 'esn-buddy-program',
    title: 'ESN Buddy Program',
    category: 'fullstack',
    status: 'production',
    statusLabel: {
      it: 'In produzione · Demo Live',
      en: 'In Production · Live Demo',
    },
    year: '2024',
    tagline: {
      it: 'Abbina automaticamente studenti internazionali a studenti locali in base a lingua, interessi e facoltà.',
      en: 'Automatically matches international Erasmus students with local buddies based on languages, studies, and interests.',
    },
    problem: {
      it: 'I volontari ESN (Erasmus Student Network) dovevano abbinare centinaia di studenti in arrivo a mentor locali ogni semestre leggendo a mano questionari Google Form sparsi, impiegando settimane e generando abbinamenti sbilanciati.',
      en: 'Erasmus Student Network volunteers had to pair hundreds of incoming international students with local student mentors every semester by manually cross-referencing spreadsheets, taking weeks of tedious effort.',
    },
    howItWorks: {
      it: 'Registrazione self-service per studenti internazionali e locali. Algoritmo di scoring ponderato multidimensionale che valuta compatibilità linguistica, facoltà accademica, interessi condivisi e preferenze speciali, proponendo i match ottimali con override manuale per i manager.',
      en: 'Self-service registration portals for incoming and local students. Multi-criteria weighted scoring algorithm evaluating language proficiency, academic discipline, shared hobbies, and mentor capacity with quick administrative override.',
    },
    whyItMatters: {
      it: 'Nato da un\'esigenza reale vissuta direttamente da Giorgio come Web Manager ESN. Include dashboard GDPR per cancellazione batch dei dati a fine semestre, email automatiche di benvenuto e monitoraggio delle risposte in tempo reale.',
      en: 'Born from a real operational need directly experienced as ESN Web Manager. Includes GDPR batch purge workflows, automated bilingual introduction emails, and live response tracking.',
    },
    architectureNotes: {
      it: 'Python / Flask, database relazionale con hashing crittografico sicuro (Werkzeug), protezione CSRF/XSS, esportazione Excel formattata e template email dinamici.',
      en: 'Python / Flask, relational database with Werkzeug cryptographic security, CSRF/XSS hardening, Excel reporting engine, and dynamic email templating.',
    },
    stack: ['Python', 'Flask', 'PostgreSQL', 'Jinja2', 'Werkzeug Security', 'GDPR Engine', 'Excel Automation', 'REST API'],
    metrics: [
      { label: { it: 'Tempo risparmiato', en: 'Time saved / semester' }, value: '95%' },
      { label: { it: 'Studenti abbinati', en: 'Matched students' }, value: '800+' },
      { label: { it: 'Gradimento match', en: 'Match satisfaction' }, value: '4.8 / 5' }
    ],
    demoCredentials: {
      it: 'Demo pubblica sandbox attiva con ruoli Admin e Studente preconfigurati per test immediato.',
      en: 'Public sandbox demo active with preconfigured Admin and Student roles for instant testing.'
    },
    demoUrl: 'https://esn-buddy-program.vercel.app/',
    repoUrl: 'https://github.com/Horghe20',
    abstractDiagramType: 'scoring_graph',
    image: '/images/projects/esn-buddy-program.webp'
  },
  {
    id: 'match-bandi-gara',
    slug: 'match-bandi-gara',
    title: 'MatchBandiGara',
    category: 'ai',
    status: 'in_development',
    statusLabel: {
      it: 'In sviluppo · B2B',
      en: 'In Development · B2B',
    },
    year: '2025',
    tagline: {
      it: 'Motore di matching intelligente che abbina automaticamente bandi di gara alle aziende più idonee.',
      en: 'Intelligent scoring engine that matches public procurement tenders with qualified enterprise vendors.',
    },
    problem: {
      it: 'Monitorare centinaia di bandi di gara pubblici ogni settimana su portali eterogenei richiede ore di lavoro a team legali e commerciali, con alto rischio di perdere gare ad alto margine per ritardo nella qualificazione.',
      en: 'Manually screening hundreds of public procurement tenders every week across fragmented regional portals drains commercial resources and risks missing high-margin opportunities.',
    },
    howItWorks: {
      it: 'Ingestione dei bandi pubblici e pipeline di scoring automatico basato su ontologie di settore, requisiti di fatturato, certificazioni SOA e storico aziendale. Il sistema propone collaborazioni mirate che vengono validate dal consulente prima dell\'invio.',
      en: 'Automated tender ingestion pipeline and scoring system evaluating company qualifications, SOA certifications, historical contract performance, and scope alignment before notifying legal advisers.',
    },
    aiRole: {
      it: 'Sistema di scoring proprietario che valuta la compatibilità multilivello tra requisiti del bando e profilo aziendale, identificando sinergie tra aziende per la formazione di raggruppamenti temporanei di imprese (RTI). Algoritmo tenuto protetto a tutela del vantaggio competitivo.',
      en: 'Proprietary multi-level scoring algorithm evaluating compatibility between public tender clauses and company capability matrices, including Joint Venture consortium discovery. Algorithmic specifics kept proprietary.',
    },
    whyItMatters: {
      it: 'Automazione di un processo decisionale ed economico complesso, non solo un semplice bot di notifica. Ottimo banco di prova per sistemi di lead qualification e recommendation B2B.',
      en: 'Automates a high-stakes economic decision pipeline rather than trivial notifications. A strong benchmark for domain-specific enterprise lead qualification and B2B recommendation.',
    },
    stack: ['Python', 'Flask', 'PostgreSQL', 'JWT', 'Proprietary Scoring', 'Async Tasks', 'Email Dispatcher', 'Docker'],
    metrics: [
      { label: { it: 'Precisione screening', en: 'Screening precision' }, value: '91%' },
      { label: { it: 'Velocità qualifica', en: 'Tender screening speed' }, value: 'x10' }
    ],
    abstractDiagramType: 'tender_matching',
    image: '/images/projects/match-bandi-gara.webp'
  },
  {
    id: 'network-tester',
    slug: 'network-tester',
    title: 'Network Tester Interface',
    category: 'embedded',
    status: 'bare_metal',
    statusLabel: {
      it: 'Bare Metal · Embedded (2020)',
      en: 'Bare Metal · Embedded (2020)',
    },
    year: '2020',
    tagline: {
      it: 'Un dispositivo standalone per configurare e diagnosticare reti, con touchscreen, costruito da zero su Arduino.',
      en: 'A standalone hardware device for network diagnostics and configuration with touch display, built from scratch on Arduino.',
    },
    problem: {
      it: 'La diagnostica di rete in data center o rack distribuiti richiedeva il trasporto di computer portatili ingombranti, cavi e alimentatori solo per verificare leasing DHCP, gateway reachability o latenza ICMP.',
      en: 'Troubleshooting Ethernet drops in server racks and field installations required carrying heavy laptops and bulky gear just to check DHCP leasing, gateway reachability, or ICMP latency.',
    },
    howItWorks: {
      it: 'Dispositivo tascabile e autonomo alimentato a batteria. Integra un display TFT Touchscreen resistivo con interfaccia GUI grafica a basso consumo. Permette configurazione DHCP / IP statico, ping bidirezionale verso gateway/DNS, echo ICMP server e telemetria voltaggio batteria in tempo reale.',
      en: 'Handheld battery-operated diagnostic unit. Features a resistive TFT touchscreen with custom low-latency UI. Supports DHCP leasing, static IP configuration, bidirectional ICMP pinging to gateway/custom hosts, and real-time battery voltage monitoring.',
    },
    whyItMatters: {
      it: 'Dimostra solide basi a basso livello (C/C++, gestione bus SPI, pacchetti raw Ethernet, registri hardware e memory constraints rigorosi su microcontrollori ATmega) — un differenziatore raro per uno sviluppatore cloud/full-stack.',
      en: 'Demonstrates deep low-level engineering fundamentals (C/C++, SPI bus communication, raw Ethernet packet crafting, hardware interrupts, tight memory footprint on ATmega) — a rare asset for a full-stack engineer.',
    },
    architectureNotes: {
      it: 'Arduino Mega/Uno, controller Ethernet Microchip ENC28J60 via bus SPI hardware, Display MCUFRIEND 2.4" TFT LCD con driver TouchScreen calibrato, librerie EtherCard e Adafruit_GFX ottimizzate per ridurre occupazione SRAM.',
      en: 'Arduino platform, Microchip ENC28J60 Ethernet controller interfaced over SPI, 2.4" MCUFRIEND TFT touch display, optimized EtherCard & Adafruit_GFX drivers customized for SRAM preservation.',
    },
    stack: ['C / C++', 'Arduino', 'SPI Protocol', 'ENC28J60 Ethernet', 'ICMP Protocol', 'MCUFRIEND TFT', 'Embedded Systems'],
    metrics: [
      { label: { it: 'Tempo boot', en: 'Boot time' }, value: '0.8s' },
      { label: { it: 'Memoria SRAM usata', en: 'SRAM footprint' }, value: '< 1.8 KB' },
      { label: { it: 'Consumo', en: 'Power draw' }, value: '180 mA' }
    ],
    repoUrl: 'https://github.com/Horghe20/EthernetTester',
    abstractDiagramType: 'spi_icmp',
    image: '/images/projects/network-tester.webp'
  },
  {
    id: 'nutrifit',
    slug: 'nutrifit',
    title: 'NutriFit',
    category: 'ai',
    status: 'case_study',
    statusLabel: {
      it: 'Caso Studio · Architettura Agentica',
      en: 'Case Study · Agentic Architecture',
    },
    year: '2025',
    tagline: {
      it: 'Una piattaforma agentica per nutrizionisti: l\'AI non si limita a estrarre dati, orchestra piani alimentari e allenamento in tempo reale.',
      en: 'An agentic SaaS architecture for nutritionists: AI orchestrates live dietary plans with real-time streaming and instant kNN meal swaps.',
    },
    problem: {
      it: 'Nutrizionisti e preparatori atletici gestiscono pazienti, piani dietetici, tabelle di allenamento, appuntamenti e abbonamenti con strumenti frammentati (WhatsApp, Excel, email). I software esistenti offrono solo database statici o lente chiamate AI monolitiche che bloccano la UI.',
      en: 'Nutritionists and athletic trainers juggle patient dossiers, meal regimes, workout schedules, and recurring payments across fragmented tools. Existing apps offer static tables or slow blocking AI endpoints that freeze user workflow.',
    },
    howItWorks: {
      it: 'Piattaforma unificata: cartella clinica paziente, prescrizione diete e schede workout, calendario sincronizzato e billing automatico Stripe. Quando viene richiesta la generazione di un piano complesso, un task Celery avvia la pipeline agentica.',
      en: 'Unified platform: patient health records, dietary and workout prescription, calendar sync, and Stripe recurring billing. Complex plan generation triggers an asynchronous Celery agentic pipeline.',
    },
    aiRole: {
      it: 'Architettura reattiva ad eventi: la richiesta innesca un worker Celery che interroga Google Gemini con schemi JSON strutturati. I chunk validati vengono pubblicati su Redis Pub/Sub e trasmessi al client in tempo reale via Server-Sent Events (SSE) senza bloccare il thread web. In parallelo, un motore di raccomandazione kNN calcola istantaneamente (<30ms) alternative alimentari basate sulla distanza euclidea tra macronutrienti (proteine, lipidi, glucidi, calorie) direttamente nel database.',
      en: 'Event-driven agentic flow: requests spawn Celery background workers that interface with Google Gemini using strictly typed JSON schemas. Validated output tokens publish to Redis Pub/Sub and stream to the browser via Server-Sent Events (SSE). Simultaneously, a kNN recommendation engine calculates meal swaps under 30ms based on Euclidean distance across macronutrient vectors directly in PostgreSQL.',
    },
    whyItMatters: {
      it: 'Dimostra come progettare un\'architettura AI scalabile ed enterprise: task queue disaccoppiata, streaming live non bloccante, fallback resiliente e combinazione ibrida tra inferenza LLM e calcolo vettoriale deterministico.',
      en: 'Exemplifies a production-grade enterprise AI architecture: decoupled task workers, non-blocking SSE streaming, graceful fallback, and hybrid synthesis of LLM generation with deterministic vector math.',
    },
    architectureNotes: {
      it: 'Python 3.12, Django 5 + Django REST Framework, Uvicorn (ASGI), Celery, Redis Pub/Sub, PostgreSQL, Google Gemini API, Stripe Billing, Resend per transazionali.',
      en: 'Python 3.12, Django 5 + DRF, ASGI Uvicorn, Celery, Redis Pub/Sub, PostgreSQL, Google Gemini API, Stripe, Resend.',
    },
    stack: ['Python 3.12', 'Django 5', 'Django REST Framework', 'Uvicorn ASGI', 'Celery', 'Redis Pub/Sub', 'Server-Sent Events', 'Google Gemini API', 'kNN Vector Engine', 'PostgreSQL', 'Stripe'],
    metrics: [
      { label: { it: 'Latenza swap kNN', en: 'kNN swap latency' }, value: '< 30ms' },
      { label: { it: 'Streaming update', en: 'SSE Stream delay' }, value: 'Realtime' },
      { label: { it: 'Throughput worker', en: 'Async scalability' }, value: '100% async' }
    ],
    demoUrl: 'https://www.nutrifitai.it/',
    abstractDiagramType: 'agent_stream',
    image: '/images/projects/nutrifit.webp'
  }
];

export const SERVICES: ServiceArea[] = [
  {
    id: 'fullstack-dev',
    title: {
      it: 'Hai un\'idea ma non sai da dove partire?',
      en: 'Have an idea but don\'t know where to start?'
    },
    description: {
      it: 'Costruisco l\'intera applicazione: database, logica di business, pagine web e pagamenti integrati. Tu vedi il prodotto finito, io mi occupo di tutto il resto.',
      en: 'I build the entire application: database, business logic, web interface, and integrated payments. You see the finished product — I take care of everything else.'
    },
    proof: {
      it: 'Central Parking è live in produzione con migliaia di voucher gestiti ogni mese.',
      en: 'Central Parking is live in production, processing thousands of vouchers every month.'
    },
    linkedProjectId: 'central-parking',
    keyPoints: {
      it: [
        'Dai requisiti al prodotto live in poche settimane, non mesi',
        'Pagamenti, notifiche WhatsApp, PDF e molto altro: tutto già integrato',
        'Nessun tecnicismo: ti aggiorno ad ogni step con linguaggio chiaro'
      ],
      en: [
        'From requirements to a live product in weeks, not months',
        'Payments, WhatsApp notifications, PDFs and more: all integrated',
        'No jargon: I keep you updated at every step in plain language'
      ]
    },
    icon: 'Layers'
  },
  {
    id: 'applied-ai',
    title: {
      it: 'E se il tuo sistema capisse cosa vuole il cliente prima ancora che te lo dica?',
      en: 'What if your system knew what the customer wanted before they asked?'
    },
    description: {
      it: 'Costruisco sistemi che imparano dai tuoi dati e agiscono: raccomandano, ottimizzano, personalizzano. Non AI generica — intelligenza su misura per il tuo problema specifico.',
      en: 'I build systems that learn from your data and act on it: recommending, optimising, personalising. Not generic AI — intelligence tailored to your specific problem.'
    },
    proof: {
      it: 'Harbor Manager: 0 conflitti di assegnazione su centinaia di posti barca. NutriFit: piano dietetico personalizzato generato in pochi secondi.',
      en: 'Harbor Manager: zero assignment conflicts across hundreds of berths. NutriFit: personalised meal plan generated in seconds.'
    },
    linkedProjectId: 'harbor-manager',
    keyPoints: {
      it: [
        'Il sistema sceglie, assegna e ottimizza da solo: tu rivedi solo le eccezioni',
        'Chatbot e assistenti che parlano usando i tuoi dati, non risposte inventate',
        'Ogni cliente riceve un\'esperienza personalizzata, su scala, senza sforzo manuale'
      ],
      en: [
        'The system decides, assigns and optimises by itself: you only review exceptions',
        'Chatbots and assistants that answer using your data, not made-up responses',
        'Every customer gets a personalised experience, at scale, without manual effort'
      ]
    },
    icon: 'Cpu'
  },
  {
    id: 'automation-delivery',
    title: {
      it: 'I tuoi strumenti non si parlano tra loro e perdi ore a copiare dati a mano?',
      en: 'Your tools don\'t talk to each other and you waste hours copying data manually?'
    },
    description: {
      it: 'Connetto i tuoi sistemi e automatizzo i passaggi manuali: il dato entra una volta e fluisce ovunque serva. Niente più copia-incolla tra gestionali, fogli Excel e email.',
      en: 'I connect your systems and automate the manual hand-offs: data enters once and flows wherever it\'s needed. No more copy-pasting between tools, spreadsheets and emails.'
    },
    proof: {
      it: 'Infrastrutture automatizzate in produzione h24 su sistemi di navigazione aerea (ENAV Group): zero interventi manuali sui rilasci.',
      en: 'Automated infrastructure running 24/7 on air navigation systems (ENAV Group): zero manual release interventions.'
    },
    linkedProjectId: 'central-parking',
    keyPoints: {
      it: [
        'Colleghi CRM, e-commerce, gestionale e email: un\'unica fonte di verità',
        'Processi schedulati che girano di notte e nei weekend, senza che tu ci pensi',
        'Alert immediati se qualcosa si interrompe: sai sempre cosa sta succedendo'
      ],
      en: [
        'Connect CRM, e-commerce, ERP and email: one single source of truth',
        'Scheduled processes running overnight and on weekends, without you thinking about it',
        'Instant alerts if anything breaks: you always know what\'s happening'
      ]
    },
    icon: 'Terminal'
  }
];

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'faidda-tech-lab',
    period: 'Mag 2026 – Oggi',
    startDate: '2026-05',
    column: 'right',
    title: {
      it: 'Tesoriere & Organizzatore Community',
      en: 'Treasurer & Community Organizer'
    },
    organization: 'Faidda Tech Lab',
    location: 'Palermo, Sicilia',
    category: 'volontariato',
    description: {
      it: "Tesoriere di Faidda Tech Lab, la rete che aggrega freelance, startup e professionisti ICT in Sicilia. Gestione finanziaria dell'associazione e supporto organizzativo agli eventi della community, da Sicily&Coding in poi.",
      en: "Treasurer at Faidda Tech Lab, the network connecting freelancers, startups, and ICT professionals across Sicily. Handles the association's finances and helps organize community events, including Sicily&Coding."
    },
    highlights: {
      it: ['Gestione contabile e budget associativo', 'Organizzazione incontri tecnici e hackathon', 'Crescita dell\'ecosistema tech locale'],
      en: ['Financial accounting and non-profit budget governance', 'Co-organizing technical meetups & hackathons', 'Empowering the Sicilian tech ecosystem']
    }
  },
  {
    id: 'idsairnav-enav',
    period: 'Giu 2025 – Oggi',
    startDate: '2025-06',
    column: 'left',
    title: {
      it: 'Software Engineer',
      en: 'Software Engineer'
    },
    organization: 'ENAV Group',
    location: 'Roma / Remoto',
    category: 'lavoro',
    description: {
      it: 'Ingegnerizzazione e manutenzione di sistemi software critici per la gestione delle informazioni aeronautiche (AIM/ATM). Sviluppo di pipeline di automazione del rilascio, continuous integration e testing rigoroso per sistemi con standard di sicurezza stringenti.',
      en: 'Engineering and maintaining safety-critical aeronautical information management systems (AIM/ATM). Building automated release pipelines, continuous integration workflows, and deterministic test automation under strict international aviation standards.'
    },
    highlights: {
      it: ['Sistemi mission-critical di navigazione aerea', 'Pipeline CI/CD e qualità del codice', 'Standard di compliance internazionali'],
      en: ['Mission-critical air traffic software', 'CI/CD pipelines & automated test gates', 'Strict compliance and reliability standards']
    }
  },
  {
    id: 'cyberchallenge',
    period: '2025',
    startDate: '2025-01',
    column: 'right',
    title: {
      it: 'CyberChallenge.IT',
      en: 'CyberChallenge.IT'
    },
    organization: 'Cybersecurity National Lab',
    location: 'Italia',
    category: 'certificazione',
    description: {
      it: 'Programma di addestramento avanzato in sicurezza informatica: crittografia applicata, vulnerability assessment, web application security e reverse engineering.',
      en: 'Advanced cybersecurity program: applied cryptography, vulnerability exploitation, binary reverse engineering, and web application security defense.'
    }
  },
  {
    id: 'magistrale',
    period: '2022 – 2025',
    startDate: '2022-09',
    column: 'left',
    title: {
      it: 'Laurea Magistrale in Ingegneria Informatica (110 e Lode)',
      en: "Master's Degree in Computer Engineering (110/110 Summa Cum Laude)"
    },
    organization: 'Università degli Studi di Palermo',
    location: 'Palermo, Italia',
    category: 'studio',
    degreeTrack: 'magistrale',
    yearRange: [2022, 2025],
    description: {
      it: 'Specializzazione in Intelligenza Artificiale, Sistemi Distribuiti e Sicurezza. Tesi sperimentale su "BERT4Def: Difesa di modelli NLP da attacchi avversari", dimostrando contromisure avanzate per proteggere i transformer da manipolazioni del testo.',
      en: 'Specialized in Artificial Intelligence, Distributed Systems, and Security. Experimental thesis on "BERT4Def: Defending NLP models against adversarial attacks", demonstrating robust defenses against textual adversarial manipulation on transformer architectures.'
    },
    highlights: {
      it: ['Votazione: 110/110 con Lode', 'Tesi sperimentale su difesa Transformer / BERT', 'Focus su sistemi distribuiti e affidabilità'],
      en: ['Final grade: 110/110 with Honors', 'Experimental thesis on Transformer/BERT defense', 'Core focus on distributed systems & reliability']
    }
  },
  {
    id: 'ricerca-pisa',
    period: 'Lug – Dic 2024',
    startDate: '2024-07',
    column: 'right',
    title: {
      it: 'Ricerca NLP & Recommender Systems',
      en: 'Research in NLP & Recommender Systems'
    },
    organization: 'Università di Pisa',
    location: 'Pisa, Italia',
    category: 'ricerca',
    degreeTrack: 'magistrale',
    description: {
      it: 'Attività di ricerca applicata su modelli di Elaborazione del Linguaggio Naturale (NLP) e sistemi di raccomandazione avanzati, combinando embedding semantici e metriche di similarità vettoriale.',
      en: 'Applied research in Natural Language Processing (NLP) models and advanced recommender architectures, bridging semantic embeddings with high-dimensional vector similarity.'
    }
  },
  {
    id: 'esn-web-manager',
    period: 'Set 2024 – Ago 2026',
    startDate: '2024-09',
    column: 'right',
    title: {
      it: 'Web Manager & Coordinatore Tech',
      en: 'Web Manager & Tech Coordinator'
    },
    organization: 'ESN (Erasmus Student Network)',
    location: 'Palermo, Italia',
    category: 'volontariato',
    degreeTrack: 'magistrale',
    description: {
      it: 'Gestione dell\'infrastruttura web della sezione, progettazione e deployment della piattaforma Buddy Program per l\'abbinamento automatizzato degli studenti internazionali, gestione privacy GDPR.',
      en: 'Led section web infrastructure, designed and deployed the automated Buddy Matching platform for international exchange students, enforcing GDPR compliance.'
    }
  },
  {
    id: 'erasmus-pardubice',
    period: 'Feb – Giu 2024',
    startDate: '2024-02',
    column: 'right',
    title: {
      it: 'Erasmus+ Mobility Exchange',
      en: 'Erasmus+ Mobility Exchange'
    },
    organization: 'University of Pardubice',
    location: 'Pardubice, Repubblica Ceca',
    category: 'erasmus',
    degreeTrack: 'magistrale',
    description: {
      it: 'Semestre accademico internazionale focalizzato su networking avanzato, sistemi embedded e algoritmi distribuiti in contesto multidisciplinare europeo.',
      en: 'International academic exchange focusing on advanced computer networking, embedded architectures, and distributed algorithms in a multicultural environment.'
    }
  },
  {
    id: 'cert-plsql',
    period: '2024',
    startDate: '2024-06',
    column: 'right',
    title: {
      it: 'Database Programming with PL/SQL',
      en: 'Database Programming with PL/SQL'
    },
    organization: 'Oracle Academy',
    location: 'Certificazione Professionale',
    category: 'certificazione',
    degreeTrack: 'magistrale',
    description: {
      it: 'Progettazione avanzata di database relazionali, stored procedures, trigger complessi, ottimizzazione delle query e integrità transazionale ACID.',
      en: 'Advanced relational schema design, complex stored procedures, ACID transaction integrity, and SQL query execution plan optimization.'
    }
  },
  {
    id: 'ricerca-biomedicale',
    period: 'Apr – Nov 2023',
    startDate: '2023-04',
    column: 'right',
    title: {
      it: 'Ricerca Software Biomedicale (Simulatore TMS)',
      en: 'Biomedical Software Research (TMS Simulator)'
    },
    organization: 'Università degli Studi di Palermo',
    location: 'Palermo, Italia',
    category: 'ricerca',
    degreeTrack: 'magistrale',
    description: {
      it: 'Sviluppo di un simulatore per la Stimolazione Magnetica Transcranica (TMS). Modellazione fisica del campo magnetico e interfaccia software per la visualizzazione 3D delle traiettorie neuronali indotte.',
      en: 'Engineered a Transcranial Magnetic Stimulation (TMS) simulator. Modeled magnetic field physical propagation with a 3D visualization engine for induced neuronal current mapping.'
    }
  },
  {
    id: 'samsung-innovation',
    period: 'Estate 2022',
    startDate: '2022-07',
    column: 'right',
    title: {
      it: 'Samsung Innovation Campus — AI & IoT',
      en: 'Samsung Innovation Campus — AI & IoT'
    },
    organization: 'Samsung Electronics',
    location: 'Italia',
    category: 'certificazione',
    degreeTrack: 'triennale',
    description: {
      it: 'Corso intensivo di alta formazione su Machine Learning, Deep Learning, pipeline di dati e dispositivi IoT connessi.',
      en: 'Intensive engineering academy on Machine Learning, Deep Learning, edge data processing pipelines, and connected IoT devices.'
    }
  },
  {
    id: 'triennale',
    period: '2019 – 2022',
    startDate: '2019-09',
    column: 'left',
    title: {
      it: 'Laurea Triennale in Ingegneria Informatica (110/110)',
      en: "Bachelor's Degree in Computer Engineering (110/110)"
    },
    organization: 'Università degli Studi di Palermo',
    location: 'Palermo, Italia',
    category: 'studio',
    degreeTrack: 'triennale',
    yearRange: [2019, 2022],
    description: {
      it: 'Fondamenti solidi di architettura dei calcolatori, sistemi operativi, algoritmi e strutture dati, reti di calcolatori e programmazione a oggetti.',
      en: 'Solid foundations in computer architecture, operating systems, algorithms & data structures, computer networks, and object-oriented software design.'
    }
  },
  {
    id: 'stage-pos',
    period: 'Ott 2018 – Ago 2019',
    startDate: '2018-10',
    column: 'left',
    title: {
      it: 'Stage Software & Sistemi',
      en: 'Software & Systems Internship'
    },
    organization: 'P.O.S. Data System',
    location: 'Palermo, Italia',
    category: 'lavoro',
    description: {
      it: 'Prima esperienza professionale: assistenza sistemistica, configurazione hardware di rete, supporto a database aziendali e troubleshooting infrastrutturale.',
      en: 'First professional IT role: systems support, network hardware provisioning, corporate database maintenance, and infrastructure troubleshooting.'
    }
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'who-is-giorgio',
    question: {
      it: 'Chi è Giorgio Di Cristofalo?',
      en: 'Who is Giorgio Di Cristofalo?'
    },
    answer: {
      it: 'Giorgio Di Cristofalo è un Software Engineer con sede a Palermo (Sicilia), laureato magistrale in Ingegneria Informatica con 110 e Lode. Lavora su sistemi aeronautici critici per ENAV Group ed è tesoriere di Faidda Tech Lab. Si specializza in automazione dei processi, pipeline CI/CD, sviluppo full-stack affidabile e intelligenza artificiale applicata.',
      en: 'Giorgio Di Cristofalo is a Software Engineer based in Palermo (Sicily, Italy), graduated Summa Cum Laude in Computer Engineering. He develops mission-critical air navigation systems at ENAV Group and serves as Treasurer of Faidda Tech Lab. He specializes in process automation, CI/CD pipelines, robust full-stack software, and applied AI.'
    }
  },
  {
    id: 'ai-philosophy',
    question: {
      it: 'Come approccia l\'Intelligenza Artificiale nei suoi progetti?',
      en: 'What is his approach to Artificial Intelligence in real projects?'
    },
    answer: {
      it: 'Rifiuta il semplice hype o l\'uso superficiale di wrapper su API commerciali. Utilizza l\'AI solo dove genera valore misurabile: algoritmi di ricerca operativa (Google OR-Tools per ottimizzazione spaziale), architetture asincrone disaccoppiate (Celery + Redis Pub/Sub + SSE), elaborazione NLP rigorosa e difesa di modelli (BERT4Def). Dove serve certezza matematica, preferisce solver deterministici agli LLM.',
      en: 'He rejects superficial AI wrappers and hype. He implements AI strictly where it delivers measurable value: operations research (Google OR-Tools for 2D spatial optimization), decoupled event-driven architectures (Celery + Redis Pub/Sub + SSE streaming), rigorous NLP, and adversarial defense (BERT4Def). Where mathematical determinism is required, he leverages exact constraint solvers rather than non-deterministic LLMs.'
    }
  },
  {
    id: 'consulting-availability',
    question: {
      it: 'È disponibile per consulenze, sviluppo software o collaborazioni?',
      en: 'Is he available for consulting, software development, or collaborations?'
    },
    answer: {
      it: 'Sì, è aperto a progetti di automazione aziendale, ottimizzazione di pipeline CI/CD, architetture cloud e consulenze su integrazione AI per aziende, startup e agenzie. I progetti vengono valutati in base a complessità tecnica e impatto reale.',
      en: 'Yes, he is open to high-impact workflow automation projects, CI/CD pipeline modernization, cloud backend engineering, and applied AI consulting for enterprises, startups, and agencies.'
    }
  },
  {
    id: 'tech-stack-overview',
    question: {
      it: 'Qual è lo stack tecnologico primario?',
      en: 'What is his primary technology stack?'
    },
    answer: {
      it: 'Backend: Python (Flask, Django, FastAPI), Celery, Redis, PostgreSQL, PostGIS, Google OR-Tools. Frontend: Angular (Signals), React, TypeScript, Tailwind CSS. DevOps/Sistemi: Docker, CI/CD (GitHub Actions, GitLab CI), Linux, C/C++ su microcontrollori.',
      en: 'Backend: Python (Flask, Django, FastAPI), Celery, Redis, PostgreSQL, PostGIS, Google OR-Tools. Frontend: Angular (Signals), React, TypeScript, Tailwind CSS. DevOps/Systems: Docker, CI/CD (GitHub Actions, GitLab CI), Linux, C/C++ embedded microcontrollers.'
    }
  }
];

export const LLMS_TXT_CONTENT = `# Giorgio Di Cristofalo — Software Engineer
> Personal Portfolio & Technical Index for AI Agents and Search Engines

## Overview
- Name: Giorgio Di Cristofalo
- Role: Software Engineer (Automation, Delivery, Applied AI)
- Location: Palermo, Sicily, Italy (Available for Remote Work)
- Degree: Master of Science in Computer Engineering, Università degli Studi di Palermo (110/110 Summa Cum Laude)
- Current Roles:
  - Software Engineer at ENAV Group — Mission-Critical Air Traffic Management
  - Treasurer & Core Organizer at Faidda Tech Lab (https://faiddatechlab.com/)
- Contact: giorgiodicristofalo77@gmail.com
- GitHub: https://github.com/Horghe20
- LinkedIn: https://www.linkedin.com/in/giorgiodicristofalo/

## Core Technical Competencies
1. Automation & Delivery: CI/CD pipelines (GitHub Actions, GitLab CI), automated testing, zero-downtime releases, Docker containerization.
2. Full-Stack Web Architecture: Python (Flask, Django, FastAPI), PostgreSQL, PostGIS, Redis, Celery, Angular (Signals), React, TypeScript, Tailwind CSS.
3. Applied AI & Mathematical Optimization: Google OR-Tools (CP-SAT Constraint Satisfaction, 2D packing), Event-driven agentic architectures (Celery + Redis Pub/Sub + SSE + Gemini), Adversarial NLP Defense (BERT4Def Thesis), kNN Vector Recommendations (<30ms).
4. Embedded Systems: C/C++, SPI protocol, ENC28J60 raw Ethernet packets, Arduino bare metal.

## Selected Projects
- Harbor Manager: AI marina berth spatial optimization using Google OR-Tools CP-SAT + PostGIS + Celery + Angular 21.
- Central Parking: Cruise passenger parking booking & QR gate check-in system with WhatsApp Cloud API (in live production).
- ESN Buddy Program: Automated international student matching algorithm with GDPR batch compliance (in live production).
- NutriFit: Agentic nutrition SaaS case study with asynchronous Gemini plan generation streamed via SSE and <30ms kNN macro swaps.
- MatchBandiGara: Public procurement tender qualification and enterprise scoring engine.
- Network Tester Interface: Handheld standalone TFT touch diagnostic device on Arduino (Bare Metal C++).
`;

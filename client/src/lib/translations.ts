import type { Language } from './i18n';

export type TranslationKey = keyof typeof translations.en;

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.properties': 'Properties',
    'nav.matching': 'Matching',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login',

    // Hero Section
    'hero.title': 'Find Your Perfect Coliving in Safety',
    'hero.subtitle': 'TrustNest verifies landlord and tenant identities, calculates compatibility with AI, and creates reliable coliving communities. Zero scams, maximum trust.',
    'hero.cta.start': 'Get Started',
    'hero.cta.learn': 'Learn More',

    // Features Section
    'features.title': 'Why Choose TrustNest?',
    'features.subtitle': 'A complete platform to find your ideal coliving with maximum security and compatibility',
    'features.verification.title': 'Complete Identity Verification',
    'features.verification.desc': 'Government ID, selfie with liveness detection, email and phone OTP verification. Binary trust badge for maximum transparency.',
    'features.matching.title': 'Advanced AI Matching',
    'features.matching.desc': 'Compatibility algorithm based on budget, schedule, cleanliness, lifestyle and pets. Match percentage with detailed explanation.',
    'features.properties.title': 'Verified Listings',
    'features.properties.desc': 'Properties published only by verified landlords. Detailed photos, description, filters by city, price and amenities.',
    'features.messaging.title': 'Real-time Messaging',
    'features.messaging.desc': 'Communicate directly with landlords and potential roommates. One-to-one conversations with complete history.',
    'features.search.title': 'Advanced Search',
    'features.search.desc': 'Filter by city, price, number of rooms, amenities. Sort by price or date. Find exactly what you\'re looking for.',
    'features.community.title': 'Trusted Community',
    'features.community.desc': 'Verified profiles, reviews and ratings. Build lasting relationships with compatible and reliable people.',

    // How It Works
    'howitworks.title': 'How It Works',
    'howitworks.step1.title': 'Sign Up',
    'howitworks.step1.desc': 'Create your profile with personal information and coliving preferences',
    'howitworks.step2.title': 'Verify Identity',
    'howitworks.step2.desc': 'Complete verifications to get the trust badge and unlock all features',
    'howitworks.step3.title': 'Find Matches',
    'howitworks.step3.desc': 'Discover compatible properties and roommates with our AI algorithm',
    'howitworks.step4.title': 'Connect',
    'howitworks.step4.desc': 'Message directly and arrange visits. Start your perfect coliving!',

    // Trust & Security
    'trust.title': 'Security and Trust',
    'trust.gdpr.title': 'GDPR Compliant',
    'trust.gdpr.desc': 'All documents are encrypted and securely stored according to GDPR regulations',
    'trust.verification.title': '4-Level Verification',
    'trust.verification.desc': 'Email, phone OTP, government ID and selfie with liveness detection for maximum security',
    'trust.fraud.title': 'Zero Scams',
    'trust.fraud.desc': 'Fraud detection algorithm and manual review of suspicious listings',

    // CTA Section
    'cta.title': 'Ready to Find Your Perfect Coliving?',
    'cta.subtitle': 'Join thousands of people who have found their ideal community on TrustNest',
    'cta.button': 'Get Started Free',

    // Footer
    'footer.tagline': 'The safest coliving platform in Europe',
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.copyright': '© 2026 TrustNest. All rights reserved.',

    // Language Selector
    'lang.select': 'Select Language',
  },

  it: {
    // Navigation
    'nav.properties': 'Proprietà',
    'nav.matching': 'Matching',
    'nav.messages': 'Messaggi',
    'nav.profile': 'Profilo',
    'nav.logout': 'Esci',
    'nav.login': 'Accedi',

    // Hero Section
    'hero.title': 'Trova il tuo coliving perfetto in sicurezza',
    'hero.subtitle': 'TrustNest verifica identità di landlord e tenant, calcola compatibilità con AI e crea comunità di coliving affidabili. Zero scam, massima fiducia.',
    'hero.cta.start': 'Inizia ora',
    'hero.cta.learn': 'Scopri di più',

    // Features Section
    'features.title': 'Perché scegliere TrustNest?',
    'features.subtitle': 'Una piattaforma completa per trovare il tuo coliving ideale con massima sicurezza e compatibilità',
    'features.verification.title': 'Verifica identità completa',
    'features.verification.desc': 'ID governativo, selfie con liveness detection, verifica email e telefono OTP. Trust badge binario per massima trasparenza.',
    'features.matching.title': 'Matching AI avanzato',
    'features.matching.desc': 'Algoritmo di compatibilità basato su budget, orari, pulizia, lifestyle e animali. Percentuale match con spiegazione dettagliata.',
    'features.properties.title': 'Annunci verificati',
    'features.properties.desc': 'Proprietà pubblicate solo da landlord verificati. Foto, descrizione dettagliata, filtri per città, prezzo e amenità.',
    'features.messaging.title': 'Messaggistica real-time',
    'features.messaging.desc': 'Comunica direttamente con landlord e potenziali roommate. Conversazioni one-to-one con cronologia completa.',
    'features.search.title': 'Ricerca avanzata',
    'features.search.desc': 'Filtra per città, prezzo, numero camere, amenità. Ordina per prezzo o data. Trova esattamente quello che cerchi.',
    'features.community.title': 'Comunità affidabile',
    'features.community.desc': 'Profili verificati, review e rating. Costruisci relazioni durature con persone compatibili e affidabili.',

    // How It Works
    'howitworks.title': 'Come funziona',
    'howitworks.step1.title': 'Registrati',
    'howitworks.step1.desc': 'Crea il tuo profilo con informazioni personali e preferenze di coliving',
    'howitworks.step2.title': 'Verifica identità',
    'howitworks.step2.desc': 'Completa le verifiche per ottenere il badge di fiducia e sbloccare tutte le funzioni',
    'howitworks.step3.title': 'Trova match',
    'howitworks.step3.desc': 'Scopri proprietà e roommate compatibili con il nostro algoritmo AI',
    'howitworks.step4.title': 'Connettiti',
    'howitworks.step4.desc': 'Messaggia direttamente e organizza visite. Inizia il tuo coliving perfetto!',

    // Trust & Security
    'trust.title': 'Sicurezza e fiducia',
    'trust.gdpr.title': 'GDPR Compliant',
    'trust.gdpr.desc': 'Tutti i documenti sono crittografati e archiviati in sicurezza secondo le normative GDPR',
    'trust.verification.title': 'Verifica a 4 livelli',
    'trust.verification.desc': 'Email, telefono OTP, ID governativo e selfie con liveness detection per massima sicurezza',
    'trust.fraud.title': 'Zero scam',
    'trust.fraud.desc': 'Algoritmo di rilevamento frodi e revisione manuale degli annunci sospetti',

    // CTA Section
    'cta.title': 'Pronto a trovare il tuo coliving perfetto?',
    'cta.subtitle': 'Unisciti a migliaia di persone che hanno trovato la loro comunità ideale su TrustNest',
    'cta.button': 'Inizia gratuitamente',

    // Footer
    'footer.tagline': 'La piattaforma di coliving più sicura d\'Europa',
    'footer.product': 'Prodotto',
    'footer.company': 'Azienda',
    'footer.legal': 'Legale',
    'footer.copyright': '© 2026 TrustNest. Tutti i diritti riservati.',

    // Language Selector
    'lang.select': 'Seleziona Lingua',
  },

  fr: {
    // Navigation
    'nav.properties': 'Propriétés',
    'nav.matching': 'Compatibilité',
    'nav.messages': 'Messages',
    'nav.profile': 'Profil',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',

    // Hero Section
    'hero.title': 'Trouvez votre colocation parfaite en sécurité',
    'hero.subtitle': 'TrustNest vérifie l\'identité des propriétaires et des locataires, calcule la compatibilité avec l\'IA et crée des communautés de colocation fiables. Zéro arnaque, confiance maximale.',
    'hero.cta.start': 'Commencer maintenant',
    'hero.cta.learn': 'En savoir plus',

    // Features Section
    'features.title': 'Pourquoi choisir TrustNest?',
    'features.subtitle': 'Une plateforme complète pour trouver votre colocation idéale avec sécurité et compatibilité maximales',
    'features.verification.title': 'Vérification d\'identité complète',
    'features.verification.desc': 'Pièce d\'identité gouvernementale, selfie avec détection de vivacité, vérification email et OTP téléphone. Badge de confiance binaire pour transparence maximale.',
    'features.matching.title': 'Compatibilité IA avancée',
    'features.matching.desc': 'Algorithme de compatibilité basé sur le budget, l\'horaire, la propreté, le mode de vie et les animaux. Pourcentage de compatibilité avec explication détaillée.',
    'features.properties.title': 'Annonces vérifiées',
    'features.properties.desc': 'Propriétés publiées uniquement par des propriétaires vérifiés. Photos détaillées, description, filtres par ville, prix et commodités.',
    'features.messaging.title': 'Messagerie en temps réel',
    'features.messaging.desc': 'Communiquez directement avec les propriétaires et les colocataires potentiels. Conversations un-à-un avec historique complet.',
    'features.search.title': 'Recherche avancée',
    'features.search.desc': 'Filtrez par ville, prix, nombre de chambres, commodités. Triez par prix ou date. Trouvez exactement ce que vous cherchez.',
    'features.community.title': 'Communauté fiable',
    'features.community.desc': 'Profils vérifiés, avis et évaluations. Construisez des relations durables avec des personnes compatibles et fiables.',

    // How It Works
    'howitworks.title': 'Comment ça marche',
    'howitworks.step1.title': 'Inscrivez-vous',
    'howitworks.step1.desc': 'Créez votre profil avec des informations personnelles et vos préférences de colocation',
    'howitworks.step2.title': 'Vérifiez votre identité',
    'howitworks.step2.desc': 'Complétez les vérifications pour obtenir le badge de confiance et déverrouiller toutes les fonctionnalités',
    'howitworks.step3.title': 'Trouvez des correspondances',
    'howitworks.step3.desc': 'Découvrez des propriétés et des colocataires compatibles avec notre algorithme IA',
    'howitworks.step4.title': 'Connectez-vous',
    'howitworks.step4.desc': 'Messagez directement et organisez des visites. Commencez votre colocation parfaite!',

    // Trust & Security
    'trust.title': 'Sécurité et confiance',
    'trust.gdpr.title': 'Conforme RGPD',
    'trust.gdpr.desc': 'Tous les documents sont chiffrés et stockés en toute sécurité conformément aux réglementations RGPD',
    'trust.verification.title': 'Vérification à 4 niveaux',
    'trust.verification.desc': 'Email, OTP téléphone, pièce d\'identité gouvernementale et selfie avec détection de vivacité pour sécurité maximale',
    'trust.fraud.title': 'Zéro arnaque',
    'trust.fraud.desc': 'Algorithme de détection des fraudes et examen manuel des annonces suspectes',

    // CTA Section
    'cta.title': 'Prêt à trouver votre colocation parfaite?',
    'cta.subtitle': 'Rejoignez des milliers de personnes qui ont trouvé leur communauté idéale sur TrustNest',
    'cta.button': 'Commencer gratuitement',

    // Footer
    'footer.tagline': 'La plateforme de colocation la plus sûre d\'Europe',
    'footer.product': 'Produit',
    'footer.company': 'Entreprise',
    'footer.legal': 'Légal',
    'footer.copyright': '© 2026 TrustNest. Tous droits réservés.',

    // Language Selector
    'lang.select': 'Sélectionner la langue',
  },

  de: {
    // Navigation
    'nav.properties': 'Immobilien',
    'nav.matching': 'Kompatibilität',
    'nav.messages': 'Nachrichten',
    'nav.profile': 'Profil',
    'nav.logout': 'Abmelden',
    'nav.login': 'Anmelden',

    // Hero Section
    'hero.title': 'Finden Sie Ihr perfektes Wohngemeinschafts-Zuhause sicher',
    'hero.subtitle': 'TrustNest verifiziert die Identität von Vermietern und Mietern, berechnet die Kompatibilität mit KI und schafft zuverlässige Wohngemeinschaften. Null Betrug, maximales Vertrauen.',
    'hero.cta.start': 'Jetzt starten',
    'hero.cta.learn': 'Mehr erfahren',

    // Features Section
    'features.title': 'Warum TrustNest wählen?',
    'features.subtitle': 'Eine vollständige Plattform, um Ihre ideale Wohngemeinschaft mit maximaler Sicherheit und Kompatibilität zu finden',
    'features.verification.title': 'Vollständige Identitätsverifizierung',
    'features.verification.desc': 'Behördlicher Ausweis, Selfie mit Lebensechtheits-Erkennung, Email- und Telefon-OTP-Verifizierung. Binäres Vertrauensabzeichen für maximale Transparenz.',
    'features.matching.title': 'Fortgeschrittene KI-Kompatibilität',
    'features.matching.desc': 'Kompatibilitätsalgorithmus basierend auf Budget, Zeitplan, Sauberkeit, Lebensstil und Haustieren. Kompatibilitätsprozentsatz mit detaillierter Erklärung.',
    'features.properties.title': 'Verifizierte Angebote',
    'features.properties.desc': 'Immobilien nur von verifizierten Vermietern veröffentlicht. Detaillierte Fotos, Beschreibung, Filter nach Stadt, Preis und Ausstattung.',
    'features.messaging.title': 'Echtzeit-Messaging',
    'features.messaging.desc': 'Kommunizieren Sie direkt mit Vermietern und potenziellen Mitbewohnern. Eins-zu-Eins-Gespräche mit vollständiger Historie.',
    'features.search.title': 'Erweiterte Suche',
    'features.search.desc': 'Filtern Sie nach Stadt, Preis, Anzahl der Zimmer, Ausstattung. Sortieren Sie nach Preis oder Datum. Finden Sie genau das, was Sie suchen.',
    'features.community.title': 'Vertrauenswürdige Gemeinschaft',
    'features.community.desc': 'Verifizierte Profile, Bewertungen und Ratings. Bauen Sie dauerhafte Beziehungen mit kompatiblen und zuverlässigen Menschen auf.',

    // How It Works
    'howitworks.title': 'Wie es funktioniert',
    'howitworks.step1.title': 'Registrieren Sie sich',
    'howitworks.step1.desc': 'Erstellen Sie Ihr Profil mit persönlichen Informationen und Wohngemeinschafts-Präferenzen',
    'howitworks.step2.title': 'Identität verifizieren',
    'howitworks.step2.desc': 'Schließen Sie Verifizierungen ab, um das Vertrauensabzeichen zu erhalten und alle Funktionen freizuschalten',
    'howitworks.step3.title': 'Finden Sie Matches',
    'howitworks.step3.desc': 'Entdecken Sie kompatible Immobilien und Mitbewohner mit unserem KI-Algorithmus',
    'howitworks.step4.title': 'Verbinden Sie sich',
    'howitworks.step4.desc': 'Schreiben Sie direkt und vereinbaren Sie Besichtigungen. Starten Sie Ihre perfekte Wohngemeinschaft!',

    // Trust & Security
    'trust.title': 'Sicherheit und Vertrauen',
    'trust.gdpr.title': 'DSGVO-konform',
    'trust.gdpr.desc': 'Alle Dokumente sind verschlüsselt und gemäß DSGVO-Bestimmungen sicher gespeichert',
    'trust.verification.title': '4-stufige Verifizierung',
    'trust.verification.desc': 'Email, Telefon-OTP, behördlicher Ausweis und Selfie mit Lebensechtheits-Erkennung für maximale Sicherheit',
    'trust.fraud.title': 'Null Betrug',
    'trust.fraud.desc': 'Betrugserkennung und manuelle Überprüfung verdächtiger Angebote',

    // CTA Section
    'cta.title': 'Bereit, Ihre perfekte Wohngemeinschaft zu finden?',
    'cta.subtitle': 'Schließen Sie sich Tausenden von Menschen an, die ihre ideale Gemeinschaft auf TrustNest gefunden haben',
    'cta.button': 'Kostenlos starten',

    // Footer
    'footer.tagline': 'Die sicherste Wohngemeinschafts-Plattform Europas',
    'footer.product': 'Produkt',
    'footer.company': 'Unternehmen',
    'footer.legal': 'Rechtliches',
    'footer.copyright': '© 2026 TrustNest. Alle Rechte vorbehalten.',

    // Language Selector
    'lang.select': 'Sprache wählen',
  },

  es: {
    // Navigation
    'nav.properties': 'Propiedades',
    'nav.matching': 'Compatibilidad',
    'nav.messages': 'Mensajes',
    'nav.profile': 'Perfil',
    'nav.logout': 'Cerrar sesión',
    'nav.login': 'Iniciar sesión',

    // Hero Section
    'hero.title': 'Encuentra tu coliving perfecto con seguridad',
    'hero.subtitle': 'TrustNest verifica la identidad de propietarios e inquilinos, calcula compatibilidad con IA y crea comunidades de coliving confiables. Cero estafas, máxima confianza.',
    'hero.cta.start': 'Comenzar ahora',
    'hero.cta.learn': 'Saber más',

    // Features Section
    'features.title': '¿Por qué elegir TrustNest?',
    'features.subtitle': 'Una plataforma completa para encontrar tu coliving ideal con máxima seguridad y compatibilidad',
    'features.verification.title': 'Verificación de identidad completa',
    'features.verification.desc': 'Identificación gubernamental, selfie con detección de vivacidad, verificación de email y OTP telefónico. Insignia de confianza binaria para máxima transparencia.',
    'features.matching.title': 'Compatibilidad IA avanzada',
    'features.matching.desc': 'Algoritmo de compatibilidad basado en presupuesto, horario, limpieza, estilo de vida y mascotas. Porcentaje de compatibilidad con explicación detallada.',
    'features.properties.title': 'Anuncios verificados',
    'features.properties.desc': 'Propiedades publicadas solo por propietarios verificados. Fotos detalladas, descripción, filtros por ciudad, precio y comodidades.',
    'features.messaging.title': 'Mensajería en tiempo real',
    'features.messaging.desc': 'Comunícate directamente con propietarios y posibles compañeros de cuarto. Conversaciones uno a uno con historial completo.',
    'features.search.title': 'Búsqueda avanzada',
    'features.search.desc': 'Filtra por ciudad, precio, número de habitaciones, comodidades. Ordena por precio o fecha. Encuentra exactamente lo que buscas.',
    'features.community.title': 'Comunidad confiable',
    'features.community.desc': 'Perfiles verificados, reseñas y calificaciones. Construye relaciones duraderas con personas compatibles y confiables.',

    // How It Works
    'howitworks.title': 'Cómo funciona',
    'howitworks.step1.title': 'Regístrate',
    'howitworks.step1.desc': 'Crea tu perfil con información personal y preferencias de coliving',
    'howitworks.step2.title': 'Verifica tu identidad',
    'howitworks.step2.desc': 'Completa las verificaciones para obtener la insignia de confianza y desbloquear todas las funciones',
    'howitworks.step3.title': 'Encuentra coincidencias',
    'howitworks.step3.desc': 'Descubre propiedades y compañeros compatibles con nuestro algoritmo IA',
    'howitworks.step4.title': 'Conéctate',
    'howitworks.step4.desc': 'Mensajea directamente y organiza visitas. ¡Comienza tu coliving perfecto!',

    // Trust & Security
    'trust.title': 'Seguridad y confianza',
    'trust.gdpr.title': 'Cumplimiento RGPD',
    'trust.gdpr.desc': 'Todos los documentos están encriptados y almacenados de forma segura según las regulaciones RGPD',
    'trust.verification.title': 'Verificación de 4 niveles',
    'trust.verification.desc': 'Email, OTP telefónico, identificación gubernamental y selfie con detección de vivacidad para máxima seguridad',
    'trust.fraud.title': 'Cero estafas',
    'trust.fraud.desc': 'Algoritmo de detección de fraude y revisión manual de anuncios sospechosos',

    // CTA Section
    'cta.title': '¿Listo para encontrar tu coliving perfecto?',
    'cta.subtitle': 'Únete a miles de personas que han encontrado su comunidad ideal en TrustNest',
    'cta.button': 'Comenzar gratis',

    // Footer
    'footer.tagline': 'La plataforma de coliving más segura de Europa',
    'footer.product': 'Producto',
    'footer.company': 'Empresa',
    'footer.legal': 'Legal',
    'footer.copyright': '© 2026 TrustNest. Todos los derechos reservados.',

    // Language Selector
    'lang.select': 'Seleccionar idioma',
  },

  sv: {
    // Navigation
    'nav.properties': 'Fastigheter',
    'nav.matching': 'Matchning',
    'nav.messages': 'Meddelanden',
    'nav.profile': 'Profil',
    'nav.logout': 'Logga ut',
    'nav.login': 'Logga in',

    // Hero Section
    'hero.title': 'Hitta ditt perfekta samboende säkert',
    'hero.subtitle': 'TrustNest verifierar identiteten för hyresvärdar och hyresgäster, beräknar kompatibilitet med AI och skapar tillförlitliga samboendekommuner. Noll bedrägerier, maximal tillit.',
    'hero.cta.start': 'Börja nu',
    'hero.cta.learn': 'Läs mer',

    // Features Section
    'features.title': 'Varför välja TrustNest?',
    'features.subtitle': 'En komplett plattform för att hitta ditt ideala samboende med maximal säkerhet och kompatibilitet',
    'features.verification.title': 'Fullständig identitetsverifiering',
    'features.verification.desc': 'Regeringsutfärdat ID, selfie med livlighetdetektering, email- och telefonverifiering via OTP. Binär förtroendemärke för maximal transparens.',
    'features.matching.title': 'Avancerad AI-matchning',
    'features.matching.desc': 'Kompatibilitetsalgoritm baserad på budget, schema, renlighet, livsstil och husdjur. Matchningsprocent med detaljerad förklaring.',
    'features.properties.title': 'Verifierade annonser',
    'features.properties.desc': 'Fastigheter publicerade endast av verifierade hyresvärdar. Detaljerade foton, beskrivning, filter efter stad, pris och bekvämligheter.',
    'features.messaging.title': 'Realtidsmeddelanden',
    'features.messaging.desc': 'Kommunicera direkt med hyresvärdar och potentiella samboende. En-till-en-samtal med fullständig historik.',
    'features.search.title': 'Avancerad sökning',
    'features.search.desc': 'Filtrera efter stad, pris, antal rum, bekvämligheter. Sortera efter pris eller datum. Hitta exakt vad du letar efter.',
    'features.community.title': 'Pålitlig gemenskap',
    'features.community.desc': 'Verifierade profiler, recensioner och betyg. Bygg varaktiga relationer med kompatibla och pålitliga människor.',

    // How It Works
    'howitworks.title': 'Hur det fungerar',
    'howitworks.step1.title': 'Registrera dig',
    'howitworks.step1.desc': 'Skapa din profil med personlig information och samboendepreferenser',
    'howitworks.step2.title': 'Verifiera din identitet',
    'howitworks.step2.desc': 'Slutför verifieringar för att få förtroendemärket och låsa upp alla funktioner',
    'howitworks.step3.title': 'Hitta matchningar',
    'howitworks.step3.desc': 'Upptäck kompatibla fastigheter och samboende med vår AI-algoritm',
    'howitworks.step4.title': 'Anslut',
    'howitworks.step4.desc': 'Skicka meddelanden direkt och boka besök. Starta ditt perfekta samboende!',

    // Trust & Security
    'trust.title': 'Säkerhet och tillit',
    'trust.gdpr.title': 'GDPR-kompatibel',
    'trust.gdpr.desc': 'Alla dokument är krypterade och lagras säkert enligt GDPR-reglerna',
    'trust.verification.title': '4-stegs verifiering',
    'trust.verification.desc': 'Email, telefon-OTP, regeringsutfärdat ID och selfie med livlighetdetektering för maximal säkerhet',
    'trust.fraud.title': 'Noll bedrägerier',
    'trust.fraud.desc': 'Bedrägeridetektering och manuell granskning av misstänkta annonser',

    // CTA Section
    'cta.title': 'Redo att hitta ditt perfekta samboende?',
    'cta.subtitle': 'Gå med tusentals människor som har hittat sin ideala gemenskap på TrustNest',
    'cta.button': 'Börja gratis',

    // Footer
    'footer.tagline': 'Europas säkraste samboendeplattform',
    'footer.product': 'Produkt',
    'footer.company': 'Företag',
    'footer.legal': 'Juridik',
    'footer.copyright': '© 2026 TrustNest. Alla rättigheter förbehållna.',

    // Language Selector
    'lang.select': 'Välj språk',
  },

  pt: {
    // Navigation
    'nav.properties': 'Propriedades',
    'nav.matching': 'Compatibilidade',
    'nav.messages': 'Mensagens',
    'nav.profile': 'Perfil',
    'nav.logout': 'Sair',
    'nav.login': 'Entrar',

    // Hero Section
    'hero.title': 'Encontre seu coliving perfeito com segurança',
    'hero.subtitle': 'TrustNest verifica a identidade de proprietários e inquilinos, calcula compatibilidade com IA e cria comunidades de coliving confiáveis. Zero fraudes, máxima confiança.',
    'hero.cta.start': 'Começar agora',
    'hero.cta.learn': 'Saiba mais',

    // Features Section
    'features.title': 'Por que escolher TrustNest?',
    'features.subtitle': 'Uma plataforma completa para encontrar seu coliving ideal com máxima segurança e compatibilidade',
    'features.verification.title': 'Verificação de identidade completa',
    'features.verification.desc': 'Identificação governamental, selfie com detecção de vivacidade, verificação de email e OTP telefônico. Crachá de confiança binário para máxima transparência.',
    'features.matching.title': 'Compatibilidade IA avançada',
    'features.matching.desc': 'Algoritmo de compatibilidade baseado em orçamento, horário, limpeza, estilo de vida e animais de estimação. Percentual de compatibilidade com explicação detalhada.',
    'features.properties.title': 'Anúncios verificados',
    'features.properties.desc': 'Propriedades publicadas apenas por proprietários verificados. Fotos detalhadas, descrição, filtros por cidade, preço e comodidades.',
    'features.messaging.title': 'Mensagens em tempo real',
    'features.messaging.desc': 'Comunique-se diretamente com proprietários e possíveis colegas de quarto. Conversas um-a-um com histórico completo.',
    'features.search.title': 'Busca avançada',
    'features.search.desc': 'Filtre por cidade, preço, número de quartos, comodidades. Ordene por preço ou data. Encontre exatamente o que procura.',
    'features.community.title': 'Comunidade confiável',
    'features.community.desc': 'Perfis verificados, avaliações e classificações. Construa relacionamentos duradouros com pessoas compatíveis e confiáveis.',

    // How It Works
    'howitworks.title': 'Como funciona',
    'howitworks.step1.title': 'Registre-se',
    'howitworks.step1.desc': 'Crie seu perfil com informações pessoais e preferências de coliving',
    'howitworks.step2.title': 'Verifique sua identidade',
    'howitworks.step2.desc': 'Complete as verificações para obter o crachá de confiança e desbloquear todos os recursos',
    'howitworks.step3.title': 'Encontre correspondências',
    'howitworks.step3.desc': 'Descubra propriedades e colegas compatíveis com nosso algoritmo IA',
    'howitworks.step4.title': 'Conecte-se',
    'howitworks.step4.desc': 'Envie mensagens diretas e agende visitas. Comece seu coliving perfeito!',

    // Trust & Security
    'trust.title': 'Segurança e confiança',
    'trust.gdpr.title': 'Compatível com LGPD',
    'trust.gdpr.desc': 'Todos os documentos são criptografados e armazenados com segurança de acordo com os regulamentos de proteção de dados',
    'trust.verification.title': 'Verificação de 4 níveis',
    'trust.verification.desc': 'Email, OTP telefônico, identificação governamental e selfie com detecção de vivacidade para máxima segurança',
    'trust.fraud.title': 'Zero fraudes',
    'trust.fraud.desc': 'Detecção de fraude e revisão manual de anúncios suspeitos',

    // CTA Section
    'cta.title': 'Pronto para encontrar seu coliving perfeito?',
    'cta.subtitle': 'Junte-se a milhares de pessoas que encontraram sua comunidade ideal no TrustNest',
    'cta.button': 'Começar gratuitamente',

    // Footer
    'footer.tagline': 'A plataforma de coliving mais segura da Europa',
    'footer.product': 'Produto',
    'footer.company': 'Empresa',
    'footer.legal': 'Legal',
    'footer.copyright': '© 2026 TrustNest. Todos os direitos reservados.',

    // Language Selector
    'lang.select': 'Selecionar idioma',
  },

  nl: {
    // Navigation
    'nav.properties': 'Woningen',
    'nav.matching': 'Compatibiliteit',
    'nav.messages': 'Berichten',
    'nav.profile': 'Profiel',
    'nav.logout': 'Afmelden',
    'nav.login': 'Aanmelden',

    // Hero Section
    'hero.title': 'Vind je perfecte samenwoning veilig',
    'hero.subtitle': 'TrustNest verifieert de identiteit van verhuurders en huurders, berekent compatibiliteit met AI en creëert betrouwbare samenwoning-gemeenschappen. Nul fraude, maximaal vertrouwen.',
    'hero.cta.start': 'Nu starten',
    'hero.cta.learn': 'Meer informatie',

    // Features Section
    'features.title': 'Waarom TrustNest kiezen?',
    'features.subtitle': 'Een compleet platform om je ideale samenwoning te vinden met maximale veiligheid en compatibiliteit',
    'features.verification.title': 'Volledige identiteitsverificatie',
    'features.verification.desc': 'Overheids-ID, selfie met liveness-detectie, email- en telefoon-OTP-verificatie. Binair vertrouwensbadge voor maximale transparantie.',
    'features.matching.title': 'Geavanceerde AI-compatibiliteit',
    'features.matching.desc': 'Compatibiliteitsalgoritme gebaseerd op budget, schema, netheid, levensstijl en huisdieren. Compatibiliteitspercentage met gedetailleerde uitleg.',
    'features.properties.title': 'Geverifieerde advertenties',
    'features.properties.desc': 'Woningen gepubliceerd alleen door geverifieerde verhuurders. Gedetailleerde foto\'s, beschrijving, filters op stad, prijs en voorzieningen.',
    'features.messaging.title': 'Realtime-berichten',
    'features.messaging.desc': 'Communiceer rechtstreeks met verhuurders en mogelijke huisgenoten. Een-op-een-gesprekken met volledige geschiedenis.',
    'features.search.title': 'Geavanceerd zoeken',
    'features.search.desc': 'Filter op stad, prijs, aantal kamers, voorzieningen. Sorteer op prijs of datum. Vind precies wat je zoekt.',
    'features.community.title': 'Betrouwbare gemeenschap',
    'features.community.desc': 'Geverifieerde profielen, beoordelingen en ratings. Bouw duurzame relaties op met compatibele en betrouwbare mensen.',

    // How It Works
    'howitworks.title': 'Hoe het werkt',
    'howitworks.step1.title': 'Registreer je',
    'howitworks.step1.desc': 'Maak je profiel aan met persoonlijke informatie en samenwoning-voorkeuren',
    'howitworks.step2.title': 'Verifieer je identiteit',
    'howitworks.step2.desc': 'Voltooi verificaties om het vertrouwensbadge te krijgen en alle functies te ontgrendelen',
    'howitworks.step3.title': 'Vind matches',
    'howitworks.step3.desc': 'Ontdek compatibele woningen en huisgenoten met ons AI-algoritme',
    'howitworks.step4.title': 'Maak verbinding',
    'howitworks.step4.desc': 'Stuur berichten en plan bezoeken. Start je perfecte samenwoning!',

    // Trust & Security
    'trust.title': 'Veiligheid en vertrouwen',
    'trust.gdpr.title': 'GDPR-compliant',
    'trust.gdpr.desc': 'Alle documenten zijn versleuteld en veilig opgeslagen volgens GDPR-regelgeving',
    'trust.verification.title': '4-staps verificatie',
    'trust.verification.desc': 'Email, telefoon-OTP, overheids-ID en selfie met liveness-detectie voor maximale veiligheid',
    'trust.fraud.title': 'Nul fraude',
    'trust.fraud.desc': 'Fraudedetectie en handmatige controle van verdachte advertenties',

    // CTA Section
    'cta.title': 'Klaar om je perfecte samenwoning te vinden?',
    'cta.subtitle': 'Sluit je aan bij duizenden mensen die hun ideale gemeenschap op TrustNest hebben gevonden',
    'cta.button': 'Gratis starten',

    // Footer
    'footer.tagline': 'Het veiligste samenwoning-platform in Europa',
    'footer.product': 'Product',
    'footer.company': 'Bedrijf',
    'footer.legal': 'Juridisch',
    'footer.copyright': '© 2026 TrustNest. Alle rechten voorbehouden.',

    // Language Selector
    'lang.select': 'Taal selecteren',
  },
};

export const t = (key: TranslationKey, lang: Language): string => {
  return translations[lang][key] || translations.en[key] || key;
};

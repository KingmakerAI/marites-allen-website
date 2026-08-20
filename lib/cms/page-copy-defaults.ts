import type { PageCopy } from "./page-copy-types";

export function mergePageCopy(raw?: Partial<PageCopy> | null): PageCopy {
  const d = DEFAULT_PAGE_COPY;
  if (!raw) return structuredClone(d);
  return {
    about: { ...d.about, ...raw.about, sections: raw.about?.sections || d.about.sections },
    destara: { ...d.destara, ...raw.destara, features: raw.destara?.features || d.destara.features, facts: raw.destara?.facts || d.destara.facts },
    frigga: {
      ...d.frigga,
      ...raw.frigga,
      shops: raw.frigga?.shops || d.frigga.shops,
      collections: raw.frigga?.collections || d.frigga.collections,
      guidePerks: raw.frigga?.guidePerks || d.frigga.guidePerks,
      marketplaces: raw.frigga?.marketplaces || d.frigga.marketplaces
    },
    projects: { ...d.projects, ...raw.projects, items: raw.projects?.items || d.projects.items },
    forecast: {
      ...d.forecast,
      ...raw.forecast,
      navYears: raw.forecast?.navYears || d.forecast.navYears,
      years: raw.forecast?.years || d.forecast.years,
      zodiacs: raw.forecast?.zodiacs || d.forecast.zodiacs,
      stars: raw.forecast?.stars || d.forecast.stars
    },
    home: {
      ...d.home,
      ...raw.home,
      speakingClients: raw.home?.speakingClients || d.home.speakingClients,
      destaraBenefits: raw.home?.destaraBenefits || d.home.destaraBenefits,
      friggaBrowse: raw.home?.friggaBrowse || d.home.friggaBrowse,
      friggaRegions: raw.home?.friggaRegions || d.home.friggaRegions,
      pressNames: raw.home?.pressNames || d.home.pressNames,
      guarantees: raw.home?.guarantees || d.home.guarantees
    },
    book: { ...d.book, ...(raw.book || {}) },
    eventsPage: {
      ...d.eventsPage,
      ...(raw.eventsPage || {}),
      speakingLines: raw.eventsPage?.speakingLines || d.eventsPage.speakingLines,
      videos: raw.eventsPage?.videos || d.eventsPage.videos
    },
    mediaPage: {
      ...d.mediaPage,
      ...(raw.mediaPage || {}),
      videos: raw.mediaPage?.videos || d.mediaPage.videos
    }
  };
}

export const DEFAULT_PAGE_COPY: PageCopy = {
  about: {
    seoTitle: "About Marites Allen",
    seoDescription:
      "Meet Marites Allen, the Feng Shui Queen — first Filipina Master in Feng Shui, author, speaker, and consultant to families and leaders in 100+ countries.",
    kicker: "Marites Allen",
    title: "Marites Allen",
    intro:
      "Marites Allen, widely known as the Feng Shui Queen, is a Filipina Feng Shui master, author and consultant. In 2013 she became the first Filipina awarded the title of Master in Feng Shui by the International Feng Shui Association. Over more than three decades of practice, she has advised individuals, families, and organizations across more than 100 countries, and is based between Manila, Philippines, and London, United Kingdom.",
    sections: [
      {
        heading: "Early life and education",
        paragraphs: [
          "Allen's interest in Chinese metaphysics and Feng Shui developed over years of independent study and travel, including exposure to teachings connected to His Holiness the Dalai Lama. She holds an MBA from the Ateneo Graduate School of Business, pairing a formal business education with her metaphysical practice."
        ]
      },
      {
        heading: "Career",
        paragraphs: [
          "Allen built her practice around personal Destiny Readings (BaZi astrology), home and office Feng Shui audits, and business consultations on timing and strategy. Her clients have included business leaders, celebrities and public figures, drawn by her approach that blends traditional Chinese metaphysics with practical, real-world guidance.",
          "She is a frequent media commentator on Chinese astrology and the annual Chinese New Year forecast, appearing regularly on Philippine television and in international press. She also hosts Marites Allen Live, a recurring broadcast segment sharing Feng Shui guidance and yearly forecasts.",
          "In 2026, Allen extended her practice into technology with the launch of Destara, an AI-powered Destiny Guide trained on her three decades of Feng Shui knowledge, offering guidance to a global audience in over 50 languages."
        ]
      },
      {
        heading: "Philosophy",
        paragraphs: [
          'Allen is known for demystifying Feng Shui for a broad, non-Chinese audience. As she frequently states, "You don\'t have to be Chinese, it\'s all about energy," emphasizing that Feng Shui is "not a religion, not magic, and never a superstition," but a practical framework for aligning one\'s environment and timing with one\'s goals.'
        ]
      }
    ],
    recognitionHeading: "Recognition",
    recognition: [
      "First Filipina awarded the title of Master in Feng Shui by the International Feng Shui Association (2013)",
      "Regularly featured in Forbes, Tatler Asia, Manila Bulletin, Manila Times, Philippine Star, and the Daily Tribune",
      "Television appearances discussing annual Chinese astrology forecasts",
      "Author of published works on Chinese astrology"
    ],
    bibliographyHeading: "Bibliography",
    bibliography: ["Chinese Astrology: Decode the Zodiac"],
    seeAlsoHeading: "See also",
    seeAlso: [
      { label: "Brands & projects Marites Allen has worked with", href: "/projects" },
      { label: "Speaking engagements & events", href: "/events" },
      { label: "2026 Chinese New Year forecast", href: "/forecast" },
      { label: "Destara, the AI Destiny Guide", href: "/destara" },
      { label: "Media coverage & press kit", href: "/media" }
    ],
    infobox: [
      { label: "Occupation", value: "Feng Shui master, author, consultant" },
      { label: "Known for", value: "First Filipina Master in Feng Shui (IFSA, 2013); annual CNY forecasts" },
      { label: "Years active", value: "30+ years" },
      { label: "Based in", value: "Manila, Philippines & London, UK" },
      { label: "Education", value: "MBA, Ateneo Graduate School of Business" },
      { label: "Notable work", value: "Chinese Astrology: Decode the Zodiac" },
      { label: "App", value: "Destara (2026)" }
    ],
    imageUrl: "/images/zip/marites-1.webp",
    imageAlt: "Marites Allen",
    ctaTitle: "Work with Marites Allen",
    ctaBody: "Book a personal, home/office, or business consultation directly online.",
    ctaLabel: "Book Consultation",
    ctaHref: "/book"
  },
  destara: {
    seoTitle: "Destara AI — Destiny Guide",
    seoDescription:
      "Destara is Marites Allen's AI Destiny Guide — daily Feng Shui guidance, personal forecasts, and practical tips trained on 30 years of expertise. Free to try at destara.app.",
    kicker: "Destara (application)",
    title: "Destara",
    intro:
      "Destara is an AI-powered Destiny Guide created with Feng Shui master Marites Allen. Launched in 2026 for the Year of the Fire Horse, it draws on more than thirty years of her practice to offer personal guidance rooted in Chinese astrology and Feng Shui.",
    overviewHeading: "Overview",
    overview:
      "Destara makes Marites Allen's guidance available between formal consultations. It is not a generic chatbot. The app is built around Feng Shui and Chinese astrology, so the advice stays grounded in an established practice instead of open-ended speculation.",
    featuresHeading: "Features",
    features: [
      "Personalized BaZi and zodiac-based readings",
      "Real-time auspicious date suggestions",
      "Tailored Feng Shui cures and recommendations",
      "Available day and night in more than 50 languages"
    ],
    caption: "Destara home screen with your daily forecast",
    availabilityHeading: "Availability",
    availability: "Use Destara on the web at destara.app. It is also available on iOS and Android.",
    complementHeading: "How it complements consultations",
    complement:
      "Destara supports Marites Allen's practice; it does not replace it. Use the app for everyday guidance, then book a one-on-one session for deeper work such as home audits or major business decisions.",
    appUrl: "https://destara.app",
    ctaLabel: "Open Destara.app →",
    facts: [
      { label: "Developer", value: "Marites Allen" },
      { label: "Platforms", value: "Web, iOS, Android" },
      { label: "Launch", value: "2026" },
      { label: "Languages", value: "50+" }
    ]
  },
  frigga: {
    seoTitle: "Frigga Charmed Life",
    seoDescription:
      "Shop Marites Allen's Frigga Charmed Life — Feng Shui charms, amulets, planners, almanacs and lucky fashion across the Philippines, UK, and USA stores.",
    kicker: "The brand",
    title: "Frigga Charmed Life",
    body: "Marites Allen's own line of Feng Shui charms, amulets, planners and almanacs, designed so the guidance from a consultation can travel with you every day. Each piece is created around authentic Feng Shui principles rather than decoration alone.",
    shopUrl: "https://www.frigga.com.ph",
    shopLabel: "Shop Frigga →",
    browseLabel: "Browse collections",
    regionsHeading: "Shop by region",
    shops: [
      { flag: "🇵🇭", label: "frigga.com.ph", url: "https://www.frigga.com.ph" },
      { flag: "🇬🇧", label: "frigga.co.uk", url: "https://www.frigga.co.uk" },
      { flag: "🇺🇸", label: "frigga-usa.com", url: "https://www.frigga-usa.com" }
    ],
    collectionsLabel: "Collections",
    collectionsHeading: "Charms for every intention",
    collectionsBody: "Each collection targets a specific area of luck, chosen to match your chart and the year's energies.",
    collections: [
      { id: "wealth", title: "Wealth Amulets", desc: "Coins, ingots and wealth deities to activate abundance." },
      { id: "love", title: "Love & Harmony", desc: "Peach Blossom charms and pairs for relationships." },
      { id: "health", title: "Health & Longevity", desc: "Wu Lou, Medicine Buddha and metal cures." },
      { id: "career", title: "Career & Success", desc: "Mystic knots and dragon motifs for advancement." },
      { id: "protection", title: "Protection", desc: "Shields, rhino and elephant charms to deflect harm." },
      { id: "travel", title: "Travel & Mentors", desc: "Amulets to attract helpful people and safe passage." },
      { id: "jewellery", title: "Charmed Jewellery", desc: "Bracelets, rings and pendants worn daily." },
      { id: "home", title: "Home & Décor", desc: "Scarves, wraps and pieces that dress your space." }
    ],
    guideKicker: "Annual guides",
    guideTitle: "The Feng Shui Planner & Almanac",
    guideBody:
      "Published every year ahead of the Lunar New Year, the Planner and Almanac carry the full forecast, auspicious dates, and month-by-month guidance so you can plan the year with intention.",
    guidePerks: [
      "The full annual forecast for all 12 signs",
      "Auspicious dates for major decisions",
      "Month-by-month Flying Star guidance",
      "Recommended cures and enhancers"
    ],
    guideCta: "SHOP NOW →",
    marketplacesHeading: "Also available on",
    marketplacesBody: "Find Frigga Charmed Life on your preferred marketplace.",
    marketplaces: ["Shopee · Frigga Charmed Life", "Lazada · Frigga Charmed Life"]
  },
  projects: {
    seoTitle: "Brands & collaborations",
    seoDescription: "A selection of brands, organizations and figures Marites Allen has consulted for and collaborated with.",
    kicker: "Projects",
    title: "Brands & collaborations",
    body: "A selection of the brands, organizations and figures Marites Allen has consulted for and collaborated with over three decades. Click any entry to read more.",
    items: [
      {
        id: "sm",
        category: "Retail",
        name: "SM Supermalls",
        summary: "Feng Shui consultation for major retail spaces and openings.",
        body1:
          "Marites Allen has consulted with SM Supermalls, one of the largest mall operators in the Philippines, on Feng Shui considerations for retail spaces, including layout energy flow and auspicious timing around openings and renovations.",
        body2:
          "Her work with large retail operators reflects a broader theme in her practice: applying traditional Feng Shui principles to commercial spaces where foot traffic, prosperity and customer experience are closely linked."
      },
      {
        id: "bench",
        category: "Fashion & Retail",
        name: "Bench",
        summary: "Long-standing Feng Shui guidance for one of the Philippines' leading clothing brands.",
        body1:
          "Bench founder Ben Chan has credited Feng Shui guidance from Marites Allen as part of the thinking behind the brand's growth, alongside decades of hard work building the company into a leading Philippine fashion retailer.",
        body2:
          "The relationship illustrates how Feng Shui consultation is often woven into long-term business relationships rather than one-off engagements, informing decisions over years rather than a single project."
      },
      {
        id: "manilahouse",
        category: "Hospitality",
        name: "Manila House Private Club",
        summary: "Venue for Marites Allen's annual Chinese New Year countdown and rituals.",
        body1:
          "Manila House Private Club in BGC, Taguig, hosts Marites Allen's annual Chinese New Year Countdown and Welcoming Ritual, where she shares her forecast for the incoming zodiac year with members and guests.",
        body2:
          "The venue also serves as the location for her in-person consultations, offering clients a private, members-only setting for one-on-one sessions."
      },
      {
        id: "marcopolo",
        category: "Hospitality",
        name: "Marco Polo Hotels",
        summary: "Speaking engagements and media conferences on annual Feng Shui forecasts.",
        body1:
          "Marites Allen has held media conferences and speaking engagements at Marco Polo Hotels properties, sharing her annual predictions and Feng Shui insights with press and guests ahead of the Lunar New Year.",
        body2:
          "These events are typically timed around the Chinese New Year season, combining her forecast presentations with hospitality partners seeking to mark the occasion for their guests and clients."
      },
      {
        id: "belo",
        category: "Wellness & Beauty",
        name: "Belo Essentials",
        summary: "Feng Shui guidance sought before opening new locations.",
        body1:
          "Belo Essentials CEO Cristalle Belo-Pitt has sought Marites Allen's Feng Shui guidance before opening new Belo Essentials locations, reflecting a broader practice among Philippine business leaders of consulting on auspicious timing and placement ahead of major openings.",
        body2:
          "This type of engagement, a pre-launch consultation, is one of the most common ways Marites Allen works with growing consumer brands."
      },
      {
        id: "unilab",
        category: "Corporate",
        name: "Unilab",
        summary: "Corporate speaking engagement on Feng Shui and business timing.",
        body1:
          "Marites Allen has been engaged by Unilab, one of the largest pharmaceutical companies in the Philippines, for corporate talks on Feng Shui principles as they relate to business strategy and organizational energy.",
        body2:
          "Corporate engagements of this kind typically combine an educational talk with guidance tailored to the company's specific goals for the year ahead."
      },
      {
        id: "citibank",
        category: "Finance",
        name: "Citibank",
        summary: "Speaking engagement for a financial institution audience.",
        body1:
          "Marites Allen has spoken to audiences at Citibank on Chinese astrology and Feng Shui as they relate to prosperity, timing and decision-making in a business context.",
        body2:
          "Financial institutions have been a recurring client category for her corporate speaking engagements, often around the Lunar New Year period."
      },
      {
        id: "hsbc",
        category: "Finance",
        name: "HSBC",
        summary: "Speaking engagement for a financial institution audience.",
        body1:
          "Marites Allen has presented Feng Shui and Chinese astrology insights to HSBC audiences, sharing forecasts relevant to business planning and personal decision-making for the year ahead.",
        body2: "These sessions are typically delivered as part of client-appreciation or new-year events hosted by the bank."
      },
      {
        id: "accenture",
        category: "Corporate",
        name: "Accenture",
        summary: "Corporate talk on Feng Shui principles and workplace energy.",
        body1:
          "Marites Allen has been engaged by Accenture for corporate talks exploring Feng Shui principles in relation to workplace environment and organizational energy.",
        body2:
          "Talks like this are often positioned as an engaging, culturally resonant addition to corporate wellness or new-year programming."
      },
      {
        id: "robinsons",
        category: "Retail",
        name: "Robinsons Malls",
        summary: "Feng Shui consultation and events for a major mall operator.",
        body1:
          "Robinsons Malls has engaged Marites Allen for Feng Shui-related consultations and public events, including forecast-sharing sessions timed around the Lunar New Year.",
        body2:
          "As with other mall partnerships, the focus is often on auspicious timing for promotions, openings and seasonal activations."
      },
      {
        id: "nestle",
        category: "Consumer Goods",
        name: "Nestlé",
        summary: "Corporate engagement on Feng Shui and prosperity themes.",
        body1:
          "Marites Allen has been engaged by Nestlé for corporate sessions on Feng Shui and prosperity themes, tailored to the company's audience and calendar.",
        body2:
          "Consumer goods companies frequently engage her around the New Year season, when interest in forecasts and prosperity guidance is highest."
      },
      {
        id: "mcdo",
        category: "Consumer Goods",
        name: "McDonald's Philippines",
        summary: "Corporate speaking engagement on Feng Shui themes.",
        body1:
          "Marites Allen has spoken at McDonald's Philippines corporate events, sharing Feng Shui and Chinese astrology insights relevant to the company's audience.",
        body2:
          "Her ability to make traditional Feng Shui concepts accessible to a broad, modern corporate audience is a recurring theme across these engagements."
      }
    ]
  },
  forecast: {
    seoTitle: "Chinese New Year forecast",
    seoDescription: "Marites Allen's Chinese New Year forecast, Flying Stars, and guidance for all 12 zodiac signs.",
    defaultYear: "2026",
    navYears: [
      { year: "2027", label: "2027 · Year of the Fire Sheep" },
      { year: "2026", label: "2026 · Year of the Fire Horse" },
      { year: "2025", label: "2025 · Year of the Wood Snake" },
      { year: "2024", label: "2024 · Year of the Wood Dragon" }
    ],
    years: [
      {
        year: "2027",
        animal: "Sheep",
        label: "Year of the Fire Sheep",
        element: "Fire (Yin)",
        cny: "February 6, 2027",
        intro:
          "In the Year of the Fire Sheep, the pace softens and attention turns inward. After the momentum of the Fire Horse, 2027 rewards consolidation, care and creative work. With expert guidance from Marites Allen, discover how to protect what you have built and grow it gently.",
        lead: "Chinese New Year 2027 begins on February 6, 2027, ushering in the Year of the Fire Sheep.",
        body1:
          "The Sheep brings gentleness, artistry and diplomacy. Where 2026 rewarded speed and visibility, 2027 favours refinement: nurturing relationships, consolidating gains, and tending to health and home.",
        body2:
          "Fire keeps warmth and passion in play, but channelled through the Sheep it becomes creative rather than competitive. A strong year for the arts, hospitality, care work and anything built on trust."
      },
      {
        year: "2026",
        animal: "Horse",
        label: "Year of the Fire Horse",
        element: "Fire (Yang)",
        cny: "February 4, 2026",
        intro:
          "In the Year of the Fire Horse, harness the energy of renewal, wisdom, and growth. With expert guidance from Marites Allen, the leading Feng Shui consultant, discover how to elevate your health, wealth, love, and career through powerful Feng Shui practices. Embrace the year ahead with confidence and balance. Marites Allen is here to help you transform your life.",
        lead: "Chinese New Year 2026 begins on February 4, 2026, ushering in the Year of the Fire Horse.",
        body1:
          "The year of the Fire Horse is characterized by speed, dynamism, and charisma. Where 2025 favored deep planning and strategy, 2026 rewards action, visibility, and movement. It is a time for individuals and organizations to launch projects, expand their influence, and showcase talents on bigger stages.",
        body2:
          "Fire is expressive and passionate; the Horse is associated with freedom, travel, and ambition. Together they favor launches, career moves, and public-facing ventures, tempered by a need to manage impulsiveness and pace yourself through a fast-moving year."
      },
      {
        year: "2025",
        animal: "Snake",
        label: "Year of the Wood Snake",
        element: "Wood (Yin)",
        cny: "January 29, 2025",
        intro:
          "The Year of the Wood Snake rewarded patience, strategy and quiet growth. Marites Allen's guidance for 2025 focused on deep planning, laying foundations that would pay off in the faster years to follow.",
        lead: "Chinese New Year 2025 began on January 29, 2025, ushering in the Year of the Wood Snake.",
        body1:
          "The Wood Snake favoured wisdom, discretion and long-range thinking. It was a year for study, restructuring and careful positioning rather than bold public moves.",
        body2:
          "Wood brought growth and flexibility to the Snake's strategic nature, making it ideal for research, education, and building relationships that would mature later."
      },
      {
        year: "2024",
        animal: "Dragon",
        label: "Year of the Wood Dragon",
        element: "Wood (Yang)",
        cny: "February 10, 2024",
        intro:
          "The Year of the Wood Dragon brought ambition, expansion and bold vision. Marites Allen's 2024 guidance centred on scaling up and stepping into greater authority.",
        lead: "Chinese New Year 2024 began on February 10, 2024, ushering in the Year of the Wood Dragon.",
        body1:
          "The Dragon is the most auspicious sign in the zodiac, associated with power, prestige and transformation. 2024 favoured big launches, leadership moves and long-held ambitions.",
        body2:
          "Wood added growth and vitality, making it a year of visible expansion: new ventures, new titles and new territory for those prepared to claim it."
      }
    ],
    zodiacs: [
      {
        id: "rat",
        sign: "Rat",
        years: "1936 · 1948 · 1960 · 1972 · 1984 · 1996 · 2008 · 2020",
        text: "Flexibility and steady effort open new doors this year. Fast-moving opportunities favor those who adapt quickly rather than wait for perfect conditions.",
        focus: "Stay nimble; say yes to well-timed opportunities rather than holding out for certainty."
      },
      {
        id: "ox",
        sign: "Ox",
        years: "1937 · 1949 · 1961 · 1973 · 1985 · 1997 · 2009 · 2021",
        text: "Peach Blossom energy favors relationships and social connections. A good year to widen your network and let others see your reliability.",
        focus: "Invest in relationships and visibility, and let your consistency be noticed."
      },
      {
        id: "tiger",
        sign: "Tiger",
        years: "1938 · 1950 · 1962 · 1974 · 1986 · 1998 · 2010 · 2022",
        text: "Bold, well-timed moves are rewarded. The Fire Horse energy amplifies your natural courage, so channel it into one focused goal rather than several.",
        focus: "Pick one ambitious goal and commit fully instead of splitting your energy."
      },
      {
        id: "rabbit",
        sign: "Rabbit",
        years: "1939 · 1951 · 1963 · 1975 · 1987 · 1999 · 2011 · 2023",
        text: "A year to nurture harmony at home and protect your energy from the year's fast pace. Prioritize rest alongside ambition.",
        focus: "Guard your peace; strengthen the home before chasing outward growth."
      },
      {
        id: "dragon",
        sign: "Dragon",
        years: "1940 · 1952 · 1964 · 1976 · 1988 · 2000 · 2012 · 2024",
        text: "Long-term growth and rising influence are supported. Visibility increases, so use it deliberately rather than reactively.",
        focus: "Build durable influence; choose which stages you step onto."
      },
      {
        id: "snake",
        sign: "Snake",
        years: "1941 · 1953 · 1965 · 1977 · 1989 · 2001 · 2013 · 2025",
        text: "Quietly favorable. Wise, patient planning now compounds into lasting rewards later in the year.",
        focus: "Plan carefully early; let results accumulate rather than forcing them."
      },
      {
        id: "horse",
        sign: "Horse",
        years: "1942 · 1954 · 1966 · 1978 · 1990 · 2002 · 2014 · 2026",
        text: "Your year of visibility and momentum. Big moves are favored, but pace yourself, because the Fire Horse year burns bright and fast.",
        focus: "Move decisively, then rest deliberately. Avoid burnout in your own year."
      },
      {
        id: "sheep",
        sign: "Sheep",
        years: "1943 · 1955 · 1967 · 1979 · 1991 · 2003 · 2015",
        text: "Prosperity flows when you enhance your lucky sectors and stay disciplined with resources amid a fast-moving year.",
        focus: "Mind your resources; steady discipline beats impulsive spending."
      },
      {
        id: "monkey",
        sign: "Monkey",
        years: "1944 · 1956 · 1968 · 1980 · 1992 · 2004 · 2016",
        text: "Opportunity is abundant this year; timing and placement make the difference between a good idea and a good outcome.",
        focus: "Time your moves well, because execution matters more than ideas this year."
      },
      {
        id: "rooster",
        sign: "Rooster",
        years: "1945 · 1957 · 1969 · 1981 · 1993 · 2005 · 2017",
        text: "Romance and connection are highlighted. Align your space and schedule to make room for people, not just projects.",
        focus: "Make space for relationships alongside your ambitions."
      },
      {
        id: "dog",
        sign: "Dog",
        years: "1946 · 1958 · 1970 · 1982 · 1994 · 2006 · 2018",
        text: "Guard against friction and lean into peace-and-harmony practices, because the Horse year's pace can strain relationships if unchecked.",
        focus: "Choose harmony over being right; ease tension before it escalates."
      },
      {
        id: "boar",
        sign: "Boar",
        years: "1947 · 1959 · 1971 · 1983 · 1995 · 2007 · 2019",
        text: "A year to consolidate luck and build steady, protected abundance, even as the year's energy encourages faster action around you.",
        focus: "Consolidate and protect what you have while others rush ahead."
      }
    ],
    stars: [
      {
        title: "1 Victory (Center)",
        text: "New beginnings, career progress, and wisdom. Activate with water features or blue/black colors. Everyone in the family can take advantage of this good luck."
      },
      {
        title: "2 Illness (Northwest)",
        text: "Illness and low energy. Suppress with metal cures, Wu Lou, and Medicine Buddha charms. Dog and Boar personalities are afflicted."
      },
      {
        title: "3 Arguments (West)",
        text: "Arguments and legal disputes. Balance with red colors, fire elements, and Peace charms. Rooster-born could be short fused, be more patient and considerate to avoid misunderstanding and legal issues."
      },
      {
        title: "4 Romance & Travel (Northeast)",
        text: "Romance, creativity, study and travel luck. Enhance with water elements and Peach Blossom charms. Favorable for Ox and Tiger personalities."
      },
      {
        title: "5 Misfortune (South)",
        text: "The most troublesome star, bringing obstacles and loss. Suppress with metal cures and Five Element Pagoda. Horse-born should take extra care this year."
      },
      {
        title: "6 Windfall (North)",
        text: "Heaven luck, authority and unexpected gains. Activate with metal and gold elements. Favorable for Rat personalities."
      },
      {
        title: "7 Robbery & Violence (Southwest)",
        text: "Theft, betrayal and violence. Neutralize with water elements, Blue Rhino and Elephant charms. Sheep and Monkey personalities should be cautious."
      },
      {
        title: "8 Wealth (East)",
        text: "The most auspicious wealth star. Activate with earth and crystal elements, Wealth Deities and money charms. Rabbit personalities benefit most."
      },
      {
        title: "9 Prosperity (Southeast)",
        text: "Future prosperity, celebration and multiplication of luck. Enhance with fire elements and bright lights. Favorable for Dragon and Snake personalities."
      }
    ]
  },
  home: {
    aboutKicker: "Meet Marites Allen",
    aboutHeading: "The name the world trusts for Feng Shui",
    aboutBody:
      "Dubbed the Real Feng Shui Queen, Marites Allen is the first Filipina Master in Feng Shui, guiding business leaders, celebrities and families for over three decades from Manila to London.",
    aboutCta: "Read her full story →",
    aboutImageUrl: "/images/zip/marites-2.webp",
    speakingLabel: "Corporate clients & speaking engagements",
    speakingClients: [
      "Accenture",
      "Citibank",
      "HSBC",
      "McDonald's",
      "Nestlé",
      "SM",
      "Robinsons",
      "Unilab",
      "Bench",
      "Marco Polo"
    ],
    destaraBenefits: [
      { title: "Trained on 30 years of expertise", desc: "Answers grounded in Marites Allen's practice, not generic AI." },
      { title: "Daily Feng Shui guidance", desc: "Know what the day favors for luck, timing and decisions." },
      { title: "Practical tips you can use", desc: "Clear recommendations for home, career, love and wealth." },
      { title: "Personal forecast tools", desc: "Explore your sign, directions and yearly themes anytime." }
    ],
    pressLabel: "As featured in",
    pressBadge: "Forbes · Tatler · ANC",
    pressNames: ["Forbes", "Tatler", "Manila Bulletin", "Manila Times", "ANC"],
    destaraBadge1: "New",
    destaraBadge2: "Beta testing now",
    destaraHeading: "The future of Feng Shui, in your pocket",
    destaraBody:
      "Destara is an AI Destiny Guide trained on 30 years of Marites Allen's Feng Shui expertise. It's free to use, with no email and no sign-up. Just open it and ask.",
    destaraCta: "Try Destara free →",
    destaraMore: "Learn more",
    destaraUrl: "https://destara.app",
    servicesKicker: "Consultations",
    servicesHeading: "Guidance for every turning point",
    servicesBody:
      "Every session is one-on-one with Marites, online or in person. Each one includes a personalized analysis, a written action plan, and a follow-up window.",
    bespokeKicker: "For estates, family offices & business leaders",
    bespokeHeading: "Bespoke Advisory, scoped around what you need",
    bespokeCta: "Enquire privately →",
    comingKicker: "Coming soon",
    comingHeading: "Online booking is on the way",
    comingBody:
      "Private consultations with Marites Allen will open for booking here shortly. Enquire anytime while we finish the experience.",
    comingCta: "View Coming Soon →",
    guarantees: ["Free reschedule up to 48h", "Instant confirmation", "SSL-secured booking", "One-on-one with Marites"],
    friggaHeading: "Frigga Charmed Life",
    friggaBody: "Wearable Feng Shui charms for love, health, wealth and career.",
    friggaCta: "Shop Frigga",
    friggaBrowse: [
      { label: "Love", url: "https://www.frigga.com.ph" },
      { label: "Health", url: "https://www.frigga.com.ph" },
      { label: "Wealth", url: "https://www.frigga.com.ph" },
      { label: "Career", url: "https://www.frigga.com.ph" },
      { label: "Shop your sign", url: "https://www.frigga.com.ph" },
      { label: "Books & planners", url: "https://www.frigga.com.ph" }
    ],
    friggaRegions: [
      { region: "Philippines & Asia", domain: "frigga.com.ph", url: "https://www.frigga.com.ph" },
      { region: "US & Canada", domain: "frigga-usa.com", url: "https://www.frigga-usa.com" },
      { region: "Europe & UK", domain: "frigga.co.uk", url: "https://www.frigga.co.uk" }
    ]
  },
  book: {
    seoTitle: "Book a Consultation",
    seoDescription:
      "Enquire about a private Feng Shui consultation with Marites Allen. Online booking is being prepared.",
    kicker: "Coming soon",
    title: "Book Consultation",
    intro: "Online booking is being prepared. Send an enquiry with what you need, and the team will follow up.",
    formTitle: "Consultation enquiry",
    formBody: "Tell us who you are and what you're looking for. The team will use this to follow up.",
    submitLabel: "Send enquiry",
    successTitle: "Enquiry received",
    successBody: "We'll review what you're looking for and follow up by email. WhatsApp remains available if you need help sooner.",
    preferTalkHeading: "Prefer to talk now?",
    whatsappLabel: "WhatsApp enquire →"
  },
  eventsPage: {
    seoTitle: "Events & Speaking",
    seoDescription:
      "Upcoming Marites Allen events — live sessions, exclusive gatherings, and corporate speaking engagements.",
    kicker: "Upcoming & featured",
    title: "Events with Marites Allen",
    intro: "Live sessions and private gatherings for Ghost Month preparation, cleansing, and guidance.",
    speakingHeading: "Speaking engagements & corporate talks",
    speakingLines: [
      "Manila House Private Club|Annual CNY Countdown & Welcoming Ritual",
      "Marco Polo Hotels|Media conference & annual forecast",
      "Citibank|Client event on prosperity and timing",
      "HSBC|Client event on the annual forecast",
      "Accenture|Corporate talk on workplace Feng Shui",
      "Unilab|Corporate talk on business timing",
      "Nestlé|Corporate session on prosperity themes",
      "McDonald's Philippines|Corporate talk on Feng Shui themes"
    ],
    videosHeading: "Videos & presentations",
    videos: [
      "Boy Abunda · The Interviewer|Marites Allen, Philippine Feng Shui Queen|mswSQ7Utz1s",
      "Media Conference · Marco Polo|Why 2018 is a Prosperous Year|4RPYGf1oY_4",
      "NewsWatch Interviews|Feng Shui Expert on the Year of the Wooden Snake|r27QpjNfhfk",
      "ABS-CBN · The Bottomline|Predictions for Each Chinese Zodiac Sign|xfLMTQCr3og"
    ]
  },
  mediaPage: {
    seoTitle: "Media & Press",
    seoDescription:
      "Press coverage, TV interviews, and media features featuring Marites Allen — Forbes, Tatler, ANC, ABS-CBN, Manila Bulletin, and more.",
    kicker: "Press coverage",
    title: "Media & Press",
    intro: "Press coverage, interviews, and features with Marites Allen — newest first.",
    pressKitTitle: "Download the free press kit",
    pressKitBody: "Register your details and we'll email you the full kit.",
    videosHeading: "Television & video",
    videos: [
      "Boy Abunda · The Interviewer|Marites Allen, Philippine Feng Shui Queen (Live Replay)|mswSQ7Utz1s|Jan 2023|334K views",
      "NewsWatch Interviews|Feng Shui Expert Marites Allen on the Year of the Wooden Snake|r27QpjNfhfk|Jan 2025|TV",
      "ABS-CBN · The Bottomline|Predictions for Each Chinese Zodiac Sign|xfLMTQCr3og|2020|TV",
      "Media Conference · Marco Polo|Why 2018 is a Prosperous Year|4RPYGf1oY_4|2017|International",
      "Marites Allen|Journey to Feng Shui|kfPKazF19jw|2021|Feature",
      "Boy Abunda · The Interviewer|Marites Allen, Philippine Feng Shui Queen|60M_0OOtfHU|Jan 2023|TV"
    ]
  }
};

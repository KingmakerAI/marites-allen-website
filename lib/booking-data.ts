export const BOOK_PRODUCTS = [
  {
    id: "fullreading",
    letter: "A",
    title: "Personalised Destiny Reading 2026",
    desc: "A comprehensive BaZi report covering career, wealth, health and relationships.",
    duration: "Full report"
  },
  {
    id: "navguide",
    letter: "B",
    title: "Destiny Navigation Guide 2026",
    desc: "A 12-month personal roadmap based on your BaZi chart.",
    duration: "Delivered guide",
    popular: true
  },
  {
    id: "consult30",
    letter: "C",
    title: "30-Minute Destiny Consultation 2026",
    desc: "Verbal, one-on-one guidance with no written report.",
    duration: "30 min"
  }
];

export const BOOK_MODES = [
  {
    id: "personal",
    title: "Personal Life & Destiny",
    desc: "Career, wealth, relationships and life direction.",
    recommended: true
  },
  {
    id: "property",
    title: "Home or Property",
    desc: "Residential Feng Shui, moving, renovating or buying.",
    recommended: false
  },
  {
    id: "business",
    title: "Business or Commercial",
    desc: "Office, premises, launch timing and business luck.",
    recommended: false
  },
  {
    id: "occasion",
    title: "Special Occasion",
    desc: "Wedding, baby, auspicious dates or other milestones.",
    recommended: false
  }
];

export const BOOK_CATEGORIES = [
  "1. Personal Destiny and Relationships",
  "2. Residential Feng Shui and Property",
  "3. Business, Commercial and Corporate",
  "4. Architecture and Development Advisory",
  "5. Auspicious Date Selection",
  "6. Speaking, Training and Special Engagements"
];

export type BookService = {
  id: string;
  cat: number;
  title: string;
  shortDesc: string;
  idealFor: string;
  cta: string;
  flags: { birth?: boolean; property?: boolean; company?: boolean; event?: boolean };
};

export const BOOK_SERVICES: BookService[] = [
  {
    id: "s1",
    cat: 0,
    title: "Personal Destiny Reading (BaZi / Four Pillars)",
    shortDesc:
      "A personalised Chinese destiny analysis revealing strengths, life patterns, career and wealth potential, relationship tendencies and favourable timing.",
    idealFor: "Individuals seeking clearer direction in career, business, wealth, relationships or the year ahead.",
    cta: "Request a Destiny Consultation",
    flags: { birth: true }
  },
  {
    id: "s2",
    cat: 0,
    title: "Relationship and Family Compatibility",
    shortDesc:
      "A comparison of two or more destiny charts to understand compatibility, communication styles and possible pressure points.",
    idealFor: "Couples, engaged partners, parents and children, siblings and blended families.",
    cta: "Request a Compatibility Reading",
    flags: { birth: true }
  },
  {
    id: "s3",
    cat: 0,
    title: "Baby Birth Date and Auspicious Name Selection",
    shortDesc:
      "A traditional date and name consultation for medically planned deliveries, based only on doctor-approved dates.",
    idealFor: "Expectant parents with a medically approved delivery window.",
    cta: "Request a Baby Date and Name Consultation",
    flags: { birth: true, event: true }
  },
  {
    id: "s4",
    cat: 1,
    title: "Full Residential Feng Shui Audit",
    shortDesc: "A complete Feng Shui assessment of the home, its occupants and surrounding environment.",
    idealFor: "Homeowners, families and households preparing for a major new chapter.",
    cta: "Request a Residential Feng Shui Audit",
    flags: { birth: true, property: true }
  },
  {
    id: "s5",
    cat: 1,
    title: "Home or Residential Property Selection",
    shortDesc: "A pre-purchase or pre-lease Feng Shui review to compare homes and identify the most supportive property.",
    idealFor: "Buyers, tenants, relocating families and residential investors.",
    cta: "Request a Property Selection Review",
    flags: { birth: true, property: true }
  },
  {
    id: "s6",
    cat: 1,
    title: "Floor Plan, Renovation and Interior Design Integration",
    shortDesc: "Feng Shui guidance for planning, renovating or styling a home alongside your design team.",
    idealFor: "Homeowners building or renovating; architects and interior designers.",
    cta: "Request a Feng Shui Design Review",
    flags: { birth: true, property: true }
  },
  {
    id: "s7",
    cat: 1,
    title: "Residential Reassessment and Annual Update",
    shortDesc: "A follow-up review after renovations, household changes or the new annual Flying Star energies.",
    idealFor: "Existing clients and households requesting an annual Feng Shui update.",
    cta: "Request a Residential Reassessment",
    flags: { property: true }
  },
  {
    id: "s8",
    cat: 2,
    title: "Commercial or Corporate Feng Shui Audit",
    shortDesc:
      "A comprehensive assessment of business premises to support operations, leadership and commercial opportunity.",
    idealFor: "Corporations, family businesses, retail, hospitality and growing companies.",
    cta: "Request a Commercial Feng Shui Audit",
    flags: { birth: true, property: true, company: true }
  },
  {
    id: "s9",
    cat: 2,
    title: "Executive Office and Leadership Feng Shui",
    shortDesc:
      "A focused consultation aligning the executive's directions, office layout and visual authority with leadership goals.",
    idealFor: "Founders, CEOs, chairpersons and senior executives.",
    cta: "Request an Executive Office Consultation",
    flags: { birth: true, property: true, company: true }
  },
  {
    id: "s10",
    cat: 2,
    title: "Business Premises Selection and Launch Package",
    shortDesc:
      "A coordinated service for selecting premises and preparing space, leadership and timing for a confident opening.",
    idealFor: "Entrepreneurs, start-ups, franchisees and expanding companies.",
    cta: "Request a Business Launch Consultation",
    flags: { birth: true, property: true, company: true, event: true }
  },
  {
    id: "s11",
    cat: 2,
    title: "Corporate Team and Leadership Compatibility",
    shortDesc: "A destiny-based review of key people to identify complementary strengths and leadership styles.",
    idealFor: "Executive teams, business partners, boards and succession planning.",
    cta: "Request a Corporate Compatibility Review",
    flags: { birth: true, company: true }
  },
  {
    id: "s12",
    cat: 3,
    title: "Pre-Construction and Architectural Plan Review",
    shortDesc:
      "Early-stage Feng Shui guidance for site orientation, building placement and room zoning before decisions are fixed.",
    idealFor: "Homeowners, architects, builders and developers planning new construction.",
    cta: "Request an Architectural Feng Shui Review",
    flags: { birth: true, property: true, company: true }
  },
  {
    id: "s13",
    cat: 3,
    title: "Land, Master Planning and Development Consultation",
    shortDesc: "A strategic assessment for land and large developments covering landform, access, gates and landscape.",
    idealFor: "Property developers, landowners, investors and large private estates.",
    cta: "Request a Development Feng Shui Consultation",
    flags: { birth: true, property: true, company: true }
  },
  {
    id: "s14",
    cat: 4,
    title: "Personal and Business Auspicious Date Selection",
    shortDesc: "Selection of a favourable date and time for important personal, property or business activities.",
    idealFor: "Individuals, business owners and organisations planning an important beginning.",
    cta: "Request an Auspicious Date",
    flags: { birth: true, event: true }
  },
  {
    id: "s15",
    cat: 4,
    title: "Wedding Date Selection",
    shortDesc: "A detailed comparison of wedding dates using the birth details of the couple.",
    idealFor: "Engaged couples and families planning a wedding.",
    cta: "Request a Wedding Date Consultation",
    flags: { birth: true, event: true, property: true }
  },
  {
    id: "s16",
    cat: 4,
    title: "Burial, Interment and Ash Urn Geomancy",
    shortDesc: "Traditional Yin House Feng Shui guidance for burial sites, interment timing and ash urn placement.",
    idealFor: "Families arranging a burial, memorial placement or transfer of remains.",
    cta: "Request a Yin House Consultation",
    flags: { property: true, event: true }
  },
  {
    id: "s17",
    cat: 5,
    title: "Keynote Talks and Corporate Forecast Presentations",
    shortDesc: "Engaging, customised presentations on Feng Shui, annual forecasts and Chinese astrology.",
    idealFor: "Corporations, conferences, banks, business associations and public events.",
    cta: "Invite Marites Allen to Speak",
    flags: { company: true, event: true }
  },
  {
    id: "s18",
    cat: 5,
    title: "Workshops, Masterclasses and Private Mentoring",
    shortDesc: "Practical learning experiences from introductory Feng Shui to advanced Chinese Metaphysics.",
    idealFor: "Corporate teams, private groups, aspiring practitioners and VIP learners.",
    cta: "Request a Workshop or Masterclass",
    flags: { company: true, event: true }
  },
  {
    id: "s19",
    cat: 5,
    title: "Media, Brand and Cultural Collaborations",
    shortDesc:
      "Expert participation and bespoke collaboration for media, documentaries, campaigns and brand experiences.",
    idealFor: "Media companies, publishers, luxury brands and cultural organisations.",
    cta: "Discuss a Media or Brand Collaboration",
    flags: { company: true, event: true }
  }
];

export const ARRANGEMENT_OPTS = ["On-site visit", "Virtual consultation", "Written review", "International travel"];

export const EXP_SERVICES = [
  {
    id: "personal",
    title: "Personal Destiny Reading",
    priceNum: 250,
    tagline: "BaZi chart, zodiac & yearly guidance"
  },
  {
    id: "home",
    title: "Home / Office Feng Shui",
    priceNum: 500,
    tagline: "Full space audit with action plan"
  },
  {
    id: "business",
    title: "Business Strategy",
    priceNum: 1000,
    tagline: "Timing, premises & growth advice"
  }
];

export const EXP_MODES = [
  { id: "video", title: "Video Call", mult: 1 },
  { id: "phone", title: "Phone Call", mult: 1 },
  { id: "inperson", title: "In Person", mult: 1.3 }
];

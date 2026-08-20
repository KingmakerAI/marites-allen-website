export type CopyLink = { label: string; href: string };
export type CopyFact = { label: string; value: string };
export type CopyCard = { title: string; desc: string };

export type AboutCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  recognitionHeading: string;
  recognition: string[];
  bibliographyHeading: string;
  bibliography: string[];
  seeAlsoHeading: string;
  seeAlso: CopyLink[];
  infobox: CopyFact[];
  imageUrl: string;
  imageAlt: string;
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
};

export type DestaraCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  intro: string;
  overviewHeading: string;
  overview: string;
  featuresHeading: string;
  features: string[];
  caption: string;
  availabilityHeading: string;
  availability: string;
  complementHeading: string;
  complement: string;
  appUrl: string;
  ctaLabel: string;
  facts: CopyFact[];
};

export type FriggaCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  body: string;
  shopUrl: string;
  shopLabel: string;
  browseLabel: string;
  regionsHeading: string;
  shops: Array<{ flag: string; label: string; url: string }>;
  collectionsLabel: string;
  collectionsHeading: string;
  collectionsBody: string;
  collections: Array<{ id: string; title: string; desc: string }>;
  guideKicker: string;
  guideTitle: string;
  guideBody: string;
  guidePerks: string[];
  guideCta: string;
  marketplacesHeading: string;
  marketplacesBody: string;
  marketplaces: string[];
};

export type ProjectItem = {
  id: string;
  category: string;
  name: string;
  summary: string;
  body1: string;
  body2: string;
};

export type ProjectsCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  body: string;
  items: ProjectItem[];
};

export type ForecastYear = {
  year: string;
  animal: string;
  label: string;
  element: string;
  cny: string;
  intro: string;
  lead: string;
  body1: string;
  body2: string;
};

export type ForecastZodiac = {
  id: string;
  sign: string;
  years: string;
  text: string;
  focus: string;
};

export type ForecastCopy = {
  seoTitle: string;
  seoDescription: string;
  defaultYear: string;
  navYears: Array<{ year: string; label: string }>;
  years: ForecastYear[];
  zodiacs: ForecastZodiac[];
  stars: Array<{ title: string; text: string }>;
};

export type HomeExtrasCopy = {
  aboutKicker: string;
  aboutHeading: string;
  aboutBody: string;
  aboutCta: string;
  aboutImageUrl: string;
  speakingLabel: string;
  speakingClients: string[];
  pressLabel: string;
  pressBadge: string;
  pressNames: string[];
  destaraBadge1: string;
  destaraBadge2: string;
  destaraHeading: string;
  destaraBody: string;
  destaraCta: string;
  destaraMore: string;
  destaraUrl: string;
  destaraBenefits: CopyCard[];
  servicesKicker: string;
  servicesHeading: string;
  servicesBody: string;
  bespokeKicker: string;
  bespokeHeading: string;
  bespokeCta: string;
  comingKicker: string;
  comingHeading: string;
  comingBody: string;
  comingCta: string;
  guarantees: string[];
  friggaHeading: string;
  friggaBody: string;
  friggaCta: string;
  friggaBrowse: Array<{ label: string; href?: string; url?: string }>;
  friggaRegions: Array<{ region: string; domain: string; url: string }>;
};

export type BookCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  intro: string;
  formTitle: string;
  formBody: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  preferTalkHeading: string;
  whatsappLabel: string;
};

export type EventsPageCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  intro: string;
  speakingHeading: string;
  speakingLines: string[];
  videosHeading: string;
  videos: string[];
};

export type MediaPageCopy = {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  intro: string;
  pressKitTitle: string;
  pressKitBody: string;
  videosHeading: string;
  videos: string[];
};

export type PageCopy = {
  about: AboutCopy;
  destara: DestaraCopy;
  frigga: FriggaCopy;
  projects: ProjectsCopy;
  forecast: ForecastCopy;
  home: HomeExtrasCopy;
  book: BookCopy;
  eventsPage: EventsPageCopy;
  mediaPage: MediaPageCopy;
};

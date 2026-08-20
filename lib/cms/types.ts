export type ContentStatus = "draft" | "published" | "archived";
export type AdminRole = "owner" | "editor";
export type NavLocation = "header" | "footer";

export type PageBlock =
  | { type: "hero"; heading: string; subheading?: string; ctaLabel?: string; ctaHref?: string; imageUrl?: string }
  | { type: "heading"; text: string }
  | { type: "richText"; html: string }
  | { type: "image"; src: string; alt: string }
  | { type: "cta"; label: string; href: string; note?: string }
  | { type: "faq"; items: Array<{ q: string; a: string }> }
  | { type: "articleGrid"; limit?: number }
  | { type: "consultationCta"; heading?: string; body?: string }
  | { type: "spacer" };

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastLoginAt: string | null;
};

export type PasswordReset = {
  tokenHash: string;
  expiresAt: string;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: string;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  blocks: PageBlock[];
  status: ContentStatus;
  seoTitle: string;
  seoDescription: string;
  ogImageId: string | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  featuredImageId: string | null;
  author: string;
  categoryId: string | null;
  tags: string[];
  outlet: string;
  externalUrl: string;
  ctaLabel: string;
  year: number;
  month: number;
  status: ContentStatus;
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

export type ArticleCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type MediaAsset = {
  id: string;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string;
  createdAt: string;
};

export type ConsultationService = {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  description: string;
  idealFor: string;
  duration: string;
  ctaText: string;
  bookingUrl: string;
  flags: { birth?: boolean; property?: boolean; company?: boolean; event?: boolean };
  imageId: string | null;
  active: boolean;
  featured: boolean;
  sortOrder: number;
};

export type PricingRow = {
  id: string;
  serviceId: string;
  price: number;
  currency: string;
  promoPrice: number | null;
  note: string;
  active: boolean;
  sortOrder: number;
};

export type CmsEvent = {
  id: string;
  title: string;
  slug: string;
  eyebrow: string;
  summary: string;
  whenLabel: string;
  whereLabel: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  liveUrl: string;
  ctaHref: string;
  ctaLabel: string;
  imageUrl: string;
  tagline: string;
  status: ContentStatus;
  sortOrder: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  initial: string;
  featured: boolean;
  sortOrder: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  showOnHome: boolean;
  sortOrder: number;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  external: boolean;
  parentId: string | null;
  enabled: boolean;
  sortOrder: number;
  location: NavLocation;
};

export type SocialProfile = {
  id: string;
  label: string;
  handle: string;
  href: string;
};

export type SiteSettings = {
  general: { siteName: string; tagline: string; logoUrl: string };
  contact: {
    email: string;
    emailSecondary: string;
    phone: string;
    phoneSecondary: string;
    whatsapp: string;
  };
  social: SocialProfile[];
  friggaSocial: SocialProfile[];
  seoDefaults: { title: string; description: string; ogImage: string };
  business: { bookingUrl: string; currency: string; comingSoonLabel: string; bookCtaLabel: string };
};

export type HomeSection = {
  id: string;
  blockType: string;
  payload: Record<string, unknown>;
  enabled: boolean;
  sortOrder: number;
};

export type AuditLog = {
  id: string;
  userId: string;
  entity: string;
  entityId: string;
  action: string;
  timestamp: string;
};

export type SignupKind = "booking-waitlist" | "destiny-chart" | "press-kit" | "speaking" | "newsletter";
export type SignupStatus = "new" | "contacted" | "archived";

export type Signup = {
  id: string;
  kind: SignupKind;
  email: string;
  name: string;
  phone: string;
  organization: string;
  notes: string;
  source: string;
  fields: Record<string, string>;
  status: SignupStatus;
  createdAt: string;
};

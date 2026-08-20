import { z } from "zod";

export const statusSchema = z.enum(["draft", "published", "archived"]);
export const roleSchema = z.enum(["owner", "editor"]);

export const pageBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    heading: z.string().min(1).max(160),
    subheading: z.string().max(400).optional(),
    ctaLabel: z.string().max(80).optional(),
    ctaHref: z.string().max(300).optional(),
    imageUrl: z.string().max(400).optional()
  }),
  z.object({ type: z.literal("heading"), text: z.string().min(1).max(160) }),
  z.object({ type: z.literal("richText"), html: z.string().max(20000) }),
  z.object({ type: z.literal("image"), src: z.string().min(1).max(400), alt: z.string().max(160) }),
  z.object({
    type: z.literal("cta"),
    label: z.string().min(1).max(80),
    href: z.string().min(1).max(300),
    note: z.string().max(200).optional()
  }),
  z.object({
    type: z.literal("faq"),
    items: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).max(20)
  }),
  z.object({ type: z.literal("articleGrid"), limit: z.number().int().min(1).max(24).optional() }),
  z.object({
    type: z.literal("consultationCta"),
    heading: z.string().max(160).optional(),
    body: z.string().max(400).optional()
  }),
  z.object({ type: z.literal("spacer") })
]);

export const pageInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(160),
  blocks: z.array(pageBlockSchema).max(40),
  status: statusSchema,
  seoTitle: z.string().max(70).optional().default(""),
  seoDescription: z.string().max(180).optional().default(""),
  ogImageId: z.string().nullable().optional()
});

export const articleInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(400).optional().default(""),
  body: z.string().max(20000).optional().default(""),
  featuredImageId: z.string().nullable().optional(),
  author: z.string().max(80).optional().default("Marites Allen"),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string().max(40)).max(12).optional().default([]),
  outlet: z.string().max(120).optional().default(""),
  externalUrl: z.string().max(500).optional().default(""),
  ctaLabel: z.string().max(40).optional().default("Read article"),
  year: z.number().int().min(1990).max(2100),
  month: z.number().int().min(1).max(12),
  status: statusSchema,
  seoTitle: z.string().max(70).optional().default(""),
  seoDescription: z.string().max(180).optional().default("")
});

export const categoryInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(80),
  description: z.string().max(300).optional().default("")
});

export const consultationInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(160),
  slug: z.string().min(1).max(120),
  categoryLabel: z.string().max(120).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  idealFor: z.string().max(400).optional().default(""),
  duration: z.string().max(80).optional().default(""),
  ctaText: z.string().max(80).optional().default("Enquire"),
  bookingUrl: z.string().max(300).optional().default("/book"),
  flags: z
    .object({
      birth: z.boolean().optional(),
      property: z.boolean().optional(),
      company: z.boolean().optional(),
      event: z.boolean().optional()
    })
    .optional()
    .default({}),
  imageId: z.string().nullable().optional(),
  active: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int().min(0).max(999)
});

export const pricingInputSchema = z.object({
  id: z.string().min(1),
  serviceId: z.string().min(1),
  price: z.number().int().min(0).max(1000000),
  currency: z.string().min(1).max(8).default("USD"),
  promoPrice: z.number().int().min(0).max(1000000).nullable().optional(),
  note: z.string().max(200).optional().default(""),
  active: z.boolean(),
  sortOrder: z.number().int().min(0).max(999)
});

export const eventInputSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  eyebrow: z.string().max(80).optional().default(""),
  summary: z.string().max(600).optional().default(""),
  whenLabel: z.string().max(160).optional().default(""),
  whereLabel: z.string().max(200).optional().default(""),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  venue: z.string().max(200).optional().default(""),
  liveUrl: z.string().max(400).optional().default(""),
  ctaHref: z.string().max(300).optional().default("/book"),
  ctaLabel: z.string().max(80).optional().default("Learn more"),
  imageUrl: z.string().max(400).optional().default(""),
  tagline: z.string().max(200).optional().default(""),
  status: statusSchema,
  sortOrder: z.number().int().min(0).max(999)
});

export const navInputSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  href: z.string().min(1).max(300),
  external: z.boolean(),
  parentId: z.string().nullable().optional(),
  enabled: z.boolean(),
  sortOrder: z.number().int().min(0).max(999),
  location: z.enum(["header", "footer"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200)
});

export const userInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(200),
  role: roleSchema
});

export const signupKindSchema = z.enum([
  "booking-waitlist",
  "destiny-chart",
  "press-kit",
  "speaking",
  "newsletter"
]);

export const signupInputSchema = z.object({
  kind: signupKindSchema,
  email: z.string().email().max(160),
  name: z.string().max(120).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  organization: z.string().max(160).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  source: z.string().max(80).optional().default(""),
  fields: z.record(z.string(), z.string().max(400)).optional().default({}),
  honeypot: z.string().max(200).optional().default("")
});


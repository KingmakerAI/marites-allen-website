"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  Compass,
  Gem,
  Globe2,
  Heart,
  Home,
  Mail,
  Map,
  Menu,
  Moon,
  Play,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Upload,
  Users
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

const services = [
  {
    title: "Personal Consultation",
    copy: "Private guidance for career, wealth, relationships, health, and life transitions.",
    icon: Sparkles
  },
  {
    title: "Business Feng Shui",
    copy: "Strategic spatial and timing recommendations for leaders, teams, and enterprises.",
    icon: Building2
  },
  {
    title: "Home Audit",
    copy: "Create a refined sanctuary with energy flow, harmony, and prosperity at its center.",
    icon: Home
  },
  {
    title: "BaZi Reading",
    copy: "Decode your elemental profile and uncover patterns behind opportunity and timing.",
    icon: Compass
  },
  {
    title: "Destiny Analysis",
    copy: "A deeper lens into purpose, potential, compatibility, and long-term direction.",
    icon: Moon
  },
  {
    title: "Date Selection",
    copy: "Choose auspicious dates for launches, moves, contracts, weddings, and milestones.",
    icon: CalendarDays
  },
  {
    title: "Annual Forecast",
    copy: "Navigate the year ahead with elegant, practical insight for every life area.",
    icon: Globe2
  }
];

const destaraFeatures = [
  "Daily Feng Shui Forecast",
  "AI Feng Shui Assistant",
  "Lucky Directions",
  "Personalized Calendar",
  "Compass Tool",
  "Home Analysis",
  "Chinese Zodiac Profile",
  "Destiny Insights"
];

const stats = [
  ["30+", "Years of Expertise"],
  ["100+", "Countries Reached"],
  ["10K+", "Clients Guided"],
  ["Global", "Media Recognition"]
];

const books = [
  {
    title: "Annual Feng Shui Forecast",
    badge: "New Release",
    copy: "An elegant guide to navigating the year with clarity, timing, and intention."
  },
  {
    title: "The Destiny Code",
    badge: "Bestseller",
    copy: "A practical introduction to BaZi, personal elements, and life direction."
  },
  {
    title: "Feng Shui for Modern Living",
    badge: "Signature",
    copy: "Timeless Eastern wisdom adapted for refined contemporary homes."
  }
];

const articles = [
  "The Year of the Fire Horse: Forecast 2026",
  "The Science Behind Feng Shui",
  "Designing a Home for Prosperity",
  "Auspicious Dates for Life Milestones"
];

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#FAF8F2]/86 backdrop-blur-2xl">
      <div className="luxury-container flex h-20 items-center justify-between gap-6">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full">
          <Image
            src="/images/marites-logo-horizontal.png"
            alt="Marites Allen"
            width={310}
            height={64}
            className="h-9 w-auto object-contain invert"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#171717]/75 lg:flex">
          {["Services", "Destara", "Books", "Stories", "Events", "Journal"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="focus-ring rounded-full hover:text-[#0F5132]">
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <a href="#booking">Book Consultation</a>
          </Button>
          <button className="focus-ring rounded-full border border-black/10 p-3 lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 700], [1.05, 1.18]);
  const textY = useTransform(scrollY, [0, 700], [0, 80]);

  return (
    <section className="noise relative min-h-screen overflow-hidden bg-[#06261A] pt-20 text-white">
      <motion.div style={{ scale: imageScale }} className="absolute inset-y-20 right-0 w-full opacity-55 md:w-[58%]">
        <Image
          src="/images/marites-emerald-full.png"
          alt="Marites Allen portrait"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06261A] via-[#06261A]/70 to-transparent" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(198,163,72,0.22),transparent_28%),linear-gradient(120deg,#06261A_0%,#0F5132_58%,#07150f_100%)]" />
      <motion.div style={{ y: textY }} className="luxury-container relative flex min-h-[calc(100vh-80px)] items-center">
        <div className="max-w-4xl py-20">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm uppercase tracking-[0.28em] text-[#C6A348]"
          >
            <Gem className="h-4 w-4" /> Global Feng Shui Master
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.12, duration: 0.9 }}
            className="font-display max-w-4xl text-balance text-6xl font-semibold leading-[0.88] tracking-[-0.055em] md:text-8xl lg:text-9xl"
          >
            Transform Your Life Through Authentic Feng Shui
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.24, duration: 0.9 }}
            className="mt-8 max-w-2xl text-lg leading-8 text-white/78 md:text-xl"
          >
            Helping individuals, families, and businesses create harmony, prosperity, and lasting success through over three decades of expertise.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.36, duration: 0.9 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button asChild variant="gold" size="lg">
              <a href="#booking">Book Consultation</a>
            </Button>
            <Button asChild variant="ivory" size="lg">
              <a href="#services">Explore Services</a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/55 md:flex"
      >
        Scroll
        <span className="h-12 w-px bg-gradient-to-b from-white/70 to-transparent" />
      </motion.div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8 }}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#C6A348]">{eyebrow}</p>
      <h2 className="font-display text-balance text-5xl font-semibold leading-none tracking-[-0.04em] text-[#171717] md:text-7xl">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#171717]/62">{copy}</p>
    </motion.div>
  );
}

function Services() {
  return (
    <section id="services" className="bg-[#FAF8F2] py-24 md:py-32">
      <div className="luxury-container">
        <SectionIntro
          eyebrow="Consultation Atelier"
          title="Guidance for every chapter of life"
          copy="A refined suite of Feng Shui, BaZi, destiny, and timing services designed for modern lives, homes, and companies."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.045, duration: 0.7 }}
                whileHover={{ y: -10 }}
                className="group min-h-[290px] rounded-[2rem] border border-[#0F5132]/10 bg-white/72 p-7 shadow-[0_20px_70px_rgba(15,81,50,0.07)] backdrop-blur"
              >
                <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6A348]/12 text-[#C6A348] transition group-hover:scale-110 group-hover:bg-[#0F5132] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-3xl font-semibold leading-none text-[#171717]">{service.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[#171717]/60">{service.copy}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0F5132]">
                  Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="overflow-hidden bg-white py-24 md:py-32">
      <div className="luxury-container grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(12% 12% 12% 12% round 36px)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 36px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem]"
        >
          <Image src="/images/marites-red-portrait.png" alt="Marites Allen" fill className="object-cover" />
          <div className="absolute inset-x-8 bottom-8 rounded-3xl bg-white/90 p-5 shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-[#C6A348]">Authority</p>
            <p className="font-display mt-1 text-3xl font-semibold">International speaker, author, and trusted advisor.</p>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#C6A348]">About Marites Allen</p>
          <h2 className="font-display text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Timeless Eastern wisdom, translated for a modern global life.
          </h2>
          <p className="mt-7 text-lg leading-8 text-[#171717]/64">
            Marites Allen is internationally recognized for making authentic Feng Shui practical, elegant, and deeply personal. Her work spans private consultations, corporate strategy, books, media, speaking engagements, and digital tools for everyday guidance.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-[#0F5132]/10 bg-[#FAF8F2] p-6">
                <div className="font-display text-5xl font-semibold text-[#0F5132]">{value}</div>
                <p className="mt-2 text-sm font-medium text-[#171717]/58">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Books() {
  return (
    <section id="books" className="bg-[#FAF8F2] py-24 md:py-32">
      <div className="luxury-container">
        <SectionIntro
          eyebrow="Library"
          title="Books for a more intentional life"
          copy="A luxury bookstore-inspired presentation for annual forecasts, destiny guides, and signature Feng Shui titles."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {books.map((book, index) => (
            <motion.article
              key={book.title}
              initial={{ opacity: 0, y: 30, rotate: -1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.75 }}
              whileHover={{ y: -8 }}
              className="rounded-[2rem] bg-white p-6 shadow-[0_20px_80px_rgba(15,81,50,0.08)]"
            >
              <div className="relative mb-8 flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#0F5132] to-[#061b13] p-8 text-center text-white">
                <span className="absolute left-5 top-5 rounded-full bg-[#C6A348] px-3 py-1 text-xs font-bold text-[#171717]">{book.badge}</span>
                <div>
                  <BookOpen className="mx-auto mb-5 h-12 w-12 text-[#C6A348]" />
                  <p className="font-display text-4xl font-semibold leading-none">{book.title}</p>
                </div>
              </div>
              <h3 className="font-display text-3xl font-semibold">{book.title}</h3>
              <p className="mt-3 min-h-20 text-sm leading-7 text-[#171717]/62">{book.copy}</p>
              <div className="mt-6 flex gap-3">
                <Button size="sm">Buy Now</Button>
                <Button size="sm" variant="ghost">Preview</Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Destara() {
  return (
    <section id="destara" className="noise relative overflow-hidden bg-[#06140f] py-24 text-white md:py-36">
      <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-[#0F5132] blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-[#C6A348]/18 blur-[140px]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="absolute right-[8%] top-20 hidden h-56 w-56 rounded-full border border-[#C6A348]/20 md:block"
      >
        <div className="absolute inset-10 rounded-full border border-white/10" />
        <Compass className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-[#C6A348]/40" />
      </motion.div>
      <div className="luxury-container relative grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#C6A348]">Destara App</p>
          <h2 className="font-display text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.04em] md:text-7xl">
            Your Personal Feng Shui Master, Powered by AI
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
            Discover personalized daily Feng Shui guidance, auspicious dates, elemental insights, lucky directions, and AI-powered recommendations wherever you are.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {destaraFeatures.map((feature) => (
              <div key={feature} className="glass rounded-2xl px-4 py-4 text-sm font-medium">
                <Sparkles className="mr-3 inline h-4 w-4 text-[#C6A348]" />
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button variant="gold" size="lg">Download Destara</Button>
            <Button variant="ivory" size="lg">Learn More</Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {["App Store", "Google Play"].map((store) => (
              <div key={store} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur">
                Download on {store}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto w-full max-w-[430px]"
        >
          <motion.div
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto aspect-[0.52/1] rounded-[3rem] border-[12px] border-[#111] bg-[#0F5132] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.55)]"
          >
            <div className="absolute left-1/2 top-3 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#111]" />
            <div className="h-full overflow-hidden rounded-[2.15rem] bg-[#FAF8F2] p-5 text-[#171717]">
              <div className="mb-6 flex items-center justify-between">
                <Image src="/images/destara-logo.png" alt="Destara" width={86} height={58} className="h-12 w-auto object-contain" />
                <Compass className="h-6 w-6 text-[#0F5132]" />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#C6A348]">Today</p>
              <h3 className="font-display mt-2 text-4xl font-semibold leading-none">Auspicious Flow</h3>
              <div className="mt-6 rounded-3xl bg-[#0F5132] p-5 text-white">
                <p className="text-sm text-white/70">Lucky direction</p>
                <p className="font-display mt-2 text-5xl">South East</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {["Wealth", "Harmony", "Timing", "Home"].map((item) => (
                  <div key={item} className="rounded-2xl border border-[#0F5132]/10 bg-white p-4">
                    <Star className="mb-3 h-4 w-4 fill-[#C6A348] text-[#C6A348]" />
                    <p className="text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-3xl border border-[#0F5132]/10 bg-white p-4">
                <p className="text-sm font-semibold text-[#0F5132]">Ask Destara AI</p>
                <p className="mt-2 text-xs leading-5 text-[#171717]/55">What is the best date for signing a contract?</p>
              </div>
            </div>
          </motion.div>
          <Image
            src="/images/destara-qr.png"
            alt="Destara QR code"
            width={150}
            height={150}
            className="absolute -bottom-8 -left-4 hidden rounded-3xl bg-white p-3 shadow-2xl md:block"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="stories" className="bg-white py-24 md:py-32">
      <div className="luxury-container">
        <SectionIntro
          eyebrow="Client Success Stories"
          title="Results told with restraint and credibility"
          copy="A luxury editorial approach to testimonials, from business transformation to family harmony and inspired homes."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[2rem] bg-[#0F5132] p-8 text-white">
            <Quote className="mb-12 h-10 w-10 text-[#C6A348]" />
            <p className="font-display text-4xl font-semibold leading-tight">
              “After one consultation, we finally understood how our home could support the life we wanted to build.”
            </p>
            <p className="mt-8 text-white/60">Private family consultation, Singapore</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            {["Business revenue grew after a strategic office redesign.", "A family renovation became calmer, lighter, and more intentional.", "A founder chose an auspicious launch date with confidence.", "A personal BaZi reading clarified career timing."].map((story, index) => (
              <motion.article
                key={story}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="rounded-[2rem] border border-[#0F5132]/10 bg-[#FAF8F2] p-7"
              >
                <div className="mb-8 flex gap-1 text-[#C6A348]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg leading-8 text-[#171717]/72">{story}</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5132] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">Verified Client</p>
                    <p className="text-sm text-[#171717]/48">Global consultation</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventsBlogTrust() {
  return (
    <section id="events" className="bg-[#FAF8F2] py-24 md:py-32">
      <div className="luxury-container grid gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[2rem] bg-white p-8 shadow-[0_20px_80px_rgba(15,81,50,0.07)]">
          <Timer className="mb-8 h-10 w-10 text-[#C6A348]" />
          <p className="text-sm uppercase tracking-[0.24em] text-[#C6A348]">Upcoming Seminar</p>
          <h3 className="font-display mt-4 text-4xl font-semibold leading-none">2026 Prosperity Forecast</h3>
          <p className="mt-5 text-[#171717]/62">A private online event for auspicious timing, wealth sectors, and annual energies.</p>
          <div className="mt-8 rounded-2xl bg-[#0F5132] p-5 text-white">18 days : 06 hours : 22 minutes</div>
          <Button className="mt-6 w-full" variant="gold">Reserve Seat</Button>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[2rem] bg-[#0F5132] p-8 text-white lg:col-span-2">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#C6A348]">Journal</p>
              <h3 className="font-display mt-3 text-5xl font-semibold leading-none">Featured from the archives</h3>
            </div>
            <Search className="hidden h-8 w-8 text-white/50 sm:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((article, index) => (
              <div key={article} className="group rounded-3xl border border-white/12 bg-white/8 p-5">
                <p className="mb-5 text-xs text-[#C6A348]">Featured · {2026 - index}</p>
                <h4 className="font-display text-3xl font-semibold leading-none">{article}</h4>
                <p className="mt-5 text-sm text-white/58">6 min read</p>
                <ChevronRight className="mt-5 h-5 w-5 text-[#C6A348] transition group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="luxury-container mt-20">
        <div className="rounded-[2rem] border border-[#0F5132]/10 bg-white p-8">
          <p className="mb-8 text-center text-sm uppercase tracking-[0.28em] text-[#C6A348]">As Seen In · Trusted By</p>
          <div className="grid grid-cols-2 gap-5 text-center text-sm font-bold uppercase tracking-[0.18em] text-[#171717]/45 md:grid-cols-6">
            {["TV", "News", "Tatler", "Vogue", "Awards", "Keynotes"].map((logo) => (
              <div key={logo} className="rounded-2xl bg-[#FAF8F2] px-5 py-6">{logo}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingWizard() {
  const steps = ["Choose Service", "Choose Date", "Choose Time", "Your Details", "Payment"];
  return (
    <section id="booking" className="bg-white py-24 md:py-32">
      <div className="luxury-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#C6A348]">Booking Experience</p>
          <h2 className="font-display text-5xl font-semibold leading-none tracking-[-0.04em] md:text-7xl">
            Reserve a consultation like a private retreat.
          </h2>
          <p className="mt-7 text-lg leading-8 text-[#171717]/62">
            The production-ready flow is ready to connect to Stripe, PayPal, email confirmations, availability, and admin notifications.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[2rem] border border-[#0F5132]/10 bg-[#FAF8F2] p-5 md:p-8">
          <div className="mb-8 flex gap-2 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step} className={`min-w-max rounded-full px-4 py-2 text-xs font-semibold ${index === 0 ? "bg-[#0F5132] text-white" : "bg-white text-[#171717]/55"}`}>
                {index + 1}. {step}
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {["Personal Consultation", "Business Feng Shui", "Home Audit", "BaZi Reading"].map((service) => (
              <button key={service} className="focus-ring rounded-3xl border border-[#0F5132]/12 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#C6A348]">
                <ShieldCheck className="mb-6 h-6 w-6 text-[#C6A348]" />
                <span className="font-display text-2xl font-semibold">{service}</span>
                <p className="mt-2 text-sm text-[#171717]/52">From $250 · Video, phone, or in-person</p>
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {["Name", "Country", "Birth Date", "Birth Time", "Phone", "Email"].map((field) => (
              <label key={field} className="text-xs font-semibold uppercase tracking-[0.18em] text-[#171717]/45">
                {field}
                <input className="focus-ring mt-2 h-12 w-full rounded-2xl border border-[#0F5132]/10 bg-white px-4 normal-case tracking-normal" placeholder={field} />
              </label>
            ))}
          </div>
          <div className="mt-4 rounded-3xl border border-dashed border-[#0F5132]/25 bg-white p-5 text-sm text-[#171717]/58">
            <Upload className="mr-2 inline h-4 w-4 text-[#C6A348]" />
            Optional uploads: floor plans, house photos, business layout, and notes.
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button variant="gold" size="lg" className="flex-1">Continue to Payment</Button>
            <Button variant="ghost" size="lg" className="flex-1">PayPal / Stripe Ready</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterFooter() {
  return (
    <footer className="bg-[#06140f] text-white">
      <div className="luxury-container border-b border-white/10 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Mail className="mx-auto mb-7 h-9 w-9 text-[#C6A348]" />
          <h2 className="font-display text-5xl font-semibold leading-none md:text-7xl">Receive refined guidance monthly.</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/62">A minimal newsletter for auspicious dates, annual insights, events, books, and Destara updates.</p>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-full bg-white p-2 sm:flex-row">
            <input className="min-h-12 flex-1 rounded-full px-5 text-[#171717] outline-none" placeholder="Email address" />
            <Button variant="gold">Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="luxury-container flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <Image src="/images/marites-logo-horizontal.png" alt="Marites Allen" width={260} height={52} className="h-8 w-auto object-contain invert-0 brightness-0 invert" />
        <div className="flex flex-wrap gap-5 text-sm text-white/55">
          {["Services", "Books", "Destara", "Events", "Journal", "Contact", "Admin"].map((item) => (
            <Link key={item} href={item === "Admin" ? "/admin" : `/#${item.toLowerCase()}`} className="hover:text-white">
              {item}
            </Link>
          ))}
        </div>
        <p className="text-sm text-white/42">© 2026 Marites Allen. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Books />
        <Destara />
        <Testimonials />
        <EventsBlogTrust />
        <BookingWizard />
      </main>
      <NewsletterFooter />
    </>
  );
}

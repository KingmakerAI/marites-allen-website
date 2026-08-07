import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  Gem,
  Image as ImageIcon,
  LineChart,
  Megaphone,
  MessageSquareQuote,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  { label: "Bookings", value: "128", trend: "+18%", icon: CalendarDays },
  { label: "Revenue", value: "$42.8K", trend: "+24%", icon: LineChart },
  { label: "Events", value: "7", trend: "3 live", icon: Sparkles },
  { label: "Testimonials", value: "214", trend: "+11 new", icon: MessageSquareQuote },
  { label: "Books", value: "18", trend: "5 featured", icon: BookOpen },
  { label: "Promotions", value: "6", trend: "2 ending", icon: Megaphone },
  { label: "Gallery", value: "86", trend: "12 drafts", icon: ImageIcon },
  { label: "Analytics", value: "92K", trend: "+9.4%", icon: BarChart3 }
];

const bookings = [
  ["Amelia Tan", "Personal Consultation", "July 8, 2026", "Confirmed"],
  ["Victor Santos", "Business Feng Shui", "July 12, 2026", "Paid"],
  ["Sophia Lee", "BaZi Reading", "July 18, 2026", "Pending"],
  ["Daniel Cruz", "Home Audit", "July 21, 2026", "Docs Needed"]
];

const navItems: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Bookings", icon: CalendarDays },
  { label: "Clients", icon: Users },
  { label: "Books", icon: ShoppingBag },
  { label: "Events", icon: Sparkles },
  { label: "Testimonials", icon: MessageSquareQuote },
  { label: "Gallery", icon: ImageIcon },
  { label: "SEO", icon: Search },
  { label: "Settings", icon: Settings }
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#07140f] p-4 text-white md:p-8">
      <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-2xl">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="mb-10">
            <p className="font-display text-4xl font-semibold leading-none">Marites Allen</p>
            <p className="mt-2 text-sm text-[#C6A348]">Executive Admin</p>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/62 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" /> {label}
              </a>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0F5132] to-[#06140f] p-8 shadow-2xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#C6A348]">
                  Luxury Operations Suite
                </p>
                <h1 className="font-display max-w-3xl text-5xl font-semibold leading-none tracking-[-0.04em] md:text-7xl">
                  Manage bookings, content, commerce, and growth from one calm command center.
                </h1>
              </div>
              <Button variant="gold" size="lg">
                <Gem className="mr-2 h-4 w-4" /> Publish Update
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C6A348]/15 text-[#C6A348]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">{module.trend}</span>
                  </div>
                  <p className="text-sm text-white/50">{module.label}</p>
                  <p className="font-display mt-2 text-5xl font-semibold">{module.value}</p>
                </article>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-4xl font-semibold">Upcoming bookings</h2>
                  <p className="mt-1 text-sm text-white/45">Consultations, payment state, and intake readiness.</p>
                </div>
                <Button variant="ivory" size="sm">View All</Button>
              </div>
              <div className="space-y-3">
                {bookings.map(([name, service, date, status]) => (
                  <div key={name} className="grid gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm md:grid-cols-[1fr_1.2fr_1fr_auto] md:items-center">
                    <strong>{name}</strong>
                    <span className="text-white/62">{service}</span>
                    <span className="text-white/62">{date}</span>
                    <span className="rounded-full bg-[#C6A348]/15 px-3 py-1 text-xs font-bold text-[#C6A348]">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <h2 className="font-display text-4xl font-semibold">Availability</h2>
              <p className="mt-1 text-sm text-white/45">Elegant calendar controls ready for backend integration.</p>
              <div className="mt-6 grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-xl text-center text-xs leading-10 ${
                      [3, 8, 13, 21, 29].includes(index)
                        ? "bg-[#C6A348] font-bold text-[#171717]"
                        : "bg-white/[0.06] text-white/42"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import {
  ANALYTICS_RANGES,
  analyticsSummary,
  bucketTimestamps,
  parseAnalyticsRange,
  type AnalyticsPoint,
  type AnalyticsRange
} from "@/lib/cms/analytics";
import { dashboardStats, listArticles, listSignups } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";
import type { SignupKind } from "@/lib/cms/types";

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-PH", { hour: "numeric", hour12: false, timeZone: "Asia/Manila" }).format(new Date())
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function n(value: number) {
  return value.toLocaleString("en-PH");
}

function kindLabel(kind: SignupKind) {
  if (kind === "booking-waitlist") return "Booking";
  if (kind === "speaking") return "Speaking";
  if (kind === "press-kit") return "Press kit";
  if (kind === "destiny-chart") return "Destiny chart";
  return "Newsletter";
}

function rangeNoun(range: AnalyticsRange) {
  if (range === "24h" || range === "48h") return "hour";
  if (range === "year") return "month";
  return "day";
}

function tickEvery(count: number) {
  if (count > 36) return 6;
  if (count > 24) return 4;
  if (count > 12) return 2;
  return 1;
}

function BarChart({
  title,
  note,
  series,
  dual
}: {
  title: string;
  note: string;
  series: AnalyticsPoint[];
  dual?: boolean;
}) {
  const max = Math.max(1, ...series.map((point) => (dual ? Math.max(point.views, point.visitors) : point.views)));
  const every = tickEvery(series.length);
  return (
    <section className="admin-card chart-card">
      <div className="dash-card-head">
        <h2>{title}</h2>
        {dual && (
          <span className="chart-legend">
            <i className="chart-swatch views" /> Page opens
            <i className="chart-swatch people" /> People
          </span>
        )}
      </div>
      <p className="chart-note">{note}</p>
      <div className="chart-track">
        {series.map((point, index) => {
          const viewsH = Math.round((point.views / max) * 100);
          const peopleH = Math.round((point.visitors / max) * 100);
          const showLabel = index % every === 0 || index === series.length - 1;
          return (
            <div
              key={point.key}
              className="chart-col"
              title={`${point.label}: ${n(point.views)}${dual ? ` opens, ${n(point.visitors)} people` : " messages"}`}
            >
              <div className="chart-pair">
                <span className="chart-bar views" style={{ height: `${viewsH}%` }} />
                {dual && <span className="chart-bar people" style={{ height: `${peopleH}%` }} />}
              </div>
              <span className={`chart-label${showLabel ? "" : " muted"}`}>{showLabel ? point.label : ""}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireUser();
  ensureSeeded();
  const q = await searchParams;
  const range = parseAnalyticsRange(q.range);
  const stats = dashboardStats();
  const visits = analyticsSummary(range);
  const messages = bucketTimestamps(
    listSignups().map((row) => row.createdAt),
    range
  );
  const enquiries = listSignups().slice(0, 8);
  const drafts = listArticles({ status: "draft" }).slice(0, 6);
  const today = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila"
  }).format(new Date());
  const noun = rangeNoun(range);
  const rangeLabel = ANALYTICS_RANGES.find((row) => row.id === range)?.label || "Last 7 days";

  const people = [
    [`Page opens · ${rangeLabel.toLowerCase()}`, visits.rangeViews, "/"],
    [`People counted · ${rangeLabel.toLowerCase()}`, visits.rangeVisitors, "/"],
    ["People so far", visits.totalVisitors, "/"],
    ["New booking messages", stats.unreadSignups, "/admin/enquiries"],
    ["All booking messages", stats.signups, "/admin/enquiries"],
    ["Speaking requests", stats.speaking, "/admin/enquiries"],
    ["Press kit requests", stats.pressKit, "/admin/enquiries"],
    ["Destiny chart sign-ups", stats.destinyChart, "/admin/enquiries"]
  ] as const;

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1 className="admin-h1">{greeting()}</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            {today}. These numbers are from the live website.
          </p>
        </div>
        <Link className="btn secondary" href="/" target="_blank">
          See the website
        </Link>
      </div>

      <nav className="dash-ranges" aria-label="Time range">
        {ANALYTICS_RANGES.map((row) => (
          <Link
            key={row.id}
            href={`/admin/dashboard?range=${row.id}`}
            className={row.id === range ? "active" : undefined}
          >
            {row.label}
          </Link>
        ))}
      </nav>

      <div className="admin-grid dash-stats">
        {people.map(([label, value, href]) => (
          <Link
            key={label}
            href={href}
            className={`stat-card${label.startsWith("New booking") && value > 0 ? " attention" : ""}`}
            target={href === "/" ? "_blank" : undefined}
          >
            <strong>{n(value)}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <p className="admin-sub dash-hint">
        People counted in a {noun} can include the same person more than once if they came back later. Page opens count
        every visit. Refresh this screen after you visit the site to see the bars move.
      </p>

      <div className="dash-charts">
        <BarChart
          title="Website visits"
          note={`Page opens and people, by ${noun}. Dates follow Manila time.`}
          series={visits.series}
          dual
        />
        <BarChart
          title="Messages and sign-ups"
          note={`Booking, speaking, press kit, destiny chart, and newsletter messages by ${noun}.`}
          series={messages}
        />
      </div>

      <div className="dash-cols">
        <div className="dash-col">
          <div className="admin-card">
            <div className="dash-card-head">
              <h2>Latest messages</h2>
              <Link href="/admin/enquiries">See all</Link>
            </div>
            {enquiries.length === 0 && <p className="dash-empty">No messages yet.</p>}
            {enquiries.map((row) => (
              <Link key={row.id} href={`/admin/enquiries?q=${encodeURIComponent(row.email)}`} className="dash-row">
                <span className="dash-row-main">
                  <strong>{row.name || row.email}</strong>
                  <em>
                    {kindLabel(row.kind)}
                    {row.fields?.service || row.notes ? ` · ${row.fields?.service || row.notes}` : ""}
                  </em>
                </span>
                <span className="dash-row-side">
                  {row.status === "new" && <span className="badge badge-new">New</span>}
                  <time>{new Date(row.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</time>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="dash-col">
          <div className="admin-card">
            <div className="dash-card-head">
              <h2>Stories not ready yet</h2>
              <Link href="/admin/articles">All stories</Link>
            </div>
            {drafts.length === 0 && <p className="dash-empty">Nothing waiting. Nice work.</p>}
            {drafts.map((article) => (
              <Link key={article.id} href={`/admin/articles/${article.id}`} className="dash-row">
                <span className="dash-row-main">
                  <strong>{article.title}</strong>
                  <em>{article.outlet || "News story"}</em>
                </span>
                <span className="dash-row-side">
                  <span className="badge">Not ready</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="dash-col">
          <div className="admin-card">
            <h2>Quick jobs</h2>
            <div className="dash-quick">
              <Link href="/admin/homepage">Edit homepage</Link>
              <Link href="/admin/live?page=/about">Edit a page live</Link>
              <Link href="/admin/articles/new">Write a news story</Link>
              <Link href="/admin/consultations">Edit services</Link>
              <Link href="/admin/navigation">Edit menus</Link>
              <Link href="/admin/settings">Change settings</Link>
            </div>
          </div>

          <div className="admin-card">
            <h2>What you changed</h2>
            {stats.recent.length === 0 && <p className="dash-empty">No changes yet.</p>}
            {stats.recent.map((row) => (
              <div key={row.id} className="dash-activity">
                <span>
                  {row.action} <strong>{row.entity}</strong>
                </span>
                <time>
                  {new Date(row.timestamp).toLocaleString("en-PH", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  })}
                </time>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

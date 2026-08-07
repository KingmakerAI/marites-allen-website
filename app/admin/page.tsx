"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Article = {
  id: string;
  outlet: string;
  year: number;
  m: number;
  quote: string;
  cta: string;
  url: string;
  body: string;
};

type PageRec = {
  id: string;
  title: string;
  file: string;
  status: string;
  heading: string;
  intro: string;
};

const KEY = "ma_admin_v1";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SEED_ARTICLES: Article[] = [
  {
    id: "a1",
    outlet: "Manila Times",
    year: 2026,
    m: 2,
    quote: "Destara AI: a long-planned Destiny App bridging ancient wisdom and modern technology.",
    cta: "Read article",
    url: "https://www.manilatimes.net",
    body: ""
  },
  {
    id: "a2",
    outlet: "Manila Bulletin",
    year: 2026,
    m: 1,
    quote: "Discover your luck: the Feng Shui Queen's 2026 animal sign forecast.",
    cta: "Read article",
    url: "https://mb.com.ph",
    body: ""
  },
  {
    id: "a3",
    outlet: "Daily Tribune",
    year: 2025,
    m: 2,
    quote: "How to make the most of the new lunar year.",
    cta: "Read article",
    url: "https://maritesallen.com",
    body: ""
  },
  {
    id: "a4",
    outlet: "Tatler Asia",
    year: 2022,
    m: 1,
    quote: "Filipina Feng Shui Master Marites Allen's guide to a harmonious home.",
    cta: "Read feature",
    url: "https://www.tatlerasia.com",
    body: ""
  }
];

const SEED_PAGES: PageRec[] = [
  { id: "p1", title: "Home", file: "/", status: "Published", heading: "Transform your luck, home & destiny", intro: "Personal Feng Shui guidance from the first Filipina Master in Feng Shui." },
  { id: "p2", title: "About", file: "/about", status: "Published", heading: "Marites Allen", intro: "Widely known as the Feng Shui Queen." },
  { id: "p3", title: "Projects", file: "/projects", status: "Published", heading: "Brands & collaborations", intro: "Brands and organizations Marites Allen has consulted for." },
  { id: "p4", title: "Events", file: "/events", status: "Published", heading: "Speaking engagements & appearances", intro: "From CNY Countdown to corporate talks." },
  { id: "p5", title: "Annual Forecast", file: "/forecast", status: "Published", heading: "2026: Year of the Fire Horse", intro: "Full-year outlook on the energies shaping 2026." },
  { id: "p6", title: "Destara AI", file: "/destara", status: "Published", heading: "Destara", intro: "AI-powered Destiny Guide trained on three decades of practice." },
  { id: "p7", title: "Media", file: "/media", status: "Published", heading: "Article directory", intro: "All press coverage, newest first." },
  { id: "p8", title: "Book Consultation", file: "/book", status: "Published", heading: "Reserve your consultation", intro: "Book an instant session or request a tailored consultation." }
];

const ENQUIRIES = [
  { name: "Celie / Yellow Brick", type: "Speaking", when: "May 2", note: "CNY corporate talk request" },
  { name: "BPI Events", type: "Corporate", when: "Apr 28", note: "Leadership forecast briefing" },
  { name: "J. Ramos", type: "Residential", when: "Apr 21", note: "Full home audit inquiry" },
  { name: "A. Tan", type: "Destiny", when: "Apr 18", note: "Personalised Destiny Reading 2026" }
];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [tab, setTab] = useState<"articles" | "pages" | "enquiries" | "settings">("articles");
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const [pages, setPages] = useState<PageRec[]>(SEED_PAGES);
  const [openPageId, setOpenPageId] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState("");
  const [sEmail, setSEmail] = useState("sales@frigga.co.uk");
  const [sPhone, setSPhone] = useState("+63 920 950 9390");
  const [sPass, setSPass] = useState("fengshui2026");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [fOutlet, setFOutlet] = useState("");
  const [fYear, setFYear] = useState("2026");
  const [fMonth, setFMonth] = useState("1");
  const [fQuote, setFQuote] = useState("");
  const [fUrl, setFUrl] = useState("");
  const [fCta, setFCta] = useState("Read article");
  const [fBody, setFBody] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY) || "null");
      if (saved?.articles) setArticles(saved.articles);
      if (saved?.pages) setPages(saved.pages);
      if (saved?.sEmail) setSEmail(saved.sEmail);
      if (saved?.sPhone) setSPhone(saved.sPhone);
      if (saved?.sPass) setSPass(saved.sPass);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (patch: {
    articles?: Article[];
    pages?: PageRec[];
    sEmail?: string;
    sPhone?: string;
    sPass?: string;
  }) => {
    const next = {
      articles: patch.articles ?? articles,
      pages: patch.pages ?? pages,
      sEmail: patch.sEmail ?? sEmail,
      sPhone: patch.sPhone ?? sPhone,
      sPass: patch.sPass ?? sPass
    };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (patch.articles) setArticles(patch.articles);
    if (patch.pages) setPages(patch.pages);
    if (patch.sEmail != null) setSEmail(patch.sEmail);
    if (patch.sPhone != null) setSPhone(patch.sPhone);
    if (patch.sPass != null) setSPass(patch.sPass);
  };

  const sortedArticles = useMemo(
    () => articles.slice().sort((a, b) => b.year - a.year || b.m - a.m),
    [articles]
  );

  if (!unlocked) {
    return (
      <div className="page-shell page-enter" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#fffdf8",
            border: "1px solid rgba(20,61,49,0.12)",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 30px 70px -30px rgba(20,60,45,0.4)"
          }}
        >
          <div className="font-display" style={{ fontWeight: 700, fontSize: 22, color: "#143d31", letterSpacing: 1 }}>
            MARITES ALLEN
          </div>
          <div style={{ fontSize: 12, color: "#c69a3e", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
            Admin login
          </div>
          <p style={{ fontSize: 13, color: "#5f6b60", margin: "14px 0 18px" }}>
            Demo: <code>admin@maritesallen.com</code> / <code>fengshui2026</code>
          </p>
          <label style={lab}>Email</label>
          <input value={loginUser} onChange={(e) => { setLoginUser(e.target.value); setLoginError(false); }} style={inp} />
          <label style={{ ...lab, marginTop: 10 }}>Password</label>
          <input
            type="password"
            value={loginPass}
            onChange={(e) => { setLoginPass(e.target.value); setLoginError(false); }}
            onKeyDown={(e) => e.key === "Enter" && (loginPass === sPass ? setUnlocked(true) : setLoginError(true))}
            style={inp}
          />
          {loginError && <div style={{ color: "#a33", fontSize: 13, marginTop: 8 }}>Incorrect password</div>}
          <button
            type="button"
            onClick={() => (loginPass === sPass ? setUnlocked(true) : setLoginError(true))}
            style={{ ...btn, width: "100%", marginTop: 16 }}
          >
            Sign in
          </button>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: "#143d31" }}>
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell page-enter" style={{ minHeight: "100vh", background: "#efe8d8" }}>
      <header
        style={{
          background: "#0c2a20",
          color: "#fff",
          padding: "14px clamp(16px,3vw,28px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div>
          <div className="font-display" style={{ fontWeight: 700, letterSpacing: 1 }}>
            Marites Allen Admin
          </div>
          <div style={{ fontSize: 12, color: "#e6c680" }}>Local prototype · saved in browser</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" style={{ ...ghostBtn, color: "#e6c680", borderColor: "rgba(230,198,128,0.35)" }}>
            View site
          </Link>
          <button type="button" onClick={() => setUnlocked(false)} style={ghostBtn}>
            Sign out
          </button>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "20px clamp(16px,3vw,28px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 18
        }}
      >
        <aside
          style={{
            flex: "0 1 220px",
            background: "#fffdf8",
            borderRadius: 16,
            border: "1px solid rgba(20,61,49,0.1)",
            padding: 12,
            height: "fit-content"
          }}
        >
          {(
            [
              ["articles", "Media articles"],
              ["pages", "Pages"],
              ["enquiries", "Enquiries"],
              ["settings", "Settings"]
            ] as const
          ).map(([id, label]) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                setTab(id);
                setEditorOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                border: 0,
                borderRadius: 10,
                padding: "11px 12px",
                marginBottom: 4,
                cursor: "pointer",
                background: tab === id ? "#1a4d3e" : "transparent",
                color: tab === id ? "#e6c680" : "#143d31",
                fontWeight: 700,
                fontSize: 13.5
              }}
            >
              {label}
            </button>
          ))}
        </aside>

        <main
          style={{
            flex: "1 1 480px",
            background: "#fffdf8",
            borderRadius: 16,
            border: "1px solid rgba(20,61,49,0.1)",
            padding: 20,
            minHeight: 520
          }}
        >
          {tab === "articles" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                <h1 className="font-display" style={{ margin: 0, fontSize: 26, color: "#143d31" }}>
                  Media articles
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setEditorOpen(true);
                    setEditId(null);
                    setFOutlet("");
                    setFYear("2026");
                    setFMonth("1");
                    setFQuote("");
                    setFUrl("");
                    setFCta("Read article");
                    setFBody("");
                  }}
                  style={btn}
                >
                  + New article
                </button>
              </div>

              {editorOpen && (
                <div style={{ background: "#f9f5ec", borderRadius: 14, padding: 16, marginBottom: 16, border: "1px solid rgba(20,61,49,0.1)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
                    <Field label="Outlet" value={fOutlet} onChange={setFOutlet} />
                    <Field label="Year" value={fYear} onChange={setFYear} />
                    <Field label="Month (1-12)" value={fMonth} onChange={setFMonth} />
                    <Field label="CTA" value={fCta} onChange={setFCta} />
                    <div style={{ gridColumn: "1 / -1" }}>
                      <Field label="Quote / headline" value={fQuote} onChange={setFQuote} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <Field label="URL" value={fUrl} onChange={setFUrl} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={lab}>Body notes</label>
                      <textarea value={fBody} onChange={(e) => setFBody(e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => {
                        const rec: Article = {
                          id: editId || "a" + Date.now(),
                          outlet: fOutlet.trim(),
                          year: parseInt(fYear, 10) || 2026,
                          m: parseInt(fMonth, 10) || 1,
                          quote: fQuote.trim(),
                          url: fUrl.trim(),
                          cta: fCta.trim() || "Read article",
                          body: fBody
                        };
                        const list = editId ? articles.map((a) => (a.id === editId ? rec : a)) : [rec, ...articles];
                        persist({ articles: list });
                        setEditorOpen(false);
                        setEditId(null);
                      }}
                      style={btn}
                    >
                      Save
                    </button>
                    <button type="button" onClick={() => setEditorOpen(false)} style={ghostDark}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gap: 10 }}>
                {sortedArticles.map((a) => (
                  <div key={a.id} style={{ border: "1px solid rgba(20,61,49,0.1)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: "#8a8a80" }}>
                      {a.outlet} · {MONTHS[(a.m || 1) - 1]} {a.year}
                    </div>
                    <div className="font-display" style={{ fontSize: 17, color: "#143d31", marginTop: 4 }}>
                      {a.quote}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditorOpen(true);
                          setEditId(a.id);
                          setFOutlet(a.outlet);
                          setFYear(String(a.year));
                          setFMonth(String(a.m));
                          setFQuote(a.quote);
                          setFUrl(a.url);
                          setFCta(a.cta || "Read article");
                          setFBody(a.body || "");
                        }}
                        style={ghostDark}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => persist({ articles: articles.filter((x) => x.id !== a.id) })}
                        style={{ ...ghostDark, color: "#a33" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "pages" && (
            <div>
              <h1 className="font-display" style={{ margin: "0 0 16px", fontSize: 26, color: "#143d31" }}>
                Pages
              </h1>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <input value={newPageName} onChange={(e) => setNewPageName(e.target.value)} placeholder="New page name" style={inp} />
                <button
                  type="button"
                  onClick={() => {
                    const name = newPageName.trim();
                    if (!name) return;
                    persist({
                      pages: [
                        ...pages,
                        { id: "p" + Date.now(), title: name, file: "#", status: "Draft", heading: name, intro: "" }
                      ]
                    });
                    setNewPageName("");
                  }}
                  style={btn}
                >
                  Add
                </button>
              </div>
              {pages.map((p) => {
                const open = openPageId === p.id;
                return (
                  <div key={p.id} style={{ border: "1px solid rgba(20,61,49,0.1)", borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                    <button
                      type="button"
                      onClick={() => setOpenPageId(open ? null : p.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: 0,
                        background: "#f9f5ec",
                        padding: 14,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10
                      }}
                    >
                      <span className="font-display" style={{ fontWeight: 600, color: "#143d31" }}>
                        {p.title}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: p.status === "Draft" ? "#8a6d1f" : "#1a4d3e" }}>
                        {p.status}
                      </span>
                    </button>
                    {open && (
                      <div style={{ padding: 14, display: "grid", gap: 10 }}>
                        <Field
                          label="Heading"
                          value={p.heading}
                          onChange={(v) => persist({ pages: pages.map((x) => (x.id === p.id ? { ...x, heading: v } : x)) })}
                        />
                        <div>
                          <label style={lab}>Intro</label>
                          <textarea
                            value={p.intro}
                            onChange={(e) =>
                              persist({ pages: pages.map((x) => (x.id === p.id ? { ...x, intro: e.target.value } : x)) })
                            }
                            rows={3}
                            style={{ ...inp, resize: "vertical" }}
                          />
                        </div>
                        <Link href={p.file.startsWith("/") ? p.file : "/"} style={{ fontSize: 13, fontWeight: 700, color: "#143d31" }}>
                          Open route →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "enquiries" && (
            <div>
              <h1 className="font-display" style={{ margin: "0 0 8px", fontSize: 26, color: "#143d31" }}>
                Enquiries
              </h1>
              <p style={{ color: "#5f6b60", fontSize: 14, marginBottom: 16 }}>Demo list — connect a booking database later.</p>
              <div style={{ display: "grid", gap: 10 }}>
                {ENQUIRIES.map((e) => (
                  <div key={e.name} style={{ border: "1px solid rgba(20,61,49,0.1)", borderRadius: 12, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <strong style={{ color: "#143d31" }}>{e.name}</strong>
                      <span style={{ fontSize: 12, color: "#8a8a80" }}>{e.when}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#c69a3e", marginTop: 4 }}>{e.type}</div>
                    <div style={{ fontSize: 14, color: "#5f6b60", marginTop: 6 }}>{e.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div>
              <h1 className="font-display" style={{ margin: "0 0 16px", fontSize: 26, color: "#143d31" }}>
                Settings
              </h1>
              <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
                <Field label="Public email" value={sEmail} onChange={(v) => persist({ sEmail: v })} />
                <Field label="Public phone" value={sPhone} onChange={(v) => persist({ sPhone: v })} />
                <Field label="Admin password" value={sPass} onChange={(v) => persist({ sPass: v })} />
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={lab}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inp} />
    </div>
  );
}

const lab: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#3d5348",
  marginBottom: 4
};

const inp: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #cdd8d0",
  borderRadius: 10,
  padding: "10px 12px",
  fontFamily: "Lato, system-ui, sans-serif",
  fontSize: 14,
  color: "#2a2a28"
};

const btn: React.CSSProperties = {
  background: "linear-gradient(160deg,#1a4d3e,#143d31)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  padding: "10px 16px",
  borderRadius: 10,
  border: 0,
  cursor: "pointer",
  whiteSpace: "nowrap"
};

const ghostBtn: React.CSSProperties = {
  background: "transparent",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  padding: "9px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.25)",
  cursor: "pointer"
};

const ghostDark: React.CSSProperties = {
  background: "#fff",
  color: "#143d31",
  fontSize: 12,
  fontWeight: 700,
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(20,61,49,0.15)",
  cursor: "pointer"
};

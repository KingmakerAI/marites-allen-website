import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { listFaqs, listHomeSections, listTestimonials } from "@/lib/cms/repo";
import { saveHomepageAllAction } from "../actions";
import { Flash, ShopHead } from "../ui";

const TOC = [
  ["hero", "Top"],
  ["stats", "Numbers"],
  ["services", "Services"],
  ["closing", "Bottom"],
  ["faqs", "Questions"],
  ["testimonials", "Reviews"]
] as const;

export default async function HomepageEditor({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const sections = listHomeSections();
  const hero = sections.find((s) => s.id === "home-hero" || s.blockType === "hero");
  const stats = sections.find((s) => s.id === "home-stats" || s.blockType === "stats");
  const services = sections.find((s) => s.id === "home-services" || s.blockType === "services");
  const closing = sections.find((s) => s.id === "home-closing" || s.blockType === "closing");
  const faqs = listFaqs();
  const testimonials = listTestimonials();
  const heroPayload = (hero?.payload || {}) as Record<string, string>;
  const existingStats = (stats?.payload.items as Array<{ value: string; label: string }>) || [];
  const statItems = existingStats
    .concat(Array.from({ length: 4 }, () => ({ value: "", label: "" })))
    .slice(0, Math.max(existingStats.length, 4));
  const closePayload = (closing?.payload || {}) as Record<string, string>;
  const serviceItems = ((services?.payload.items as Array<{ title?: string; tagline?: string }>) || []).slice(0, 6);

  return (
    <div className="shop-page">
      <ShopHead
        title="Homepage banner"
        sub="The top of the home page. Lower strips (Destara, Frigga, press) are edited on the live page."
        backHref="/admin/pages"
        backLabel="All pages"
        viewHref="/"
        viewLabel="View page"
      >
        <Link className="btn secondary" href="/admin/live?page=/">
          Edit live page
        </Link>
      </ShopHead>
      <Flash saved={q.saved} />

      <form action={saveHomepageAllAction} className="shop-body shop-body-studio homepage-one-save">
        <nav className="shop-toc" aria-label="Homepage sections">
          {TOC.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className="homepage-forms">
          <section id="hero" className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>Top of the page</h2>
                <p>The first thing visitors see.</p>
              </div>
              <label className="shop-check">
                <input type="checkbox" name="heroEnabled" defaultChecked={hero?.enabled !== false} />
                Show this
              </label>
            </div>
            <label>
              Heading
              <input name="heading" required defaultValue={heroPayload.heading || ""} />
            </label>
            <label>
              Subheading
              <textarea name="subheading" rows={3} defaultValue={heroPayload.subheading || ""} />
            </label>
            <div className="fields-2">
              <label>
                Highlight phrase
                <input name="highlight" defaultValue={heroPayload.highlight || ""} />
              </label>
              <label>
                Rating line
                <input name="rating" defaultValue={heroPayload.rating || ""} />
              </label>
              <label>
                Book button
                <input name="ctaLabel" defaultValue={heroPayload.ctaLabel || ""} />
              </label>
              <label>
                Book link
                <input name="ctaHref" defaultValue={heroPayload.ctaHref || "/book"} />
              </label>
              <label>
                Destiny chart button
                <input name="chartCtaLabel" defaultValue={heroPayload.chartCtaLabel || "Free Destiny Chart"} />
              </label>
              <label>
                Photo URL
                <input name="imageUrl" defaultValue={heroPayload.imageUrl || "/images/zip/marites-1.webp"} />
              </label>
            </div>
            <label>
              Photo alt text
              <input name="imageAlt" defaultValue={heroPayload.imageAlt || "Marites Allen"} />
            </label>
          </section>

          <section id="stats" className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>Numbers</h2>
                <p>The four big numbers under the top of the page.</p>
              </div>
            </div>
            <div className="stat-edit">
              {statItems.map((item, i) => (
                <div key={i} className="fields-2">
                  <label>
                    Value
                    <input name="statValue" defaultValue={item.value} placeholder="30+" />
                  </label>
                  <label>
                    Label
                    <input name="statLabel" defaultValue={item.label} placeholder="Years" />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {services && (
            <section id="services" className="shop-card admin-form">
              <input type="hidden" name="servicesId" value={services.id} />
              <input type="hidden" name="servicesSortOrder" value={services.sortOrder} />
              <div className="shop-card-head">
                <div>
                  <h2>Service cards</h2>
                  <p>
                    Names, prices, and descriptions come from{" "}
                    <Link href="/admin/consultations">Services</Link>. This box only turns the homepage strip on or off.
                  </p>
                </div>
                <label className="shop-check">
                  <input type="checkbox" name="servicesEnabled" defaultChecked={services.enabled} />
                  Show this
                </label>
              </div>
              {serviceItems.length > 0 && (
                <ul className="shop-summary">
                  {serviceItems.map((item, i) => (
                    <li key={i}>
                      <strong>{item.title || "Untitled"}</strong>
                      {item.tagline ? <span>{item.tagline}</span> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section id="closing" className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>Last message on the page</h2>
                <p>The box at the bottom that asks people to book.</p>
              </div>
              <label className="shop-check">
                <input type="checkbox" name="closingEnabled" defaultChecked={closing?.enabled !== false} />
                Show this
              </label>
            </div>
            <label>
              Heading
              <input name="closingHeading" defaultValue={closePayload.heading || ""} />
            </label>
            <label>
              Body
              <textarea name="closingBody" rows={2} defaultValue={closePayload.body || ""} />
            </label>
            <div className="fields-2">
              <label>
                Button label
                <input name="closingCtaLabel" defaultValue={closePayload.ctaLabel || ""} />
              </label>
              <label>
                Button link
                <input name="closingCtaHref" defaultValue={closePayload.ctaHref || "/book"} />
              </label>
            </div>
          </section>

          <section id="faqs" className="shop-card">
            <div className="shop-card-head">
              <div>
                <h2>Questions people ask</h2>
                <p>{faqs.length} questions. Toggle which ones appear on the homepage.</p>
              </div>
            </div>
            <div className="shop-stack">
              {faqs.map((f) => (
                <div key={f.id} className="admin-form shop-nested">
                  <input type="hidden" name="faqId" value={f.id} />
                  <label>
                    Question
                    <input name="faqQuestion" defaultValue={f.question} />
                  </label>
                  <label>
                    Answer
                    <textarea name="faqAnswer" rows={2} defaultValue={f.answer} />
                  </label>
                  <div className="fields-2">
                    <label>
                      Sort
                      <input name="faqSortOrder" type="number" defaultValue={f.sortOrder} />
                    </label>
                    <label className="shop-check">
                      <input type="checkbox" name={`faqShow_${f.id}`} defaultChecked={f.showOnHome} />
                      Show on home
                    </label>
                  </div>
                </div>
              ))}
              <div className="admin-form shop-nested shop-add">
                <h3>Add FAQ</h3>
                <label>
                  Question
                  <input name="newFaqQuestion" placeholder="What should visitors know?" />
                </label>
                <label>
                  Answer
                  <textarea name="newFaqAnswer" rows={2} placeholder="Short answer" />
                </label>
                <input type="hidden" name="newFaqSortOrder" value={faqs.length + 1} />
                <label className="shop-check">
                  <input type="checkbox" name="newFaqShowOnHome" defaultChecked />
                  Show on home
                </label>
              </div>
            </div>
          </section>

          <section id="testimonials" className="shop-card">
            <div className="shop-card-head">
              <div>
                <h2>Reviews</h2>
                <p>{testimonials.length} quotes. Featured ones appear in the homepage carousel.</p>
              </div>
            </div>
            <div className="shop-stack">
              {testimonials.map((t) => (
                <div key={t.id} className="admin-form shop-nested">
                  <input type="hidden" name="reviewId" value={t.id} />
                  <div className="fields-2">
                    <label>
                      Name
                      <input name="reviewName" defaultValue={t.name} />
                    </label>
                    <label>
                      Role
                      <input name="reviewRole" defaultValue={t.role} />
                    </label>
                  </div>
                  <label>
                    Quote
                    <textarea name="reviewText" rows={2} defaultValue={t.text} />
                  </label>
                  <div className="fields-2">
                    <label>
                      Initial
                      <input name="reviewInitial" defaultValue={t.initial} />
                    </label>
                    <label>
                      Sort
                      <input name="reviewSortOrder" type="number" defaultValue={t.sortOrder} />
                    </label>
                  </div>
                  <label className="shop-check">
                    <input type="checkbox" name={`reviewFeatured_${t.id}`} defaultChecked={t.featured} />
                    Featured
                  </label>
                </div>
              ))}
            </div>
          </section>

          <div className="shop-card">
            <h2>Also on the homepage</h2>
            <p className="shop-aside-copy">
              Destara, Frigga, press names, and the About teaser are edited on the{" "}
              <Link href="/admin/live?page=/">live home page</Link>. Service names and prices are under{" "}
              <Link href="/admin/consultations">Services</Link>.
            </p>
          </div>
        </div>

        <aside className="homepage-save">
          <div className="shop-card">
            <h2>Save</h2>
            <p className="shop-aside-copy">One Save keeps every change on this screen.</p>
            <button className="btn" type="submit">
              Save homepage
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

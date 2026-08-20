import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { getPageCopy, listMedia } from "@/lib/cms/repo";
import {
  saveAboutCopyAction,
  saveDestaraCopyAction,
  saveForecastCopyAction,
  saveFriggaCopyAction,
  saveHomeExtrasAction,
  saveProjectsCopyAction
} from "../actions";
import { PageLinkField, PhotoField, RepeatCards } from "../copy-fields";
import { EasyMore, Flash, ShopHead } from "../ui";

const PAGES = [
  {
    id: "about",
    label: "About",
    path: "/about",
    title: "About page",
    blurb: "Marites’s story, photo, and the booking box."
  },
  {
    id: "destara",
    label: "Destara",
    path: "/destara",
    title: "Destara page",
    blurb: "The app page — what Destara is and how to open it."
  },
  {
    id: "frigga",
    label: "Frigga",
    path: "/frigga",
    title: "Frigga page",
    blurb: "The shop page — charms, stores, and collections."
  },
  {
    id: "forecast",
    label: "Forecast",
    path: "/forecast",
    title: "Forecast page",
    blurb: "The yearly Chinese New Year forecast."
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    title: "Projects page",
    blurb: "Brands and work she has done."
  },
  {
    id: "home",
    label: "Homepage extras",
    path: "/",
    title: "Homepage extras",
    blurb: "Extra strips lower on the homepage. The top banner is edited under Homepage."
  }
] as const;

function SeoFields({ title, description }: { title: string; description: string }) {
  return (
    <EasyMore title="How this page looks on Google (optional)">
      <label>
        Google title
        <input name="seoTitle" defaultValue={title} />
        <span className="field-hint">The blue title in Google search results.</span>
      </label>
      <label>
        Google description
        <textarea name="seoDescription" rows={3} defaultValue={description} />
        <span className="field-hint">The short sentence under that title.</span>
      </label>
    </EasyMore>
  );
}

export default async function CopyEditor({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; tab?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const page = PAGES.find((p) => p.id === q.tab) || PAGES[0];
  const copy = getPageCopy();
  const photos = listMedia().map((m) => ({ path: m.path, altText: m.altText, filename: m.filename }));
  const saveLabel = page.id === "home" ? "Save homepage extras" : `Save ${page.label}`;

  return (
    <div className="shop-page">
      <ShopHead
        title={`Edit ${page.label}`}
        sub={`${page.blurb} Prefer the live page when you only need to change words.`}
        backHref="/admin/pages"
        backLabel="All pages"
        viewHref={`/admin/live?page=${encodeURIComponent(page.path)}`}
        viewLabel="Edit live page"
      />
      <Flash saved={q.saved} />

      <div className="shop-body shop-body-studio">
        <nav className="shop-toc" aria-label="Which page to edit">
          {PAGES.map((item) => (
            <Link key={item.id} className={page.id === item.id ? "active" : ""} href={`/admin/copy?tab=${item.id}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="story-forms-wrap">
          {page.id === "about" && (
            <form id="story-form" action={saveAboutCopyAction} className="story-form">
              <input type="hidden" name="aboutSectionsMode" value="cards" />
              <section id="part-top" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Top of the About page</h2>
                    <p>The small line and the big heading visitors see first.</p>
                  </div>
                </div>
                <label>
                  Small line above the heading
                  <input name="kicker" defaultValue={copy.about.kicker} />
                </label>
                <label>
                  Page heading
                  <input name="title" defaultValue={copy.about.title} />
                </label>
                <label>
                  Opening paragraph
                  <textarea name="intro" rows={6} defaultValue={copy.about.intro} />
                  <span className="field-hint">This is the first block of writing under the heading.</span>
                </label>
              </section>

              <section id="part-story" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Story sections</h2>
                    <p>The rest of the About page — Early life, Career, and so on. Leave a blank line between paragraphs.</p>
                  </div>
                </div>
                <RepeatCards
                  itemLabel="Section"
                  addHint="Add another heading, such as Philosophy or Career."
                  initial={copy.about.sections.map((section) => ({
                    sectionHeading: section.heading,
                    sectionBody: section.paragraphs.join("\n\n")
                  }))}
                  fields={[
                    { name: "sectionHeading", label: "Heading" },
                    {
                      name: "sectionBody",
                      label: "Writing",
                      kind: "textarea",
                      rows: 6
                    }
                  ]}
                />
              </section>

              <section id="part-photo" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Photo on the right</h2>
                    <p>The picture in the side box on About.</p>
                  </div>
                </div>
                <PhotoField
                  name="imageUrl"
                  altName="imageAlt"
                  value={copy.about.imageUrl}
                  alt={copy.about.imageAlt}
                  photos={photos}
                />
              </section>

              <section id="part-facts" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Facts under the photo</h2>
                    <p>Short facts in the side box, such as where she is based.</p>
                  </div>
                </div>
                <RepeatCards
                  itemLabel="Fact"
                  initial={copy.about.infobox.map((row) => ({ infoLabel: row.label, infoValue: row.value }))}
                  fields={[
                    { name: "infoLabel", label: "Label" },
                    { name: "infoValue", label: "Fact" }
                  ]}
                />
              </section>

              <section id="part-awards" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Awards and books</h2>
                    <p>The lists further down the About page.</p>
                  </div>
                </div>
                <label>
                  Recognition heading
                  <input name="recognitionHeading" defaultValue={copy.about.recognitionHeading} />
                </label>
                <label>
                  Awards and recognition
                  <textarea name="recognition" rows={5} defaultValue={copy.about.recognition.join("\n")} />
                  <span className="field-hint">One award per line.</span>
                </label>
                <label>
                  Bibliography heading
                  <input name="bibliographyHeading" defaultValue={copy.about.bibliographyHeading} />
                </label>
                <label>
                  Books
                  <textarea name="bibliography" rows={3} defaultValue={copy.about.bibliography.join("\n")} />
                  <span className="field-hint">One book per line.</span>
                </label>
              </section>

              <section id="part-links" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Also see</h2>
                    <p>Links at the bottom of the story, before the booking box.</p>
                  </div>
                </div>
                <label>
                  Section heading
                  <input name="seeAlsoHeading" defaultValue={copy.about.seeAlsoHeading} />
                </label>
                <RepeatCards
                  itemLabel="Link"
                  initial={copy.about.seeAlso.map((row) => ({ seeAlsoLabel: row.label, seeAlsoHref: row.href }))}
                  fields={[
                    { name: "seeAlsoLabel", label: "Words on the link" },
                    { name: "seeAlsoHref", label: "Goes to", hint: "Usually a page on this website, like /events" }
                  ]}
                />
              </section>

              <section id="part-cta" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Booking box</h2>
                    <p>The cream box at the bottom that invites people to book.</p>
                  </div>
                </div>
                <label>
                  Box heading
                  <input name="ctaTitle" defaultValue={copy.about.ctaTitle} />
                </label>
                <label>
                  Box text
                  <textarea name="ctaBody" rows={2} defaultValue={copy.about.ctaBody} />
                </label>
                <label>
                  Button words
                  <input name="ctaLabel" defaultValue={copy.about.ctaLabel} />
                </label>
                <PageLinkField name="ctaHref" value={copy.about.ctaHref} />
              </section>

              <section className="shop-card admin-form">
                <SeoFields title={copy.about.seoTitle} description={copy.about.seoDescription} />
                <button className="btn" type="submit">
                  {saveLabel}
                </button>
              </section>
            </form>
          )}

          {page.id === "destara" && (
            <form id="story-form" action={saveDestaraCopyAction} className="story-form">
              <input type="hidden" name="destaraFactsMode" value="cards" />
              <section id="part-top" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Top of the Destara page</h2>
                    <p>The first words visitors see.</p>
                  </div>
                </div>
                <label>
                  Small line above the heading
                  <input name="kicker" defaultValue={copy.destara.kicker} />
                </label>
                <label>
                  Page heading
                  <input name="title" defaultValue={copy.destara.title} />
                </label>
                <label>
                  Opening paragraph
                  <textarea name="intro" rows={5} defaultValue={copy.destara.intro} />
                </label>
              </section>
              <section id="part-overview" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Overview</h2>
                    <p>What Destara is, in a little more detail.</p>
                  </div>
                </div>
                <label>
                  Section heading
                  <input name="overviewHeading" defaultValue={copy.destara.overviewHeading} />
                </label>
                <label>
                  Writing
                  <textarea name="overview" rows={4} defaultValue={copy.destara.overview} />
                </label>
              </section>
              <section id="part-features" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>What it can do</h2>
                    <p>The list of Destara features.</p>
                  </div>
                </div>
                <label>
                  Section heading
                  <input name="featuresHeading" defaultValue={copy.destara.featuresHeading} />
                </label>
                <label>
                  Features
                  <textarea name="features" rows={5} defaultValue={copy.destara.features.join("\n")} />
                  <span className="field-hint">One feature per line.</span>
                </label>
                <label>
                  Photo caption
                  <input name="caption" defaultValue={copy.destara.caption} />
                </label>
              </section>
              <section id="part-availability" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Where to get it</h2>
                    <p>Availability, and how it sits alongside a real consultation.</p>
                  </div>
                </div>
                <label>
                  Availability heading
                  <input name="availabilityHeading" defaultValue={copy.destara.availabilityHeading} />
                </label>
                <label>
                  Availability
                  <textarea name="availability" rows={3} defaultValue={copy.destara.availability} />
                </label>
                <label>
                  Complements heading
                  <input name="complementHeading" defaultValue={copy.destara.complementHeading} />
                </label>
                <label>
                  Complements
                  <textarea name="complement" rows={4} defaultValue={copy.destara.complement} />
                </label>
              </section>
              <section id="part-cta" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Open Destara button</h2>
                    <p>The button that sends people to the app.</p>
                  </div>
                </div>
                <label>
                  Button words
                  <input name="ctaLabel" defaultValue={copy.destara.ctaLabel} />
                </label>
                <label>
                  App website
                  <input name="appUrl" defaultValue={copy.destara.appUrl} />
                  <span className="field-hint">Usually https://destara.app</span>
                </label>
              </section>
              <section id="part-facts" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Side facts</h2>
                    <p>Short facts in the side box, such as platforms and launch year.</p>
                  </div>
                </div>
                <RepeatCards
                  itemLabel="Fact"
                  initial={copy.destara.facts.map((row) => ({ factLabel: row.label, factValue: row.value }))}
                  fields={[
                    { name: "factLabel", label: "Label" },
                    { name: "factValue", label: "Fact" }
                  ]}
                />
              </section>
              <section className="shop-card admin-form">
                <SeoFields title={copy.destara.seoTitle} description={copy.destara.seoDescription} />
                <button className="btn" type="submit">
                  {saveLabel}
                </button>
              </section>
            </form>
          )}

          {page.id === "frigga" && (
            <form id="story-form" action={saveFriggaCopyAction} className="story-form">
              <input type="hidden" name="friggaListsMode" value="cards" />
              <section id="part-top" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Top of the Frigga page</h2>
                    <p>The first words and the shop button.</p>
                  </div>
                </div>
                <label>
                  Small line above the heading
                  <input name="kicker" defaultValue={copy.frigga.kicker} />
                </label>
                <label>
                  Page heading
                  <input name="title" defaultValue={copy.frigga.title} />
                </label>
                <label>
                  Opening paragraph
                  <textarea name="body" rows={4} defaultValue={copy.frigga.body} />
                </label>
                <label>
                  Shop button words
                  <input name="shopLabel" defaultValue={copy.frigga.shopLabel} />
                </label>
                <label>
                  Main shop website
                  <input name="shopUrl" defaultValue={copy.frigga.shopUrl} />
                </label>
                <label>
                  Browse button words
                  <input name="browseLabel" defaultValue={copy.frigga.browseLabel} />
                </label>
              </section>
              <section id="part-stores" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Stores</h2>
                    <p>Philippines, UK, USA, and any other Frigga shops.</p>
                  </div>
                </div>
                <RepeatCards
                  itemLabel="Store"
                  initial={copy.frigga.shops.map((row) => ({ storeFlag: row.flag, storeName: row.label, storeUrl: row.url }))}
                  fields={[
                    { name: "storeFlag", label: "Flag", hint: "A flag emoji is fine, such as 🇵🇭" },
                    { name: "storeName", label: "Name people see" },
                    { name: "storeUrl", label: "Website" }
                  ]}
                />
              </section>
              <section id="part-collections" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Collections</h2>
                    <p>The charm groups, such as Wealth or Love.</p>
                  </div>
                </div>
                <label>
                  Section heading
                  <input name="collectionsHeading" defaultValue={copy.frigga.collectionsHeading} />
                </label>
                <label>
                  Intro
                  <textarea name="collectionsBody" rows={2} defaultValue={copy.frigga.collectionsBody} />
                </label>
                <RepeatCards
                  itemLabel="Collection"
                  initial={copy.frigga.collections.map((row) => ({
                    collectionId: row.id,
                    collectionTitle: row.title,
                    collectionDesc: row.desc
                  }))}
                  fields={[
                    { name: "collectionTitle", label: "Name" },
                    { name: "collectionDesc", label: "Short description", kind: "textarea", rows: 2 },
                    { name: "collectionId", label: "Short code", hint: "Leave this as it is unless you were shown how. Example: wealth" }
                  ]}
                />
              </section>
              <section id="part-guide" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Planner and almanac</h2>
                    <p>The yearly guide block.</p>
                  </div>
                </div>
                <label>
                  Small line
                  <input name="guideKicker" defaultValue={copy.frigga.guideKicker} />
                </label>
                <label>
                  Heading
                  <input name="guideTitle" defaultValue={copy.frigga.guideTitle} />
                </label>
                <label>
                  Writing
                  <textarea name="guideBody" rows={3} defaultValue={copy.frigga.guideBody} />
                </label>
                <label>
                  What is inside
                  <textarea name="guidePerks" rows={4} defaultValue={copy.frigga.guidePerks.join("\n")} />
                  <span className="field-hint">One line per point.</span>
                </label>
                <label>
                  Button words
                  <input name="guideCta" defaultValue={copy.frigga.guideCta} />
                </label>
              </section>
              <section id="part-marketplaces" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Marketplaces</h2>
                    <p>Other shops where Frigga is sold.</p>
                  </div>
                </div>
                <label>
                  Section heading
                  <input name="marketplacesHeading" defaultValue={copy.frigga.marketplacesHeading} />
                </label>
                <label>
                  Intro
                  <textarea name="marketplacesBody" rows={2} defaultValue={copy.frigga.marketplacesBody} />
                </label>
                <label>
                  Marketplace names
                  <textarea name="marketplaces" rows={3} defaultValue={copy.frigga.marketplaces.join("\n")} />
                  <span className="field-hint">One name per line.</span>
                </label>
              </section>
              <section className="shop-card admin-form">
                <SeoFields title={copy.frigga.seoTitle} description={copy.frigga.seoDescription} />
                <button className="btn" type="submit">
                  {saveLabel}
                </button>
              </section>
            </form>
          )}

          {page.id === "forecast" && (
            <form id="story-form" action={saveForecastCopyAction} className="story-form">
              <input type="hidden" name="forecastMode" value="cards" />
              <section id="part-years" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Which year shows first</h2>
                    <p>The year people land on, and the years in the menu.</p>
                  </div>
                </div>
                <label>
                  Default year
                  <input name="defaultYear" defaultValue={copy.forecast.defaultYear} />
                </label>
                <RepeatCards
                  itemLabel="Year in the menu"
                  initial={copy.forecast.navYears.map((row) => ({ navYear: row.year, navLabel: row.label }))}
                  fields={[
                    { name: "navYear", label: "Year", hint: "Example: 2026" },
                    { name: "navLabel", label: "Menu label", hint: "Example: 2026 Fire Horse" }
                  ]}
                />
              </section>
              <section id="part-writing" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Year writing</h2>
                    <p>The main forecast for each year. Change the words here — you do not need any special typing.</p>
                  </div>
                </div>
                <RepeatCards
                  itemLabel="Year"
                  initial={copy.forecast.years.map((row) => ({
                    fyYear: row.year,
                    fyAnimal: row.animal,
                    fyLabel: row.label,
                    fyElement: row.element,
                    fyCny: row.cny,
                    fyIntro: row.intro,
                    fyLead: row.lead,
                    fyBody1: row.body1,
                    fyBody2: row.body2
                  }))}
                  fields={[
                    { name: "fyYear", label: "Year" },
                    { name: "fyAnimal", label: "Animal" },
                    { name: "fyLabel", label: "Short label" },
                    { name: "fyElement", label: "Element" },
                    { name: "fyCny", label: "Chinese New Year date" },
                    { name: "fyIntro", label: "Intro", kind: "textarea", rows: 3 },
                    { name: "fyLead", label: "Lead paragraph", kind: "textarea", rows: 4 },
                    { name: "fyBody1", label: "Next paragraph", kind: "textarea", rows: 4 },
                    { name: "fyBody2", label: "Closing paragraph", kind: "textarea", rows: 4 }
                  ]}
                />
              </section>
              <section id="part-advanced" className="shop-card admin-form">
                <EasyMore title="Zodiac signs and flying stars (optional)">
                  <p className="field-hint">Each sign has its own short reading. Flying stars are the numbered energies for the year.</p>
                  <RepeatCards
                    itemLabel="Zodiac sign"
                    initial={copy.forecast.zodiacs.map((row) => ({
                      zxId: row.id,
                      zxSign: row.sign,
                      zxYears: row.years,
                      zxText: row.text,
                      zxFocus: row.focus
                    }))}
                    fields={[
                      { name: "zxSign", label: "Sign" },
                      { name: "zxYears", label: "Birth years" },
                      { name: "zxText", label: "Reading", kind: "textarea", rows: 4 },
                      { name: "zxFocus", label: "Focus" },
                      { name: "zxId", label: "Short code", hint: "Leave this as it is unless you were shown how." }
                    ]}
                  />
                  <RepeatCards
                    itemLabel="Flying star"
                    initial={copy.forecast.stars.map((row) => ({ starTitle: row.title, starText: row.text }))}
                    fields={[
                      { name: "starTitle", label: "Title" },
                      { name: "starText", label: "Writing", kind: "textarea", rows: 3 }
                    ]}
                  />
                </EasyMore>
                <SeoFields title={copy.forecast.seoTitle} description={copy.forecast.seoDescription} />
                <button className="btn" type="submit">
                  {saveLabel}
                </button>
              </section>
            </form>
          )}

          {page.id === "projects" && (
            <form id="story-form" action={saveProjectsCopyAction} className="story-form">
              <input type="hidden" name="projectsMode" value="cards" />
              <section id="part-top" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Top of the Projects page</h2>
                    <p>The heading and intro above the list of brands.</p>
                  </div>
                </div>
                <label>
                  Small line above the heading
                  <input name="kicker" defaultValue={copy.projects.kicker} />
                </label>
                <label>
                  Page heading
                  <input name="title" defaultValue={copy.projects.title} />
                </label>
                <label>
                  Opening paragraph
                  <textarea name="body" rows={3} defaultValue={copy.projects.body} />
                </label>
              </section>
              <section id="part-projects" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Each project</h2>
                    <p>One card per brand or piece of work. Add or remove as needed.</p>
                  </div>
                </div>
                <RepeatCards
                  itemLabel="Project"
                  initial={copy.projects.items.map((row) => ({
                    projectId: row.id,
                    projectCategory: row.category,
                    projectName: row.name,
                    projectSummary: row.summary,
                    projectBody1: row.body1,
                    projectBody2: row.body2
                  }))}
                  fields={[
                    { name: "projectName", label: "Name" },
                    { name: "projectCategory", label: "Type", hint: "Example: Fashion & Retail" },
                    { name: "projectSummary", label: "One-line summary", kind: "textarea", rows: 2 },
                    { name: "projectBody1", label: "First paragraph", kind: "textarea", rows: 4 },
                    { name: "projectBody2", label: "Second paragraph", kind: "textarea", rows: 4 },
                    { name: "projectId", label: "Short code", hint: "Leave this as it is unless you were shown how." }
                  ]}
                />
              </section>
              <section className="shop-card admin-form">
                <SeoFields title={copy.projects.seoTitle} description={copy.projects.seoDescription} />
                <button className="btn" type="submit">
                  {saveLabel}
                </button>
              </section>
            </form>
          )}

          {page.id === "home" && (
            <form id="story-form" action={saveHomeExtrasAction} className="story-form">
              <input type="hidden" name="next" value="/admin/copy?tab=home" />
              <section id="part-about" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>About strip on the homepage</h2>
                    <p>The teaser about Marites, not the full About page.</p>
                  </div>
                </div>
                <label>
                  Small line
                  <input name="aboutKicker" defaultValue={copy.home.aboutKicker} />
                </label>
                <label>
                  Heading
                  <input name="aboutHeading" defaultValue={copy.home.aboutHeading} />
                </label>
                <label>
                  Writing
                  <textarea name="aboutBody" rows={4} defaultValue={copy.home.aboutBody} />
                </label>
                <label>
                  Button words
                  <input name="aboutCta" defaultValue={copy.home.aboutCta} />
                </label>
                <PhotoField name="aboutImageUrl" value={copy.home.aboutImageUrl} alt="About photo on the homepage" photos={photos} />
              </section>
              <section id="part-press" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Press and speaking</h2>
                    <p>Names shown on the homepage.</p>
                  </div>
                </div>
                <label>
                  Press label
                  <input name="pressLabel" defaultValue={copy.home.pressLabel} />
                </label>
                <label>
                  Badge on the photo
                  <input name="pressBadge" defaultValue={copy.home.pressBadge} />
                </label>
                <label>
                  Press names
                  <textarea name="pressNames" rows={5} defaultValue={copy.home.pressNames.join("\n")} />
                  <span className="field-hint">One name per line.</span>
                </label>
                <label>
                  Speaking label
                  <input name="speakingLabel" defaultValue={copy.home.speakingLabel} />
                </label>
                <label>
                  Speaking clients
                  <textarea name="speakingClients" rows={8} defaultValue={copy.home.speakingClients.join("\n")} />
                  <span className="field-hint">One name per line.</span>
                </label>
              </section>
              <section id="part-destara" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Destara strip</h2>
                    <p>The Destara block on the homepage. Service names and prices are under Services.</p>
                  </div>
                </div>
                <label>
                  Heading
                  <input name="destaraHeading" defaultValue={copy.home.destaraHeading} />
                </label>
                <label>
                  Writing
                  <textarea name="destaraBody" rows={4} defaultValue={copy.home.destaraBody} />
                </label>
                <div className="fields-2">
                  <label>
                    Badge 1
                    <input name="destaraBadge1" defaultValue={copy.home.destaraBadge1} />
                  </label>
                  <label>
                    Badge 2
                    <input name="destaraBadge2" defaultValue={copy.home.destaraBadge2} />
                  </label>
                  <label>
                    Main button
                    <input name="destaraCta" defaultValue={copy.home.destaraCta} />
                  </label>
                  <label>
                    More button
                    <input name="destaraMore" defaultValue={copy.home.destaraMore} />
                  </label>
                </div>
                <label>
                  Destara website
                  <input name="destaraUrl" defaultValue={copy.home.destaraUrl} />
                </label>
                <input type="hidden" name="homeListsMode" value="cards" />
                <RepeatCards
                  itemLabel="Benefit"
                  initial={copy.home.destaraBenefits.map((row) => ({
                    benefitTitle: row.title,
                    benefitDesc: row.desc
                  }))}
                  fields={[
                    { name: "benefitTitle", label: "Title" },
                    { name: "benefitDesc", label: "Short description", kind: "textarea", rows: 2 }
                  ]}
                />
              </section>
              <section id="part-services" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Services strip</h2>
                    <p>The words above the service cards. The cards themselves are edited under Services.</p>
                  </div>
                </div>
                <label>
                  Small line
                  <input name="servicesKicker" defaultValue={copy.home.servicesKicker} />
                </label>
                <label>
                  Heading
                  <input name="servicesHeading" defaultValue={copy.home.servicesHeading} />
                </label>
                <label>
                  Intro
                  <textarea name="servicesBody" rows={3} defaultValue={copy.home.servicesBody} />
                </label>
              </section>
              <section id="part-bespoke" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Bespoke and coming soon</h2>
                  </div>
                </div>
                <label>
                  Bespoke small line
                  <input name="bespokeKicker" defaultValue={copy.home.bespokeKicker} />
                </label>
                <label>
                  Bespoke heading
                  <input name="bespokeHeading" defaultValue={copy.home.bespokeHeading} />
                </label>
                <label>
                  Bespoke button
                  <input name="bespokeCta" defaultValue={copy.home.bespokeCta} />
                </label>
                <label>
                  Coming-soon small line
                  <input name="comingKicker" defaultValue={copy.home.comingKicker} />
                </label>
                <label>
                  Coming-soon heading
                  <input name="comingHeading" defaultValue={copy.home.comingHeading} />
                </label>
                <label>
                  Coming-soon writing
                  <textarea name="comingBody" rows={3} defaultValue={copy.home.comingBody} />
                </label>
                <label>
                  Coming-soon button
                  <input name="comingCta" defaultValue={copy.home.comingCta} />
                </label>
                <label>
                  Promise chips
                  <textarea name="guarantees" rows={4} defaultValue={copy.home.guarantees.join("\n")} />
                  <span className="field-hint">One short promise per line.</span>
                </label>
              </section>
              <section id="part-frigga" className="shop-card admin-form">
                <div className="shop-card-head">
                  <div>
                    <h2>Frigga strip</h2>
                    <p>The Frigga block on the homepage.</p>
                  </div>
                </div>
                <label>
                  Heading
                  <input name="friggaHeading" defaultValue={copy.home.friggaHeading} />
                </label>
                <label>
                  Writing
                  <textarea name="friggaBody" rows={3} defaultValue={copy.home.friggaBody} />
                </label>
                <label>
                  Button words
                  <input name="friggaCta" defaultValue={copy.home.friggaCta} />
                </label>
                <RepeatCards
                  itemLabel="Browse button"
                  initial={copy.home.friggaBrowse.map((row) => ({
                    browseLabel: row.label,
                    browseUrl: row.url || row.href || ""
                  }))}
                  fields={[
                    { name: "browseLabel", label: "Button words" },
                    { name: "browseUrl", label: "Goes to" }
                  ]}
                />
                <RepeatCards
                  itemLabel="Region"
                  initial={copy.home.friggaRegions.map((row) => ({
                    regionName: row.region,
                    regionDomain: row.domain,
                    regionUrl: row.url
                  }))}
                  fields={[
                    { name: "regionName", label: "Place" },
                    { name: "regionDomain", label: "Website name" },
                    { name: "regionUrl", label: "Link" }
                  ]}
                />
                <button className="btn" type="submit">
                  {saveLabel}
                </button>
              </section>
            </form>
          )}

          <div className="shop-card">
            <h2>Not the page you want?</h2>
            <ul className="shop-related">
              <li>
                <Link href="/admin/homepage">Homepage top banner</Link>
              </li>
              <li>
                <Link href="/admin/consultations">Services and prices</Link>
              </li>
              <li>
                <Link href="/admin/articles">News and press</Link>
              </li>
              <li>
                <Link href="/admin/events">Events</Link>
              </li>
              <li>
                <Link href="/admin/pages">All pages</Link>
              </li>
              <li>
                <Link href={`/admin/live?page=${encodeURIComponent(page.path)}`}>Edit this page live</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

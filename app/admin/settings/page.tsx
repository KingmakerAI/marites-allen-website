import { requireUser } from "@/lib/cms/auth";
import { getSettings } from "@/lib/cms/repo";
import { saveSettingsAction } from "../actions";
import { RepeatCards } from "../copy-fields";
import { Flash, ShopHead } from "../ui";
import { ensureSeeded } from "@/lib/cms/seed";

export default async function SettingsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  ensureSeeded();
  const q = await searchParams;
  const s = getSettings();
  if (!s) return <p>Settings not seeded.</p>;
  return (
    <div className="shop-page">
      <ShopHead title="Settings" sub="The website name, phone numbers, and booking button. Press Save when you are done." viewHref="/" viewLabel="See the website" />
      <Flash saved={q.saved} />
      <form action={saveSettingsAction} className="shop-body shop-body-settings">
        <div className="shop-main">
          <div className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>Website name</h2>
                <p>This is how the site introduces itself.</p>
              </div>
            </div>
            <label>
              Site name
              <input name="siteName" defaultValue={s.general.siteName} />
            </label>
            <label>
              Tagline
              <input name="tagline" defaultValue={s.general.tagline} />
            </label>
            <label>
              Picture for the logo
              <input name="logoUrl" defaultValue={s.general.logoUrl} placeholder="/images/brand/marites-allen-logo.png" />
              <span className="field-hint">Official mark is forest green on a clear background. Do not use a white version.</span>
            </label>
          </div>

          <div className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>Contact</h2>
              </div>
            </div>
            <div className="fields-2">
              <label>
                Email
                <input name="email" defaultValue={s.contact.email} />
              </label>
              <label>
                Secondary email
                <input name="emailSecondary" defaultValue={s.contact.emailSecondary} />
              </label>
              <label>
                Phone
                <input name="phone" defaultValue={s.contact.phone} />
              </label>
              <label>
                Secondary phone
                <input name="phoneSecondary" defaultValue={s.contact.phoneSecondary} />
              </label>
            </div>
            <label>
              WhatsApp (digits)
              <input name="whatsapp" defaultValue={s.contact.whatsapp} />
            </label>
          </div>

          <div className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>How Google describes the site</h2>
                <p>This shows up in search results if a page does not have its own.</p>
              </div>
            </div>
            <label>
              Title
              <input name="seoTitle" defaultValue={s.seoDefaults.title} />
            </label>
            <label>
              Description
              <textarea name="seoDescription" rows={3} defaultValue={s.seoDefaults.description} />
            </label>
            <label>
              Picture for sharing
              <input name="ogImage" defaultValue={s.seoDefaults.ogImage} />
            </label>
          </div>

          <div className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>Booking</h2>
              </div>
            </div>
            <div className="fields-2">
              <label>
                Booking page
                <input name="bookingUrl" defaultValue={s.business.bookingUrl} />
              </label>
              <label>
                Currency
                <input name="currency" defaultValue={s.business.currency} />
              </label>
              <label>
                Words on the top booking button
                <input name="comingSoonLabel" defaultValue={s.business.comingSoonLabel || "Coming Soon"} />
              </label>
              <label>
                Words on other booking buttons
                <input name="bookCtaLabel" defaultValue={s.business.bookCtaLabel || "Book Consultation · Coming Soon →"} />
              </label>
            </div>
          </div>

          <div className="shop-card admin-form">
            <div className="shop-card-head">
              <div>
                <h2>Social media</h2>
                <p>Links to Facebook, Instagram, and more.</p>
              </div>
            </div>
            <input type="hidden" name="socialMode" value="cards" />
            <h3 className="admin-h2">Marites links</h3>
            <RepeatCards
              itemLabel="Link"
              initial={s.social.map((row) => ({
                socialId: row.id,
                socialLabel: row.label,
                socialHandle: row.handle,
                socialHref: row.href
              }))}
              fields={[
                { name: "socialLabel", label: "Name" },
                { name: "socialHandle", label: "Handle" },
                { name: "socialHref", label: "Link" },
                { name: "socialId", label: "Short id (optional)", hint: "Leave blank and we will make one." }
              ]}
            />
            <h3 className="admin-h2">Frigga links</h3>
            <RepeatCards
              itemLabel="Link"
              initial={s.friggaSocial.map((row) => ({
                friggaId: row.id,
                friggaLabel: row.label,
                friggaHandle: row.handle,
                friggaHref: row.href
              }))}
              fields={[
                { name: "friggaLabel", label: "Name" },
                { name: "friggaHandle", label: "Handle" },
                { name: "friggaHref", label: "Link" },
                { name: "friggaId", label: "Short id (optional)" }
              ]}
            />
          </div>
        </div>

        <aside className="shop-aside">
          <div className="shop-card">
            <h2>Save</h2>
            <p className="shop-aside-copy">Press Save to keep every change on this page.</p>
            <button className="btn" type="submit">
              Save settings
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

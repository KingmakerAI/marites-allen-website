import { requireUser } from "@/lib/cms/auth";
import { getPageCopy, listPricing, listServices } from "@/lib/cms/repo";
import type { ConsultationService, PricingRow } from "@/lib/cms/types";
import { deleteServiceAction, saveBookCopyAction, saveServiceAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { PreviewEditor } from "../preview-editor";
import { Flash } from "../ui";

function ServiceFields({
  service,
  price
}: {
  service?: ConsultationService;
  price?: PricingRow;
}) {
  return (
    <>
      {service && <input type="hidden" name="id" value={service.id} />}
      {price && <input type="hidden" name="pricingId" value={price.id} />}
      <input type="hidden" name="sortOrder" value={service?.sortOrder ?? 99} />
      <div className="service-row">
        <label>
          Name
          <input name="name" required defaultValue={service?.name} placeholder="Personal Destiny Reading" />
        </label>
        <label>
          Price
          <input name="price" type="number" min={0} defaultValue={price?.price ?? ""} placeholder="0" />
        </label>
        <label>
          Promo
          <input name="promoPrice" type="number" min={0} defaultValue={price?.promoPrice ?? ""} placeholder="Optional" />
        </label>
        <label>
          Currency
          <input name="currency" defaultValue={price?.currency || "USD"} />
        </label>
      </div>
      <label>
        Short description
        <textarea name="description" rows={3} defaultValue={service?.description} placeholder="What this consultation includes" />
      </label>
      <div className="service-row service-row-2">
        <label>
          Duration
          <input name="duration" defaultValue={service?.duration} placeholder="45–60 min" />
        </label>
        <label>
          Category
          <input name="categoryLabel" defaultValue={service?.categoryLabel} placeholder="Personal" />
        </label>
        <label className="service-check">
          <input type="checkbox" name="active" defaultChecked={service?.active !== false} /> Show on the website
        </label>
      </div>
      <details>
        <summary>More options</summary>
        <div className="service-more">
          <label>
            Price note
            <input name="note" defaultValue={price?.note} placeholder="From, starting at, etc." />
          </label>
          <label>
            Ideal for
            <input name="idealFor" defaultValue={service?.idealFor} />
          </label>
          <label>
            Button text
            <input name="ctaText" defaultValue={service?.ctaText || "Enquire"} />
          </label>
          <label>
            Booking link
            <input name="bookingUrl" defaultValue={service?.bookingUrl || "/book"} />
          </label>
          <label>
            Link name
            <input name="slug" defaultValue={service?.slug} placeholder="we will make this from the name" />
          </label>
          <div className="service-checks">
            <label>
              <input type="checkbox" name="featured" defaultChecked={service?.featured} /> Featured
            </label>
            <label>
              <input type="checkbox" name="flagBirth" defaultChecked={service?.flags?.birth} /> Needs birth details
            </label>
            <label>
              <input type="checkbox" name="flagProperty" defaultChecked={service?.flags?.property} /> Property
            </label>
            <label>
              <input type="checkbox" name="flagCompany" defaultChecked={service?.flags?.company} /> Company
            </label>
            <label>
              <input type="checkbox" name="flagEvent" defaultChecked={service?.flags?.event} /> Event
            </label>
          </div>
        </div>
      </details>
    </>
  );
}

export default async function ConsultationsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const services = listServices();
  const pricing = listPricing();
  const book = getPageCopy().book;

  return (
    <div>
      <div className="admin-page-head">
        <h1 className="admin-h1">Services</h1>
        <p className="admin-sub">
          These are the bookings people can ask for. Change the name, price, and short description. Tick “Show on the website” when it is ready.
        </p>
        <Flash saved={q.saved} />
      </div>

      {services.map((service) => (
        <div key={service.id} className="admin-card" style={{ marginBottom: 16 }}>
          <PreviewEditor kind="consultation">
            <form action={saveServiceAction} className="admin-form service-editor">
              <ServiceFields service={service} price={pricing.find((p) => p.serviceId === service.id)} />
              <div className="admin-actions">
                <button className="btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </PreviewEditor>
          <form action={deleteServiceAction} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={service.id} />
            <ConfirmSubmit label="Delete" message="Delete this consultation and its price?" />
          </form>
        </div>
      ))}

      <details className="admin-card" open={services.length === 0}>
        <summary style={{ fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>Add a service</summary>
        <PreviewEditor kind="consultation">
          <form action={saveServiceAction} className="admin-form service-editor">
            <ServiceFields />
            <button className="btn" type="submit">
              Add service
            </button>
          </form>
        </PreviewEditor>
      </details>

      <form action={saveBookCopyAction} className="admin-card admin-form" style={{ marginTop: 28 }}>
        <h2 className="admin-h2">Words on the Book page</h2>
        <p className="admin-sub">These show on /book, next to the enquiry form. Prices above also appear there.</p>
        <label>
          Title
          <input name="title" defaultValue={book.title} />
        </label>
        <label>
          Small label
          <input name="kicker" defaultValue={book.kicker} />
        </label>
        <label>
          Introduction
          <textarea name="intro" rows={3} defaultValue={book.intro} />
        </label>
        <label>
          Form heading
          <input name="formTitle" defaultValue={book.formTitle} />
        </label>
        <label>
          Form intro
          <textarea name="formBody" rows={2} defaultValue={book.formBody} />
        </label>
        <div className="service-row service-row-2">
          <label>
            Send button
            <input name="submitLabel" defaultValue={book.submitLabel} />
          </label>
          <label>
            Thank-you heading
            <input name="successTitle" defaultValue={book.successTitle} />
          </label>
        </div>
        <label>
          Thank-you message
          <textarea name="successBody" rows={2} defaultValue={book.successBody} />
        </label>
        <details>
          <summary>Search listing (optional)</summary>
          <label>
            Browser title
            <input name="seoTitle" defaultValue={book.seoTitle} />
          </label>
          <label>
            Short description
            <textarea name="seoDescription" rows={2} defaultValue={book.seoDescription} />
          </label>
        </details>
        <button className="btn" type="submit">
          Save book page
        </button>
      </form>
    </div>
  );
}

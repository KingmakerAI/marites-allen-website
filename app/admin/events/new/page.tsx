import { requireUser } from "@/lib/cms/auth";
import { saveEventAction } from "../../actions";
import { PreviewEditor } from "../../preview-editor";
import { EasyMore, ShopHead, StatusSelect } from "../../ui";
import type { CmsEvent } from "@/lib/cms/types";

function toDateTimeLocal(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventForm({ event }: { event?: CmsEvent | null }) {
  return (
    <form action={saveEventAction} className="admin-form shop-card">
      {event && <input type="hidden" name="id" value={event.id} />}
      <p className="field-hint">Tell people what, when, and where. Check the preview before you show it.</p>
      <label>
        Event name
        <input name="title" required defaultValue={event?.title} placeholder="Chinese New Year talk" />
      </label>
      <label>
        What is it about?
        <textarea name="summary" rows={4} defaultValue={event?.summary} />
      </label>
      <div className="fields-2">
        <label>
          Starts
          <input name="startsAt" type="datetime-local" required defaultValue={toDateTimeLocal(event?.startsAt)} />
        </label>
        <label>
          Ends
          <input name="endsAt" type="datetime-local" required defaultValue={toDateTimeLocal(event?.endsAt)} />
        </label>
      </div>
      <div className="fields-2">
        <label>
          Date in words
          <input name="whenLabel" defaultValue={event?.whenLabel} placeholder="Saturday 7pm" />
        </label>
        <label>
          Place in words
          <input name="whereLabel" defaultValue={event?.whereLabel} placeholder="Manila House" />
        </label>
      </div>
      <label>
        Picture link
        <input name="imageUrl" defaultValue={event?.imageUrl} placeholder="/uploads/event.jpg" />
      </label>
      <StatusSelect value={event?.status} />
      <EasyMore>
        <label>
          Small label above the title
          <input name="eyebrow" defaultValue={event?.eyebrow} placeholder="Live event" />
        </label>
        <label>
          One-line tagline
          <input name="tagline" defaultValue={event?.tagline} />
        </label>
        <label>
          Venue name
          <input name="venue" defaultValue={event?.venue} />
        </label>
        <label>
          Button words
          <input name="ctaLabel" defaultValue={event?.ctaLabel} placeholder="Get tickets" />
        </label>
        <label>
          Button goes to
          <input name="ctaHref" defaultValue={event?.ctaHref} />
        </label>
        <label>
          Watch live link
          <input name="liveUrl" defaultValue={event?.liveUrl} />
        </label>
        <label>
          Link name
          <input name="slug" defaultValue={event?.slug} placeholder="leave blank and we will make one" />
        </label>
        <label>
          Order on the list
          <input name="sortOrder" type="number" defaultValue={event?.sortOrder || 0} />
          <span className="field-hint">Smaller numbers show first.</span>
        </label>
      </EasyMore>
      <button className="btn" type="submit">
        Save
      </button>
    </form>
  );
}

export default async function NewEvent() {
  await requireUser();
  return (
    <div className="shop-page">
      <ShopHead title="New event" sub="Fill in the name, time, and place. Look at the preview, then show it when it is ready." />
      <div className="shop-copy shop-copy-wide">
        <PreviewEditor kind="event">
          <EventForm />
        </PreviewEditor>
      </div>
    </div>
  );
}

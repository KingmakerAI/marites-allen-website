import { notFound } from "next/navigation";
import { requireUser } from "@/lib/cms/auth";
import { listEvents } from "@/lib/cms/repo";
import { PreviewEditor } from "../../preview-editor";
import { Flash, ShopHead } from "../../ui";
import { EventForm } from "../new/page";

export default async function EditEvent({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const q = await searchParams;
  const event = listEvents().find((e) => e.id === id);
  if (!event) notFound();
  return (
    <div className="shop-page">
      <ShopHead
        title="Edit event"
        sub="Change the details, check the preview, then save."
        viewHref={event.status === "published" ? "/events" : undefined}
        viewLabel="See events page"
      />
      <Flash saved={q.saved} />
      <div className="shop-copy shop-copy-wide">
        <PreviewEditor kind="event" liveHref={event.status === "published" ? "/events" : undefined}>
          <EventForm event={event} />
        </PreviewEditor>
      </div>
    </div>
  );
}

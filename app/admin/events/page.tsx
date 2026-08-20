import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { getPageCopy, listEvents } from "@/lib/cms/repo";
import { parseTalkLines, parseVideoLines } from "@/lib/cms/copy-lines";
import { deleteEventAction, saveEventsPageCopyAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { RepeatCards } from "../copy-fields";
import { Flash, statusLabel } from "../ui";

export default async function EventsList({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const rows = listEvents();
  const copy = getPageCopy().eventsPage;
  const talks = parseTalkLines(copy.speakingLines);
  const videos = parseVideoLines(copy.videos);
  return (
    <div>
      <h1 className="admin-h1">Events</h1>
      <p className="admin-sub">Talks and gatherings. They only show on the website when you choose “Show it”.</p>
      <Flash saved={q.saved} />
      <p>
        <Link className="btn" href="/admin/events/new">
          New event
        </Link>
      </p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>When</th>
            <th>Who can see it</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>{e.whenLabel || new Date(e.startsAt).toLocaleString()}</td>
              <td>
                <span className="badge">{statusLabel(e.status)}</span>
              </td>
              <td>
                <div className="admin-actions">
                  <Link className="btn secondary" href={`/admin/events/${e.id}`}>
                    Edit
                  </Link>
                  <form action={deleteEventAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <ConfirmSubmit label="Delete" message="Delete this event?" />
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form action={saveEventsPageCopyAction} className="admin-card admin-form" style={{ marginTop: 28 }}>
        <input type="hidden" name="eventsListsMode" value="cards" />
        <h2 className="admin-h2">Words at the top of Events</h2>
        <p className="admin-sub">The event cards above are the live dates. These boxes change the rest of the page.</p>
        <label>
          Title
          <input name="title" defaultValue={copy.title} />
        </label>
        <label>
          Small label
          <input name="kicker" defaultValue={copy.kicker} />
        </label>
        <label>
          Introduction
          <textarea name="intro" rows={3} defaultValue={copy.intro} />
        </label>
        <label>
          Speaking heading
          <input name="speakingHeading" defaultValue={copy.speakingHeading} />
        </label>
        <RepeatCards
          itemLabel="Speaking engagement"
          initial={talks.map((row) => ({ speakingOrg: row.org, speakingTopic: row.topic }))}
          fields={[
            { name: "speakingOrg", label: "Organisation" },
            { name: "speakingTopic", label: "Topic" }
          ]}
        />
        <label>
          Videos heading
          <input name="videosHeading" defaultValue={copy.videosHeading} />
        </label>
        <RepeatCards
          itemLabel="Video"
          initial={videos.map((row) => ({
            videoSource: row.source,
            videoTitle: row.title,
            videoYt: row.yt
          }))}
          fields={[
            { name: "videoSource", label: "Source / show" },
            { name: "videoTitle", label: "Title" },
            { name: "videoYt", label: "YouTube id", hint: "The letters after watch?v= in the YouTube link." }
          ]}
        />
        <details>
          <summary>Search listing (optional)</summary>
          <label>
            Browser title
            <input name="seoTitle" defaultValue={copy.seoTitle} />
          </label>
          <label>
            Short description
            <textarea name="seoDescription" rows={2} defaultValue={copy.seoDescription} />
          </label>
        </details>
        <button className="btn" type="submit">
          Save events page
        </button>
      </form>
    </div>
  );
}

import { requireUser } from "@/lib/cms/auth";
import { listMedia, mediaInUse } from "@/lib/cms/repo";
import { deleteMediaAction, updateMediaAltAction, uploadMediaAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { Flash } from "../ui";

export default async function MediaPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string; q?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const items = listMedia(q.q);
  return (
    <div>
      <h1 className="admin-h1">Photos</h1>
      <p className="admin-sub">Upload pictures to use on the website. Describe each photo so people who cannot see it still know what it is.</p>
      <Flash saved={q.saved} error={q.error} />
      <form action={uploadMediaAction} className="admin-form">
        <label>
          Choose a picture
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
          <span className="field-hint">JPG, PNG, WebP, or GIF. Keep it under 8MB.</span>
        </label>
        <label>
          Describe this photo
          <input name="altText" required placeholder="Marites smiling at a talk" />
        </label>
        <button className="btn" type="submit">
          Add photo
        </button>
      </form>
      <form style={{ margin: "20px 0" }}>
        <input name="q" placeholder="Search" defaultValue={q.q} />
        <button className="btn secondary" type="submit">
          Search
        </button>
      </form>
      <div className="media-grid">
        {items.map((m) => {
          const used = mediaInUse(m.id);
          return (
            <div key={m.id} className="admin-card media-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.path} alt={m.altText} />
              <div style={{ fontSize: 12, marginTop: 8 }}>{m.filename}</div>
              <form action={updateMediaAltAction}>
                <input type="hidden" name="id" value={m.id} />
                <input name="altText" defaultValue={m.altText} />
                <button className="btn secondary" type="submit">
                  Save description
                </button>
              </form>
              {used ? (
                <p style={{ fontSize: 12 }}>This photo is used on the website, so it cannot be deleted yet.</p>
              ) : (
                <form action={deleteMediaAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmSubmit label="Delete" message="Delete this file?" />
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

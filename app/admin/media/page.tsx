import Image from "next/image";
import { requireUser } from "@/lib/cms/auth";
import { listMedia, mediaInUse } from "@/lib/cms/repo";
import { STORAGE_SETUP_HINT, persistenceMode } from "@/lib/cms/store";
import { deleteMediaAction, updateMediaAltAction, uploadMediaAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { Flash } from "../ui";

function mediaError(error?: string) {
  if (!error) return undefined;
  if (error === "inuse") return "inuse";
  if (error === "storage") return `This photo was not saved. ${STORAGE_SETUP_HINT}`;
  if (error === "type") return "Use a JPG, PNG, WebP, or GIF.";
  if (error === "size") return "That photo is over 4MB. Use a smaller file.";
  return "The photo could not be saved.";
}

function AdminPhoto({ src, alt }: { src: string; alt: string }) {
  if (!src) return null;
  if (/^https?:/i.test(src)) {
    return (
      // Remote photos stay as a plain image so a Blob hostname cannot crash this screen.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
    );
  }
  return (
    <Image src={src} alt={alt} width={480} height={320} sizes="(max-width: 800px) 100vw, 320px" style={{ width: "100%", height: "auto", objectFit: "cover" }} />
  );
}

export default async function MediaPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string; q?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const items = await listMedia(q.q);
  const usedIds = new Set<string>();
  for (const item of items) {
    if (await mediaInUse(item.id)) usedIds.add(item.id);
  }
  const ephemeral = persistenceMode() === "ephemeral";
  return (
    <div>
      <h1 className="admin-h1">Photos</h1>
      <p className="admin-sub">Upload pictures to use on the website. Describe each photo so people who cannot see it still know what it is.</p>
      {ephemeral ? (
        <div className="flash error" role="alert">
          Photos cannot be stored on this host yet. {STORAGE_SETUP_HINT}
        </div>
      ) : null}
      <Flash saved={q.saved} error={mediaError(q.error)} />
      <form action={uploadMediaAction} className="admin-form">
        <label>
          Choose a picture
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
          <span className="field-hint">JPG, PNG, WebP, or GIF. Keep it under 4MB.</span>
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
          const used = usedIds.has(m.id);
          return (
            <div key={m.id} className="admin-card media-card">
              <AdminPhoto src={m.path} alt={m.altText} />
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

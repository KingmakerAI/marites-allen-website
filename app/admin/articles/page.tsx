import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { parseVideoLines } from "@/lib/cms/copy-lines";
import { getPageCopy, listArticles, listCategories } from "@/lib/cms/repo";
import { deleteArticleAction, saveMediaPageCopyAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { RepeatCards } from "../copy-fields";
import { Flash, statusLabel } from "../ui";

export default async function ArticlesList({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; categoryId?: string; saved?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const articles = listArticles({
    q: q.q,
    status: q.status as "draft" | "published" | "archived" | undefined,
    categoryId: q.categoryId || undefined
  });
  const cats = listCategories();
  const media = getPageCopy().mediaPage;
  const videos = parseVideoLines(media.videos);
  return (
    <div>
      <h1 className="admin-h1">News & press</h1>
      <p className="admin-sub">Stories, interviews, and write-ups. “Not ready” stays private until you show it.</p>
      <Flash saved={q.saved} />
      <form className="admin-actions" style={{ marginBottom: 16 }}>
        <input name="q" placeholder="Search" defaultValue={q.q} />
        <select name="status" defaultValue={q.status || ""}>
          <option value="">Everything</option>
          <option value="published">On the website</option>
          <option value="draft">Not ready</option>
          <option value="archived">Hidden</option>
        </select>
        <select name="categoryId" defaultValue={q.categoryId || ""}>
          <option value="">All folders</option>
          {cats.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button className="btn secondary" type="submit">
          Filter
        </button>
        <Link className="btn" href="/admin/articles/new">
          New story
        </Link>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Newspaper / show</th>
            <th>Date</th>
            <th>Who can see it</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.outlet}</td>
              <td>
                {a.year}-{String(a.month).padStart(2, "0")}
              </td>
              <td>
                <span className="badge">{statusLabel(a.status)}</span>
              </td>
              <td>
                <div className="admin-actions">
                  <Link className="btn secondary" href={`/admin/articles/${a.id}`}>
                    Edit
                  </Link>
                  <form action={deleteArticleAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmSubmit label="Delete" message="Delete this story? You cannot undo it." />
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form action={saveMediaPageCopyAction} className="admin-card admin-form" style={{ marginTop: 28 }}>
        <input type="hidden" name="mediaListsMode" value="cards" />
        <h2 className="admin-h2">Words at the top of Media</h2>
        <p className="admin-sub">Stories in the table above fill the press list. These boxes change the rest of the page.</p>
        <label>
          Title
          <input name="title" defaultValue={media.title} />
        </label>
        <label>
          Small label
          <input name="kicker" defaultValue={media.kicker} />
        </label>
        <label>
          Introduction
          <textarea name="intro" rows={3} defaultValue={media.intro} />
        </label>
        <label>
          Press kit heading
          <input name="pressKitTitle" defaultValue={media.pressKitTitle} />
        </label>
        <label>
          Press kit intro
          <textarea name="pressKitBody" rows={2} defaultValue={media.pressKitBody} />
        </label>
        <label>
          Videos heading
          <input name="videosHeading" defaultValue={media.videosHeading} />
        </label>
        <RepeatCards
          itemLabel="Video"
          initial={videos.map((row) => ({
            videoSource: row.source,
            videoTitle: row.title,
            videoYt: row.yt,
            videoDate: row.date || "",
            videoBadge: row.badge || ""
          }))}
          fields={[
            { name: "videoSource", label: "Source / show" },
            { name: "videoTitle", label: "Title" },
            { name: "videoYt", label: "YouTube id", hint: "The letters after watch?v= in the YouTube link." },
            { name: "videoDate", label: "Date (optional)" },
            { name: "videoBadge", label: "Badge (optional)" }
          ]}
        />
        <details>
          <summary>Search listing (optional)</summary>
          <label>
            Browser title
            <input name="seoTitle" defaultValue={media.seoTitle} />
          </label>
          <label>
            Short description
            <textarea name="seoDescription" rows={2} defaultValue={media.seoDescription} />
          </label>
        </details>
        <button className="btn" type="submit">
          Save media page
        </button>
      </form>
    </div>
  );
}

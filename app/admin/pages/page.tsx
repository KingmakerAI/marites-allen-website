import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { listPages } from "@/lib/cms/repo";
import { combineAdminPages } from "@/lib/cms/site-pages";
import { deletePageAction, duplicatePageAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { Flash, statusLabel } from "../ui";

function formatWhen(stamp?: string) {
  if (!stamp) return "—";
  return new Date(stamp).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export default async function PagesList({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; kind?: string; q?: string; status?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const query = (q.q || "").trim().toLowerCase();
  const kind = q.kind === "site" || q.kind === "custom" ? q.kind : "all";
  const status = q.status || "";
  const pages = combineAdminPages(listPages()).filter((page) => {
    if (kind !== "all" && page.kind !== kind) return false;
    if (status === "published" && page.status !== "published") return false;
    if (status === "hidden" && page.status === "published") return false;
    if (!query) return true;
    return `${page.title} ${page.href} ${page.blurb || ""}`.toLowerCase().includes(query);
  });
  const counts = combineAdminPages(listPages());
  const allCount = counts.length;
  const siteCount = counts.filter((page) => page.kind === "site").length;
  const customCount = counts.filter((page) => page.kind === "custom").length;

  const filterHref = (next: Record<string, string>) => {
    const params = new URLSearchParams();
    const kindValue = next.kind ?? (kind === "all" ? "" : kind);
    const statusValue = next.status ?? status;
    const qValue = next.q ?? q.q ?? "";
    if (kindValue) params.set("kind", kindValue);
    if (statusValue) params.set("status", statusValue);
    if (qValue) params.set("q", qValue);
    const qs = params.toString();
    return qs ? `/admin/pages?${qs}` : "/admin/pages";
  };

  return (
    <div className="pages-screen">
      <div className="pages-head">
        <div>
          <h1 className="admin-h1">Pages</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Every page on the website. Open one to see it, or edit the words that visitors read.
          </p>
        </div>
        <Link className="btn" href="/admin/pages/new">
          Add new
        </Link>
      </div>
      <Flash saved={q.saved} />

      <div className="pages-toolbar">
        <nav className="pages-views" aria-label="Which pages">
          <Link className={kind === "all" ? "active" : undefined} href={filterHref({ kind: "" })}>
            All <em>{allCount}</em>
          </Link>
          <Link className={kind === "site" ? "active" : undefined} href={filterHref({ kind: "site" })}>
            Site pages <em>{siteCount}</em>
          </Link>
          <Link className={kind === "custom" ? "active" : undefined} href={filterHref({ kind: "custom" })}>
            Extra pages <em>{customCount}</em>
          </Link>
        </nav>
        <form className="pages-search">
          {kind !== "all" && <input type="hidden" name="kind" value={kind} />}
          <input name="q" placeholder="Search pages" defaultValue={q.q} />
          <select name="status" defaultValue={status}>
            <option value="">All statuses</option>
            <option value="published">On the website</option>
            <option value="hidden">Hidden / not ready</option>
          </select>
          <button className="btn secondary" type="submit">
            Search
          </button>
        </form>
      </div>

      <table className="admin-table pages-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Link</th>
            <th>Status</th>
            <th>Last updated</th>
          </tr>
        </thead>
        <tbody>
          {pages.length === 0 && (
            <tr>
              <td colSpan={4} className="pages-empty">
                No pages match that search.
              </td>
            </tr>
          )}
          {pages.map((page) => {
            const live = page.status === "published" && !page.blocked;
            return (
              <tr key={page.key} className={page.blocked ? "pages-blocked" : undefined}>
                <td>
                  <div className="pages-title">
                    <Link href={page.editHref}>{page.title}</Link>
                    {page.kind === "site" && <span className="pages-kind">Site page</span>}
                    {page.blurb && <span className="pages-blurb">{page.blurb}</span>}
                    <div className="pages-row-actions">
                      <Link href={page.editHref}>Edit</Link>
                      {live ? (
                        <a href={page.href} target="_blank" rel="noreferrer">
                          View
                        </a>
                      ) : (
                        <span>View</span>
                      )}
                      {page.id && (
                        <>
                          <form action={duplicatePageAction}>
                            <input type="hidden" name="id" value={page.id} />
                            <button type="submit">Duplicate</button>
                          </form>
                          <form action={deletePageAction}>
                            <input type="hidden" name="id" value={page.id} />
                            <ConfirmSubmit
                              className="pages-trash"
                              label="Trash"
                              message="Delete this page? You cannot undo it."
                            />
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {live ? (
                    <a href={page.href} target="_blank" rel="noreferrer">
                      {page.href}
                    </a>
                  ) : (
                    page.href
                  )}
                </td>
                <td>
                  <span className={`badge${page.blocked ? " badge-warn" : ""}`}>
                    {page.blocked ? "Not live" : statusLabel(page.status)}
                  </span>
                </td>
                <td>{formatWhen(page.updatedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

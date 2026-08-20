import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { listArticles, listCategories } from "@/lib/cms/repo";
import { deleteCategoryAction, saveCategoryAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { Flash } from "../ui";

export default async function CategoriesPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const cats = listCategories();
  const articles = listArticles();
  const counts = Object.fromEntries(cats.map((cat) => [cat.id, articles.filter((a) => a.categoryId === cat.id).length]));
  const uncategorized = articles.filter((a) => !a.categoryId).length;

  return (
    <div>
      <div className="admin-page-head">
        <h1 className="admin-h1">Folders</h1>
        <p className="admin-sub">
          Folders help you group news stories, like Press or Television. Pick a folder when you write a story.
        </p>
        <Flash saved={q.saved} />
      </div>

      <div className="admin-grid dash-stats">
        <div className="stat-card">
          <strong>{cats.length}</strong>
          <span>Folders</span>
        </div>
        <div className="stat-card">
          <strong>{articles.length - uncategorized}</strong>
          <span>Stories in a folder</span>
        </div>
        <Link href="/admin/articles" className="stat-card">
          <strong>{uncategorized}</strong>
          <span>Uncategorized</span>
        </Link>
      </div>

      <div className="cat-layout">
        <form action={saveCategoryAction} className="admin-card admin-form cat-create">
          <h2>Add a folder</h2>
          <label>
            Folder name
            <input name="name" required placeholder="Press, Television, Events…" />
          </label>
          <label>
            Link name
            <input name="slug" placeholder="press" />
            <span className="field-hint">Leave this blank and we will make it from the name.</span>
          </label>
          <label>
            Description
            <textarea name="description" rows={3} placeholder="What belongs in this group" />
          </label>
          <button className="btn" type="submit">
            Add folder
          </button>
        </form>

        <div className="cat-list">
          {cats.length === 0 && (
            <div className="admin-card">
              <p className="dash-empty">No folders yet. Add Press or Television to start grouping stories.</p>
            </div>
          )}
          {cats.map((cat) => {
            const count = counts[cat.id] || 0;
            return (
              <div key={cat.id} className="admin-card cat-card">
                <form action={saveCategoryAction} className="admin-form">
                  <input type="hidden" name="id" value={cat.id} />
                  <div className="cat-card-top">
                    <h2>{cat.name}</h2>
                    <span className="badge">{count} {count === 1 ? "article" : "articles"}</span>
                  </div>
                  <label>
                    Name
                    <input name="name" required defaultValue={cat.name} />
                  </label>
                  <label>
                  Link name
                  <input name="slug" defaultValue={cat.slug} />
                  </label>
                  <label>
                    Description
                    <textarea name="description" rows={2} defaultValue={cat.description} />
                  </label>
                  <div className="admin-actions">
                    <button className="btn" type="submit">
                      Save
                    </button>
                    <Link className="btn secondary" href={`/admin/articles?categoryId=${cat.id}`}>
                      View stories
                    </Link>
                  </div>
                </form>
                <form action={deleteCategoryAction} className="cat-delete">
                  <input type="hidden" name="id" value={cat.id} />
                  <ConfirmSubmit
                    label="Delete"
                    message={
                      count
                        ? `Delete “${cat.name}”? ${count} article${count === 1 ? "" : "s"} will become uncategorized.`
                        : `Delete “${cat.name}”?`
                    }
                  />
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { requireUser } from "@/lib/cms/auth";
import { listNavigation } from "@/lib/cms/repo";
import { deleteNavAction, saveNavAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { Flash } from "../ui";

export default async function NavigationPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const items = listNavigation();
  return (
    <div>
      <h1 className="admin-h1">Menus</h1>
      <p className="admin-sub">These are the links at the top and bottom of the website. Turn a link off if you do not want it shown.</p>
      <Flash saved={q.saved} />
      <form action={saveNavAction} className="admin-form admin-card" style={{ marginBottom: 24 }}>
        <h2>Add a link</h2>
        <label>
          Words on the link
          <input name="label" required placeholder="About" />
        </label>
        <label>
          Where it goes
          <input name="href" required placeholder="/about" />
          <span className="field-hint">Use /about for a page on this website, or a full https:// link for somewhere else.</span>
        </label>
        <label>
          Which menu?
          <select name="location">
            <option value="header">Top of the page</option>
            <option value="footer">Bottom of the page</option>
          </select>
        </label>
        <label>
          <input type="checkbox" name="enabled" defaultChecked /> Show this link
        </label>
        <label>
          <input type="checkbox" name="external" /> This goes to a different website
        </label>
        <input type="hidden" name="sortOrder" value={items.length + 1} />
        <button className="btn" type="submit">
          Add link
        </button>
      </form>
      {items.map((n) => (
        <div key={n.id} className="admin-card" style={{ marginBottom: 10 }}>
          <form action={saveNavAction} className="admin-form">
            <input type="hidden" name="id" value={n.id} />
            <div className="fields-2">
              <label>
                Words
                <input name="label" defaultValue={n.label} />
              </label>
              <label>
                Where it goes
                <input name="href" defaultValue={n.href} />
              </label>
              <label>
                Menu
                <select name="location" defaultValue={n.location}>
                  <option value="header">Top of the page</option>
                  <option value="footer">Bottom of the page</option>
                </select>
              </label>
              <label>
                Order
                <input name="sortOrder" type="number" defaultValue={n.sortOrder} />
              </label>
            </div>
            <label>
              <input type="checkbox" name="enabled" defaultChecked={n.enabled} /> Show this link
            </label>
            <label>
              <input type="checkbox" name="external" defaultChecked={n.external} /> Different website
            </label>
            <div className="admin-actions">
              <button className="btn" type="submit">
                Save
              </button>
            </div>
          </form>
          <form action={deleteNavAction} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={n.id} />
            <ConfirmSubmit label="Delete" message={`Delete the “${n.label}” link?`} />
          </form>
        </div>
      ))}
    </div>
  );
}

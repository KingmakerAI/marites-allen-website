import Link from "next/link";
import { ConfirmSubmit } from "./admin-shell";

export function Flash({ saved, error }: { saved?: string; error?: string }) {
  if (saved) return <div className="flash">Saved — this change is on the live website now.</div>;
  if (error) return <div className="flash error">{error === "inuse" ? "This is still being used, so it cannot be deleted yet." : error === "self" ? "You cannot delete your own login." : error}</div>;
  return null;
}

export function EasyMore({
  title = "More options (you can skip this)",
  children
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="easy-more">
      <summary>{title}</summary>
      <div className="easy-more-body">{children}</div>
    </details>
  );
}

export function statusLabel(status?: string) {
  if (status === "published") return "On the website";
  if (status === "archived") return "Hidden";
  return "Not ready";
}

export function ShopHead({
  title,
  sub,
  viewHref,
  viewLabel = "See website",
  backHref,
  backLabel = "All pages",
  children
}: {
  title: string;
  sub?: React.ReactNode;
  viewHref?: string;
  viewLabel?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="shop-head">
      <div>
        {backHref ? (
          <Link className="shop-back" href={backHref}>
            ← {backLabel}
          </Link>
        ) : null}
        <h1>{title}</h1>
        {sub ? <p>{sub}</p> : null}
      </div>
      <div className="shop-head-actions">
        {children}
        {viewHref ? (
          <Link className="btn secondary" href={viewHref} target="_blank">
            {viewLabel}
          </Link>
        ) : null}
      </div>
    </header>
  );
}

export function RowActions({ href, deleteAction, id }: { href?: string; deleteAction?: (form: FormData) => void | Promise<void>; id?: string }) {
  return (
    <div className="admin-actions">
      {href && (
        <Link href={href} className="btn secondary">
          Edit
        </Link>
      )}
      {deleteAction && id && (
        <form action={deleteAction}>
          <input type="hidden" name="id" value={id} />
          <ConfirmSubmit label="Delete" message="Delete this? You cannot undo it." />
        </form>
      )}
    </div>
  );
}

export function StatusSelect({ value }: { value?: string }) {
  return (
    <label>
      Who can see this?
      <select name="status" defaultValue={value || "draft"}>
        <option value="draft">Not ready — only you can see it</option>
        <option value="published">Show it on the website</option>
        <option value="archived">Hide it from the website</option>
      </select>
    </label>
  );
}

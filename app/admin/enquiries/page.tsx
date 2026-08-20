import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { listSignups } from "@/lib/cms/repo";
import type { SignupStatus } from "@/lib/cms/types";
import { deleteSignupAction, updateSignupStatusAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { Flash } from "../ui";

const SORTS = [
  ["createdAt", "Date"],
  ["name", "Name"],
  ["email", "Email"],
  ["interest", "Looking for"],
  ["status", "Where they are"]
] as const;

function enquiryInterest(fields: Record<string, string>, notes: string) {
  return [fields.service, notes].filter(Boolean).join(" — ");
}

function sortHref(current: Record<string, string | undefined>, key: string) {
  const nextDir = current.sort === key && current.dir !== "asc" ? "asc" : "desc";
  const params = new URLSearchParams();
  if (current.q) params.set("q", current.q);
  if (current.status) params.set("status", current.status);
  params.set("sort", key);
  params.set("dir", nextDir);
  return `/admin/enquiries?${params.toString()}`;
}

function exportHref(current: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (current.q) params.set("q", current.q);
  if (current.status) params.set("status", current.status);
  if (current.sort) params.set("sort", current.sort);
  if (current.dir) params.set("dir", current.dir);
  return `/admin/enquiries/export?${params.toString()}`;
}

export default async function EnquiriesPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; q?: string; sort?: string; dir?: string; saved?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const sort = (SORTS.some((s) => s[0] === q.sort) ? q.sort : "createdAt") as (typeof SORTS)[number][0];
  const dir = q.dir === "asc" ? "asc" : "desc";
  const rows = listSignups({
    kind: "booking-waitlist",
    status: q.status as SignupStatus | undefined,
    q: q.q,
    sort,
    dir
  });
  const query = { q: q.q, status: q.status, sort, dir };

  return (
    <div>
      <h1 className="admin-h1">Messages</h1>
      <p className="admin-sub">People who asked to book, and what they want. Press “I replied” after you message them.</p>
      <Flash saved={q.saved} />
      <form className="admin-actions" style={{ marginBottom: 16 }}>
        <input name="q" placeholder="Search name, email, or request" defaultValue={q.q} />
        <select name="status" defaultValue={q.status || ""}>
          <option value="">Everyone</option>
          <option value="new">New</option>
          <option value="contacted">I replied</option>
          <option value="archived">Done</option>
        </select>
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir} />
        <button className="btn secondary" type="submit">
          Filter
        </button>
        <a className="btn" href={exportHref(query)}>
          Download list
        </a>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            {SORTS.map(([key, label]) => (
              <th key={key}>
                <Link href={sortHref(query, key)} style={{ color: "inherit" }}>
                  {label}
                  {sort === key ? (dir === "asc" ? " ↑" : " ↓") : ""}
                </Link>
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6}>No consultation enquiries yet.</td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ whiteSpace: "nowrap" }}>{new Date(row.createdAt).toLocaleString()}</td>
              <td>
                {row.name || "—"}
                {row.phone ? <div style={{ fontSize: 12, color: "#5f6b60" }}>{row.phone}</div> : null}
              </td>
              <td>
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </td>
              <td style={{ maxWidth: 340 }}>
                {enquiryInterest(row.fields, row.notes) || "—"}
              </td>
              <td>{row.status === "contacted" ? "I replied" : row.status === "archived" ? "Done" : "New"}</td>
              <td>
                <div className="admin-actions">
                  {row.status !== "contacted" && (
                    <form action={updateSignupStatusAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value="contacted" />
                      <button className="btn secondary" type="submit">
                        I replied
                      </button>
                    </form>
                  )}
                  {row.status !== "archived" && (
                    <form action={updateSignupStatusAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value="archived" />
                      <button className="btn secondary" type="submit">
                        Done
                      </button>
                    </form>
                  )}
                  <form action={deleteSignupAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <ConfirmSubmit label="Delete" message="Delete this enquiry?" />
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

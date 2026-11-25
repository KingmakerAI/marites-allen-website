import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { missingPressKitMailEnv } from "@/lib/cms/notify";
import { resolvePressKit } from "@/lib/cms/press-kit";
import { getPressKitFile, listSignups } from "@/lib/cms/repo";
import { STORAGE_SETUP_HINT, persistenceMode } from "@/lib/cms/store";
import { uploadPressKitAction } from "../actions";
import { Flash } from "../ui";

function pressKitError(error?: string) {
  if (!error) return undefined;
  if (error === "storage") {
    return `The file was not stored. ${STORAGE_SETUP_HINT} Until uploads work, put the real kit at public/press-kit/press-kit.pdf or public/press-kit/press-kit.zip and redeploy. Files over 4MB belong in that folder too — the host rejects larger form uploads.`;
  }
  if (error === "type") return "Upload a PDF or a zip file.";
  if (error === "size") {
    return "That file is over 4MB. Put it at public/press-kit/press-kit.pdf or public/press-kit/press-kit.zip and redeploy.";
  }
  return "The press kit could not be saved.";
}

function fileLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function PressKitAdminPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string; q?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const [file, stored, rows] = await Promise.all([
    resolvePressKit(),
    getPressKitFile(),
    listSignups({ kind: "press-kit", q: q.q, sort: "createdAt", dir: "desc" })
  ]);
  const missingMail = missingPressKitMailEnv();
  const ephemeral = persistenceMode() === "ephemeral";

  return (
    <div>
      <h1 className="admin-h1">Press kit</h1>
      <p className="admin-sub">
        The file visitors download after they register on <Link href="/media">Media</Link>, and the people who asked for it.
      </p>
      <Flash saved={q.saved} error={pressKitError(q.error)} />
      {ephemeral ? (
        <div className="flash error" role="alert">
          Uploads from this page are not kept on the live host yet. {STORAGE_SETUP_HINT} You can still ship the kit by
          adding <code>public/press-kit/press-kit.pdf</code> or <code>public/press-kit/press-kit.zip</code> and redeploying.
          See <code>public/press-kit/README.md</code>.
        </div>
      ) : null}
      {!file ? (
        <div className="flash error" role="alert">
          No real press kit is public yet. People who register are thanked and told the media team will email the kit.
          They do not get a download. Upload the PDF or zip here, or add <code>public/press-kit/press-kit.pdf</code> (or{" "}
          <code>.zip</code>) and redeploy. The download button appears on its own once that file is in place.
        </div>
      ) : null}
      {stored?.placeholder && !file ? (
        <div className="flash error" role="alert">
          The file last uploaded here is a placeholder. It is not offered to visitors. Upload the real kit.
        </div>
      ) : null}
      {missingMail.length > 0 ? (
        <div className="flash" role="status">
          Registration email is off until the host has {missingMail.join(" and ")}. This note stays in the admin. The
          public page does not mention these settings, and it says an email was sent only after one is actually sent.
        </div>
      ) : (
        <div className="flash" role="status">
          Outgoing email is configured. When a real kit is on the site, a registration emails the download link.
        </div>
      )}

      <section className="admin-card" style={{ marginBottom: 24 }}>
        <h2 className="admin-h2">File</h2>
        {file ? (
          <p>
            Current file: <strong>{file.filename}</strong>
            {" · "}
            {fileLabel(file.size)}
            {" · "}
            {file.source === "upload" ? "uploaded in the admin" : "file in public/press-kit"}
            {" · "}
            <Link href="/press-kit">Download</Link>
          </p>
        ) : (
          <p>No press kit file is public yet. Upload one, or add public/press-kit/press-kit.pdf or press-kit.zip.</p>
        )}
        <form action={uploadPressKitAction} className="admin-form">
          <label>
            {file && !file.placeholder ? "Replace the press kit" : "Upload the press kit"}
            <input type="file" name="file" accept="application/pdf,application/zip,.pdf,.zip" required />
            <span className="field-hint">PDF or zip, up to 4MB. Larger kits go in public/press-kit/ and need a redeploy.</span>
          </label>
          <button className="btn" type="submit">
            {file && !file.placeholder ? "Replace press kit" : "Upload press kit"}
          </button>
        </form>
      </section>

      <section>
        <div className="dash-card-head">
          <h2 className="admin-h2">Registrations ({rows.length})</h2>
          <a className="btn" href={q.q ? `/admin/press-kit/export?q=${encodeURIComponent(q.q)}` : "/admin/press-kit/export"}>
            Download list
          </a>
        </div>
        <form className="admin-actions" style={{ marginBottom: 16 }}>
          <input name="q" placeholder="Search name, outlet, or email" defaultValue={q.q} />
          <button className="btn secondary" type="submit">
            Search
          </button>
        </form>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Outlet</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4}>No press kit registrations yet.</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ whiteSpace: "nowrap" }}>{new Date(row.createdAt).toLocaleString()}</td>
                <td>{row.name || "—"}</td>
                <td>{row.organization || "—"}</td>
                <td>
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

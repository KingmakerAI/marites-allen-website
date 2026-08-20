import { requireUser } from "@/lib/cms/auth";
import { listUsers } from "@/lib/cms/repo";
import { createUserAction, deleteUserAction, setUserPasswordAction } from "../actions";
import { ConfirmSubmit } from "../admin-shell";
import { Flash } from "../ui";

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const me = await requireUser("owner");
  const q = await searchParams;
  const users = listUsers();
  return (
    <div>
      <h1 className="admin-h1">Team</h1>
      <p className="admin-sub">People who can edit the website. Editors can change pages. Owners can also add or remove people.</p>
      <Flash
        saved={q.saved}
        error={
          q.error === "weak"
            ? "Password must be at least 10 characters."
            : q.error === "invalid"
              ? "Could not update that password."
              : q.error
        }
      />
      <form action={createUserAction} className="admin-form" style={{ marginBottom: 24 }}>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" minLength={10} required />
          <span className="field-hint">At least 10 letters or numbers.</span>
        </label>
        <label>
          Role
          <select name="role" defaultValue="editor">
            <option value="editor">Editor — can change the website</option>
            <option value="owner">Owner — can also add people</option>
          </select>
        </label>
        <button className="btn" type="submit">
          Add person
        </button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Last signed in</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "—"}</td>
              <td>
                {u.id !== me.id && (
                  <form action={deleteUserAction}>
                    <input type="hidden" name="id" value={u.id} />
                    <ConfirmSubmit label="Remove" message="Remove this person? They will not be able to sign in." />
                  </form>
                )}
                <form action={setUserPasswordAction} className="admin-inline-pass">
                  <input type="hidden" name="id" value={u.id} />
                  <input type="password" name="password" minLength={10} required placeholder="New password" aria-label={`New password for ${u.email}`} />
                  <button className="btn secondary" type="submit">
                    Set password
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

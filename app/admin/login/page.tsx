import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser, REMEMBER_EMAIL_COOKIE } from "@/lib/cms/auth";
import { pageMetadata } from "@/lib/seo";
import { changePasswordAction, completeResetAction, loginAction, requestResetAction } from "../actions";
import { BrandLogo } from "@/components/brand-logo";

export const metadata = pageMetadata({
  title: "Admin sign in",
  description: "Private CMS sign-in.",
  path: "/admin/login",
  noIndex: true
});

type View = "signin" | "change" | "forgot" | "reset";

function errorText(error?: string) {
  if (error === "invalid") return "That email or password is not right. Try again.";
  if (error === "rate") return "Too many tries. Wait a few minutes, then try again.";
  if (error === "mismatch") return "The new passwords do not match.";
  if (error === "weak") return "The new password must be at least 10 characters.";
  if (error === "reset") return "That reset code is not right, or it has expired. Ask for a new one.";
  return "";
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string; view?: string; email?: string; sent?: string }>;
}) {
  const q = await searchParams;
  const user = await getSessionUser();
  if (user) redirect("/admin/dashboard");
  const rememberedEmail = (await cookies()).get(REMEMBER_EMAIL_COOKIE)?.value || "";
  const view: View =
    q.view === "change" || q.view === "forgot" || q.view === "reset" ? q.view : "signin";
  const next = q.next || "/admin/dashboard";
  const email = q.email || rememberedEmail;
  const err = errorText(q.error);

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <BrandLogo height={36} maxWidth={240} />
        </div>
        {view !== "signin" ? (
          <>
            <h1>
              {view === "change" && "Change password"}
              {view === "forgot" && "Forgot password"}
              {view === "reset" && "Set a new password"}
            </h1>
            <p className="admin-login-lead">
              {view === "change" && "Enter your current password, then choose a new one."}
              {view === "forgot" && "We’ll prepare a short reset code for your login."}
              {view === "reset" && "Enter the reset code, then choose a new password."}
            </p>
          </>
        ) : null}

        {err ? (
          <div className="flash error" role="alert">
            {err}
          </div>
        ) : null}
        {q.sent === "1" ? (
          <div className="flash" role="status">
            If that email is on the team, a reset code is ready for 20 minutes. Enter it below. You can also ask the other
            owner to set a new password in Team.
          </div>
        ) : null}

        {view === "signin" && (
          <form action={loginAction} className="admin-login-form">
            <input type="hidden" name="next" value={next} />
            <label>
              Email
              <input type="email" name="email" required autoComplete="username" defaultValue={email} />
            </label>
            <label>
              Password
              <input type="password" name="password" required autoComplete="current-password" minLength={8} />
            </label>
            <label className="admin-login-remember">
              <input type="checkbox" name="remember" defaultChecked={Boolean(rememberedEmail)} />
              Remember me on this computer
            </label>
            <button className="btn" type="submit">
              Sign in
            </button>
          </form>
        )}

        {view === "change" && (
          <form action={changePasswordAction} className="admin-login-form">
            <label>
              Email
              <input type="email" name="email" required autoComplete="username" defaultValue={email} />
            </label>
            <label>
              Current password
              <input type="password" name="currentPassword" required autoComplete="current-password" minLength={8} />
            </label>
            <label>
              New password
              <input type="password" name="newPassword" required autoComplete="new-password" minLength={10} />
              <span className="field-hint">At least 10 characters.</span>
            </label>
            <label>
              Type the new password again
              <input type="password" name="confirmPassword" required autoComplete="new-password" minLength={10} />
            </label>
            <button className="btn" type="submit">
              Save and sign in
            </button>
          </form>
        )}

        {view === "forgot" && (
          <form action={requestResetAction} className="admin-login-form">
            <label>
              Email
              <input type="email" name="email" required autoComplete="username" defaultValue={email} />
            </label>
            <button className="btn" type="submit">
              Send reset code
            </button>
          </form>
        )}

        {view === "reset" && (
          <form action={completeResetAction} className="admin-login-form">
            <label>
              Email
              <input type="email" name="email" required autoComplete="username" defaultValue={email} />
            </label>
            <label>
              Reset code
              <input name="code" required autoComplete="one-time-code" />
            </label>
            <label>
              New password
              <input type="password" name="newPassword" required autoComplete="new-password" minLength={10} />
              <span className="field-hint">At least 10 characters.</span>
            </label>
            <label>
              Type the new password again
              <input type="password" name="confirmPassword" required autoComplete="new-password" minLength={10} />
            </label>
            <button className="btn" type="submit">
              Save and sign in
            </button>
          </form>
        )}

        <div className="admin-login-links">
          {view === "signin" ? (
            <>
              <Link href="/admin/login?view=forgot">Forgot password</Link>
              <span aria-hidden="true">·</span>
              <Link href="/admin/login?view=change">Change password</Link>
            </>
          ) : (
            <>
              <Link href="/admin/login">Back to sign in</Link>
              {view === "reset" ? (
                <>
                  <span aria-hidden="true">·</span>
                  <Link href="/admin/login?view=forgot">Need a new code?</Link>
                </>
              ) : null}
              {view === "forgot" ? (
                <>
                  <span aria-hidden="true">·</span>
                  <Link href="/admin/login?view=change">I know my password</Link>
                </>
              ) : null}
            </>
          )}
        </div>

        <Link className="admin-login-back" href="/">
          Back to the website
        </Link>
      </div>
    </div>
  );
}

"use server";

import { headers } from "next/headers";
import { fingerprint } from "@/lib/cms/crypto";
import { rateLimitLogin } from "@/lib/cms/auth";
import { notifyBookingEnquiry, notifyPressKitDownload } from "@/lib/cms/notify";
import { PRESS_KIT_DOWNLOAD_PATH, pressKitVisitorNotice, publicSiteOrigin, resolvePressKit } from "@/lib/cms/press-kit";
import { saveSignup } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";
import { signupInputSchema } from "@/lib/cms/validation";

export type SignupResult =
  | {
      ok: true;
      emailed?: boolean;
      headline?: string;
      detail?: string;
      downloadPath?: string | null;
    }
  | { ok: false; error: string };

export async function submitSignupAction(raw: unknown): Promise<SignupResult> {
  await ensureSeeded();
  const parsed = signupInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Please check your details and try again." };
  if (parsed.data.honeypot) return { ok: true };

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
  if (!(await rateLimitLogin(`signup:${fingerprint(ip)}`, 20, 15 * 60 * 1000))) {
    return { ok: false, error: "Too many attempts. Please try again later." };
  }

  const saved = await saveSignup({
    kind: parsed.data.kind,
    email: parsed.data.email,
    name: parsed.data.name,
    phone: parsed.data.phone,
    organization: parsed.data.organization,
    notes: parsed.data.notes,
    source: parsed.data.source,
    fields: parsed.data.fields
  });

  if (parsed.data.kind === "booking-waitlist") {
    await notifyBookingEnquiry({
      kind: saved.kind,
      email: saved.email,
      name: saved.name,
      phone: saved.phone,
      organization: saved.organization,
      notes: saved.notes,
      source: saved.source,
      fields: saved.fields
    });
  }

  if (parsed.data.kind === "press-kit") {
    const file = await resolvePressKit();
    const origin = publicSiteOrigin(hdrs);
    const downloadUrl = `${origin}${PRESS_KIT_DOWNLOAD_PATH}`;
    const mail = file
      ? await notifyPressKitDownload({
          name: saved.name,
          email: saved.email,
          outlet: saved.organization,
          downloadUrl
        })
      : { status: "no-file" as const, missing: [] as string[] };
    const notice = pressKitVisitorNotice({
      name: saved.name,
      email: saved.email,
      hasFile: Boolean(file),
      emailStatus: mail.status
    });
    return { ok: true, ...notice };
  }

  return { ok: true };
}

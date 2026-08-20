"use server";

import { headers } from "next/headers";
import { fingerprint } from "@/lib/cms/crypto";
import { rateLimitLogin } from "@/lib/cms/auth";
import { saveSignup } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";
import { signupInputSchema } from "@/lib/cms/validation";

export type SignupResult = { ok: true } | { ok: false; error: string };

export async function submitSignupAction(raw: unknown): Promise<SignupResult> {
  ensureSeeded();
  const parsed = signupInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Please check your details and try again." };
  if (parsed.data.honeypot) return { ok: true };

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
  if (!rateLimitLogin(`signup:${fingerprint(ip)}`, 20, 15 * 60 * 1000)) {
    return { ok: false, error: "Too many attempts. Please try again later." };
  }

  saveSignup({
    kind: parsed.data.kind,
    email: parsed.data.email,
    name: parsed.data.name,
    phone: parsed.data.phone,
    organization: parsed.data.organization,
    notes: parsed.data.notes,
    source: parsed.data.source,
    fields: parsed.data.fields
  });
  return { ok: true };
}

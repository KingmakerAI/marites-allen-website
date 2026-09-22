"use server";

import { headers } from "next/headers";
import { fingerprint } from "@/lib/cms/crypto";
import { rateLimitLogin } from "@/lib/cms/auth";
import {
  notifyCustomerConsultationEnquiry,
  notifyTeamConsultationEnquiry
} from "@/lib/cms/notify";
import { saveSignup } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";
import { consultationEnquirySchema } from "@/lib/cms/validation";
import { PRIVACY_POLICY_VERSION } from "@/lib/privacy";

export type ConsultationEnquiryResult =
  | { ok: true; firstName: string; emailsSent: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const FAIL_MESSAGE =
  "We couldn't submit your enquiry right now. Please try again or contact us directly via WhatsApp or email.";

export async function submitConsultationEnquiryAction(raw: unknown): Promise<ConsultationEnquiryResult> {
  try {
    try {
      ensureSeeded();
    } catch (err) {
      // Seed/store may be read-only on some hosts; enquiry can still succeed via email.
      console.error("[consultation-enquiry] ensureSeeded failed", err);
    }

    const parsed = consultationEnquirySchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fieldErrors
      };
    }

    if (parsed.data.honeypot) {
      return { ok: true, firstName: parsed.data.firstName, emailsSent: true };
    }

    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
    if (!rateLimitLogin(`enquiry:${fingerprint(ip)}`, 12, 15 * 60 * 1000)) {
      return { ok: false, error: "Too many attempts. Please try again later." };
    }

    const {
      firstName,
      lastName,
      gender,
      country,
      countryCode,
      dialCode,
      phone,
      email,
      consultationType,
      message,
      privacyAcknowledged,
      marketingConsent
    } = parsed.data;

    const fullName = `${firstName} ${lastName}`.trim();
    const submittedAt = new Date().toISOString();
    const marketing = Boolean(marketingConsent);

    let saved = false;
    try {
      saveSignup({
        kind: "booking-waitlist",
        email,
        name: fullName,
        phone,
        organization: "",
        notes: message,
        source: "book",
        status: "new",
        fields: {
          firstName,
          lastName,
          gender: gender || "",
          country,
          countryCode,
          dialCode,
          consultationType,
          first_name: firstName,
          last_name: lastName,
          consultation_type: consultationType,
          message,
          privacy_acknowledged: privacyAcknowledged ? "true" : "false",
          privacy_acknowledged_at: submittedAt,
          privacy_policy_version: PRIVACY_POLICY_VERSION,
          marketing_consent: marketing ? "true" : "false",
          marketing_consent_at: marketing ? submittedAt : ""
        }
      });
      saved = true;
    } catch (err) {
      console.error("[consultation-enquiry] saveSignup failed", err);
    }

    const notifyPayload = {
      firstName,
      lastName,
      gender: gender || "",
      country,
      phone,
      email,
      consultationType,
      message,
      marketingConsent: marketing,
      privacyAcknowledged: Boolean(privacyAcknowledged),
      submittedAt: new Date(submittedAt).toLocaleString("en-GB", {
        timeZone: "Asia/Manila",
        dateStyle: "full",
        timeStyle: "short"
      })
    };

    const [teamOk, customerOk] = await Promise.all([
      notifyTeamConsultationEnquiry(notifyPayload),
      notifyCustomerConsultationEnquiry(notifyPayload)
    ]);

    const emailsSent = Boolean(teamOk && customerOk);

    // Succeed if we persisted OR at least one notification went out.
    if (!saved && !teamOk && !customerOk) {
      return { ok: false, error: FAIL_MESSAGE };
    }

    return {
      ok: true,
      firstName,
      emailsSent
    };
  } catch (err) {
    console.error("[consultation-enquiry] submit failed", err);
    return { ok: false, error: FAIL_MESSAGE };
  }
}

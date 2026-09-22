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

    // Always leave a structured log trail (visible in Vercel function logs).
    console.info("[consultation-enquiry] received", JSON.stringify(notifyPayload));

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

    const [teamOk, customerOk] = await Promise.all([
      notifyTeamConsultationEnquiry(notifyPayload),
      notifyCustomerConsultationEnquiry(notifyPayload)
    ]);

    const emailsSent = Boolean(teamOk || customerOk);
    const resendConfigured = Boolean(
      (process.env.RESEND_API_KEY || "").trim() &&
        (process.env.BOOKING_FROM_EMAIL || process.env.RESET_FROM_EMAIL || "").trim()
    );

    if (saved || emailsSent) {
      return { ok: true, firstName, emailsSent };
    }

    if (!resendConfigured) {
      console.error("[consultation-enquiry] no persistence and Resend is not configured");
      return {
        ok: false,
        error:
          "Enquiry email is not configured yet. Please contact us on WhatsApp or Messenger, or try again shortly."
      };
    }

    console.error("[consultation-enquiry] save and Resend both failed");
    return { ok: false, error: FAIL_MESSAGE };
  } catch (err) {
    console.error("[consultation-enquiry] submit failed", err);
    return { ok: false, error: FAIL_MESSAGE };
  }
}

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

export type ConsultationEnquiryResult =
  | { ok: true; firstName: string; emailsSent: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const FAIL_MESSAGE =
  "We couldn't submit your enquiry right now. Please try again or contact us directly via WhatsApp or email.";

export async function submitConsultationEnquiryAction(raw: unknown): Promise<ConsultationEnquiryResult> {
  try {
    ensureSeeded();
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
      message
    } = parsed.data;

    const fullName = `${firstName} ${lastName}`.trim();
    const submittedAt = new Date().toISOString();

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
        message
      }
    });

    const notifyPayload = {
      firstName,
      lastName,
      gender: gender || "",
      country,
      phone,
      email,
      consultationType,
      message,
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

    return {
      ok: true,
      firstName,
      emailsSent: Boolean(teamOk && customerOk)
    };
  } catch (err) {
    console.error("[consultation-enquiry] submit failed", err);
    return { ok: false, error: FAIL_MESSAGE };
  }
}

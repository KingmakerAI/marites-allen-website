/**
 * Sends enquiry notifications via Resend when configured.
 * Requires RESEND_API_KEY and a from address (BOOKING_FROM_EMAIL or RESET_FROM_EMAIL).
 */

export type ConsultationEnquiryNotifyInput = {
  firstName: string;
  lastName: string;
  gender?: string;
  country: string;
  phone: string;
  email: string;
  consultationType: string;
  message: string;
  submittedAt: string;
};

async function sendResendEmail(payload: {
  from: string;
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: payload.from,
        to: payload.to,
        reply_to: payload.replyTo,
        subject: payload.subject,
        text: payload.text
      })
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[notify] Resend failed", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notify] Resend error", err);
    return false;
  }
}

function mailConfig() {
  const from = process.env.BOOKING_FROM_EMAIL || process.env.RESET_FROM_EMAIL;
  const to = process.env.BOOKING_NOTIFY_TO || "hello@maritesallen.com";
  const key = process.env.RESEND_API_KEY;
  return { from, to, key };
}

export async function notifyTeamConsultationEnquiry(input: ConsultationEnquiryNotifyInput) {
  const { from, to, key } = mailConfig();
  if (!key || !from) {
    console.warn("[notify] Skipping team enquiry email — RESEND_API_KEY or from address not set");
    return false;
  }

  const text = [
    "NEW CONSULTATION ENQUIRY",
    "",
    "Personal Information",
    `First Name: ${input.firstName}`,
    `Last Name: ${input.lastName}`,
    `Gender: ${input.gender || "—"}`,
    `Country / Region: ${input.country}`,
    "",
    "Contact Information",
    `Phone / WhatsApp: ${input.phone}`,
    `Email: ${input.email}`,
    "",
    "Consultation Details",
    `Consultation: ${input.consultationType}`,
    "",
    "What they're looking for:",
    input.message,
    "",
    "Submitted:",
    input.submittedAt
  ].join("\n");

  return sendResendEmail({
    from,
    to: [to],
    replyTo: input.email,
    subject: `New Consultation Enquiry — ${input.firstName} ${input.lastName}`,
    text
  });
}

export async function notifyCustomerConsultationEnquiry(input: ConsultationEnquiryNotifyInput) {
  const { from, key } = mailConfig();
  if (!key || !from) {
    console.warn("[notify] Skipping customer confirmation — RESEND_API_KEY or from address not set");
    return false;
  }

  const text = [
    `Dear ${input.firstName},`,
    "",
    "Thank you for contacting Marites Allen.",
    "",
    "We've received your consultation enquiry and our team has been notified.",
    "",
    "Your enquiry:",
    "",
    `Consultation: ${input.consultationType}`,
    "",
    "What you're looking for:",
    input.message,
    "",
    "Our team will review your request and contact you by email or WhatsApp regarding availability and the next steps.",
    "",
    "We look forward to speaking with you.",
    "",
    "Marites Allen Team",
    "The Feng Shui Queen"
  ].join("\n");

  return sendResendEmail({
    from,
    to: [input.email],
    subject: "We've Received Your Consultation Enquiry",
    text
  });
}

/** @deprecated Prefer notifyTeamConsultationEnquiry + notifyCustomerConsultationEnquiry */
export async function notifyBookingEnquiry(input: {
  kind: string;
  email: string;
  name?: string;
  phone?: string;
  organization?: string;
  notes?: string;
  source?: string;
  fields?: Record<string, string>;
}) {
  const firstName = input.fields?.firstName || (input.name || "").split(/\s+/)[0] || "Guest";
  const lastName = input.fields?.lastName || (input.name || "").split(/\s+/).slice(1).join(" ") || "";
  const payload: ConsultationEnquiryNotifyInput = {
    firstName,
    lastName,
    gender: input.fields?.gender || "",
    country: input.fields?.country || "",
    phone: input.phone || "",
    email: input.email,
    consultationType: input.fields?.consultationType || input.fields?.service || "—",
    message: input.notes || "—",
    submittedAt: new Date().toISOString()
  };
  const team = await notifyTeamConsultationEnquiry(payload);
  const customer = await notifyCustomerConsultationEnquiry(payload);
  return team || customer;
}

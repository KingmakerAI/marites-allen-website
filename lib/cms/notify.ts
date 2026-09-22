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
  marketingConsent?: boolean;
  privacyAcknowledged?: boolean;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailShell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#06140f;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#06140f;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f3126;border:1px solid rgba(230,198,128,0.28);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:22px 26px 10px;text-align:center;">
              <div style="display:inline-block;font-family:Lato,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;color:#143d31;background:#e6c680;border-radius:999px;padding:6px 14px;">
                Marites Allen
              </div>
              <h1 style="margin:16px 0 0;font-size:26px;line-height:1.25;color:#ffffff;font-weight:700;">
                ${escapeHtml(title)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 26px 26px;font-family:Lato,Arial,sans-serif;font-size:15px;line-height:1.65;color:#c7ddd2;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 26px 24px;font-family:Lato,Arial,sans-serif;font-size:12px;line-height:1.55;color:#8eaea0;text-align:center;border-top:1px solid rgba(230,198,128,0.18);">
              <div style="padding-top:16px;">
                Marites Allen · The Feng Shui Queen<br />
                <a href="https://maritesallen.com" style="color:#e6c680;text-decoration:none;">maritesallen.com</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid rgba(230,198,128,0.12);color:#e6c680;font-size:12px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid rgba(230,198,128,0.12);color:#f4f0e6;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`;
}

async function sendResendEmail(payload: {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const key = (process.env.RESEND_API_KEY || "").trim();
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
        text: payload.text,
        html: payload.html
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
  const from = (process.env.BOOKING_FROM_EMAIL || process.env.RESET_FROM_EMAIL || "").trim();
  const to = (process.env.BOOKING_NOTIFY_TO || "hello@maritesallen.com").trim();
  const key = (process.env.RESEND_API_KEY || "").trim();
  return { from: from || undefined, to, key: key || undefined };
}

export async function notifyTeamConsultationEnquiry(input: ConsultationEnquiryNotifyInput) {
  const { from, to, key } = mailConfig();
  if (!key || !from) {
    console.warn("[notify] Skipping team enquiry email — RESEND_API_KEY or from address not set");
    return false;
  }

  const marketingLine = `Marketing consent: ${input.marketingConsent ? "Yes" : "No"}`;
  const privacyLine = `Privacy consent: ${input.privacyAcknowledged === false ? "No" : "Yes"}`;

  const text = [
    "NEW CONSULTATION ENQUIRY",
    "",
    "Personal Information",
    `First Name: ${input.firstName}`,
    `Last Name: ${input.lastName}`,
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
    privacyLine,
    marketingLine,
    "",
    "Submitted:",
    input.submittedAt
  ].join("\n");

  const html = emailShell(
    "New Consultation Enquiry",
    `
      <p style="margin:0 0 18px;color:#c7ddd2;">A new enquiry was submitted on the website.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
        ${detailRow("First Name", input.firstName)}
        ${detailRow("Last Name", input.lastName)}
        ${detailRow("Country / Region", input.country)}
        ${detailRow("Phone / WhatsApp", input.phone)}
        ${detailRow("Email", input.email)}
        ${detailRow("Consultation", input.consultationType)}
        ${detailRow("Privacy consent", input.privacyAcknowledged === false ? "No" : "Yes")}
        ${detailRow("Marketing consent", input.marketingConsent ? "Yes" : "No")}
        ${detailRow("Submitted", input.submittedAt)}
      </table>
      <div style="margin:0;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(230,198,128,0.2);border-radius:12px;">
        <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#e6c680;margin-bottom:8px;">What they're looking for</div>
        <div style="color:#f4f0e6;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(input.message)}</div>
      </div>
      <p style="margin:18px 0 0;font-size:13px;color:#8eaea0;">Reply directly to this email to respond to the customer.</p>
    `
  );

  return sendResendEmail({
    from,
    to: [to],
    replyTo: input.email,
    subject: `New Consultation Enquiry — ${input.firstName} ${input.lastName}`,
    text,
    html
  });
}

export async function notifyCustomerConsultationEnquiry(input: ConsultationEnquiryNotifyInput) {
  const { from, key } = mailConfig();
  if (!key || !from) {
    console.warn("[notify] Skipping customer confirmation — RESEND_API_KEY or from address not set");
    return false;
  }

  const text = [
    `Hi ${input.firstName},`,
    "",
    "Thank you for your consultation enquiry.",
    "",
    "We've received your request and our team will review the details you've provided. We'll contact you by email or WhatsApp regarding availability and the next steps.",
    "",
    "Warm regards,",
    "",
    "Marites Allen Team"
  ].join("\n");

  const html = emailShell(
    "Enquiry Received",
    `
      <p style="margin:0 0 14px;color:#f4f0e6;font-size:16px;">Hi ${escapeHtml(input.firstName)},</p>
      <p style="margin:0 0 14px;">Thank you for your consultation enquiry.</p>
      <p style="margin:0 0 18px;">We've received your request and our team will review the details you've provided. We'll contact you by email or WhatsApp regarding availability and the next steps.</p>
      <p style="margin:0;color:#e6c680;font-weight:700;">Warm regards,<br /><span style="font-weight:500;color:#c7ddd2;">Marites Allen Team</span></p>
    `
  );

  return sendResendEmail({
    from,
    to: [input.email],
    subject: "We've received your consultation enquiry — Marites Allen",
    text,
    html
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

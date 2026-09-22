/**
 * Sends enquiry notifications via Resend when configured.
 * Requires RESEND_API_KEY and a from address (BOOKING_FROM_EMAIL or RESET_FROM_EMAIL).
 */
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
  const key = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL || process.env.RESET_FROM_EMAIL;
  const to = process.env.BOOKING_NOTIFY_TO || "hello@maritesallen.com";
  if (!key || !from) {
    console.warn("[notify] Skipping enquiry email — RESEND_API_KEY or from address not set");
    return false;
  }

  const fieldLines = Object.entries(input.fields || {})
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const text = [
    "New consultation enquiry from the website.",
    "",
    `Kind: ${input.kind}`,
    `Source: ${input.source || "—"}`,
    `Name: ${input.name || "—"}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "—"}`,
    `Organization: ${input.organization || "—"}`,
    `Notes: ${input.notes || "—"}`,
    fieldLines ? `Details:\n${fieldLines}` : "",
    "",
    "Open Admin → Messages to review this enquiry."
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: `New booking enquiry${input.name ? ` — ${input.name}` : ""}`,
        text
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

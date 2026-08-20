"use client";

import { useState } from "react";
import { submitSignupAction } from "@/app/signup/actions";
import type { SignupKind } from "@/lib/cms/types";

type Props = {
  kind: SignupKind;
  source: string;
  nameLabel?: string;
  showName?: boolean;
  showPhone?: boolean;
  phoneLabel?: string;
  showOrganization?: boolean;
  organizationLabel?: string;
  showNotes?: boolean;
  notesLabel?: string;
  extraFields?: Array<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  variant?: "light" | "dark";
};

export function SignupForm({
  kind,
  source,
  showName = true,
  nameLabel = "Full name",
  showPhone = false,
  phoneLabel = "Phone",
  showOrganization = false,
  organizationLabel = "Organization",
  showNotes = false,
  notesLabel = "Notes",
  extraFields = [],
  submitLabel,
  successTitle,
  successBody,
  variant = "light"
}: Props) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const dark = variant === "dark";
  const inputStyle = {
    width: "100%",
    background: dark ? "rgba(255,255,255,0.06)" : "#f9f5ec",
    border: dark ? "1px solid rgba(230,198,128,0.28)" : "1.5px solid #cdd8d0",
    borderRadius: 10,
    padding: "11px 13px",
    fontFamily: "Lato, system-ui, sans-serif",
    color: dark ? "#fff" : "#2a2a28"
  } as const;

  async function onSubmit(formData: FormData) {
    setError("");
    setPending(true);
    const fields: Record<string, string> = {};
    for (const field of extraFields) {
      fields[field.name] = String(formData.get(field.name) || "");
    }
    const result = await submitSignupAction({
      kind,
      source,
      email: String(formData.get("email") || ""),
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      organization: String(formData.get("organization") || ""),
      notes: String(formData.get("notes") || ""),
      honeypot: String(formData.get("company_website") || ""),
      fields
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#1a4d3e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            color: "#e6c680",
            fontSize: 24,
            fontWeight: 700
          }}
        >
          ✓
        </div>
        <h3 className="font-display" style={{ fontWeight: 700, fontSize: 22, color: dark ? "#fff" : "#143d31", margin: "0 0 6px" }}>
          {successTitle}
        </h3>
        <p style={{ fontSize: 14, color: dark ? "#c7ddd2" : "#6b7268", margin: 0, lineHeight: 1.55 }}>{successBody}</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} style={{ display: "grid", gap: 12 }}>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden style={{ display: "none" }} />
      {showName && (
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700, color: dark ? "#e6c680" : "#3d5348" }}>
          {nameLabel}
          <input name="name" required placeholder="Your name" style={inputStyle} />
        </label>
      )}
      <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700, color: dark ? "#e6c680" : "#3d5348" }}>
        Email
        <input name="email" type="email" required placeholder="you@email.com" style={inputStyle} />
      </label>
      {showPhone && (
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700, color: dark ? "#e6c680" : "#3d5348" }}>
          {phoneLabel}
          <input name="phone" type="tel" placeholder="+63 or +44…" style={inputStyle} />
        </label>
      )}
      {showOrganization && (
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700, color: dark ? "#e6c680" : "#3d5348" }}>
          {organizationLabel}
          <input name="organization" placeholder={organizationLabel} style={inputStyle} />
        </label>
      )}
      {extraFields.map((field) => (
        <label key={field.name} style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700, color: dark ? "#e6c680" : "#3d5348" }}>
          {field.label}
          {field.options?.length ? (
            <select name={field.name} required={field.required} style={inputStyle} defaultValue="">
              <option value="" disabled>
                {field.placeholder || "Select…"}
              </option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type || "text"}
              required={field.required}
              placeholder={field.placeholder}
              style={inputStyle}
            />
          )}
        </label>
      ))}
      {showNotes && (
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700, color: dark ? "#e6c680" : "#3d5348" }}>
          {notesLabel}
          <textarea name="notes" rows={3} placeholder={notesLabel} style={{ ...inputStyle, resize: "vertical" }} />
        </label>
      )}
      {error && <div style={{ color: dark ? "#ffb4b4" : "#8b2e2e", fontSize: 13 }}>{error}</div>}
      <button
        type="submit"
        disabled={pending}
        style={{
          width: "100%",
          textAlign: "center",
          background: dark ? "linear-gradient(160deg,#e6c680,#c69a3e)" : "linear-gradient(160deg,#1a4d3e,#143d31)",
          color: dark ? "#143d31" : "#fff",
          borderRadius: 12,
          padding: 14,
          fontSize: 15,
          fontWeight: 700,
          border: 0,
          cursor: pending ? "wait" : "pointer",
          opacity: pending ? 0.7 : 1
        }}
      >
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

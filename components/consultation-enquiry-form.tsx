"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { submitConsultationEnquiryAction } from "@/app/signup/consultation-enquiry";
import { CountrySelect, darkInput } from "@/components/country-select";
import { ChatCtaButtons } from "@/components/chat-cta-buttons";
import { formatE164, isValidNationalPhone, PhoneInput } from "@/components/phone-input";
import { FALLBACK_CONSULTATION_OPTIONS, findCountry } from "@/lib/countries";

type Props = {
  consultationOptions: string[];
  whatsappUrl: string;
  emailUrl: string;
  preferTalkHeading?: string;
  whatsappLabel?: string;
  emailLabel?: string;
  submitHint?: string;
};

const labelStyle = {
  display: "grid" as const,
  gap: 6,
  fontSize: 12,
  fontWeight: 700,
  color: "#e6c680"
};

const sectionLabel = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.8,
  textTransform: "uppercase" as const,
  color: "#e6c680",
  margin: "0 0 6px"
};

const sectionBody = {
  fontSize: 13.5,
  lineHeight: 1.55,
  color: "#c7ddd2",
  margin: "0 0 14px"
};

const errorText = { color: "#ffb4b4", fontSize: 12.5, marginTop: 4 };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <div style={errorText}>{message}</div>;
}

export function ConsultationEnquiryForm({
  consultationOptions,
  whatsappUrl,
  emailUrl,
  preferTalkHeading = "Prefer to speak with us directly?",
  whatsappLabel = "WhatsApp Enquiry →",
  emailLabel = "Email Our Team →",
  submitHint = "Once you submit your enquiry, our team will be notified. We'll review your request and contact you by email or WhatsApp regarding availability and the next steps."
}: Props) {
  const options = useMemo(() => {
    const base = consultationOptions.length ? consultationOptions : FALLBACK_CONSULTATION_OPTIONS;
    return base.includes("Other") ? base : [...base, "Other"];
  }, [consultationOptions]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [countryCode, setCountryCode] = useState("PH");
  const [nationalPhone, setNationalPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [emailsSent, setEmailsSent] = useState(true);

  const country = findCountry(countryCode);
  const dialCode = country?.dial || "+63";
  const countryName = country?.name || "";

  function validateLocal(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "Please enter your first name.";
    if (!lastName.trim()) errors.lastName = "Please enter your last name.";
    if (!countryCode || !countryName) errors.country = "Please select your country.";
    if (!isValidNationalPhone(nationalPhone)) errors.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!consultationType) errors.consultationType = "Please select a consultation.";
    if (!message.trim()) errors.message = "Please tell us what you're looking for.";
    return errors;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setFormError("");
    const errors = validateLocal();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setPending(true);
    const result = await submitConsultationEnquiryAction({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      country: countryName,
      countryCode,
      dialCode,
      phone: formatE164(dialCode, nationalPhone),
      email: email.trim(),
      consultationType,
      message: message.trim(),
      honeypot: ""
    });
    setPending(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors || {});
      setFormError(result.error);
      return;
    }

    setEmailsSent(result.emailsSent);
    setSuccessName(result.firstName);
  }

  if (successName) {
    return (
      <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
        <div
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: "#143d31",
            background: "#e6c680",
            borderRadius: 99,
            padding: "6px 14px",
            marginBottom: 16
          }}
        >
          Enquiry Received
        </div>
        <h3
          className="font-display"
          style={{ fontWeight: 700, fontSize: "clamp(24px,4vw,32px)", color: "#fff", margin: "0 0 12px" }}
        >
          Thank You, {successName}
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "#c7ddd2", margin: "0 0 12px" }}>
          Your consultation enquiry has been received successfully.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#c7ddd2", margin: "0 0 12px" }}>
          Our team has been notified and will review your request. We&apos;ll contact you by email or WhatsApp
          regarding availability, consultation details, and the next steps.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: emailsSent ? "#e6c680" : "#c7ddd2", margin: "0 0 22px" }}>
          {emailsSent
            ? "Please check your inbox for a confirmation email."
            : "Your enquiry is saved. If you do not receive a confirmation email shortly, please contact us on WhatsApp."}
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "linear-gradient(160deg,#e6c680,#c69a3e)",
            color: "#143d31",
            fontWeight: 700,
            fontSize: 14,
            padding: "13px 22px",
            borderRadius: 12,
            textDecoration: "none"
          }}
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 22 }}>
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden style={{ display: "none" }} />

        <section>
          <div style={sectionLabel}>01 · Personal Information</div>
          <p style={sectionBody}>Tell us a little about yourself.</p>
          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10
              }}
              className="enquiry-name-row"
            >
              <label style={labelStyle}>
                First Name
                <input
                  name="firstName"
                  autoComplete="given-name"
                  required
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    ...darkInput,
                    borderColor: fieldErrors.firstName ? "rgba(255,150,150,0.7)" : darkInput.border
                  }}
                />
                <FieldError message={fieldErrors.firstName} />
              </label>
              <label style={labelStyle}>
                Last Name
                <input
                  name="lastName"
                  autoComplete="family-name"
                  required
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    ...darkInput,
                    borderColor: fieldErrors.lastName ? "rgba(255,150,150,0.7)" : darkInput.border
                  }}
                />
                <FieldError message={fieldErrors.lastName} />
              </label>
            </div>

            <label style={labelStyle}>
              Gender <span style={{ fontWeight: 500, color: "#8eaea0" }}>(optional)</span>
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  ...darkInput,
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23e6c680' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 40
                }}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>

            <label style={labelStyle}>
              Country / Region
              <CountrySelect
                value={countryCode}
                onChange={(code) => setCountryCode(code)}
                error={fieldErrors.country}
              />
              <FieldError message={fieldErrors.country} />
            </label>
          </div>
        </section>

        <section>
          <div style={sectionLabel}>02 · Contact Information</div>
          <p style={sectionBody}>How should our team contact you?</p>
          <div style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>
              Phone / WhatsApp Number
              <PhoneInput
                countryCode={countryCode}
                nationalNumber={nationalPhone}
                onCountryChange={(code) => setCountryCode(code)}
                onNumberChange={setNationalPhone}
                error={fieldErrors.phone}
              />
              <FieldError message={fieldErrors.phone} />
            </label>
            <label style={labelStyle}>
              Email Address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...darkInput,
                  borderColor: fieldErrors.email ? "rgba(255,150,150,0.7)" : darkInput.border
                }}
              />
              <FieldError message={fieldErrors.email} />
            </label>
          </div>
        </section>

        <section>
          <div style={sectionLabel}>03 · Consultation Details</div>
          <p style={sectionBody}>Tell us what you would like help with.</p>
          <div style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>
              What type of consultation are you interested in?
              <select
                name="consultationType"
                required
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value)}
                style={{
                  ...darkInput,
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23e6c680' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 40,
                  borderColor: fieldErrors.consultationType ? "rgba(255,150,150,0.7)" : darkInput.border
                }}
              >
                <option value="" disabled>
                  Choose a consultation
                </option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.consultationType} />
            </label>

            <label style={labelStyle}>
              What are you looking for?
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about your situation, goals, questions, or what you would like guidance on..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  ...darkInput,
                  resize: "vertical",
                  minHeight: 120,
                  borderColor: fieldErrors.message ? "rgba(255,150,150,0.7)" : darkInput.border
                }}
              />
              <FieldError message={fieldErrors.message} />
            </label>
          </div>
        </section>

        {formError && <div style={{ color: "#ffb4b4", fontSize: 13 }}>{formError}</div>}

        <button
          type="submit"
          disabled={pending}
          style={{
            width: "100%",
            textAlign: "center",
            background: "linear-gradient(160deg,#e6c680,#c69a3e)",
            color: "#143d31",
            borderRadius: 12,
            padding: 14,
            fontSize: 15,
            fontWeight: 700,
            border: 0,
            cursor: pending ? "wait" : "pointer",
            opacity: pending ? 0.75 : 1
          }}
        >
          {pending ? "Sending enquiry..." : "Send Consultation Enquiry →"}
        </button>

        <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "#8eaea0", margin: 0 }}>{submitHint}</p>
      </form>

      <p style={{ fontSize: 13, lineHeight: 1.6, color: "#c7ddd2", margin: "22px 0 12px" }}>{preferTalkHeading}</p>
      <ChatCtaButtons
        whatsappUrl={whatsappUrl}
        messengerUrl={emailUrl}
        whatsappLabel={whatsappLabel}
        messengerLabel={emailLabel}
        secondIsEmail
      />

      <style>{`
        @media (max-width: 520px) {
          .enquiry-name-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

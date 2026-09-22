"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { submitConsultationEnquiryAction } from "@/app/signup/consultation-enquiry";
import { CountrySelect, darkInput } from "@/components/country-select";
import { ChatCtaButtons } from "@/components/chat-cta-buttons";
import { formatE164, isValidNationalPhone, PhoneInput } from "@/components/phone-input";
import { FALLBACK_CONSULTATION_OPTIONS, findCountry } from "@/lib/countries";
import { MESSENGER_URL, PRIVACY_POLICY_PATH } from "@/lib/privacy";

type Props = {
  consultationOptions: string[];
  whatsappUrl: string;
  emailUrl: string;
  messengerUrl?: string;
  preferTalkHeading?: string;
  whatsappLabel?: string;
  messengerLabel?: string;
  emailLabel?: string;
  submitHint?: string;
  compact?: boolean;
};

const labelStyle = {
  display: "grid" as const,
  gap: 5,
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
  margin: "0 0 4px"
};

const sectionBody = {
  fontSize: 13,
  lineHeight: 1.5,
  color: "#a8c4b6",
  margin: "0 0 14px"
};

const errorText = { color: "#ffb4b4", fontSize: 12.5, marginTop: 4 };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" style={errorText}>
      {message}
    </div>
  );
}

function ProgressGuide({ compact }: { compact?: boolean }) {
  const steps = ["01 Personal", "02 Contact", "03 Consultation"];
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: compact ? 6 : 8,
        marginBottom: compact ? 12 : 22,
        paddingBottom: compact ? 10 : 16,
        borderBottom: "1px solid rgba(230,198,128,0.15)"
      }}
    >
      {steps.map((step, i) => (
        <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.1,
              textTransform: "uppercase",
              color: "#e6c680"
            }}
          >
            {step}
          </span>
          {i < steps.length - 1 ? <span style={{ color: "rgba(230,198,128,0.35)", fontSize: 10 }}>→</span> : null}
        </span>
      ))}
    </div>
  );
}

export function ConsultationEnquiryForm({
  consultationOptions,
  whatsappUrl,
  emailUrl,
  messengerUrl = MESSENGER_URL,
  preferTalkHeading = "Prefer to speak with us directly?",
  whatsappLabel = "WhatsApp Enquiry →",
  messengerLabel = "Facebook Messenger →",
  emailLabel = "Email Our Team →",
  submitHint = "Your enquiry will be sent securely to our team. We'll contact you by email or WhatsApp regarding availability and next steps.",
  compact = false
}: Props) {
  const options = useMemo(() => {
    const base = consultationOptions.length ? consultationOptions : FALLBACK_CONSULTATION_OPTIONS;
    return base.includes("Other") ? base : [...base, "Other"];
  }, [consultationOptions]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [nationalPhone, setNationalPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [message, setMessage] = useState("");
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [emailsSent, setEmailsSent] = useState(true);

  const country = countryCode ? findCountry(countryCode) : undefined;
  const dialCode = country?.dial || "";
  const countryName = country?.name || "";

  function validateLocal(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "Please enter your first name.";
    if (!lastName.trim()) errors.lastName = "Please enter your last name.";
    if (!countryCode || !countryName || !dialCode) errors.country = "Please select your country.";
    if (!countryCode || !dialCode || !isValidNationalPhone(nationalPhone)) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!consultationType) errors.consultationType = "Please select a consultation.";
    if (!message.trim()) errors.message = "Please tell us what you're looking for.";
    if (!privacyAcknowledged) {
      errors.privacyAcknowledged = "Please confirm that you have read and agree to the Privacy Policy.";
    }
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
    try {
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
        privacyAcknowledged,
        marketingConsent,
        honeypot: ""
      });

      if (!result.ok) {
        setFieldErrors(result.fieldErrors || {});
        setFormError(
          result.error ||
            "We couldn't submit your enquiry right now. Please try again or contact us directly via WhatsApp or email."
        );
        return;
      }

      setEmailsSent(result.emailsSent);
      setSuccessName(result.firstName);
    } catch {
      setFormError(
        "We couldn't submit your enquiry right now. Please try again or contact us directly via WhatsApp or email."
      );
    } finally {
      setPending(false);
    }
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
            textDecoration: "none",
            marginBottom: 22
          }}
        >
          Return to Home
        </Link>
        <p style={{ fontSize: 13, color: "#a8c4b6", margin: "0 0 12px" }}>Or contact us directly:</p>
        <ChatCtaButtons
          whatsappUrl={whatsappUrl}
          messengerUrl={messengerUrl}
          emailUrl={emailUrl}
          whatsappLabel="WhatsApp"
          messengerLabel="Messenger"
          emailLabel="Email"
        />
      </div>
    );
  }

  const selectChevron = {
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23e6c680' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 14px center",
    paddingRight: 40
  };

  return (
    <>
      <ProgressGuide compact={compact} />
      <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: compact ? 16 : 28 }}>
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden style={{ display: "none" }} />

        <section>
          <div style={sectionLabel}>01 · Personal Information</div>
          <p style={{ ...sectionBody, margin: compact ? "0 0 10px" : sectionBody.margin }}>
            Tell us a little about yourself.
          </p>
          <div style={{ display: "grid", gap: compact ? 10 : 12 }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
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
                    padding: compact ? "9px 12px" : darkInput.padding,
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
                    padding: compact ? "9px 12px" : darkInput.padding,
                    borderColor: fieldErrors.lastName ? "rgba(255,150,150,0.7)" : darkInput.border
                  }}
                />
                <FieldError message={fieldErrors.lastName} />
              </label>
            </div>

            <div
              className="enquiry-meta-row"
              style={{
                display: "grid",
                gridTemplateColumns: compact ? "0.85fr 1.15fr" : "1fr",
                gap: 10
              }}
            >
              <label style={labelStyle}>
                <span>
                  Gender{" "}
                  <span style={{ fontWeight: 500, color: "#8eaea0", textTransform: "none", letterSpacing: 0 }}>
                    Optional
                  </span>
                </span>
                <select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    ...darkInput,
                    ...selectChevron,
                    padding: compact ? "9px 40px 9px 12px" : undefined
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
                  onChange={(code) => {
                    setCountryCode(code);
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.country;
                      delete next.phone;
                      return next;
                    });
                  }}
                  error={fieldErrors.country}
                />
                <FieldError message={fieldErrors.country} />
              </label>
            </div>
          </div>
        </section>

        <section
          style={{
            paddingTop: compact ? 2 : 4,
            borderTop: "1px solid rgba(230,198,128,0.12)"
          }}
        >
          <div style={{ ...sectionLabel, marginTop: compact ? 2 : 4 }}>02 · Contact Information</div>
          <p style={{ ...sectionBody, margin: compact ? "0 0 10px" : sectionBody.margin }}>
            How should our team contact you?
          </p>
          <div style={{ display: "grid", gap: compact ? 10 : 12 }}>
            <label style={labelStyle}>
              Phone / WhatsApp Number
              <PhoneInput
                countryCode={countryCode}
                nationalNumber={nationalPhone}
                onCountryChange={(code) => {
                  setCountryCode(code);
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.country;
                    delete next.phone;
                    return next;
                  });
                }}
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
                  padding: compact ? "9px 12px" : darkInput.padding,
                  borderColor: fieldErrors.email ? "rgba(255,150,150,0.7)" : darkInput.border
                }}
              />
              <FieldError message={fieldErrors.email} />
            </label>
          </div>
        </section>

        <section
          style={{
            paddingTop: compact ? 2 : 4,
            borderTop: "1px solid rgba(230,198,128,0.12)"
          }}
        >
          <div style={{ ...sectionLabel, marginTop: compact ? 2 : 4 }}>03 · Consultation Details</div>
          <p style={{ ...sectionBody, margin: compact ? "0 0 10px" : sectionBody.margin }}>
            Tell us what you would like help with.
          </p>
          <div style={{ display: "grid", gap: compact ? 10 : 12 }}>
            <label style={labelStyle}>
              What type of consultation are you interested in?
              <select
                name="consultationType"
                required
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value)}
                style={{
                  ...darkInput,
                  ...selectChevron,
                  padding: compact ? "9px 40px 9px 12px" : undefined,
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
                rows={compact ? 3 : 5}
                placeholder="Tell us about your situation, goals, questions, or what you would like guidance on..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  ...darkInput,
                  resize: "vertical",
                  minHeight: compact ? 72 : 120,
                  padding: compact ? "9px 12px" : darkInput.padding,
                  borderColor: fieldErrors.message ? "rgba(255,150,150,0.7)" : darkInput.border
                }}
              />
              <FieldError message={fieldErrors.message} />
            </label>
          </div>
        </section>

        {formError ? (
          <div
            role="alert"
            style={{
              color: "#ffb4b4",
              fontSize: 13.5,
              lineHeight: 1.55,
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,150,150,0.35)",
              background: "rgba(120,30,30,0.25)"
            }}
          >
            {formError}
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 12, paddingTop: 2 }}>
          <label
            style={{
              display: "grid",
              gridTemplateColumns: "18px 1fr",
              gap: 10,
              alignItems: "start",
              fontSize: 12.5,
              lineHeight: 1.55,
              color: "#c7ddd2",
              cursor: "pointer"
            }}
          >
            <input
              type="checkbox"
              checked={privacyAcknowledged}
              onChange={(e) => {
                setPrivacyAcknowledged(e.target.checked);
                if (e.target.checked) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.privacyAcknowledged;
                    return next;
                  });
                }
              }}
              style={{ marginTop: 3, accentColor: "#e6c680", width: 16, height: 16 }}
            />
            <span>
              I agree that Marites Allen may collect and use the information I provide to respond to my consultation
              enquiry. I have read the{" "}
              <Link href={PRIVACY_POLICY_PATH} target="_blank" rel="noopener noreferrer" style={{ color: "#e6c680" }}>
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <FieldError message={fieldErrors.privacyAcknowledged} />

          <label
            style={{
              display: "grid",
              gridTemplateColumns: "18px 1fr",
              gap: 10,
              alignItems: "start",
              fontSize: 12.5,
              lineHeight: 1.55,
              color: "#a8c4b6",
              cursor: "pointer"
            }}
          >
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              style={{ marginTop: 3, accentColor: "#e6c680", width: 16, height: 16 }}
            />
            <span>
              I would like to receive occasional updates, announcements and offers from Marites Allen by email or
              WhatsApp.
            </span>
          </label>
        </div>

        <div style={{ paddingTop: 4 }}>
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="enquiry-submit"
            style={{
              width: "100%",
              textAlign: "center",
              background: "linear-gradient(160deg,#e6c680,#c69a3e)",
              color: "#143d31",
              borderRadius: 12,
              padding: 15,
              fontSize: 15,
              fontWeight: 700,
              border: 0,
              cursor: pending ? "wait" : "pointer",
              opacity: pending ? 0.75 : 1,
              transition: "filter 160ms ease, transform 160ms ease"
            }}
          >
            {pending ? "Submitting enquiry..." : "Submit Consultation Enquiry →"}
          </button>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "#8eaea0", margin: "12px 0 0" }}>{submitHint}</p>
        </div>
      </form>

      <div
        style={{
          marginTop: compact ? 18 : 28,
          paddingTop: compact ? 14 : 22,
          borderTop: "1px solid rgba(230,198,128,0.15)"
        }}
      >
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#c7ddd2", margin: "0 0 10px" }}>{preferTalkHeading}</p>
        <ChatCtaButtons
          whatsappUrl={whatsappUrl}
          messengerUrl={messengerUrl}
          emailUrl={emailUrl}
          whatsappLabel={whatsappLabel}
          messengerLabel={messengerLabel}
          emailLabel={emailLabel}
        />
      </div>

      <style>{`
        @media (max-width: 520px) {
          .enquiry-name-row,
          .enquiry-meta-row {
            grid-template-columns: 1fr !important;
          }
        }
        .enquiry-submit:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .enquiry-submit:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible,
        button:focus-visible {
          outline: 2px solid rgba(230,198,128,0.65);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { submitConsultationEnquiryAction } from "@/app/signup/consultation-enquiry";
import { CountrySelect, darkInput } from "@/components/country-select";
import { ChatCtaButtons } from "@/components/chat-cta-buttons";
import { DarkSelect } from "@/components/dark-select";
import { formatE164, isValidNationalPhone, PhoneInput } from "@/components/phone-input";
import { FALLBACK_CONSULTATION_OPTIONS, findCountry } from "@/lib/countries";
import { MESSENGER_URL, PRIVACY_POLICY_PATH } from "@/lib/privacy";

type Props = {
  consultationOptions: string[];
  whatsappUrl: string;
  messengerUrl?: string;
  preferTalkHeading?: string;
  whatsappLabel?: string;
  messengerLabel?: string;
  submitHint?: string;
};

const labelStyle = {
  display: "grid" as const,
  gap: 7,
  fontSize: 13,
  fontWeight: 600,
  color: "#f0e6c8"
};

const sectionLabel = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.8,
  textTransform: "uppercase" as const,
  color: "#e6c680",
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

export function ConsultationEnquiryForm({
  consultationOptions,
  whatsappUrl,
  messengerUrl = MESSENGER_URL,
  preferTalkHeading = "Prefer to speak with us directly?",
  whatsappLabel = "WhatsApp Enquiry →",
  messengerLabel = "Facebook Messenger →",
  submitHint = "Your enquiry will be sent securely to our team. We'll contact you by email or WhatsApp regarding availability and next steps."
}: Props) {
  const options = useMemo(() => {
    const base = consultationOptions.length ? consultationOptions : FALLBACK_CONSULTATION_OPTIONS;
    return base.includes("Other") ? base : [...base, "Other"];
  }, [consultationOptions]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regionCountryCode, setRegionCountryCode] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("");
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

  const region = regionCountryCode ? findCountry(regionCountryCode) : undefined;
  const phoneCountry = phoneCountryCode ? findCountry(phoneCountryCode) : undefined;
  const dialCode = phoneCountry?.dial || "";
  const countryName = region?.name || "";

  function clearErrors(...keys: string[]) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
  }

  function validateLocal(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "Please enter your first name.";
    if (!lastName.trim()) errors.lastName = "Please enter your last name.";
    if (!regionCountryCode || !countryName) errors.country = "Please select your country.";
    if (!phoneCountryCode || !dialCode || !isValidNationalPhone(nationalPhone)) {
      errors.phone = "Please enter your phone number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!consultationType) errors.consultationType = "Please choose a consultation type.";
    if (!message.trim()) errors.message = "Please tell us what you're looking for.";
    if (!privacyAcknowledged) {
      errors.privacyAcknowledged = "Please accept the Privacy Policy to continue.";
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
        gender: "",
        country: countryName,
        countryCode: regionCountryCode,
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
      <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
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
          Your consultation enquiry has been received.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#c7ddd2", margin: "0 0 12px" }}>
          Our team has been notified and will review your request. We&apos;ll contact you by email or WhatsApp
          regarding availability and the next steps.
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
          whatsappLabel="WhatsApp"
          messengerLabel="Messenger"
        />
      </div>
    );
  }

  const inputStyle = {
    ...darkInput,
    background: "#214c40",
    backgroundColor: "#214c40",
    color: "#f8f4ea",
    borderColor: "rgba(230,198,128,0.5)",
    colorScheme: "dark" as const,
    WebkitTextFillColor: "#f8f4ea",
    caretColor: "#f8f4ea"
  };

  return (
    <>
      <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 26 }}>
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden style={{ display: "none" }} />

        <section>
          <div style={sectionLabel}>01 · Personal Information</div>
          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
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
                  className="enquiry-field"
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.firstName ? "rgba(255,150,150,0.7)" : inputStyle.borderColor
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
                  className="enquiry-field"
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.lastName ? "rgba(255,150,150,0.7)" : inputStyle.borderColor
                  }}
                />
                <FieldError message={fieldErrors.lastName} />
              </label>
            </div>

            <label style={labelStyle}>
              Country / Region
              <CountrySelect
                value={regionCountryCode}
                onChange={(code) => {
                  setRegionCountryCode(code);
                  setPhoneCountryCode(code);
                  clearErrors("country", "phone");
                }}
                error={fieldErrors.country}
              />
              <FieldError message={fieldErrors.country} />
            </label>
          </div>
        </section>

        <section style={{ borderTop: "1px solid rgba(230,198,128,0.12)", paddingTop: 22 }}>
          <div style={sectionLabel}>02 · Contact Information</div>
          <div style={{ display: "grid", gap: 14 }}>
            <label style={labelStyle}>
              Phone / WhatsApp Number
              <PhoneInput
                countryCode={phoneCountryCode}
                nationalNumber={nationalPhone}
                onCountryChange={(code) => {
                  setPhoneCountryCode(code);
                  clearErrors("phone");
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
                className="enquiry-field"
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.email ? "rgba(255,150,150,0.7)" : inputStyle.borderColor
                }}
              />
              <FieldError message={fieldErrors.email} />
            </label>
          </div>
        </section>

        <section style={{ borderTop: "1px solid rgba(230,198,128,0.12)", paddingTop: 22 }}>
          <div style={sectionLabel}>03 · Consultation Details</div>
          <div style={{ display: "grid", gap: 14 }}>
            <label style={labelStyle}>
              What type of consultation are you interested in?
              <DarkSelect
                value={consultationType}
                placeholder="Choose a consultation"
                error={fieldErrors.consultationType}
                options={options}
                onChange={(value) => {
                  setConsultationType(value);
                  clearErrors("consultationType");
                }}
              />
              <FieldError message={fieldErrors.consultationType} />
            </label>

            <label style={labelStyle}>
              What are you looking for?
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Tell us about your situation, goals, questions, or what you would like guidance on..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="enquiry-field"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 96,
                  borderColor: fieldErrors.message ? "rgba(255,150,150,0.7)" : inputStyle.borderColor
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

        <div style={{ display: "grid", gap: 12 }}>
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
                if (e.target.checked) clearErrors("privacyAcknowledged");
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
              I&apos;d like to receive occasional news, announcements and offers from Marites Allen by email or
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
            {pending ? "Submitting…" : "Submit Consultation Enquiry →"}
          </button>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "#8eaea0", margin: "12px 0 0" }}>{submitHint}</p>
        </div>
      </form>

      <div
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid rgba(230,198,128,0.15)"
        }}
      >
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#c7ddd2", margin: "0 0 12px" }}>{preferTalkHeading}</p>
        <ChatCtaButtons
          whatsappUrl={whatsappUrl}
          messengerUrl={messengerUrl}
          whatsappLabel={whatsappLabel}
          messengerLabel={messengerLabel}
        />
      </div>

      <style>{`
        @media (max-width: 520px) {
          .enquiry-name-row {
            grid-template-columns: 1fr !important;
          }
        }
        .enquiry-field,
        .enquiry-field:hover,
        .enquiry-field:focus,
        .enquiry-field:active {
          background-color: #214c40 !important;
          background: #214c40 !important;
          color: #f8f4ea !important;
          -webkit-text-fill-color: #f8f4ea !important;
          caret-color: #f8f4ea;
        }
        .enquiry-field:-webkit-autofill,
        .enquiry-field:-webkit-autofill:hover,
        .enquiry-field:-webkit-autofill:focus,
        .enquiry-field:-webkit-autofill:active {
          -webkit-text-fill-color: #f8f4ea !important;
          caret-color: #f8f4ea;
          box-shadow: 0 0 0 1000px #214c40 inset !important;
          transition: background-color 99999s ease-out;
        }
        .enquiry-submit:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .enquiry-submit:focus-visible,
        .enquiry-field:focus-visible,
        button:focus-visible {
          outline: 2px solid rgba(230,198,128,0.65);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

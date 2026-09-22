"use client";

import { useState } from "react";
import { ConsultationEnquiryForm } from "@/components/consultation-enquiry-form";
import { cms } from "@/lib/cms/cms-attr";

type Props = {
  kicker: string;
  title: string;
  intro: string;
  introSecondary?: string;
  consultationOptions: string[];
  whatsappUrl: string;
  messengerUrl: string;
  preferTalkHeading: string;
  whatsappLabel: string;
  messengerLabel: string;
  submitHint: string;
};

export function BookEnquirySection({
  kicker,
  title,
  intro,
  introSecondary,
  consultationOptions,
  whatsappUrl,
  messengerUrl,
  preferTalkHeading,
  whatsappLabel,
  messengerLabel,
  submitHint
}: Props) {
  const [success, setSuccess] = useState(false);

  return (
    <div className={`book-shell${success ? " book-shell--success" : ""}`}>
      {!success ? (
        <aside className="book-intro">
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
              padding: "5px 12px",
              marginBottom: 16
            }}
            {...cms("book.kicker")}
          >
            {kicker}
          </div>
          <h1
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: "clamp(28px,3.4vw,42px)",
              lineHeight: 1.12,
              margin: "0 0 14px"
            }}
            {...cms("book.title")}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "clamp(14px,1.5vw,16px)",
              lineHeight: 1.55,
              color: "#c7ddd2",
              margin: "0 0 10px",
              maxWidth: 400
            }}
            {...cms("book.intro")}
          >
            {intro}
          </p>
          {introSecondary ? (
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "#a8c4b6",
                margin: 0,
                maxWidth: 400
              }}
              {...cms("book.introSecondary")}
            >
              {introSecondary}
            </p>
          ) : null}
        </aside>
      ) : null}

      <div className="book-form-card">
        <ConsultationEnquiryForm
          consultationOptions={consultationOptions}
          whatsappUrl={whatsappUrl}
          messengerUrl={messengerUrl}
          preferTalkHeading={preferTalkHeading}
          whatsappLabel={whatsappLabel}
          messengerLabel={messengerLabel}
          submitHint={submitHint}
          onSuccess={() => setSuccess(true)}
        />
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";

type Props = {
  whatsappUrl: string;
  messengerUrl: string;
  emailUrl: string;
  whatsappLabel?: string;
  messengerLabel?: string;
  emailLabel?: string;
};

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.045L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MessengerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.1l3.131 3.259L19.752 8.1l-6.559 6.863z" />
    </svg>
  );
}

function EmailIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}

const baseBtn: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  minHeight: 48,
  padding: "12px 12px",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: 0.15,
  textDecoration: "none",
  border: "1px solid rgba(230,198,128,0.28)",
  transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease"
};

const iconWrap = (bg: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 999,
  background: bg,
  flexShrink: 0
});

export function ChatCtaButtons({
  whatsappUrl,
  messengerUrl,
  emailUrl,
  whatsappLabel = "WhatsApp Enquiry →",
  messengerLabel = "Facebook Messenger →",
  emailLabel = "Email Our Team →"
}: Props) {
  return (
    <div className="chat-cta-grid">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-cta chat-cta--whatsapp"
        style={{
          ...baseBtn,
          background: "linear-gradient(165deg, #2fe074 0%, #25d366 45%, #1ebe57 100%)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 20px rgba(37, 211, 102, 0.22)"
        }}
      >
        <span style={iconWrap("rgba(255,255,255,0.22)")}>
          <WhatsAppIcon />
        </span>
        {whatsappLabel}
      </a>

      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-cta chat-cta--messenger"
        style={{
          ...baseBtn,
          background: "rgba(255,255,255,0.06)",
          color: "#f4f0e6",
          boxShadow: "none"
        }}
      >
        <span style={iconWrap("rgba(230,198,128,0.16)")}>
          <MessengerIcon />
        </span>
        {messengerLabel}
      </a>

      <a
        href={emailUrl}
        className="chat-cta chat-cta--email"
        style={{
          ...baseBtn,
          background: "linear-gradient(160deg,#e6c680,#c69a3e)",
          color: "#143d31",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 20px rgba(198, 154, 62, 0.22)"
        }}
      >
        <span style={iconWrap("rgba(20,61,49,0.12)")}>
          <EmailIcon />
        </span>
        {emailLabel}
      </a>

      <style>{`
        .chat-cta-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .chat-cta:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
        }
        .chat-cta--messenger:hover {
          background: rgba(255,255,255,0.09) !important;
          border-color: rgba(230,198,128,0.4);
        }
        @media (max-width: 720px) {
          .chat-cta-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 420px) {
          .chat-cta {
            font-size: 12.5px !important;
          }
        }
      `}</style>
    </div>
  );
}

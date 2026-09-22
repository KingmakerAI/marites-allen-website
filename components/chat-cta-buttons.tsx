type Props = {
  whatsappUrl: string;
  messengerUrl: string;
  whatsappLabel?: string;
  messengerLabel?: string;
};

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.045L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MessengerIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.1l3.131 3.259L19.752 8.1l-6.559 6.863z" />
    </svg>
  );
}

export function ChatCtaButtons({
  whatsappUrl,
  messengerUrl,
  whatsappLabel = "WhatsApp",
  messengerLabel = "Messenger"
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10
      }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-cta chat-cta--whatsapp"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minHeight: 48,
          padding: "12px 14px",
          borderRadius: 12,
          background: "linear-gradient(165deg, #2fe074 0%, #25d366 45%, #1ebe57 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 0.2,
          textDecoration: "none",
          boxShadow: "0 8px 20px rgba(37, 211, 102, 0.28)",
          border: "1px solid rgba(255,255,255,0.18)",
          transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease"
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "rgba(255,255,255,0.22)"
          }}
        >
          <WhatsAppIcon size={16} />
        </span>
        {whatsappLabel}
      </a>

      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-cta chat-cta--messenger"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minHeight: 48,
          padding: "12px 14px",
          borderRadius: 12,
          background: "linear-gradient(135deg, #00c6ff 0%, #0078ff 48%, #a033ff 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 0.2,
          textDecoration: "none",
          boxShadow: "0 8px 20px rgba(0, 120, 255, 0.28)",
          border: "1px solid rgba(255,255,255,0.18)",
          transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease"
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "rgba(255,255,255,0.22)"
          }}
        >
          <MessengerIcon size={16} />
        </span>
        {messengerLabel}
      </a>

      <style>{`
        .chat-cta:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        .chat-cta--whatsapp:hover {
          box-shadow: 0 10px 24px rgba(37, 211, 102, 0.38);
        }
        .chat-cta--messenger:hover {
          box-shadow: 0 10px 24px rgba(0, 120, 255, 0.38);
        }
        @media (max-width: 420px) {
          .chat-cta {
            font-size: 13px !important;
            gap: 8px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

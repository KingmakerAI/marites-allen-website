import Link from "next/link";

type Props = {
  variant?: "full" | "minimal";
};

export function SiteFooter({ variant = "full" }: Props) {
  if (variant === "minimal") {
    return (
      <footer
        style={{
          borderTop: "1px solid rgba(20,61,49,0.1)",
          padding: "28px clamp(18px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
          background: "#efe8d8"
        }}
      >
        <div>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 16, color: "#143d31", letterSpacing: 1 }}>
            MARITES ALLEN
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#6b6862" }}>© 2026 Marites Allen. All rights reserved.</div>
      </footer>
    );
  }

  return (
    <footer style={{ background: "#0c2a20" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "48px clamp(18px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          justifyContent: "space-between"
        }}
      >
        <div style={{ flex: "1 1 260px" }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1, color: "#fff" }}>
            MARITES ALLEN
          </div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#e6c680",
              marginTop: 4
            }}
          >
            FENG SHUI QUEEN
          </div>
        </div>
        <div style={{ flex: "0 1 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#e6c680",
              marginBottom: 12
            }}
          >
            Explore
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <Link href="/about" style={{ color: "#c7ddd2", fontSize: 14 }}>
              About
            </Link>
            <Link href="/projects" style={{ color: "#c7ddd2", fontSize: 14 }}>
              Projects
            </Link>
            <Link href="/events" style={{ color: "#c7ddd2", fontSize: 14 }}>
              Events
            </Link>
            <Link href="/forecast" style={{ color: "#c7ddd2", fontSize: 14 }}>
              Annual Forecast
            </Link>
            <Link href="/destara" style={{ color: "#c7ddd2", fontSize: 14 }}>
              Destara AI
            </Link>
            <Link href="/media" style={{ color: "#c7ddd2", fontSize: 14 }}>
              Media
            </Link>
            <Link href="/book" style={{ color: "#e6c680", fontSize: 14, fontWeight: 700 }}>
              Book now
            </Link>
          </div>
        </div>
        <div style={{ flex: "0 1 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#e6c680",
              marginBottom: 12
            }}
          >
            Contact
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14, color: "#c7ddd2" }}>
            <a href="mailto:sales@frigga.co.uk" style={{ color: "#c7ddd2" }}>
              sales@frigga.co.uk
            </a>
            <span>+63 920 950 9390</span>
            <span>+63 939 351 6424</span>
            <a href="https://destara.app" target="_blank" rel="noopener noreferrer" style={{ color: "#c7ddd2" }}>
              destara.app
            </a>
          </div>
        </div>
        <div style={{ flex: "0 1 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#e6c680",
              marginBottom: 12
            }}
          >
            Follow
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
            <a
              href="https://www.facebook.com/MaritesAllen168/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#c7ddd2" }}
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/maritesallen/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#c7ddd2" }}
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/channel/UCDrwKncdOeMKG3dt6vk2QLg"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#c7ddd2" }}
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "16px clamp(18px,4vw,40px)",
            fontSize: 12,
            color: "#7fa093",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>© 2026 Marites Allen. Secure booking · SSL encrypted · Free reschedule up to 48h.</span>
          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(230,198,128,0.3)",
              color: "#e6c680",
              fontSize: 11.5,
              fontWeight: 700,
              padding: "7px 14px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

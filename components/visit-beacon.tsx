"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookieConsent } from "@/components/cookie-notice";

export function VisitBeacon() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(getCookieConsent() === "accepted");
    sync();
    const onConsent = () => sync();
    window.addEventListener("ma-cookie-consent", onConsent as EventListener);
    return () => window.removeEventListener("ma-cookie-consent", onConsent as EventListener);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/adminportal")) return;
    void fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
      credentials: "same-origin"
    }).catch(() => {
      /* ignore tracking failures */
    });
  }, [pathname, allowed]);

  return null;
}

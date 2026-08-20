"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    void fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
      credentials: "same-origin"
    }).catch(() => {
      /* ignore tracking failures */
    });
  }, [pathname]);
  return null;
}

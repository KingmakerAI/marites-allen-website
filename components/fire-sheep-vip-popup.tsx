"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  FIRE_SHEEP_POPUP_STORAGE_KEY,
  FIRE_SHEEP_VIP_COPY,
  FIRE_SHEEP_VIP_EVENT,
  FIRE_SHEEP_VIP_MEDIA,
  fireSheepPopupAllowed,
  manilaCalendarDay
} from "@/lib/events/fire-sheep-vip";

const SHOW_DELAY_MS = 700;

function seenToday() {
  try {
    return window.localStorage.getItem(FIRE_SHEEP_POPUP_STORAGE_KEY) === manilaCalendarDay();
  } catch {
    return false;
  }
}

function markSeenToday() {
  try {
    window.localStorage.setItem(FIRE_SHEEP_POPUP_STORAGE_KEY, manilaCalendarDay());
  } catch {
    /* Private browsing can block storage. The in-memory flag still limits this visit. */
  }
}

let seenThisVisit = false;

export function FireSheepVipPopup() {
  const pathname = usePathname() || "/";
  const allowed = fireSheepPopupAllowed(pathname);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const detailsId = useId();

  useEffect(() => {
    if (!allowed || seenThisVisit || seenToday()) return;
    const timer = window.setTimeout(() => {
      seenThisVisit = true;
      markSeenToday();
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [allowed]);

  const visible = open && allowed;

  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("vip-popup-open");
    body.classList.add("vip-popup-open");
    const previously = returnFocus.current;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    function onFocusIn(event: FocusEvent) {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (event.target instanceof Node && dialog.contains(event.target)) return;
      closeRef.current?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      root.classList.remove("vip-popup-open");
      body.classList.remove("vip-popup-open");
      previously?.focus();
    };
  }, [visible]);

  function close() {
    markSeenToday();
    setOpen(false);
  }

  function onTab(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const items = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!visible) return null;

  return (
    <div
      className="vip-popup"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={detailsId}
        className="vip-popup__dialog"
        onKeyDown={onTab}
      >
        <div className="vip-popup__bar">
          <button ref={closeRef} type="button" className="vip-popup__close" onClick={close} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <picture className="vip-popup__picture">
          <source srcSet={FIRE_SHEEP_VIP_MEDIA.webp} type="image/webp" />
          <img
            src={FIRE_SHEEP_VIP_MEDIA.jpg}
            alt={FIRE_SHEEP_VIP_MEDIA.alt}
            width={FIRE_SHEEP_VIP_MEDIA.width}
            height={FIRE_SHEEP_VIP_MEDIA.height}
          />
        </picture>
        <p className="vip-popup__kicker">{FIRE_SHEEP_VIP_EVENT.eyebrow}</p>
        <h2 id={titleId} className="font-display vip-popup__title">
          {FIRE_SHEEP_VIP_EVENT.title}
        </h2>
        <p className="vip-popup__host">{FIRE_SHEEP_VIP_COPY.hostLine}</p>
        <ul id={detailsId} className="vip-popup__details">
          <li>{FIRE_SHEEP_VIP_COPY.dateLabel}</li>
          <li>{FIRE_SHEEP_VIP_COPY.timeLabel}</li>
          <li>{FIRE_SHEEP_VIP_COPY.placeLabel}</li>
          <li>Attire: {FIRE_SHEEP_VIP_COPY.attire}</li>
        </ul>
        <p className="vip-popup__line">{FIRE_SHEEP_VIP_COPY.line}</p>
        <Link className="vip-popup__cta" href={`/events#${FIRE_SHEEP_VIP_EVENT.slug}`} onClick={close}>
          View event
        </Link>
      </div>
    </div>
  );
}

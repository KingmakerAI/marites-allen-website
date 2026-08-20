"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PageBlocks } from "@/lib/cms/render-blocks";
import type { PageBlock } from "@/lib/cms/types";

type PreviewKind = "article" | "page" | "event" | "consultation";

function readForm(form: HTMLFormElement) {
  const data: Record<string, string> = {};
  const fd = new FormData(form);
  fd.forEach((value, key) => {
    if (typeof value === "string") data[key] = value;
  });
  form.querySelectorAll<HTMLInputElement>("input[type=checkbox]").forEach((box) => {
    data[box.name] = box.checked ? "on" : "";
  });
  return data;
}

function safeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=/gi, " data-dropped=");
}

function parseBlocks(raw: string): PageBlock[] | null {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PageBlock[]) : null;
  } catch {
    return null;
  }
}

function StatusPill({ status }: { status?: string }) {
  return (
    <span className={`preview-pill ${status || "draft"}`}>
      {status === "published" ? "On the website" : status === "archived" ? "Hidden" : "Not ready"}
    </span>
  );
}

function ArticlePreview({ values }: { values: Record<string, string> }) {
  const month = values.month ? String(values.month).padStart(2, "0") : "";
  return (
    <article className="preview-article">
      <p className="preview-kicker">
        {values.outlet || "Outlet"} {values.year ? `· ${values.year}${month ? `-${month}` : ""}` : ""}
      </p>
      <h1>{values.title || "Article title"}</h1>
      {values.excerpt ? <p className="preview-excerpt">{values.excerpt}</p> : null}
        {values.body ? <div className="preview-body" dangerouslySetInnerHTML={{ __html: safeHtml(values.body) }} /> : <p className="preview-empty">The story will show up here as you type.</p>}
      {values.externalUrl ? (
        <p>
          <a href={values.externalUrl} target="_blank" rel="noreferrer">
            {values.ctaLabel || "Read original"} →
          </a>
        </p>
      ) : null}
      <p className="preview-meta">By {values.author || "Marites Allen"}</p>
    </article>
  );
}

function PagePreview({ values }: { values: Record<string, string> }) {
  const blocks = parseBlocks(values.blocks || "");
  return (
    <div className="preview-page">
      <p className="preview-kicker">/{values.slug || "page-slug"}</p>
      <h1>{values.title || "Page title"}</h1>
      {blocks ? (
        <PageBlocks blocks={blocks} />
      ) : (
        <p className="preview-empty">The page pieces will show up here. If something looks wrong, go back and fix the boxes on the left.</p>
      )}
    </div>
  );
}

function EventPreview({ values }: { values: Record<string, string> }) {
  return (
    <article className="preview-event">
      {values.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={values.imageUrl} alt={values.title || "Event"} />
      ) : (
        <div className="preview-photo-ph">Event photo</div>
      )}
      <p className="preview-kicker">{values.eyebrow || "Event"}</p>
      <h1>{values.title || "Event title"}</h1>
      {values.tagline ? <p className="preview-excerpt">{values.tagline}</p> : null}
      <p className="preview-meta">
        {values.whenLabel || "Date TBC"}
        {values.whereLabel || values.venue ? ` · ${values.whereLabel || values.venue}` : ""}
      </p>
      {values.summary ? <p>{values.summary}</p> : <p className="preview-empty">Summary will appear here.</p>}
      {values.ctaLabel ? (
        <span className="preview-cta">{values.ctaLabel}</span>
      ) : null}
    </article>
  );
}

function ConsultationPreview({ values }: { values: Record<string, string> }) {
  const price = values.promoPrice || values.price;
  const currency = values.currency || "USD";
  return (
    <article className="preview-consult">
      <p className="preview-kicker">{values.categoryLabel || "Consultation"}</p>
      <h1>{values.name || "Consultation name"}</h1>
      {values.duration ? <p className="preview-meta">{values.duration}</p> : null}
      {values.description ? <p>{values.description}</p> : <p className="preview-empty">Description will appear here.</p>}
      {values.idealFor ? <p className="preview-meta">Ideal for: {values.idealFor}</p> : null}
      {price ? (
        <p className="preview-price">
          {values.promoPrice ? <s>{currency} {values.price}</s> : null} {currency} {price}
        </p>
      ) : null}
      <span className="preview-cta">{values.ctaText || "Enquire"}</span>
    </article>
  );
}

export function PreviewEditor({
  kind,
  children,
  liveHref
}: {
  kind: PreviewKind;
  children: React.ReactNode;
  liveHref?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useLayoutEffect(() => {
    const root = rootRef.current;
    const form = root?.querySelector("form");
    if (!form) return;
    const sync = () => setValues(readForm(form));
    sync();
    form.addEventListener("input", sync);
    form.addEventListener("change", sync);
    return () => {
      form.removeEventListener("input", sync);
      form.removeEventListener("change", sync);
    };
  }, []);

  const status =
    kind === "consultation" ? (values.active === "" ? "draft" : "published") : values.status || "draft";
  const showLive = Boolean(liveHref && status === "published");

  return (
    <div className="editor-split" ref={rootRef}>
      <div className="editor-pane">{children}</div>
      <aside className="preview-pane">
        <div className="preview-toolbar">
          <strong>Preview</strong>
          <StatusPill status={status} />
          <span className="preview-devices">
            <button type="button" className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")}>
              Desktop
            </button>
            <button type="button" className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")}>
              Mobile
            </button>
          </span>
        </div>
        <p className="preview-note">
          {kind === "consultation"
            ? status === "published"
              ? "This is how it will look after you press Save."
              : "Hidden until you tick “Show on the website” and press Save."
            : status === "published"
              ? "This is how visitors will see it after you press Save."
              : "Not ready yet. Choose “Show it on the website” and press Save when you are happy."}
        </p>
        <div className={`preview-stage ${device}`}>
          <div className="preview-chrome">
            <span />
            <em>
              maritesallen.com
              {kind === "article" && values.slug ? `/articles/${values.slug}` : ""}
              {kind === "page" && values.slug ? `/${values.slug === "home" ? "" : values.slug}` : ""}
              {kind === "event" ? "/events" : ""}
              {kind === "consultation" ? "/book" : ""}
            </em>
          </div>
          <div className="preview-canvas">
            {kind === "article" && <ArticlePreview values={values} />}
            {kind === "page" && <PagePreview values={values} />}
            {kind === "event" && <EventPreview values={values} />}
            {kind === "consultation" && <ConsultationPreview values={values} />}
          </div>
        </div>
        {showLive ? (
          <a className="preview-live" href={liveHref} target="_blank" rel="noreferrer">
            Open live ↗
          </a>
        ) : null}
      </aside>
    </div>
  );
}

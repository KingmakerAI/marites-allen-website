"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_LINKS = [
  { value: "/book", label: "Book a consultation" },
  { value: "/", label: "Home" },
  { value: "/about", label: "About" },
  { value: "/events", label: "Events" },
  { value: "/media", label: "News & press" },
  { value: "/forecast", label: "Forecast" },
  { value: "/destara", label: "Destara" },
  { value: "/frigga", label: "Frigga" },
  { value: "/projects", label: "Projects" }
];

type Photo = { path: string; altText: string; filename: string };

export function PhotoField({
  name,
  altName,
  value,
  alt,
  photos
}: {
  name: string;
  altName?: string;
  value: string;
  alt: string;
  photos: Photo[];
}) {
  const [src, setSrc] = useState(value);
  const options = useMemo(() => {
    const seen = new Set(photos.map((p) => p.path));
    const extra = src && !seen.has(src) ? [{ path: src, altText: alt, filename: src }] : [];
    return [...extra, ...photos];
  }, [photos, src, alt]);

  return (
    <div className="photo-field">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || "Current photo"} />
      ) : (
        <div className="photo-field-empty">No photo yet</div>
      )}
      <label>
        Choose a photo
        <select name={name} value={src} onChange={(e) => setSrc(e.target.value)}>
          <option value="">None</option>
          {options.map((photo) => (
            <option key={photo.path} value={photo.path}>
              {photo.altText || photo.filename}
            </option>
          ))}
        </select>
        <span className="field-hint">
          Need a new picture? Upload it in <Link href="/admin/media">Photos</Link>, then come back and pick it here.
        </span>
      </label>
      {altName ? (
        <label>
          Describe the photo
          <input name={altName} defaultValue={alt} placeholder="Marites smiling at a talk" />
          <span className="field-hint">This is read aloud for people who cannot see the picture.</span>
        </label>
      ) : null}
    </div>
  );
}

export function PageLinkField({ name, value }: { name: string; value: string }) {
  const known = PAGE_LINKS.some((o) => o.value === value);
  const [mode, setMode] = useState<"pick" | "custom">(known || !value ? "pick" : "custom");
  const [picked, setPicked] = useState(known ? value : PAGE_LINKS[0].value);
  const [custom, setCustom] = useState(known ? "" : value);

  return (
    <div className="link-field">
      <label>
        Button goes to
        <select
          value={mode === "custom" ? "__custom" : picked}
          onChange={(e) => {
            if (e.target.value === "__custom") {
              setMode("custom");
              return;
            }
            setMode("pick");
            setPicked(e.target.value);
          }}
        >
          {PAGE_LINKS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          <option value="__custom">A different website or page…</option>
        </select>
      </label>
      {mode === "pick" ? (
        <input type="hidden" name={name} value={picked} />
      ) : (
        <label>
          Link
          <input name={name} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="https://…" />
        </label>
      )}
    </div>
  );
}

type RepeatField = {
  name: string;
  label: string;
  kind?: "text" | "textarea";
  rows?: number;
  hint?: string;
};

type RepeatRow = Record<string, string> & { _key: string };

export function RepeatCards({
  itemLabel,
  fields,
  initial,
  addHint
}: {
  itemLabel: string;
  fields: RepeatField[];
  initial: Record<string, string>[];
  addHint?: string;
}) {
  const [rows, setRows] = useState<RepeatRow[]>(() =>
    (initial.length ? initial : []).map((row, i) => ({ ...row, _key: `row-${i}` }))
  );

  return (
    <div className="repeat-list">
      {rows.length === 0 ? <p className="field-hint">None yet. Press the button below to add one.</p> : null}
      {rows.map((row, i) => (
        <div className="repeat-card" key={row._key}>
          <div className="repeat-card-head">
            <strong>
              {itemLabel} {i + 1}
            </strong>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setRows(rows.filter((r) => r._key !== row._key))}
            >
              Remove
            </button>
          </div>
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}
              {field.kind === "textarea" ? (
                <textarea name={field.name} rows={field.rows || 4} defaultValue={row[field.name] || ""} />
              ) : (
                <input name={field.name} defaultValue={row[field.name] || ""} />
              )}
              {field.hint ? <span className="field-hint">{field.hint}</span> : null}
            </label>
          ))}
        </div>
      ))}
      <button
        type="button"
        className="btn secondary"
        onClick={() => setRows([...rows, { _key: `row-${Date.now()}` }])}
      >
        Add {itemLabel.toLowerCase()}
      </button>
      {addHint ? <span className="field-hint">{addHint}</span> : null}
    </div>
  );
}

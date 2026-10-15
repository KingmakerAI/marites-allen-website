"use client";

import { useLayoutEffect, useState } from "react";

export type PhotoOption = { id: string; path: string; label: string };

export function PhotoField({ photos, value }: { photos: PhotoOption[]; value?: string | null }) {
  const known = photos.some((photo) => photo.id === value);
  const [id, setId] = useState(known ? value || "" : "");
  const current = photos.find((photo) => photo.id === id);

  useLayoutEffect(() => {
    const form = document.querySelector<HTMLFormElement>("form.admin-form");
    form?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [id]);

  if (!photos.length) {
    return (
      <div>
        <input type="hidden" name="featuredImageId" value={value || ""} />
        <p className="field-hint">No photos yet. Upload one under Photos, then come back and pick it.</p>
      </div>
    );
  }

  return (
    <label>
      Photo
      <select name="featuredImageId" value={id} onChange={(event) => setId(event.target.value)}>
        <option value="">No photo</option>
        {photos.map((photo) => (
          <option key={photo.id} value={photo.id}>
            {photo.label}
          </option>
        ))}
      </select>
      <input type="hidden" name="featuredImageUrl" value={current?.path || ""} />
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.path}
          alt={current.label}
          style={{ display: "block", width: "100%", maxWidth: 280, marginTop: 10, borderRadius: 12 }}
        />
      ) : (
        <span className="field-hint">Optional. Shows at the top of the story.</span>
      )}
    </label>
  );
}

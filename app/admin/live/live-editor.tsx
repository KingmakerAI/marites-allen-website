"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { saveCopyPatchesAction } from "../actions";

function friendlyLabel(path: string) {
  const last = path.split(".").pop() || path;
  return last
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\d+/, (n) => `#${Number(n) + 1}`)
    .trim();
}

function highlight(el: HTMLElement | null, on: boolean) {
  if (!el) return;
  if (on) {
    el.style.outline = "2px solid #c69a3e";
    el.style.outlineOffset = "3px";
    el.style.cursor = "pointer";
  } else {
    el.style.outline = "";
    el.style.outlineOffset = "";
    el.style.cursor = "";
  }
}

export function LiveEditor({
  pagePath,
  pageTitle,
  returnTo
}: {
  pagePath: string;
  pageTitle: string;
  returnTo: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [activeText, setActiveText] = useState("");
  const [patches, setPatches] = useState<Record<string, string>>({});
  const [iframeKey, setIframeKey] = useState(0);
  const [pending, startTransition] = useTransition();
  const activeEl = useRef<HTMLElement | null>(null);
  const originals = useRef<Record<string, string>>({});

  const patchList = useMemo(
    () => Object.entries(patches).map(([path, value]) => ({ path, value })),
    [patches]
  );
  const dirty = patchList.length > 0;

  const applyPatchesToFrame = useCallback((doc: Document, next: Record<string, string>) => {
    for (const [path, value] of Object.entries(next)) {
      doc.querySelectorAll<HTMLElement>(`[data-cms="${CSS.escape(path)}"]`).forEach((node) => {
        if (node.childElementCount === 0) {
          node.textContent = value;
        } else {
          // Keep trailing arrows etc. — replace first text node
          const text = Array.from(node.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
          if (text) text.textContent = value;
          else node.textContent = value;
        }
      });
    }
  }, []);

  const wireFrame = useCallback(() => {
    const frame = iframeRef.current;
    const doc = frame?.contentDocument;
    if (!doc?.body) return;
    setReady(true);

    doc.querySelectorAll<HTMLElement>("[data-cms]").forEach((el) => {
      const path = el.getAttribute("data-cms");
      if (!path) return;
      if (!(path in originals.current)) {
        originals.current[path] = (el.textContent || "").replace(/\s*→\s*$/, "").trim();
      }
      el.style.cursor = "pointer";
      el.style.transition = "outline 0.12s ease";
      el.onmouseenter = () => {
        if (activeEl.current !== el) highlight(el, true);
      };
      el.onmouseleave = () => {
        if (activeEl.current !== el) highlight(el, false);
      };
      el.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        highlight(activeEl.current, false);
        activeEl.current = el;
        highlight(el, true);
        const current = patches[path] ?? originals.current[path] ?? (el.textContent || "").replace(/\s*→\s*$/, "").trim();
        setActivePath(path);
        setActiveText(current);
      };
    });

    // Block navigation inside the preview
    doc.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => {
        if ((e.target as HTMLElement)?.closest?.("[data-cms]")) return;
        e.preventDefault();
      });
    });

    applyPatchesToFrame(doc, patches);
  }, [applyPatchesToFrame, patches]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    const onLoad = () => wireFrame();
    frame.addEventListener("load", onLoad);
    return () => frame.removeEventListener("load", onLoad);
  }, [wireFrame, iframeKey]);

  function updateActive(value: string) {
    if (!activePath) return;
    setActiveText(value);
    setPatches((prev) => {
      const next = { ...prev };
      const original = originals.current[activePath];
      if (value === original) delete next[activePath];
      else next[activePath] = value;
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        doc.querySelectorAll<HTMLElement>(`[data-cms="${CSS.escape(activePath)}"]`).forEach((node) => {
          if (node.childElementCount === 0) node.textContent = value;
          else {
            const text = Array.from(node.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
            if (text) text.textContent = value;
            else node.textContent = value;
          }
        });
      }
      return next;
    });
  }

  function discard() {
    setPatches({});
    setActivePath(null);
    setActiveText("");
    highlight(activeEl.current, false);
    activeEl.current = null;
    setIframeKey((k) => k + 1);
    setReady(false);
  }

  function save() {
    if (!dirty) return;
    const fd = new FormData();
    fd.set("returnTo", returnTo);
    fd.set("patches", JSON.stringify(patchList));
    startTransition(() => {
      saveCopyPatchesAction(fd);
    });
  }

  const longField = activeText.length > 120 || (activePath || "").includes("intro") || (activePath || "").includes("paragraphs") || (activePath || "").includes("body");

  return (
    <div className="live-edit">
      <div className="live-frame-wrap">
        {!ready && <div className="live-loading">Loading the page…</div>}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          className="live-frame"
          src={pagePath}
          title={`Live preview of ${pageTitle}`}
        />
      </div>

      <aside className="live-panel">
        <div className="live-panel-head">
          <strong>Edit {pageTitle}</strong>
          <p>Click any gold-outlined text on the page to change it. Press Save when you are happy.</p>
        </div>

        {activePath ? (
          <label className="live-field">
            <span>{friendlyLabel(activePath)}</span>
            <code>{activePath}</code>
            {longField ? (
              <textarea rows={8} value={activeText} onChange={(e) => updateActive(e.target.value)} />
            ) : (
              <input value={activeText} onChange={(e) => updateActive(e.target.value)} />
            )}
          </label>
        ) : (
          <p className="live-empty">Click a piece of writing on the page to start.</p>
        )}

        {dirty && (
          <ul className="live-queue">
            {patchList.map((row) => (
              <li key={row.path}>
                <button type="button" onClick={() => { setActivePath(row.path); setActiveText(row.value); }}>
                  {friendlyLabel(row.path)}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="live-bar">
          <button className="btn" type="button" disabled={!dirty || pending} onClick={save}>
            {pending ? "Saving…" : dirty ? `Save changes (${patchList.length})` : "No changes yet"}
          </button>
          <button className="btn secondary" type="button" disabled={!dirty || pending} onClick={discard}>
            Discard
          </button>
        </div>
      </aside>
    </div>
  );
}

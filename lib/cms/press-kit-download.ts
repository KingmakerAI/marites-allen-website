import "server-only";
import { openPressKit, resolvePressKit, resolveStaticPressKit, type ResolvedPressKit } from "./press-kit";

function attachmentHeaders(file: { mimeType: string; filename: string; size: number | null }) {
  const headers = new Headers({
    "Content-Type": file.mimeType,
    "Content-Disposition": `attachment; filename="${file.filename}"`,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex"
  });
  if (file.size && file.size > 0) headers.set("Content-Length", String(file.size));
  return headers;
}

function missing() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: "/media",
      "Cache-Control": "no-store"
    }
  });
}

async function respondWith(file: ResolvedPressKit) {
  const opened = await openPressKit(file);
  if (!opened) return null;
  return new Response(opened.stream, {
    headers: attachmentHeaders({
      mimeType: opened.mimeType,
      filename: opened.filename,
      size: opened.size
    })
  });
}

export async function pressKitDownloadResponse() {
  const file = await resolvePressKit();
  if (!file) return missing();
  const response = await respondWith(file);
  if (response) return response;
  if (file.source === "upload") {
    const fallback = resolveStaticPressKit();
    if (fallback) {
      const staticResponse = await respondWith(fallback);
      if (staticResponse) return staticResponse;
    }
  }
  return missing();
}

import { pressKitDownloadResponse } from "@/lib/cms/press-kit-download";

export const dynamic = "force-dynamic";

export function GET() {
  return pressKitDownloadResponse();
}

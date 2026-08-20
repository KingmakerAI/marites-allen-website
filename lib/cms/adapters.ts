/** Provider-agnostic CMS adapters. Swap implementations without changing admin UI. */

import type { AdminUser, MediaAsset } from "./types";

export type AuthProvider = {
  authenticate(email: string, password: string): AdminUser | null;
  createSession(userId: string): { token: string; expiresAt: string };
  destroySession(token: string): void;
  userFromSession(token: string): AdminUser | null;
};

export type MediaStorage = {
  save(file: { buffer: Buffer; mimeType: string; originalName: string; altText: string }): Promise<MediaAsset>;
  remove(id: string): Promise<void>;
};

export type ContentRepository = {
  kind: "json-file" | "sqlite" | "postgres" | "mysql" | "supabase";
};

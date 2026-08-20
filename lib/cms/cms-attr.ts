/** Mark a public-page text node so the admin live editor can find it. */
export function cms(path: string) {
  return { "data-cms": path } as const;
}

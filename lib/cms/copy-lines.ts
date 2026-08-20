export type CopyVideo = {
  source: string;
  title: string;
  yt: string;
  date?: string;
  badge?: string;
};

export type CopyTalk = { org: string; topic: string };

export function parseVideoLines(lines: string[]): CopyVideo[] {
  return lines
    .map((line) => {
      const [source = "", title = "", yt = "", date = "", badge = ""] = line.split("|").map((s) => s.trim());
      return { source, title, yt, date, badge };
    })
    .filter((v) => v.yt || v.title);
}

export function parseTalkLines(lines: string[]): CopyTalk[] {
  return lines
    .map((line) => {
      const [org = "", ...rest] = line.split("|");
      return { org: org.trim(), topic: rest.join("|").trim() };
    })
    .filter((t) => t.org);
}

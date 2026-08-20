import { isReservedPageSlug } from "./reserved-slugs";
import type { CmsPage, ContentStatus } from "./types";

export type SitePageDef = {
  id: string;
  title: string;
  href: string;
  editHref: string;
  blurb: string;
};

/** Designed pages that already live on the website. */
export const SITE_PAGES: SitePageDef[] = [
  {
    id: "home",
    title: "Home",
    href: "/",
    editHref: "/admin/live?page=/",
    blurb: "The first page visitors see."
  },
  {
    id: "about",
    title: "About",
    href: "/about",
    editHref: "/admin/live?page=/about",
    blurb: "Marites’s story and photo."
  },
  {
    id: "book",
    title: "Book",
    href: "/book",
    editHref: "/admin/live?page=/book",
    blurb: "Booking page words, services, and prices."
  },
  {
    id: "destara",
    title: "Destara",
    href: "/destara",
    editHref: "/admin/live?page=/destara",
    blurb: "The Destara app page."
  },
  {
    id: "frigga",
    title: "Frigga",
    href: "/frigga",
    editHref: "/admin/live?page=/frigga",
    blurb: "The Frigga shop page."
  },
  {
    id: "forecast",
    title: "Forecast",
    href: "/forecast",
    editHref: "/admin/live?page=/forecast",
    blurb: "The yearly forecast page."
  },
  {
    id: "projects",
    title: "Projects",
    href: "/projects",
    editHref: "/admin/live?page=/projects",
    blurb: "Brands and work she has done."
  },
  {
    id: "events",
    title: "Events",
    href: "/events",
    editHref: "/admin/live?page=/events",
    blurb: "Talks, dates, and the words at the top of Events."
  },
  {
    id: "media",
    title: "Media",
    href: "/media",
    editHref: "/admin/live?page=/media",
    blurb: "News, press, and the words at the top of Media."
  }
];

export type AdminPageRow = {
  key: string;
  kind: "site" | "custom";
  title: string;
  href: string;
  editHref: string;
  status: ContentStatus;
  updatedAt?: string;
  blurb?: string;
  id?: string;
  blocked?: boolean;
};

export function combineAdminPages(extras: CmsPage[]): AdminPageRow[] {
  const site: AdminPageRow[] = SITE_PAGES.map((page) => ({
    key: `site-${page.id}`,
    kind: "site",
    title: page.title,
    href: page.href,
    editHref: page.editHref,
    status: "published",
    blurb: page.blurb
  }));
  const custom: AdminPageRow[] = extras.map((page) => {
    const blocked = isReservedPageSlug(page.slug);
    return {
      key: page.id,
      kind: "custom" as const,
      title: page.title,
      href: `/${page.slug}`,
      editHref: `/admin/pages/${page.id}`,
      status: blocked ? "archived" : page.status,
      updatedAt: page.updatedAt,
      id: page.id,
      blocked,
      blurb: blocked
        ? "This link is already used by a site page, so this copy is not shown on the website."
        : undefined
    };
  });
  return [...site, ...custom];
}

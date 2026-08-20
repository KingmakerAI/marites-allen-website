export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  ownerOnly?: boolean;
  /** Other paths that should keep this item highlighted (page editors, and so on). */
  alsoMatch?: string[];
};

export type AdminNavGroup = {
  id: string;
  label: string | null;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "main",
    label: null,
    items: [{ href: "/admin/dashboard", label: "Home", icon: "dashboard" }]
  },
  {
    id: "content",
    label: "Writing & photos",
    items: [
      { href: "/admin/pages", label: "Pages", icon: "pages", alsoMatch: ["/admin/copy", "/admin/live", "/admin/homepage"] },
      { href: "/admin/articles", label: "News & press", icon: "articles" },
      { href: "/admin/categories", label: "Folders", icon: "categories" },
      { href: "/admin/media", label: "Photos", icon: "media" }
    ]
  },
  {
    id: "business",
    label: "Clients",
    items: [
      { href: "/admin/consultations", label: "Services", icon: "consultations" },
      { href: "/admin/enquiries", label: "Messages", icon: "enquiries" },
      { href: "/admin/events", label: "Events", icon: "events" }
    ]
  },
  {
    id: "website",
    label: "The website",
    items: [{ href: "/admin/navigation", label: "Menus", icon: "navigation" }]
  },
  {
    id: "system",
    label: "Account",
    items: [
      { href: "/admin/settings", label: "Settings", icon: "settings" },
      { href: "/admin/users", label: "Team", icon: "users", ownerOnly: true }
    ]
  }
];

/** Flat list kept for places that only need href + label. */
export const ADMIN_NAV = ADMIN_NAV_GROUPS.flatMap((group) => group.items);

export const ADMIN_CREATE_ITEMS = [
  { href: "/admin/articles/new", label: "News story", icon: "articles" },
  { href: "/admin/events/new", label: "Event", icon: "events" },
  { href: "/admin/pages/new", label: "Page", icon: "pages" },
  { href: "/admin/consultations", label: "Service", icon: "consultations" }
];

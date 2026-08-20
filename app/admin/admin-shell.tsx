"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDot,
  FileText,
  Hash,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeft,
  PenLine,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { logoutAction } from "./actions";
import { ADMIN_CREATE_ITEMS, ADMIN_NAV_GROUPS } from "./nav";
import type { AdminUser } from "@/lib/cms/types";
import { BrandLogo } from "@/components/brand-logo";

const ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  dashboard: LayoutDashboard,
  pages: FileText,
  articles: PenLine,
  categories: Hash,
  media: ImageIcon,
  consultations: CircleDot,
  enquiries: ArrowUpRight,
  events: CalendarDays,
  homepage: Home,
  builder: Sparkles,
  navigation: Menu,
  settings: Settings,
  users: Users
};

function NavIcon({ name }: { name: string }) {
  const Icon = ICONS[name] || FileText;
  return <Icon size={16} strokeWidth={1.75} />;
}

type SearchHit = { type: string; label: string; sub: string; href: string };

const RECENT_KEY = "ma-admin-recent";

function readRecent(): SearchHit[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(hit: SearchHit) {
  const next = [hit, ...readRecent().filter((r) => r.href !== hit.href)].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function SearchPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [recent] = useState<SearchHit[]>(() => readRecent());
  const [rawSelected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/admin/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          setHits(data.hits || []);
          setSelected(0);
        })
        .catch(() => {});
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const rows = query.trim() ? hits : recent;
  const selected = Math.min(rawSelected, Math.max(rows.length - 1, 0));

  const open = useCallback(
    (hit: SearchHit) => {
      pushRecent(hit);
      onClose();
      router.push(hit.href);
    },
    [onClose, router]
  );

  return (
    <div className="palette-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-label="Search Marites CMS">
        <div className="palette-input">
          <Search size={16} strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a page, news story, message..."
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((s) => Math.min(s + 1, rows.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter" && rows[selected]) {
                open(rows[selected]);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
          />
          <button type="button" className="palette-close" onClick={onClose} aria-label="Close search">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="palette-results">
          {!query.trim() && rows.length > 0 && <div className="palette-label">Recent</div>}
          {query.trim() && rows.length === 0 && <div className="palette-empty">No matches for “{query}”</div>}
          {!query.trim() && rows.length === 0 && (
            <div className="palette-empty">Type a name to find it.</div>
          )}
          {rows.map((hit, i) => (
            <button
              key={`${hit.href}-${i}`}
              type="button"
              className={`palette-row${i === selected ? " selected" : ""}`}
              onMouseEnter={() => setSelected(i)}
              onClick={() => open(hit)}
            >
              <span className="palette-type">{hit.type}</span>
              <span className="palette-main">
                <strong>{hit.label}</strong>
                {hit.sub && <em>{hit.sub}</em>}
              </span>
            </button>
          ))}
        </div>
        <div className="palette-foot">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

function subscribeNever() {
  return () => {};
}

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const isMac = useSyncExternalStore(
    subscribeNever,
    () => /Mac|iP(hone|ad|od)/.test(navigator.userAgent),
    () => false
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [navHover, setNavHover] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const createRef = useRef<HTMLDivElement>(null);
  const navOpen = navHover || createOpen;

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawerOpen(false);
    setCreateOpen(false);
    setNavHover(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") setCreateOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!createOpen) return;
    const onClick = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) setCreateOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [createOpen]);

  const groups = ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.ownerOnly || user.role === "owner")
  })).filter((group) => group.items.length > 0);

  const isActive = (href: string, alsoMatch?: string[]) =>
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    !!alsoMatch?.some((path) => pathname === path || pathname.startsWith(`${path}/`) || pathname.startsWith(`${path}?`));

  const renderSidebar = () => (
    <>
      <div className="admin-brand">
        <div className="admin-brand-lockup">
          <div className="brand-mark">
            <BrandLogo mark height={26} maxWidth={32} />
          </div>
          <div className="brand-full">
            <BrandLogo fluid />
          </div>
        </div>
      </div>

      <div className="side-tools">
        <button
          type="button"
          className="side-search"
          onClick={() => setSearchOpen(true)}
          title={isMac ? "Search (⌘K)" : "Search (Ctrl+K)"}
        >
          <Search size={16} strokeWidth={1.75} />
          <span className="side-label">Find</span>
          <kbd className="side-label">{isMac ? "⌘K" : "Ctrl K"}</kbd>
        </button>
        <div className="side-create-wrap" ref={createRef}>
          <button type="button" className="side-create" onClick={() => setCreateOpen((v) => !v)} title="Create">
            <Plus size={16} strokeWidth={2} />
            <span className="side-label">Make new</span>
          </button>
          {createOpen && (
            <div className="create-menu">
              {ADMIN_CREATE_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setCreateOpen(false)}>
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="side-nav">
        {groups.map((group) => (
          <div key={group.id} className="side-group">
            {group.label && <div className="side-group-label">{group.label}</div>}
            {group.label && <div className="side-group-rule" />}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href, item.alsoMatch) ? "active" : ""}
                title={item.label}
              >
                <NavIcon name={item.icon} />
                <span className="side-label">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-side-foot">
        <div className="admin-user-row">
          <span className="admin-avatar">{(user.email[0] || "m").toUpperCase()}</span>
          <span className="admin-user side-label">
            {user.email}
            <em>{user.role}</em>
          </span>
          <form action={logoutAction}>
            <button type="submit" className="side-logout" title="Sign out" aria-label="Sign out">
              <LogOut size={15} strokeWidth={1.75} />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className={`admin-app${navOpen ? " nav-open" : ""}`}>
      <header className="admin-topbar">
        <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          <PanelLeft size={18} strokeWidth={1.75} />
        </button>
        <BrandLogo mark height={22} maxWidth={28} />
        <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search">
          <Search size={18} strokeWidth={1.75} />
        </button>
      </header>

      <aside
        className={`admin-side${navOpen ? " expanded" : ""}`}
        onMouseEnter={() => setNavHover(true)}
        onMouseLeave={() => setNavHover(false)}
        onFocusCapture={() => setNavHover(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setNavHover(false);
        }}
      >
        {renderSidebar()}
      </aside>

      {drawerOpen && (
        <div className="drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && setDrawerOpen(false)}>
          <aside className="admin-side drawer expanded">{renderSidebar()}</aside>
        </div>
      )}

      <main className="admin-main">{children}</main>

      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

export function ConfirmSubmit({
  label,
  message,
  className = "btn danger"
}: {
  label: string;
  message: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}

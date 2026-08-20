import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { SITE_PAGES } from "@/lib/cms/site-pages";
import { Flash, ShopHead } from "../ui";
import { LiveEditor } from "./live-editor";

const ALLOWED = new Set(SITE_PAGES.map((p) => p.href));

export default async function LiveEditPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; saved?: string; error?: string }>;
}) {
  await requireUser();
  const q = await searchParams;
  const pagePath = q.page && ALLOWED.has(q.page) ? q.page : "/about";
  const page = SITE_PAGES.find((p) => p.href === pagePath) || SITE_PAGES.find((p) => p.id === "about")!;
  const returnTo = `/admin/live?page=${encodeURIComponent(page.href)}`;

  return (
    <div className="shop-page live-page">
      <ShopHead
        title={`Edit ${page.title}`}
        sub="This is the real website. Click the words you want to change, then press Save."
        backHref="/admin/pages"
        backLabel="All pages"
        viewHref={page.href}
        viewLabel="Open in a new tab"
      >
        <nav className="live-page-switch" aria-label="Which page">
          {SITE_PAGES.filter((p) => ["about", "destara", "frigga", "book", "projects", "forecast", "events", "media", "home"].includes(p.id)).map(
            (p) => (
              <Link key={p.id} href={`/admin/live?page=${encodeURIComponent(p.href)}`} className={p.href === page.href ? "active" : undefined}>
                {p.title}
              </Link>
            )
          )}
        </nav>
      </ShopHead>
      <Flash saved={q.saved} error={q.error} />
      <LiveEditor pagePath={page.href} pageTitle={page.title} returnTo={returnTo} />
    </div>
  );
}

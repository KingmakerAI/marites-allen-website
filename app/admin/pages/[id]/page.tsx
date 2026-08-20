import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { getPage } from "@/lib/cms/repo";
import { isReservedPageSlug } from "@/lib/cms/reserved-slugs";
import { PreviewEditor } from "../../preview-editor";
import { Flash, ShopHead } from "../../ui";
import { PageForm } from "../new/page";

export default async function EditPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const q = await searchParams;
  const page = getPage(id);
  if (!page) notFound();
  const blocked = isReservedPageSlug(page.slug);
  const liveHref = `/${page.slug === "home" ? "" : page.slug}`;
  return (
    <div className="shop-page">
      <ShopHead
        title={`Edit ${page.title}`}
        sub={
          blocked
            ? "This extra page is not on the website — that link already belongs to a site page."
            : "Change the pieces, look at the preview, then save. Hidden pages do not show on the website."
        }
        backHref="/admin/pages"
        backLabel="All pages"
        viewHref={!blocked && page.status === "published" ? liveHref : undefined}
        viewLabel="View page"
      />
      <Flash saved={q.saved} />
      {blocked && (
        <p className="pages-warn">
          The live {liveHref} page is a site page.{" "}
          <Link href="/admin/pages">Go back to Pages</Link> and edit that one instead, or trash this extra copy.
        </p>
      )}
      <div className="shop-copy shop-copy-wide">
        <PreviewEditor kind="page" liveHref={!blocked && page.status === "published" ? liveHref : undefined}>
          <PageForm page={page} />
        </PreviewEditor>
      </div>
    </div>
  );
}

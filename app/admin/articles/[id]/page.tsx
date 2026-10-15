import Link from "next/link";
import { requireUser } from "@/lib/cms/auth";
import { getArticle } from "@/lib/cms/repo";
import { persistenceMode } from "@/lib/cms/store";
import { PreviewEditor } from "../../preview-editor";
import { Flash, ShopHead } from "../../ui";
import { ArticleForm } from "../new/page";

export default async function EditArticle({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const q = await searchParams;
  const article = await getArticle(id);
  if (!article) {
    const ephemeral = persistenceMode() === "ephemeral";
    return (
      <div className="shop-page">
        <ShopHead title="Story not found" sub="This edit link no longer matches a story on this server." />
        <div className="flash error" role="alert">
          {ephemeral ? (
            <>
              Vercel Blob is not connected, so each server keeps its own temporary story list. Open{" "}
              <Link href="/admin/articles">News &amp; press</Link> again, or connect{" "}
              <code>BLOB_READ_WRITE_TOKEN</code> so stories stay in one place and Edit keeps working.
            </>
          ) : (
            <>
              That story is not in the library. It may have been deleted. Go back to{" "}
              <Link href="/admin/articles">News &amp; press</Link>.
            </>
          )}
        </div>
      </div>
    );
  }
  const liveHref = article.status === "published" ? `/articles/${article.slug}` : undefined;
  return (
    <div className="shop-page">
      <ShopHead
        title="Edit news story"
        sub="Change the words, check the preview, then choose who can see it and save."
        viewHref={liveHref}
        viewLabel="See on website"
      />
      <Flash saved={q.saved} />
      <div className="shop-copy shop-copy-wide">
        <PreviewEditor kind="article" liveHref={liveHref}>
          <ArticleForm article={article} />
        </PreviewEditor>
      </div>
    </div>
  );
}

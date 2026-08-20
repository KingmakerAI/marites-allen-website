import { notFound } from "next/navigation";
import { requireUser } from "@/lib/cms/auth";
import { getArticle } from "@/lib/cms/repo";
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
  const article = getArticle(id);
  if (!article) notFound();
  const liveHref = article.status === "published" ? `/articles/${article.slug}` : undefined;
  return (
    <div className="shop-page">
      <ShopHead
        title="Edit news story"
        sub="Change the words, check the preview, then save. It only goes on the website if you chose “Show it”."
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

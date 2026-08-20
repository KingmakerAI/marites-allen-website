import { requireUser } from "@/lib/cms/auth";
import { listCategories } from "@/lib/cms/repo";
import { saveArticleAction } from "../../actions";
import { PreviewEditor } from "../../preview-editor";
import { EasyMore, ShopHead, StatusSelect } from "../../ui";
import type { Article } from "@/lib/cms/types";

export function ArticleForm({ article }: { article?: Article | null }) {
  const cats = listCategories();
  return (
    <form action={saveArticleAction} className="admin-form shop-card">
      {article && <input type="hidden" name="id" value={article.id} />}
      <p className="field-hint">Fill these in, check the picture on the right, then choose who can see it.</p>
      <label>
        Headline
        <input name="title" required defaultValue={article?.title} placeholder="What is this story called?" />
      </label>
      <label>
        Short summary
        <textarea name="excerpt" rows={3} defaultValue={article?.excerpt} placeholder="One or two sentences" />
      </label>
      <label>
        The story
        <textarea name="body" rows={8} defaultValue={article?.body} placeholder="Type the story here" />
        <span className="field-hint">You can paste normal writing. If you already have web code, that works too.</span>
      </label>
      <div className="fields-2">
        <label>
          Newspaper or show
          <input name="outlet" defaultValue={article?.outlet} placeholder="ABS-CBN, Inquirer…" />
        </label>
        <label>
          Folder
          <select name="categoryId" defaultValue={article?.categoryId || ""}>
            <option value="">No folder</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year
          <input name="year" type="number" defaultValue={article?.year || new Date().getFullYear()} />
        </label>
        <label>
          Month
          <select name="month" defaultValue={article?.month || 1}>
            {["January","February","March","April","May","June","July","August","September","October","November","December"].map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <StatusSelect value={article?.status} />
      <EasyMore>
        <label>
          Link to the original story
          <input name="externalUrl" defaultValue={article?.externalUrl} placeholder="https://" />
        </label>
        <label>
          Button words
          <input name="ctaLabel" defaultValue={article?.ctaLabel || "Read article"} />
        </label>
        <label>
          Written by
          <input name="author" defaultValue={article?.author || "Marites Allen"} />
        </label>
        <label>
          Web address name
          <input name="slug" defaultValue={article?.slug} placeholder="leave blank and we will make one" />
          <span className="field-hint">This is the ending of the link, like /articles/my-story</span>
        </label>
        <label>
          Tags
          <input name="tags" defaultValue={article?.tags.join(", ")} placeholder="feng shui, luck" />
        </label>
        <label>
          Google title
          <input name="seoTitle" defaultValue={article?.seoTitle} />
        </label>
        <label>
          Google description
          <textarea name="seoDescription" rows={2} defaultValue={article?.seoDescription} />
        </label>
      </EasyMore>
      <button className="btn" type="submit">
        Save
      </button>
    </form>
  );
}

export default async function NewArticle() {
  await requireUser();
  return (
    <div className="shop-page">
      <ShopHead
        title="New news story"
        sub="Write it, look at the preview, then choose “Show it on the website” when you are ready."
      />
      <div className="shop-copy shop-copy-wide">
        <PreviewEditor kind="article">
          <ArticleForm />
        </PreviewEditor>
      </div>
    </div>
  );
}

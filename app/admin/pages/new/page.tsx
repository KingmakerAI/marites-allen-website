import { requireUser } from "@/lib/cms/auth";
import { savePageAction } from "../../actions";
import { PageBlocksEditor } from "../../page-blocks-editor";
import { PreviewEditor } from "../../preview-editor";
import { EasyMore, ShopHead, StatusSelect } from "../../ui";
import type { CmsPage, PageBlock } from "@/lib/cms/types";

export function PageForm({ page }: { page?: CmsPage | null }) {
  const blocks: PageBlock[] = page?.blocks || [
    { type: "hero", heading: "Page title", subheading: "A short sentence", ctaLabel: "", ctaHref: "/book" },
    { type: "richText", html: "<p>Type the page here.</p>" }
  ];
  return (
    <form action={savePageAction} className="admin-form shop-card">
      {page && <input type="hidden" name="id" value={page.id} />}
      <label>
        Page name
        <input name="title" required defaultValue={page?.title} placeholder="What is this page called?" />
      </label>
      <label>
        Link name
        <input name="slug" defaultValue={page?.slug} placeholder="leave blank and we will make one" />
        <span className="field-hint">This becomes maritesallen.com/your-link-name. Use small letters and dashes, or leave it blank.</span>
      </label>
      <StatusSelect value={page?.status} />
      <PageBlocksEditor initial={blocks} />
      <EasyMore>
        <label>
          Google title
          <input name="seoTitle" defaultValue={page?.seoTitle} maxLength={70} />
        </label>
        <label>
          Google description
          <textarea name="seoDescription" rows={3} defaultValue={page?.seoDescription} maxLength={180} />
        </label>
      </EasyMore>
      <div className="admin-actions">
        <button className="btn" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default async function NewPage() {
  await requireUser();
  return (
    <div className="shop-page">
      <ShopHead
        title="Add new page"
        sub="Give it a name, add pieces (title, writing, pictures), look at the preview, then show it on the website."
        backHref="/admin/pages"
        backLabel="All pages"
      />
      <div className="shop-copy shop-copy-wide">
        <PreviewEditor kind="page">
          <PageForm />
        </PreviewEditor>
      </div>
    </div>
  );
}

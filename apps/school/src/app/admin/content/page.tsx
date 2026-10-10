import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Badge } from "@/components/ui";
import {
  AdminShell,
  AdminPanel,
  AdminEmpty,
} from "@/components/admin-chrome";
import { ContentPageForm } from "@/components/forms/content-forms";

export default async function ContentAdminPage() {
  await requirePermission("manage_content");
  const pages = await db.contentPage.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell
      title="Website content"
      description="Create and publish CMS pages for the public school site."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
        </svg>
      }
    >
      <AdminPanel title="New page" description="HTML is sanitized on save.">
        <ContentPageForm />
      </AdminPanel>

      {pages.length ? (
        <div className="space-y-4">
          {pages.map((p) => (
            <AdminPanel
              key={p.id}
              title={p.title}
              description={`/p/${p.slug} · ${p.pageType}`}
              actions={
                <Badge
                  tone={
                    p.status === "PUBLISHED" ? "green" : p.status === "ARCHIVED" ? "gray" : "gold"
                  }
                >
                  {p.status}
                </Badge>
              }
            >
              <details className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
                <summary className="cursor-pointer text-sm font-semibold">Edit page</summary>
                <div className="mt-4">
                  <ContentPageForm
                    initial={{
                      id: p.id,
                      title: p.title,
                      slug: p.slug,
                      content: p.content,
                      excerpt: p.excerpt,
                      metaTitle: p.metaTitle,
                      metaDescription: p.metaDescription,
                      status: p.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                      pageType: p.pageType,
                      featured: p.featured,
                    }}
                  />
                </div>
              </details>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmpty title="No pages yet" />
      )}
    </AdminShell>
  );
}

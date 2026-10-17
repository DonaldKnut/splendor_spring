import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { AdminContentForms } from "@/components/forms";
import { Card, PageHeader } from "@/components/ui";

export default async function ContentAdminPage() {
  await requirePermission("manage_content");
  const pages = await db.contentPage.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <PageHeader title="Content" description="CMS pages, programmes, and campaigns." />
      <Card className="mb-6">
        <AdminContentForms />
      </Card>
      <Card>
        <h2 className="font-display text-lg">Existing pages</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {pages.map((p) => (
            <li key={p.id}>
              {p.title} · {p.slug} · {p.status}
            </li>
          ))}
          {!pages.length ? <li>No pages yet.</li> : null}
        </ul>
      </Card>
    </div>
  );
}

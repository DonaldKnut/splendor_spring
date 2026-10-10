import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Badge } from "@/components/ui";
import {
  AdminShell,
  AdminPanel,
  AdminEmpty,
} from "@/components/admin-chrome";
import { AnnouncementForm } from "@/components/forms/content-forms";

export default async function AnnouncementsAdminPage() {
  await requirePermission("manage_content");
  const items = await db.announcement.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell
      title="Announcements"
      description="School news shown on the public site and portals."
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      }
    >
      <AdminPanel title="New announcement">
        <AnnouncementForm />
      </AdminPanel>

      {items.length ? (
        <div className="space-y-4">
          {items.map((item) => (
            <AdminPanel
              key={item.id}
              title={item.title}
              description={`/announcements/${item.slug}`}
              actions={
                <Badge
                  tone={
                    item.status === "PUBLISHED"
                      ? "green"
                      : item.status === "ARCHIVED"
                        ? "gray"
                        : "gold"
                  }
                >
                  {item.status}
                </Badge>
              }
            >
              {item.excerpt ? (
                <p className="mb-4 text-sm text-[var(--c-text-3)]">{item.excerpt}</p>
              ) : null}
              <details className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
                <summary className="cursor-pointer text-sm font-semibold">Edit</summary>
                <div className="mt-4">
                  <AnnouncementForm
                    initial={{
                      id: item.id,
                      title: item.title,
                      slug: item.slug,
                      content: item.content,
                      excerpt: item.excerpt,
                      status: item.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                      featured: item.featured,
                    }}
                  />
                </div>
              </details>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmpty title="No announcements yet" />
      )}
    </AdminShell>
  );
}

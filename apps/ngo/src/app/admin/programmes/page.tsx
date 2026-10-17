import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Card, EmptyState, PageHeader } from "@/components/ui";

export default async function ProgrammesAdminPage() {
  await requirePermission("manage_programmes");
  const items = await db.programme.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Programmes"
        description="Create programmes from the Content admin screen."
      />
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <h2 className="font-display text-lg">{item.title}</h2>
              <p className="text-sm text-ink/65">
                {item.status} · /programmes/{item.slug}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No programmes yet" />
      )}
    </div>
  );
}

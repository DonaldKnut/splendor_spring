import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { ContactHandleButton } from "@/components/forms";
import { Card, EmptyState, PageHeader } from "@/components/ui";

export default async function ContactsAdminPage() {
  await requirePermission("view_contacts");
  const contacts = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <PageHeader title="Contact submissions" />
      {contacts.length ? (
        <div className="space-y-3">
          {contacts.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg">{c.subject}</h2>
                  <p className="text-sm text-ink/65">
                    {c.name} · {c.email} · {c.status}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{c.message}</p>
                </div>
                {c.status === "NEW" ? <ContactHandleButton id={c.id} /> : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No contact submissions yet" />
      )}
    </div>
  );
}

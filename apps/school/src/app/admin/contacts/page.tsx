import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Badge } from "@/components/ui";
import {
  AdminShell,
  AdminPanel,
  AdminEmpty,
} from "@/components/admin-chrome";
import { ContactActions } from "@/components/forms/contact-actions";

export default async function ContactsAdminPage() {
  await requirePermission("view_contacts");
  const contacts = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const newCount = contacts.filter((c) => c.status === "NEW").length;

  return (
    <AdminShell
      title="Contact submissions"
      description={`${newCount} new · ${contacts.length} recent enquiries from the public website.`}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      }
    >
      {contacts.length ? (
        <div className="space-y-3">
          {contacts.map((c) => (
            <AdminPanel
              key={c.id}
              title={c.subject}
              description={`${c.name} · ${c.email}${c.phone ? ` · ${c.phone}` : ""} · ${new Date(c.createdAt).toLocaleString()}`}
              actions={
                <Badge tone={c.status === "NEW" ? "gold" : "green"}>{c.status}</Badge>
              }
            >
              <p className="whitespace-pre-wrap text-sm text-[var(--c-text-2)]">{c.message}</p>
              {c.status === "NEW" ? (
                <div className="mt-4">
                  <ContactActions id={c.id} />
                </div>
              ) : null}
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmpty title="No contact submissions yet" />
      )}
    </AdminShell>
  );
}

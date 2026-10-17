import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { GrantForm, QuickStatusButton, toLocalInput } from "@/components/admin-forms";

export default async function GrantsAdminPage() {
  await requirePermission("manage_grants");

  const [items, programmes] = await Promise.all([
    db.grant.findMany({
      include: { programme: { select: { title: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    db.programme.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Grants"
        description="Publish funding opportunities with eligibility, amounts, and deadlines. Open grants appear on the public grants board."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Card>
          <h2 className="font-display text-xl">New grant</h2>
          <div className="mt-5">
            <GrantForm programmes={programmes} />
          </div>
        </Card>

        <div className="space-y-3">
          {items.length ? (
            items.map((item) => (
              <Card key={item.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-coral">
                      {item.status}
                      {item.category ? ` · ${item.category}` : ""}
                    </p>
                    <h3 className="mt-1 font-display text-lg">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink/65">
                      {item.amountMin != null || item.amountMax != null
                        ? `₦${(item.amountMin ?? 0).toLocaleString()} – ₦${(item.amountMax ?? item.amountMin ?? 0).toLocaleString()}`
                        : "Amount flexible"}
                      {item.deadline
                        ? ` · Deadline ${item.deadline.toLocaleDateString("en-NG")}`
                        : ""}
                    </p>
                    {item.programme ? (
                      <p className="mt-1 text-xs text-ink/50">{item.programme.title}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.status !== "OPEN" ? (
                      <QuickStatusButton kind="grant" id={item.id} status="OPEN" label="Open" />
                    ) : (
                      <QuickStatusButton kind="grant" id={item.id} status="CLOSED" label="Close" />
                    )}
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-ocean">
                    Edit grant
                  </summary>
                  <div className="mt-3 border-t border-line pt-3">
                    <GrantForm
                      programmes={programmes}
                      initial={{
                        id: item.id,
                        title: item.title,
                        summary: item.summary,
                        description: item.description,
                        amountMin: item.amountMin,
                        amountMax: item.amountMax,
                        currency: item.currency,
                        category: item.category,
                        eligibility: item.eligibility,
                        applicationUrl: item.applicationUrl,
                        deadline: toLocalInput(item.deadline),
                        featured: item.featured,
                        programmeId: item.programmeId,
                        status: item.status,
                      }}
                    />
                  </div>
                </details>
              </Card>
            ))
          ) : (
            <EmptyState title="No grants yet" description="Create an OPEN grant to list it publicly." />
          )}
        </div>
      </div>
    </div>
  );
}

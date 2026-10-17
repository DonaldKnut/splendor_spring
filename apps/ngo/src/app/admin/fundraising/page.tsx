import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { FundraisingForm, QuickStatusButton, toLocalInput } from "@/components/admin-forms";

export default async function FundraisingAdminPage() {
  await requirePermission("manage_campaigns");

  const [items, programmes, events] = await Promise.all([
    db.campaign.findMany({
      include: {
        donations: { where: { status: "SUCCESS" }, select: { amount: true } },
        event: { select: { title: true } },
        programme: { select: { title: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.programme.findMany({
      where: { status: { in: ["PUBLISHED", "DRAFT"] } },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    db.event.findMany({
      select: { id: true, title: true },
      orderBy: { startsAt: "desc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Fundraising"
        description="Create and publish donation campaigns for programmes, events, or general appeals. Verified gifts update progress automatically."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Card>
          <h2 className="font-display text-xl">New campaign</h2>
          <p className="mt-1 text-sm text-ink/60">
            Set a goal, window, and optional event link. Publish when ready for the donate page.
          </p>
          <div className="mt-5">
            <FundraisingForm programmes={programmes} events={events} />
          </div>
        </Card>

        <div className="space-y-3">
          {items.length ? (
            items.map((item) => {
              const raised = item.donations.reduce((sum, d) => sum + d.amount, 0);
              const pct =
                item.goalAmount && item.goalAmount > 0
                  ? Math.min(100, Math.round((raised / item.goalAmount) * 100))
                  : null;
              return (
                <Card key={item.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal">
                        {item.status}
                        {item.featured ? " · Featured" : ""}
                      </p>
                      <h3 className="mt-1 font-display text-lg">{item.title}</h3>
                      <p className="mt-1 text-sm text-ink/65">
                        Raised ₦{raised.toLocaleString()}
                        {item.goalAmount != null
                          ? ` / ₦${item.goalAmount.toLocaleString()}`
                          : ""}
                        {pct != null ? ` (${pct}%)` : ""}
                      </p>
                      <p className="mt-1 text-xs text-ink/50">
                        {[item.programme?.title, item.event?.title].filter(Boolean).join(" · ") ||
                          "General appeal"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.status !== "PUBLISHED" ? (
                        <QuickStatusButton
                          kind="campaign"
                          id={item.id}
                          status="PUBLISHED"
                          label="Publish"
                        />
                      ) : (
                        <QuickStatusButton
                          kind="campaign"
                          id={item.id}
                          status="ARCHIVED"
                          label="Archive"
                        />
                      )}
                    </div>
                  </div>
                  {pct != null ? (
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-mist">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: "linear-gradient(90deg, #1f5c70, #2f8f8a)",
                        }}
                      />
                    </div>
                  ) : null}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-ocean">
                      Edit campaign
                    </summary>
                    <div className="mt-3 border-t border-line pt-3">
                      <FundraisingForm
                        programmes={programmes}
                        events={events}
                        initial={{
                          id: item.id,
                          title: item.title,
                          summary: item.summary,
                          description: item.description,
                          goalAmount: item.goalAmount,
                          currency: item.currency,
                          featured: item.featured,
                          startsAt: toLocalInput(item.startsAt),
                          endsAt: toLocalInput(item.endsAt),
                          programmeId: item.programmeId,
                          eventId: item.eventId,
                          status: item.status,
                        }}
                      />
                    </div>
                  </details>
                </Card>
              );
            })
          ) : (
            <EmptyState
              title="No campaigns yet"
              description="Create your first fundraising campaign to start collecting verified donations."
            />
          )}
        </div>
      </div>
    </div>
  );
}

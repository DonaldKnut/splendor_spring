import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { PollForm, QuickStatusButton } from "@/components/admin-forms";

export default async function PollsAdminPage() {
  await requirePermission("manage_polls");

  const [items, events] = await Promise.all([
    db.poll.findMany({
      include: {
        options: {
          include: { _count: { select: { votes: true } } },
          orderBy: { sortOrder: "asc" },
        },
        event: { select: { title: true } },
        _count: { select: { votes: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.event.findMany({
      select: { id: true, title: true },
      orderBy: { startsAt: "desc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Polls"
        description="Gather community input. Open polls are live on the public site; results update as votes come in."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Card>
          <h2 className="font-display text-xl">New poll</h2>
          <div className="mt-5">
            <PollForm events={events} />
          </div>
        </Card>

        <div className="space-y-3">
          {items.length ? (
            items.map((item) => {
              const total = item._count.votes || 1;
              return (
                <Card key={item.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal">
                        {item.status}
                      </p>
                      <h3 className="mt-1 font-display text-lg">{item.title}</h3>
                      <p className="mt-1 text-sm text-ink/65">
                        {item._count.votes} vote{item._count.votes === 1 ? "" : "s"}
                        {item.event ? ` · ${item.event.title}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.status !== "OPEN" ? (
                        <QuickStatusButton kind="poll" id={item.id} status="OPEN" label="Open" />
                      ) : (
                        <QuickStatusButton kind="poll" id={item.id} status="CLOSED" label="Close" />
                      )}
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {item.options.map((opt) => {
                      const votes = opt._count.votes;
                      const pct = Math.round((votes / total) * 100);
                      return (
                        <li key={opt.id}>
                          <div className="mb-1 flex justify-between text-xs text-ink/70">
                            <span>{opt.label}</span>
                            <span>
                              {votes} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-mist">
                            <div
                              className="h-full rounded-full bg-teal"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              );
            })
          ) : (
            <EmptyState title="No polls yet" />
          )}
        </div>
      </div>
    </div>
  );
}

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { EventForm, QuickStatusButton, toLocalInput } from "@/components/admin-forms";

export default async function EventsAdminPage() {
  await requirePermission("manage_events");

  const [items, programmes] = await Promise.all([
    db.event.findMany({
      include: {
        programme: { select: { title: true } },
        _count: { select: { campaigns: true, polls: true } },
      },
      orderBy: { startsAt: "desc" },
    }),
    db.programme.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Events"
        description="Schedule community events and link fundraising campaigns or polls to them."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Card>
          <h2 className="font-display text-xl">New event</h2>
          <div className="mt-5">
            <EventForm programmes={programmes} />
          </div>
        </Card>

        <div className="space-y-3">
          {items.length ? (
            items.map((item) => (
              <Card key={item.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ocean">
                      {item.status}
                    </p>
                    <h3 className="mt-1 font-display text-lg">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink/65">
                      {item.startsAt.toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {item.venue ? ` · ${item.venue}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      {item._count.campaigns} campaign{item._count.campaigns === 1 ? "" : "s"} ·{" "}
                      {item._count.polls} poll{item._count.polls === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.status !== "PUBLISHED" ? (
                      <QuickStatusButton
                        kind="event"
                        id={item.id}
                        status="PUBLISHED"
                        label="Publish"
                      />
                    ) : (
                      <QuickStatusButton
                        kind="event"
                        id={item.id}
                        status="COMPLETED"
                        label="Mark done"
                      />
                    )}
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-ocean">
                    Edit event
                  </summary>
                  <div className="mt-3 border-t border-line pt-3">
                    <EventForm
                      programmes={programmes}
                      initial={{
                        id: item.id,
                        title: item.title,
                        summary: item.summary,
                        description: item.description,
                        venue: item.venue,
                        location: item.location,
                        startsAt: toLocalInput(item.startsAt),
                        endsAt: toLocalInput(item.endsAt),
                        capacity: item.capacity,
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
            <EmptyState title="No events yet" />
          )}
        </div>
      </div>
    </div>
  );
}

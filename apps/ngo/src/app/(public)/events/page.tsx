import Link from "next/link";
import { Reveal } from "@splendor/ui";
import { db } from "@/lib/db";
import { safeDbQuery } from "@/lib/safe-db";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await safeDbQuery(
    () =>
      db.event.findMany({
        where: { status: { in: ["PUBLISHED", "COMPLETED"] } },
        include: {
          campaigns: {
            where: { status: "PUBLISHED" },
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { startsAt: "asc" },
      }),
    [],
  );

  return (
    <div>
      <section
        className="px-5 pb-14 pt-28 text-white sm:px-6 sm:pt-32"
        style={{
          background: "linear-gradient(135deg, #1b2430 0%, #1f5c70 60%, #2f8f8a 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#e8915f]">
            Community
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Events</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Gatherings, outreaches, and fundraisers — managed from the admin control room.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-4 px-5 py-14 sm:px-6">
        {events.length ? (
          events.map((ev) => (
            <Reveal key={ev.id}>
              <article className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ocean">
                  {ev.status}
                </p>
                <h2 className="mt-1 font-display text-2xl">{ev.title}</h2>
                {ev.summary ? (
                  <p className="mt-2 max-w-2xl text-sm text-ink/70">{ev.summary}</p>
                ) : null}
                <p className="mt-3 text-sm text-ink/60">
                  {ev.startsAt.toLocaleString("en-NG", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {ev.venue ? ` · ${ev.venue}` : ""}
                  {ev.location ? `, ${ev.location}` : ""}
                </p>
                {ev.campaigns.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ev.campaigns.map((c) => (
                      <Link
                        key={c.id}
                        href={`/donate?campaign=${c.id}`}
                        className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ocean"
                      >
                        Support: {c.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </article>
            </Reveal>
          ))
        ) : (
          <p className="text-center text-ink/60">No published events yet.</p>
        )}
      </div>
    </div>
  );
}

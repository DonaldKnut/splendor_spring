import Link from "next/link";
import { Reveal } from "@splendor/ui";
import { db } from "@/lib/db";
import { safeDbQuery } from "@/lib/safe-db";

export const metadata = { title: "Polls" };

export default async function PollsPage() {
  const polls = await safeDbQuery(
    () =>
      db.poll.findMany({
        where: { status: { in: ["OPEN", "CLOSED"] } },
        include: { _count: { select: { votes: true } }, event: { select: { title: true } } },
        orderBy: { updatedAt: "desc" },
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
            Your voice
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Polls</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Quick community questions. One vote per device while a poll is open.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-4 px-5 py-14 sm:grid-cols-2 sm:px-6">
        {polls.length ? (
          polls.map((p) => (
            <Reveal key={p.id}>
              <Link
                href={`/polls/${p.slug}`}
                className="block h-full rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal">
                  {p.status}
                </p>
                <h2 className="mt-2 font-display text-xl">{p.title}</h2>
                <p className="mt-2 text-sm text-ink/60">
                  {p._count.votes} vote{p._count.votes === 1 ? "" : "s"}
                  {p.event ? ` · ${p.event.title}` : ""}
                </p>
              </Link>
            </Reveal>
          ))
        ) : (
          <p className="col-span-full text-center text-ink/60">No polls are live right now.</p>
        )}
      </div>
    </div>
  );
}

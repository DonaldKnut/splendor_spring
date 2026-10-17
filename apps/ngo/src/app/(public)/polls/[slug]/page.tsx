import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PollVoteForm } from "@/components/poll-vote-form";

export default async function PollDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poll = await db.poll.findUnique({
    where: { slug },
    include: {
      options: {
        include: { _count: { select: { votes: true } } },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { votes: true } },
    },
  });
  if (!poll || (poll.status !== "OPEN" && poll.status !== "CLOSED")) notFound();

  const total = poll._count.votes || 1;
  const showResults = poll.status === "CLOSED" || poll._count.votes > 0;

  return (
    <div>
      <section
        className="px-5 pb-12 pt-28 text-white sm:px-6 sm:pt-32"
        style={{
          background: "linear-gradient(135deg, #1b2430 0%, #1f5c70 60%, #2f8f8a 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#e8915f]">
            {poll.status === "OPEN" ? "Open poll" : "Closed poll"}
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">{poll.title}</h1>
          {poll.description ? (
            <p className="mt-3 text-sm text-white/75">{poll.description}</p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-2xl space-y-8 px-5 py-12 sm:px-6">
        {poll.status === "OPEN" ? (
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl">Cast your vote</h2>
            <div className="mt-4">
              <PollVoteForm
                pollId={poll.id}
                allowMultiple={poll.allowMultiple}
                options={poll.options.map((o) => ({ id: o.id, label: o.label }))}
              />
            </div>
          </div>
        ) : null}

        {showResults ? (
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl">Results</h2>
            <p className="mt-1 text-sm text-ink/60">
              {poll._count.votes} total vote{poll._count.votes === 1 ? "" : "s"}
            </p>
            <ul className="mt-4 space-y-3">
              {poll.options.map((opt) => {
                const votes = opt._count.votes;
                const pct = Math.round((votes / total) * 100);
                return (
                  <li key={opt.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{opt.label}</span>
                      <span className="text-ink/60">
                        {votes} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-mist">
                      <div
                        className="h-full rounded-full bg-teal"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

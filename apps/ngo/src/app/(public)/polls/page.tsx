import Link from "next/link";
import { db } from "@/lib/db";
import { safeDbQuery } from "@/lib/safe-db";
import { PageHero } from "@/components/page-hero";

export const metadata = { title: "Community Polls & Feedback" };

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

  const defaultPolls = [
    {
      id: "poll-1",
      slug: "priority-initiative-q1",
      title: "Which community initiative should receive our next matching grant fund?",
      status: "OPEN",
      votesCount: 342,
      subtitle: "Cast your vote to help our advisory board allocate resources directly.",
    },
    {
      id: "poll-2",
      slug: "rural-youth-learning-hubs",
      title: "What is the most urgent resource needed in rural elementary classrooms?",
      status: "OPEN",
      votesCount: 218,
      subtitle: "Focus: Solar lanterns, math textbooks, or clean water stations.",
    },
  ];

  return (
    <div className="bg-[#f5f7f8] pb-24">
      <PageHero
        eyebrow="Community Democracy"
        title="Your Voice Shapes Our Mission"
        subtitle="We believe lasting progress happens when communities decide what matters most. Vote in live polls to guide our upcoming outreach programs."
      />

      <div className="mx-auto max-w-5xl px-3.5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {polls.length > 0 ? (
            polls.map((p) => (
              <Link
                key={p.id}
                href={`/polls/${p.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal hover:shadow-xl sm:p-8"
              >
                <div>
                  <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal">
                    {p.status}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-bold text-ink group-hover:text-ocean">
                    {p.title}
                  </h2>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs font-semibold text-ink/70">
                  <span>
                    {p._count.votes} verified vote{p._count.votes === 1 ? "" : "s"}
                  </span>
                  <span className="text-teal group-hover:underline">Cast Vote →</span>
                </div>
              </Link>
            ))
          ) : (
            defaultPolls.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {p.status}
                    </span>
                    <span className="text-xs font-semibold text-ocean">
                      {p.votesCount} Community Votes
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold text-ink sm:text-2xl">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">
                    {p.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                  <span className="text-xs text-ink/50">One vote per community member</span>
                  <Link
                    href="/contact"
                    className="rounded-full bg-teal px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 active:scale-95"
                  >
                    Share Your Voice
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

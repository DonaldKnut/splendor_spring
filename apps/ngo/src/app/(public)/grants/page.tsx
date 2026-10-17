import Link from "next/link";
import { Reveal } from "@splendor/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Grants" };

export default async function GrantsPage() {
  const grants = await db.grant.findMany({
    where: { status: { in: ["OPEN", "CLOSED"] } },
    orderBy: [{ status: "asc" }, { deadline: "asc" }],
  });

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
            Funding
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Grants</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Open opportunities published by the organisation. Check eligibility and deadlines
            before applying.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-4 px-5 py-14 sm:px-6">
        {grants.length ? (
          grants.map((g) => (
            <Reveal key={g.id}>
              <article className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-coral">
                      {g.status}
                      {g.category ? ` · ${g.category}` : ""}
                    </p>
                    <h2 className="mt-1 font-display text-2xl">{g.title}</h2>
                    {g.summary ? (
                      <p className="mt-2 max-w-2xl text-sm text-ink/70">{g.summary}</p>
                    ) : null}
                    <p className="mt-3 text-sm text-ink/60">
                      {g.amountMin != null || g.amountMax != null
                        ? `₦${(g.amountMin ?? 0).toLocaleString()} – ₦${(g.amountMax ?? g.amountMin ?? 0).toLocaleString()}`
                        : "Flexible amount"}
                      {g.deadline
                        ? ` · Apply by ${g.deadline.toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}`
                        : ""}
                    </p>
                  </div>
                  {g.applicationUrl && g.status === "OPEN" ? (
                    <a
                      href={g.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white"
                    >
                      Apply
                    </a>
                  ) : null}
                </div>
                {g.eligibility ? (
                  <p className="mt-4 rounded-2xl bg-mist px-4 py-3 text-sm text-ink/70">
                    <span className="font-semibold text-ink">Eligibility: </span>
                    {g.eligibility}
                  </p>
                ) : null}
              </article>
            </Reveal>
          ))
        ) : (
          <p className="text-center text-ink/60">No grants are published right now.</p>
        )}
        <p className="pt-4 text-center text-sm text-ink/55">
          Looking to support programmes instead?{" "}
          <Link href="/donate" className="font-semibold text-ocean underline">
            Donate
          </Link>
        </p>
      </div>
    </div>
  );
}

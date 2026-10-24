import Link from "next/link";
import { db } from "@/lib/db";
import { safeDbQuery } from "@/lib/safe-db";
import { PageHero } from "@/components/page-hero";

export const metadata = { title: "Community Grants & Seed Funding" };

export default async function GrantsPage() {
  const grants = await safeDbQuery(
    () =>
      db.grant.findMany({
        where: { status: { in: ["OPEN", "CLOSED"] } },
        orderBy: [{ status: "asc" }, { deadline: "asc" }],
      }),
    [],
  );

  const defaultGrants = [
    {
      id: "grant-1",
      title: "Grassroots Education Innovation Seed Grant",
      status: "OPEN",
      category: "Education",
      amountMin: 250000,
      amountMax: 750000,
      deadlineText: "November 30, 2026",
      summary:
        "Providing small catalytic micro-grants for community school teachers and youth leaders to set up neighbourhood reading clubs, STEM corners, or literacy centres.",
      eligibility:
        "Open to verified educators, non-profit volunteer teachers, and grassroots youth initiatives serving rural or peri-urban primary students.",
    },
    {
      id: "grant-2",
      title: "Women Caregivers Vocational Empowerment Fund",
      status: "OPEN",
      category: "Livelihoods",
      amountMin: 150000,
      amountMax: 500000,
      deadlineText: "December 15, 2026",
      summary:
        "Direct seed equipment and inventory funding for female heads-of-household to expand sustainable micro-farming, tailoring, or food processing businesses.",
      eligibility:
        "Caregivers and mothers supporting at least 2 school-aged dependents with an established home-based craft or trade.",
    },
  ];

  return (
    <div className="bg-[#f5f7f8] pb-24">
      <PageHero
        eyebrow="Empowerment Opportunities"
        title="Community Grants & Seed Funding"
        subtitle="Empowering grassroots innovators, community educators, and caregivers with micro-grants that drive lasting self-reliance."
      />

      <div className="mx-auto max-w-5xl px-3.5 py-12 sm:px-6 sm:py-16">
        <div className="space-y-6">
          {grants.length > 0 ? (
            grants.map((g) => (
              <article
                key={g.id}
                className="rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-full bg-coral/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-coral">
                      {g.status}
                      {g.category ? ` · ${g.category}` : ""}
                    </span>
                    <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                      {g.title}
                    </h2>
                    {g.summary ? (
                      <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">
                        {g.summary}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-ink/75">
                      <span className="text-ocean">
                        Funding:{" "}
                        {g.amountMin != null || g.amountMax != null
                          ? `₦${(g.amountMin ?? 0).toLocaleString()} – ₦${(g.amountMax ?? g.amountMin ?? 0).toLocaleString()}`
                          : "Tailored to Proposal"}
                      </span>
                      {g.deadline ? (
                        <span>
                          Deadline:{" "}
                          {g.deadline.toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {g.applicationUrl && g.status === "OPEN" ? (
                    <a
                      href={g.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-ocean px-5 py-2.5 text-xs font-bold text-white transition hover:bg-ocean/90 active:scale-95"
                    >
                      Apply Now
                    </a>
                  ) : null}
                </div>

                {g.eligibility ? (
                  <div className="mt-5 rounded-2xl bg-mist p-4 text-xs leading-relaxed text-ink/80 sm:text-sm">
                    <strong className="text-ink">Eligibility Criteria: </strong>
                    {g.eligibility}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            defaultGrants.map((g) => (
              <article
                key={g.id}
                className="rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <span className="inline-block rounded-full bg-coral/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-coral">
                      {g.status} · {g.category}
                    </span>
                    <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                      {g.title}
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">
                      {g.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-ocean">
                      <span>
                        Grant Size: ₦{g.amountMin.toLocaleString()} – ₦{g.amountMax.toLocaleString()}
                      </span>
                      <span className="text-ink/60">Apply by: {g.deadlineText}</span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="rounded-full bg-ocean px-5 py-2.5 text-xs font-bold text-white transition hover:bg-ocean/90 active:scale-95"
                  >
                    Inquire to Apply
                  </Link>
                </div>

                <div className="mt-5 rounded-2xl bg-mist p-4 text-xs leading-relaxed text-ink/80 sm:text-sm">
                  <strong className="text-ink">Eligibility: </strong>
                  {g.eligibility}
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-ink/65 sm:text-sm">
            Interested in co-funding a targeted grant cycle?{" "}
            <Link href="/contact" className="font-bold text-ocean underline">
              Partner with our Grants Advisory Team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

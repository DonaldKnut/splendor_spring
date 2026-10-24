import Link from "next/link";
import { PLACEHOLDERS } from "@splendor/ui/media";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { BrilliantHero } from "@/components/brilliant-hero";
import { ImpactCalculator } from "@/components/impact-calculator";
import {
  CampaignSpotlight,
  ClosingAdvert,
  ImpactBillboard,
  PathwayAdvert,
  SignalBand,
} from "@/components/adverts";
import {
  EducationIllustration,
  WaterHealthIllustration,
  NutritionIllustration,
  ShelterEmpowermentIllustration,
  VerifiedLedgerIllustration,
} from "@/components/illustrations";

export default async function HomePage() {
  const settings = await getSettings();
  let programmes: Awaited<ReturnType<typeof db.programme.findMany>> = [];
  let campaignSpotlights: Array<{
    id: string;
    title: string;
    summary: string | null;
    description: string | null;
    goalAmount: number | null;
    currency: string;
    raised: number;
  }> = [];
  let confirmedTotal = { _count: 0, _sum: { amount: null as number | null } };
  let openGrants = 0;
  let upcomingEvents = 0;
  let openPolls = 0;

  try {
    const [prog, camps, totals, grants, events, polls] = await Promise.all([
      db.programme.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      db.campaign.findMany({
        where: { status: "PUBLISHED" },
        include: {
          donations: { where: { status: "SUCCESS" }, select: { amount: true } },
        },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: 4,
      }),
      db.donation.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
        _count: true,
      }),
      db.grant.count({ where: { status: "OPEN" } }),
      db.event.count({
        where: { status: "PUBLISHED", startsAt: { gte: new Date() } },
      }),
      db.poll.count({ where: { status: "OPEN" } }),
    ]);

    programmes = prog;
    campaignSpotlights = camps.map((c) => ({
      id: c.id,
      title: c.title,
      summary: c.summary,
      description: c.description,
      goalAmount: c.goalAmount,
      currency: c.currency,
      raised: c.donations.reduce((sum, d) => sum + d.amount, 0),
    }));
    confirmedTotal = totals;
    openGrants = grants;
    upcomingEvents = events;
    openPolls = polls;
  } catch {
    // Graceful offline fallback
  }

  const confirmedSum = confirmedTotal._sum.amount ?? 0;
  const confirmedCount = confirmedTotal._count ?? 0;

  const pillars = [
    {
      tag: "Pillar 01",
      title: "Education & Literacy",
      body: "Scholarships, learning materials, and literacy support for children in underserved schools.",
      href: "/programmes",
      tone: "text-teal",
      border: "hover:border-teal/50",
      bg: "bg-teal/5",
      illustration: <EducationIllustration className="h-32 w-full object-contain" />,
    },
    {
      tag: "Pillar 02",
      title: "Clean Water & Health",
      body: "Community water access, medical outreach, and hygiene awareness that prevent illness.",
      href: "/programmes",
      tone: "text-ocean",
      border: "hover:border-ocean/50",
      bg: "bg-ocean/5",
      illustration: <WaterHealthIllustration className="h-32 w-full object-contain" />,
    },
    {
      tag: "Pillar 03",
      title: "Food & Nutrition",
      body: "Emergency hampers and school feeding so children can learn with strength and dignity.",
      href: "/programmes",
      tone: "text-coral",
      border: "hover:border-coral/50",
      bg: "bg-coral/5",
      illustration: <NutritionIllustration className="h-32 w-full object-contain" />,
    },
    {
      tag: "Pillar 04",
      title: "Family Empowerment",
      body: "Vocational support and micro-grants that help households build lasting resilience.",
      href: "/grants",
      tone: "text-emerald-700",
      border: "hover:border-emerald-500/50",
      bg: "bg-emerald-50",
      illustration: <ShelterEmpowermentIllustration className="h-32 w-full object-contain" />,
    },
  ];

  return (
    <div className="relative overflow-x-clip bg-[#f5f7f8]">
      <BrilliantHero
        orgName={settings.org_name}
        tagline={settings.org_tagline}
        confirmedDonationTotal={confirmedSum}
        confirmedDonationCount={confirmedCount}
      />

      {/* Verified metrics — real numbers only */}
      <section className="relative z-20 -mt-6 mx-auto max-w-6xl px-3 sm:px-6">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-lg sm:grid-cols-4 sm:gap-6 sm:p-6">
          {[
            { value: "100%", label: "Verified payments only", tone: "text-ocean" },
            {
              value: confirmedCount.toLocaleString(),
              label: "Confirmed gifts",
              tone: "text-coral",
            },
            {
              value: `₦${confirmedSum.toLocaleString()}`,
              label: "Ledger total",
              tone: "text-teal",
            },
            { value: "Live", label: "Admin-controlled content", tone: "text-emerald-700" },
          ].map((m) => (
            <div key={m.label} className="text-center sm:text-left">
              <span className={`block font-display text-2xl font-bold sm:text-3xl ${m.tone}`}>
                {m.value}
              </span>
              <span className="mt-1 block text-[11px] font-medium text-ink/70 sm:text-xs">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SignalBand
        openGrants={openGrants}
        upcomingEvents={upcomingEvents}
        openPolls={openPolls}
      />

      {/* Illustrative impact pillars */}
      <section className="mx-auto max-w-6xl px-3.5 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal">
            Pillars of transformation
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            Where compassion takes root
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/75 sm:text-base">
            Four illustrated focus areas — each linked to programmes and grants you control from
            the admin room.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className={`group flex flex-col justify-between rounded-3xl border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-6 ${p.border}`}
            >
              <div>
                <div
                  className={`relative mb-4 overflow-hidden rounded-2xl p-4 transition duration-300 group-hover:scale-105 ${p.bg}`}
                >
                  {p.illustration}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${p.tone}`}>
                  {p.tag}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">{p.body}</p>
              </div>
              <div className="mt-5 border-t border-line/60 pt-4">
                <Link
                  href={p.href}
                  className={`inline-flex items-center text-xs font-bold transition hover:underline ${p.tone}`}
                >
                  Explore →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PathwayAdvert />

      <section className="mx-auto max-w-6xl px-3.5 pb-10 sm:px-6">
        <ImpactCalculator />
      </section>

      <div className="py-6 sm:py-10">
        <ImpactBillboard
          orgName={settings.org_name}
          donationCount={confirmedCount}
          donationTotal={confirmedSum}
        />
      </div>

      <CampaignSpotlight campaigns={campaignSpotlights} />

      {/* Mission editorial */}
      <section className="border-y border-line/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-ocean">
                Our commitment
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
                Founded on compassion, sustained by integrity
              </h2>
              <div
                className="mt-6 text-sm leading-relaxed text-ink/75 sm:text-base"
                dangerouslySetInnerHTML={{
                  __html:
                    settings.org_intro ||
                    "<p>We connect givers with community programmes through verified, transparent initiatives.</p>",
                }}
              />
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-ocean px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-ocean/90"
                >
                  Read full story
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-xs font-semibold text-ink transition hover:border-ocean/40"
                >
                  Connect with us
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-line bg-mist shadow-xl">
              <div
                className="aspect-[4/3] w-full bg-cover bg-center sm:aspect-[16/10]"
                style={{ backgroundImage: `url(${PLACEHOLDERS.ngoCommunity})` }}
              />
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/70">
                    Field update
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">
                  Community programmes, published when ready
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">
                  Content stays empty until administrators publish verified organisational
                  information — no invented claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="bg-sand/60 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal">
                Direct field work
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                Active programmes
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-ink/70 sm:text-sm">
                Live CMS listings — empty until you publish real initiatives.
              </p>
            </div>
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-bold text-ocean hover:underline"
            >
              View all programmes
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {programmes.length ? (
              programmes.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg"
                >
                  <div>
                    <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal">
                      Published
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-ink">{p.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">
                      {p.summary || p.content.replace(/<[^>]+>/g, "").slice(0, 140)}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-line/50 pt-4">
                    <Link
                      href={`/programmes/${p.slug}`}
                      className="inline-flex items-center text-xs font-bold text-ocean hover:underline"
                    >
                      Read full programme →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full text-sm text-ink/60">No programmes published yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Trust banner with ledger illustration */}
      <section className="mx-auto max-w-6xl px-3.5 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-[#1b2430] via-[#1f5c70] to-[#121820] p-6 text-white shadow-2xl sm:p-12">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-coral/20 blur-3xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#e8915f]">
                Verified nonprofit transparency
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to change a life today?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Donations are verified through Paystack and Flutterwave. Only SUCCESS records
                reach the public ledger.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-xl transition hover:scale-[1.03]"
                  style={{
                    background: "linear-gradient(135deg, #d97845 0%, #f97316 100%)",
                    boxShadow: "0 10px 30px rgba(217,120,69,0.45)",
                  }}
                >
                  Donate with confidence
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  See upcoming events
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:col-span-4">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/15 bg-white/5 p-4 backdrop-blur-md">
                <div className="absolute inset-2 animate-spin rounded-full border-t border-teal/40 [animation-duration:12s]" />
                <VerifiedLedgerIllustration className="h-32 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClosingAdvert orgName={settings.org_name} />
    </div>
  );
}

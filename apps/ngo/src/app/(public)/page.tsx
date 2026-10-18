import { HeroSlider, PLACEHOLDERS, Reveal } from "@splendor/ui";
import { NGO_HERO_GLOW, NGO_HERO_WASH } from "@splendor/ui/media";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const settings = await getSettings();
  let programmes: Awaited<ReturnType<typeof db.programme.findMany>> = [];
  let campaigns: Awaited<ReturnType<typeof db.campaign.findMany>> = [];
  let confirmedTotal = { _count: 0, _sum: { amount: null as number | null } };
  try {
    [programmes, campaigns, confirmedTotal] = await Promise.all([
      db.programme.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      db.campaign.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      db.donation.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
        _count: true,
      }),
    ]);
  } catch {
    // Build / offline DB — render empty listings with brand defaults.
  }

  const slides = [
    {
      id: "1",
      image: PLACEHOLDERS.ngoHero1,
      eyebrow: settings.org_name,
      title: settings.org_tagline || "Serving with integrity",
      subtitle:
        "Replace these images and copy from the admin dashboard when client content is ready.",
      ctaLabel: "Donate",
      ctaHref: "/donate",
    },
    {
      id: "2",
      image: PLACEHOLDERS.ngoHero2,
      eyebrow: "Programmes",
      title: "Community-centred initiatives",
      subtitle: "Publish programmes from the CMS — nothing invented here.",
      ctaLabel: "Explore programmes",
      ctaHref: "/programmes",
    },
    {
      id: "3",
      image: PLACEHOLDERS.ngoHero3,
      eyebrow: "Transparency",
      title: "Verified donations only",
      subtitle: "Totals reflect provider-verified successful payments via Paystack or Flutterwave.",
      ctaLabel: "Support the work",
      ctaHref: "/donate",
    },
  ];

  return (
    <>
      <HeroSlider
        slides={slides}
        wash={NGO_HERO_WASH}
        glow={NGO_HERO_GLOW}
        ctaTone="coral"
      />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ocean">Introduction</p>
          <h2 className="mt-3 font-display text-4xl text-ink">{settings.org_name}</h2>
          <div
            className="mt-5 max-w-3xl text-lg leading-relaxed text-ink/75"
            dangerouslySetInnerHTML={{ __html: settings.org_intro }}
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
            <div
              className="h-56 bg-cover bg-center"
              style={{ backgroundImage: `url(${PLACEHOLDERS.ngoCommunity})` }}
            />
            <div className="p-6">
              <h3 className="font-display text-2xl text-ocean">Mission</h3>
              <div
                className="mt-3 text-sm text-ink/75"
                dangerouslySetInnerHTML={{
                  __html:
                    settings.mission ||
                    "<p>Mission content will appear once published by administrators.</p>",
                }}
              />
            </div>
          </Reveal>
          <Reveal className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
            <div
              className="h-56 bg-cover bg-center"
              style={{ backgroundImage: `url(${PLACEHOLDERS.ngoVolunteer})` }}
            />
            <div className="p-6">
              <h3 className="font-display text-2xl text-ocean">Vision</h3>
              <div
                className="mt-3 text-sm text-ink/75"
                dangerouslySetInnerHTML={{
                  __html:
                    settings.vision ||
                    "<p>Vision content will appear once published by administrators.</p>",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand/80 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="font-display text-4xl">Programmes</h2>
            <p className="mt-3 max-w-2xl text-ink/70">
              Dynamic listings powered by the CMS. Empty until you publish real initiatives.
            </p>
          </Reveal>
          {programmes.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {programmes.map((p) => (
                <Reveal key={p.id}>
                  <a
                    href={`/programmes/${p.slug}`}
                    className="block h-full rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="font-display text-xl">{p.title}</h3>
                    <p className="mt-3 text-sm text-ink/70">
                      {p.summary || p.content.replace(/<[^>]+>/g, "").slice(0, 140)}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink/65">No programmes published yet.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-4xl">Make a difference</h2>
            <p className="mt-4 text-ink/70">
              Secure checkout with Paystack or Flutterwave. Confirmed totals only include
              server-verified successful transactions.
            </p>
            <p className="mt-6 text-sm text-ink/65">
              Confirmed donations: {confirmedTotal._count} · Total:{" "}
              {(confirmedTotal._sum.amount ?? 0).toLocaleString()} NGN
            </p>
            <a
              href="/donate"
              className="mt-8 inline-flex rounded-md bg-coral px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Donate securely
            </a>
          </Reveal>
          <div className="space-y-4">
            {campaigns.length ? (
              campaigns.map((c) => (
                <Reveal key={c.id} className="rounded-2xl border border-line bg-white p-5">
                  <h3 className="font-display text-lg">{c.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{c.description}</p>
                </Reveal>
              ))
            ) : (
              <Reveal className="rounded-2xl border border-dashed border-line bg-white/70 p-6 text-sm text-ink/65">
                Campaign cards will appear here after publication. Images above are placeholders
                you can substitute later.
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

import { HeroSlider, Reveal } from "@splendor/ui";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import Link from "next/link";
import { HomeProgrammeStages } from "@/components/home-programme-stages";
import { HomePromises } from "@/components/home-promises";
import { HomeGallery } from "@/components/home-gallery";
import { COMING_SOON_COPY, SCHOOL_GALLERY } from "@/lib/media-gallery";

export default async function HomePage() {
  const settings = await getSettings();
  let announcements: Awaited<ReturnType<typeof db.announcement.findMany>> = [];
  try {
    announcements = await db.announcement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 5,
    });
  } catch {
    announcements = [];
  }

  const motto = settings.school_tagline || settings.school_motto || "Nurturing to Greater Heights";
  const comingSoon = settings.coming_soon || COMING_SOON_COPY;

  const slides = [
    {
      id: "1",
      image: SCHOOL_GALLERY.hero[0].src,
      eyebrow: settings.school_name,
      title: motto,
      subtitle:
        "A low-cost, child-centred school in Makoko, Lagos — every child deserves the chance to learn, grow and thrive.",
      ctaLabel: "Discover our school",
      ctaHref: "/about",
      secondaryCtaLabel: "Contact us",
      secondaryCtaHref: "/contact",
    },
    {
      id: "2",
      image: SCHOOL_GALLERY.hero[1].src,
      eyebrow: "Our pupils",
      title: "Joyful learners, greater heights",
      subtitle:
        "Splendor Spring School welcomes every child into a season of learning, growth and discovery.",
      ctaLabel: "View programmes",
      ctaHref: "/about",
      secondaryCtaLabel: "Parent portal",
      secondaryCtaHref: "/login",
    },
    {
      id: "3",
      image: SCHOOL_GALLERY.hero[2].src,
      eyebrow: "Creative minds",
      title: "Learning beyond the classroom",
      subtitle:
        "Creative arts, exhibitions and practical projects help our pupils express themselves with confidence.",
      ctaLabel: "About our school",
      ctaHref: "/about",
      secondaryCtaLabel: "News",
      secondaryCtaHref: "/announcements",
    },
    {
      id: "4",
      image: SCHOOL_GALLERY.hero[3].src,
      eyebrow: "Community impact",
      title: "Education without barriers",
      subtitle:
        "For families who genuinely cannot afford fees, particularly vulnerable children, education is provided free of charge.",
      ctaLabel: "Get in touch",
      ctaHref: "/contact",
      secondaryCtaLabel: "Our story",
      secondaryCtaHref: "/about",
    },
  ];

  const stats = [
    { label: "Children served", value: "200+" },
    { label: "Learning stages", value: "4" },
    { label: "Focus", value: "Child-centred" },
    { label: "Community", value: "Makoko" },
  ];

  return (
    <>
      <HeroSlider slides={slides} />

      <section
        className="relative overflow-hidden border-y border-white/5 py-6 sm:py-8"
        style={{
          background: "linear-gradient(135deg, #140c08 0%, var(--c-navy-light) 100%)",
        }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-5 px-3 min-[240px]:px-4 sm:px-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label}>
              <div className="text-center md:text-left" style={{ animationDelay: `${i * 0.08}s` }}>
                <p
                  className="font-display text-xl font-bold min-[360px]:text-2xl sm:text-3xl"
                  style={{
                    background: "linear-gradient(135deg, #b91c2c, #d42a3a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/40 min-[360px]:text-[0.65rem] min-[360px]:tracking-[0.16em]">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <HomeProgrammeStages />
      <HomeGallery />
      <HomePromises />

      {/* Latest News & Highlights */}
      <section className="py-16 sm:py-24" style={{ background: "var(--c-surface-2)" }}>
        <div className="mx-auto max-w-6xl px-3 min-[240px]:px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Latest news &amp; highlights</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] min-[360px]:text-4xl md:text-5xl">
                  What&apos;s happening
                </h2>
                <div className="section-divider" />
              </div>
              <Link href="/announcements" className="btn btn-ghost text-sm hidden sm:inline-flex">
                All news →
              </Link>
            </div>
          </Reveal>

          {announcements.length ? (
            <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.slice(0, 5).map((a, i) => (
                <Reveal
                  key={a.id}
                  className={i === 0 ? "md:col-span-2 lg:col-span-1" : undefined}
                >
                  <a
                    href={`/announcements/${a.slug}`}
                    className="announcement-card flex h-full flex-col"
                  >
                    <div className="flex-1">
                      <span className="badge badge-navy mb-3 inline-block">
                        {a.publishedAt
                          ? new Date(a.publishedAt).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "News"}
                      </span>
                      <h3 className="font-display text-lg font-semibold leading-snug text-[var(--c-text)]">
                        {a.title}
                      </h3>
                      <p className="mt-3 truncate-3 text-sm leading-relaxed text-[var(--c-text-3)]">
                        {a.excerpt || a.content.replace(/<[^>]+>/g, "").slice(0, 140)}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[var(--c-sky)]">
                      Read more
                      <span aria-hidden>→</span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-[var(--c-border)] bg-[var(--c-surface)] p-10 text-center sm:p-16">
              <p className="font-display text-lg font-semibold text-[var(--c-text)]">
                No announcements yet
              </p>
            </div>
          )}

          <Reveal>
            <div
              className="mt-8 rounded-[1.5rem] border border-[var(--c-gold)]/25 px-5 py-6 sm:mt-10 sm:px-8"
              style={{ background: "linear-gradient(135deg, var(--c-gold-pale), #fff)" }}
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--c-gold)]">
                Coming soon
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-[0.95rem]">
                {comingSoon}
              </p>
            </div>
          </Reveal>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/announcements" className="btn btn-ghost text-sm">
              View all news →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 py-16 min-[240px]:px-4 sm:px-6 sm:py-24">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[1.5rem] px-5 py-12 text-center sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-16"
            style={{
              background:
                "linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 50%, var(--c-slate) 100%)",
            }}
          >
            <div className="relative z-10">
              <p className="hero-eyebrow">Student &amp; parent portal</p>
              <h2 className="mt-4 font-display text-2xl font-bold text-white min-[360px]:text-3xl md:text-4xl">
                Access results online
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
                Students and parents can securely sign in to view results, track progress, and stay
                connected with the school.
              </p>
              <div className="mt-8 flex flex-col items-stretch gap-3 min-[360px]:items-center sm:flex-row sm:justify-center">
                <Link href="/login" className="btn btn-gold btn-lg">
                  Sign in to portal
                </Link>
                <Link
                  href="/contact"
                  className="btn text-sm text-white/70 hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Contact school
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

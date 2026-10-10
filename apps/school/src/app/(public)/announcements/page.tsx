import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { COMING_SOON_COPY } from "@/lib/media-gallery";
import { AnnouncementsIllustration } from "@/components/illustrations";

export const metadata = {
  title: "News & Announcements | Splendor Spring School",
  description: "Official bulletins, academic calendar dates, events, and school community news.",
};

const UPCOMING_DATES = [
  {
    day: "Mon",
    date: "Term Resumption",
    title: "School Resumption & Assembly",
    desc: "Pupils resume classes promptly by 7:45 AM in complete seasonal uniform.",
    category: "Academic",
  },
  {
    day: "Fri",
    date: "Mid-Term",
    title: "Continuous Assessment & Open Day",
    desc: "Parents are warmly invited to inspect progress records and consult with class tutors.",
    category: "Assessment",
  },
  {
    day: "Wed",
    date: "Inter-House",
    title: "Annual Sports & Cultural Exhibition",
    desc: "A celebration of athletics, traditional dance, musical performance, and teamwork.",
    category: "Event",
  },
];

export default async function AnnouncementsPage() {
  const settings = await getSettings(["coming_soon", "school_name"]);
  let items: Awaited<ReturnType<typeof db.announcement.findMany>> = [];
  try {
    items = await db.announcement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
  } catch {
    items = [];
  }

  return (
    <>
      {/* ── 1. Hero with Illustration ──────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(185,28,44,0.2), transparent 45%),
            linear-gradient(105deg, rgba(11,17,32,0.92) 0%, rgba(11,17,32,0.72) 48%, rgba(15,28,54,0.95) 100%),
            linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)
          `,
        }}
      >
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="text-center lg:col-span-8 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#d42a3a]">
                Official School Dispatches
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                News &amp; Highlights
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
                Keep abreast of term calendars, academic accomplishments, community initiatives, and important parental notices from Splendor Spring School.
              </p>
            </div>
            <div className="flex justify-center lg:col-span-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <AnnouncementsIllustration className="h-36 w-36 sm:h-44 sm:w-44" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Content Grid ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left: Announcements Listing (8 cols) */}
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center justify-between border-b border-[var(--c-border)] pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[var(--c-text)]">
                  Latest Bulletins
                </h2>
                <p className="text-xs text-[var(--c-text-3)]">
                  {items.length ? `${items.length} published update${items.length === 1 ? "" : "s"}` : "No current bulletins"}
                </p>
              </div>
              <span className="rounded-full bg-[var(--c-ice)] px-3 py-1 text-xs font-semibold text-[var(--c-sky)]">
                Active Term
              </span>
            </div>

            {items.length ? (
              <div className="space-y-5">
                {items.map((item) => {
                  const dateStr = item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Recent";

                  return (
                    <Link
                      key={item.id}
                      href={`/announcements/${item.slug}`}
                      className="group relative block rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-sky)]/40 hover:shadow-md sm:p-7"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {item.featured ? (
                          <span className="rounded-full bg-[var(--c-gold-pale)] px-2.5 py-0.5 text-xs font-bold text-[#b45309]">
                            ★ Featured Notice
                          </span>
                        ) : null}
                        <span className="text-xs font-semibold text-[var(--c-text-3)]">
                          {dateStr}
                        </span>
                        <span className="text-xs text-[var(--c-text-3)]">·</span>
                        <span className="text-xs font-medium text-[var(--c-sky)]">
                          Administration
                        </span>
                      </div>

                      <div className="mt-3 flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl font-bold text-[var(--c-text)] transition-colors group-hover:text-[var(--c-sky)] sm:text-2xl">
                          {item.title}
                        </h3>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--c-surface-2)] text-[var(--c-sky)] transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-[var(--c-sky)] group-hover:text-white">
                          →
                        </span>
                      </div>

                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--c-text-3)]">
                        {item.excerpt || item.content.replace(/<[^>]+>/g, "").slice(0, 220)}...
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[var(--c-sky)]">
                        <span>Read complete announcement</span>
                        <span>→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[var(--c-border)] bg-[var(--c-surface)] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--c-ice)] text-2xl">
                  📢
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-[var(--c-text)]">
                  No public bulletins yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--c-text-3)]">
                  School circulars, holiday schedules, and academic news will be posted here by the administration.
                </p>
              </div>
            )}
          </div>

          {/* Right: School Calendar & Community Highlights (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Calendar Highlights Card */}
            <div className="rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗓️</span>
                <h3 className="font-display text-lg font-bold text-[var(--c-text)]">
                  Key Term Dates
                </h3>
              </div>
              <p className="mt-1 text-xs text-[var(--c-text-3)]">
                Upcoming school calendar highlights
              </p>

              <div className="mt-5 space-y-4">
                {UPCOMING_DATES.map((d) => (
                  <div
                    key={d.title}
                    className="flex gap-3 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-3.5"
                  >
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--c-surface)] text-center shadow-xs">
                      <span className="text-[10px] font-bold uppercase text-[var(--c-sky)]">
                        {d.day}
                      </span>
                      <span className="text-xs font-bold text-[var(--c-text)]">📌</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-gold)]">
                        {d.category}
                      </span>
                      <p className="font-display text-xs font-bold text-[var(--c-text)] leading-tight">
                        {d.title}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--c-text-3)] leading-relaxed">
                        {d.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon Notice Card */}
            <div
              className="rounded-3xl border border-[var(--c-gold)]/30 p-6 shadow-xs"
              style={{ background: "linear-gradient(145deg, var(--c-gold-pale), #ffffff)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">
                  Coming Soon to Splendor
                </p>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--c-text-2)]">
                {settings.coming_soon || COMING_SOON_COPY}
              </p>
            </div>

            {/* Quick Contact Card */}
            <div className="rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-xs text-center">
              <span className="text-2xl">📬</span>
              <h4 className="mt-2 font-display text-base font-bold text-[var(--c-text)]">
                Have an inquiry?
              </h4>
              <p className="mt-1 text-xs text-[var(--c-text-3)]">
                Reach out to school reception directly for admission or student records.
              </p>
              <Link href="/contact" className="btn btn-primary btn-sm mt-4 w-full rounded-xl">
                Contact school office →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

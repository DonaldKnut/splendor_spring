import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHero } from "@/components/page-hero";
import { SCHOOL_GALLERY } from "@/lib/media-gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await db.announcement.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true },
  });
  if (!item) return { title: "Announcement" };
  return {
    title: item.title,
    description: item.excerpt || undefined,
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await db.announcement.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!item) notFound();

  const others = await db.announcement.findMany({
    where: { status: "PUBLISHED", NOT: { id: item.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const dateLabel = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Announcement";

  const cover =
    SCHOOL_GALLERY.hero.find((_, i) => i === Math.abs(slug.length) % SCHOOL_GALLERY.hero.length)
      ?.src || SCHOOL_GALLERY.hero[0].src;

  return (
    <>
      <PageHero eyebrow="News & highlights" title={item.title} subtitle={dateLabel} />

      <article className="relative mx-auto max-w-6xl px-3 pb-20 min-[240px]:px-4 sm:px-6 sm:pb-24">
        <div className="-mt-8 grid gap-8 lg:-mt-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--c-border)] bg-[var(--c-surface)] shadow-[var(--shadow-lg)] sm:rounded-[1.75rem]">
            <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1]">
              <img
                src={cover}
                alt=""
                className="h-full w-full object-cover"
                decoding="async"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,17,32,0.55), transparent 55%)",
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  {dateLabel}
                </span>
              </div>
            </div>

            <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-10">
              {item.excerpt ? (
                <p className="border-l-[3px] border-[var(--c-gold)] pl-4 font-display text-lg leading-snug text-[var(--c-text)] sm:text-xl">
                  {item.excerpt}
                </p>
              ) : null}

              <div
                className="prose-school mt-8 space-y-4 text-[0.95rem] sm:text-base"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

              <div className="mt-10 flex flex-col gap-3 border-t border-[var(--c-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/announcements"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-sky)]"
                >
                  <span className="transition-transform group-hover:-translate-x-1">←</span>
                  All news &amp; highlights
                </Link>
                <Link href="/contact" className="btn btn-gold text-sm text-center">
                  Contact the school
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[1.5rem] border border-[var(--c-border)] bg-[var(--c-surface)] p-5 shadow-[var(--shadow-xs)] sm:p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--c-text-3)]">
                At a glance
              </p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--c-text-2)]">
                <li className="flex justify-between gap-3 border-b border-[var(--c-border)] pb-3">
                  <span className="text-[var(--c-text-3)]">Published</span>
                  <span className="font-medium text-right">{dateLabel}</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span className="text-[var(--c-text-3)]">Category</span>
                  <span className="font-medium">School news</span>
                </li>
              </ul>
            </div>

            {others.length ? (
              <div className="rounded-[1.5rem] border border-[var(--c-border)] bg-[var(--c-surface)] p-5 shadow-[var(--shadow-xs)] sm:p-6">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--c-text-3)]">
                  More highlights
                </p>
                <ul className="mt-4 space-y-1">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link
                        href={`/announcements/${o.slug}`}
                        className="group flex items-start justify-between gap-3 rounded-xl px-2 py-3 transition hover:bg-[var(--c-surface-2)]"
                      >
                        <span className="min-w-0">
                          <span className="block font-display text-sm font-semibold leading-snug text-[var(--c-text)]">
                            {o.title}
                          </span>
                          {o.excerpt ? (
                            <span className="mt-1 block truncate-2 text-xs text-[var(--c-text-3)]">
                              {o.excerpt}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 shrink-0 text-[var(--c-sky)] transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div
              className="rounded-[1.5rem] px-5 py-6 text-white sm:px-6"
              style={{
                background:
                  "linear-gradient(145deg, var(--c-midnight), var(--c-navy-light))",
              }}
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#d42a3a]/80">
                Visit us
              </p>
              <p className="mt-2 font-display text-lg font-semibold leading-snug">
                Join a school that nurtures every child
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                Affordable fees for struggling families — free education where parents cannot pay.
                Admissions and family visits are always welcome.
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d42a3a]"
              >
                About our school
                <span aria-hidden>→</span>
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

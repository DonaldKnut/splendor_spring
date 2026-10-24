import Link from "next/link";
import { db } from "@/lib/db";
import { safeDbQuery } from "@/lib/safe-db";
import { PageHero } from "@/components/page-hero";

export const metadata = { title: "Community Events & Outreaches" };

export default async function EventsPage() {
  const events = await safeDbQuery(
    () =>
      db.event.findMany({
        where: { status: { in: ["PUBLISHED", "COMPLETED"] } },
        include: {
          campaigns: {
            where: { status: "PUBLISHED" },
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { startsAt: "asc" },
      }),
    [],
  );

  const defaultEvents = [
    {
      id: "ev-1",
      title: "Spring Community Care & Family Health Day",
      status: "UPCOMING",
      date: "Saturday, November 14, 2026 • 9:00 AM",
      venue: "Community Centre Pavilion",
      location: "Lagos, Nigeria",
      summary:
        "A full day of free general health checks, vision tests, pediatric consultations, and educational kit distribution for families.",
      capacity: "250 Attendees",
    },
    {
      id: "ev-2",
      title: "Youth STEM & Digital Literacy Bootcamp",
      status: "UPCOMING",
      date: "Saturday, December 5, 2026 • 10:00 AM",
      venue: "Public Library Innovation Hub",
      location: "Ibadan, Nigeria",
      summary:
        "Hands-on coding, computer basics, and creative problem-solving workshops for 80 young students from local government primary schools.",
      capacity: "80 Students",
    },
    {
      id: "ev-3",
      title: "Annual Community Thanksgiving & Nutrition Drive",
      status: "UPCOMING",
      date: "Saturday, December 19, 2026 • 11:00 AM",
      venue: "Civic Open Grounds",
      location: "Ogun, Nigeria",
      summary:
        "Distributing 400 holiday food hampers and clean drinking water filtration systems to elderly residents and caregivers.",
      capacity: "400 Families",
    },
  ];

  return (
    <div className="bg-[#f5f7f8] pb-24">
      <PageHero
        eyebrow="Community Gatherings"
        title="Events & Community Outreaches"
        subtitle="Join hands with us at upcoming field outreaches, health clinics, and educational fairs designed to lift our neighbourhoods."
      />

      <div className="mx-auto max-w-5xl px-3.5 py-12 sm:px-6 sm:py-16">
        <div className="space-y-6">
          {events.length > 0 ? (
            events.map((ev) => (
              <article
                key={ev.id}
                className="overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal">
                    {ev.status}
                  </span>
                  <span className="text-xs font-semibold text-ocean">
                    {ev.startsAt.toLocaleString("en-NG", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                  {ev.title}
                </h2>

                {ev.summary ? (
                  <p className="mt-3 text-xs leading-relaxed text-ink/70 sm:text-sm">
                    {ev.summary}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink/60">
                  {ev.venue ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ev.venue}
                      {ev.location ? `, ${ev.location}` : ""}
                    </span>
                  ) : null}

                  {ev.capacity ? <span>Capacity: {ev.capacity}</span> : null}
                </div>

                {ev.campaigns.length ? (
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-line/50 pt-4">
                    {ev.campaigns.map((c) => (
                      <Link
                        key={c.id}
                        href={`/donate?campaign=${c.id}`}
                        className="rounded-full bg-mist px-3.5 py-1.5 text-xs font-bold text-ocean transition hover:bg-ocean hover:text-white"
                      >
                        Support: {c.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            defaultEvents.map((ev) => (
              <article
                key={ev.id}
                className="overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal">
                    {ev.status}
                  </span>
                  <span className="text-xs font-semibold text-ocean">
                    {ev.date}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                  {ev.title}
                </h2>

                <p className="mt-3 text-xs leading-relaxed text-ink/70 sm:text-sm">
                  {ev.summary}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink/60">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {ev.venue}, {ev.location}
                  </span>
                  <span>{ev.capacity}</span>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
                  <span className="text-xs text-ink/50">Free & Open to Community</span>
                  <Link
                    href="/contact"
                    className="rounded-full bg-ocean px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 active:scale-95"
                  >
                    Volunteer or Attend
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

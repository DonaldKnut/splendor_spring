import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/rbac";
import { Card, PageHeader } from "@/components/ui";

export default async function AdminDashboard() {
  const session = await requireSession();
  const [
    successCount,
    pendingCount,
    total,
    campaignCount,
    openGrants,
    upcomingEvents,
    openPolls,
    contacts,
    recent,
  ] = await Promise.all([
    db.donation.count({ where: { status: "SUCCESS" } }),
    db.donation.count({ where: { status: "PENDING" } }),
    db.donation.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
    db.campaign.count({ where: { status: "PUBLISHED" } }),
    db.grant.count({ where: { status: "OPEN" } }),
    db.event.count({
      where: { status: "PUBLISHED", startsAt: { gte: new Date() } },
    }),
    db.poll.count({ where: { status: "OPEN" } }),
    db.contactSubmission.count({ where: { status: "NEW" } }),
    db.donation.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const tiles = [
    {
      label: "Confirmed total",
      value: `₦${(total._sum.amount ?? 0).toLocaleString()}`,
      href: "/admin/donations",
    },
    { label: "Successful gifts", value: successCount, href: "/admin/donations" },
    { label: "Live campaigns", value: campaignCount, href: "/admin/fundraising" },
    { label: "Open grants", value: openGrants, href: "/admin/grants" },
    { label: "Upcoming events", value: upcomingEvents, href: "/admin/events" },
    { label: "Open polls", value: openPolls, href: "/admin/polls" },
  ];

  const shortcuts = [
    { href: "/admin/fundraising", title: "Launch fundraising", body: "Goals, timelines, event links" },
    { href: "/admin/grants", title: "Publish a grant", body: "Eligibility, amounts, deadlines" },
    { href: "/admin/events", title: "Schedule an event", body: "Venue, capacity, programmes" },
    { href: "/admin/polls", title: "Open a poll", body: "Community feedback in minutes" },
  ];

  return (
    <div>
      <div
        className="mb-8 overflow-hidden rounded-3xl px-6 py-8 text-white sm:px-8"
        style={{
          background:
            "linear-gradient(135deg, #1b2430 0%, #1f5c70 55%, #2f8f8a 100%)",
        }}
      >
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/45">
          {greeting}
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">{session.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-white/70">
          Full control over fundraising, grants, events, polls, and verified donations.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-3 py-1">
            {pendingCount} pending payment{pendingCount === 1 ? "" : "s"}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            {contacts} new inbox message{contacts === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <PageHeader
        title="Command centre"
        description="Live totals and shortcuts — only verified payments count toward confirmed totals."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm text-ink/60">{tile.label}</p>
              <p className="mt-2 font-display text-3xl text-ocean">{tile.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl">Create next</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-2xl border border-line bg-mist/70 px-4 py-3 transition hover:border-teal/40 hover:bg-white"
              >
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-xs text-ink/60">{s.body}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Recent gifts</h2>
            <Link href="/admin/donations" className="text-sm font-semibold text-ocean">
              View all
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {recent.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 border-b border-line pb-2"
              >
                <span className="truncate text-ink/80">
                  {d.anonymous ? "Anonymous" : d.donorName || d.donorEmail}
                </span>
                <span className="shrink-0 font-semibold text-ink">
                  {d.amount.toLocaleString()} {d.currency} · {d.status}
                </span>
              </li>
            ))}
            {!recent.length ? <li className="text-ink/55">No donations yet.</li> : null}
          </ul>
        </Card>
      </div>
    </div>
  );
}

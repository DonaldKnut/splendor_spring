"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { PLACEHOLDERS } from "@splendor/ui/media";
import {
  IllusCommunity,
  IllusGather,
  IllusGiving,
  IllusGrant,
  IllusShield,
  IllusVoice,
} from "@/components/advert-marks";

function useTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

/** Editorial pathway tiles — programmes, grants, events, polls */
export function PathwayAdvert({
  programmesHref = "/programmes",
  grantsHref = "/grants",
  eventsHref = "/events",
  pollsHref = "/polls",
}: {
  programmesHref?: string;
  grantsHref?: string;
  eventsHref?: string;
  pollsHref?: string;
}) {
  const items: Array<{
    href: string;
    label: string;
    title: string;
    body: string;
    accent: string;
    icon: ReactNode;
  }> = [
    {
      href: programmesHref,
      label: "Programmes",
      title: "See the work on the ground",
      body: "Published initiatives, shaped by the community and stewarded with care.",
      accent: "var(--ngo-ocean)",
      icon: <IllusCommunity className="h-16 w-16" />,
    },
    {
      href: grantsHref,
      label: "Grants",
      title: "Open funding windows",
      body: "Clear eligibility, deadlines, and amounts — managed from the control room.",
      accent: "var(--ngo-coral)",
      icon: <IllusGrant className="h-16 w-16" />,
    },
    {
      href: eventsHref,
      label: "Events",
      title: "Gather with purpose",
      body: "Outreaches and fundraisers you can link to campaigns and polls.",
      accent: "var(--ngo-teal)",
      icon: <IllusGather className="h-16 w-16" />,
    },
    {
      href: pollsHref,
      label: "Polls",
      title: "Shape what comes next",
      body: "One voice per device. Results update as the community responds.",
      accent: "#1f5c70",
      icon: <IllusVoice className="h-16 w-16" />,
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(47,143,138,0.08), transparent 55%), radial-gradient(ellipse 45% 35% at 100% 100%, rgba(217,120,69,0.08), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl" data-animate="reveal">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ocean">
            Ways to engage
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            A living platform for impact
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65 sm:text-base">
            Every pathway is admin-controlled — publish when ready, archive when done.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              data-animate="reveal"
              className="group advert-pathway relative flex flex-col overflow-hidden rounded-[1.6rem] border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_50px_rgba(27,36,48,0.12)]"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div
                className="mb-5 inline-flex rounded-2xl p-2 transition group-hover:scale-105"
                style={{ color: item.accent }}
              >
                {item.icon}
              </div>
              <p
                className="text-[0.65rem] font-bold uppercase tracking-[0.16em]"
                style={{ color: item.accent }}
              >
                {item.label}
              </p>
              <h3 className="mt-2 font-display text-xl leading-snug text-ink">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{item.body}</p>
              <span
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition group-hover:gap-2"
                style={{ color: item.accent }}
              >
                Explore
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Full-bleed billboard advert for giving */
export function ImpactBillboard({
  orgName,
  donationCount,
  donationTotal,
}: {
  orgName: string;
  donationCount: number;
  donationTotal: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useTilt(ref);

  return (
    <section
      ref={ref}
      data-animate="reveal"
      className="advert-billboard relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-5 sm:px-6"
      style={{
        transform: "perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        transition: "transform 0.35s ease",
      }}
    >
      <div className="relative overflow-hidden rounded-[2rem] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${PLACEHOLDERS.ngoCommunity})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              ${"radial-gradient(ellipse 60% 50% at 90% 10%, rgba(217,120,69,0.35), transparent 50%)"},
              linear-gradient(115deg, rgba(18,24,32,0.94) 0%, rgba(31,92,112,0.78) 48%, rgba(18,24,32,0.55) 100%)
            `,
          }}
        />
        <div className="relative grid gap-8 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#e8915f] backdrop-blur">
              <IllusGiving className="h-5 w-5 text-[#e8915f]" />
              Verified giving
            </div>
            <h2 className="mt-5 max-w-xl font-display text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Your gift becomes measurable change
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              {orgName} only counts Paystack and Flutterwave payments after server-side
              verification — no inflated totals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/donate"
                className="inline-flex items-center rounded-full px-5 py-3 text-sm font-bold text-white transition hover:brightness-105"
                style={{
                  background: "linear-gradient(135deg, #d97845, #e8915f)",
                  boxShadow: "0 12px 32px rgba(217,120,69,0.4)",
                }}
              >
                Donate now
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                Upcoming events
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-5 backdrop-blur-md">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">
                Confirmed gifts
              </p>
              <p className="mt-2 font-display text-3xl tabular-nums sm:text-4xl">
                {donationCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-5 backdrop-blur-md">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">
                Verified total
              </p>
              <p className="mt-2 font-display text-2xl tabular-nums sm:text-3xl">
                ₦{donationTotal.toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 flex items-start gap-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-md">
              <span className="text-[#e8915f]">
                <IllusShield className="h-12 w-12" />
              </span>
              <div>
                <p className="font-display text-lg">Trust by design</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">
                  Unique references, webhook signatures, and idempotent event keys — drafts never
                  inflate the public ledger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type CampaignAdvert = {
  id: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  goalAmount?: number | null;
  raised: number;
  currency: string;
};

/** Spotlight a live fundraising campaign */
export function CampaignSpotlight({ campaigns }: { campaigns: CampaignAdvert[] }) {
  if (!campaigns.length) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6" data-animate="reveal">
        <div className="overflow-hidden rounded-[2rem] border border-dashed border-line bg-white/70 px-6 py-12 text-center sm:px-10">
          <IllusGiving className="mx-auto h-16 w-16 text-coral" />
          <h2 className="mt-4 font-display text-2xl text-ink">Campaign spotlight</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
            Publish a fundraising campaign in the admin control room to feature it here with live
            verified progress.
          </p>
          <Link
            href="/donate"
            className="mt-6 inline-flex rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white"
          >
            Give generally
          </Link>
        </div>
      </section>
    );
  }

  const primary = campaigns[0];
  const pct =
    primary.goalAmount && primary.goalAmount > 0
      ? Math.min(100, Math.round((primary.raised / primary.goalAmount) * 100))
      : null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
      <div
        data-animate="reveal"
        className="grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_20px_50px_rgba(27,36,48,0.06)] lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div
          className="relative min-h-[260px] bg-cover bg-center lg:min-h-full"
          style={{ backgroundImage: `url(${PLACEHOLDERS.ngoVolunteer})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(27,36,48,0.85), rgba(27,36,48,0.2))",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#e8915f]">
              Featured campaign
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight">{primary.title}</h2>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-sm leading-relaxed text-ink/70">
            {primary.summary ||
              primary.description ||
              "Support this verified appeal. Progress updates as payments clear."}
          </p>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                  Raised
                </p>
                <p className="mt-1 font-display text-3xl text-ocean tabular-nums">
                  ₦{primary.raised.toLocaleString()}
                </p>
              </div>
              {primary.goalAmount != null ? (
                <p className="text-sm text-ink/55">
                  of ₦{primary.goalAmount.toLocaleString()} {pct != null ? `· ${pct}%` : ""}
                </p>
              ) : null}
            </div>
            {pct != null ? (
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-mist">
                <div
                  className="advert-progress h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #1f5c70, #2f8f8a, #d97845)",
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/donate?campaign=${primary.id}`}
              className="inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #d97845, #e8915f)",
              }}
            >
              Support this campaign
            </Link>
            <Link
              href="/donate"
              className="inline-flex rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ocean transition hover:bg-mist"
            >
              All giving options
            </Link>
          </div>

          {campaigns.length > 1 ? (
            <ul className="mt-8 space-y-2 border-t border-line pt-6">
              {campaigns.slice(1, 4).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/donate?campaign=${c.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm transition hover:bg-mist"
                  >
                    <span className="font-medium text-ink">{c.title}</span>
                    <span className="shrink-0 tabular-nums text-ink/50">
                      ₦{c.raised.toLocaleString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Soft signal band under intro */
export function SignalBand({
  openGrants,
  upcomingEvents,
  openPolls,
}: {
  openGrants: number;
  upcomingEvents: number;
  openPolls: number;
}) {
  const signals = [
    { label: "Open grants", value: openGrants, href: "/grants" },
    { label: "Upcoming events", value: upcomingEvents, href: "/events" },
    { label: "Live polls", value: openPolls, href: "/polls" },
  ];

  return (
    <section className="border-y border-line bg-white/70" data-animate="reveal">
      <div className="mx-auto grid max-w-6xl divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {signals.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-center justify-between gap-4 px-5 py-5 transition hover:bg-mist/80 sm:px-8 sm:py-6"
          >
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink/40">
                {s.label}
              </p>
              <p className="mt-1 font-display text-2xl text-ink tabular-nums">{s.value}</p>
            </div>
            <span className="text-ocean opacity-0 transition group-hover:opacity-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Closing editorial CTA */
export function ClosingAdvert({ orgName }: { orgName: string }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24" data-animate="reveal">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #121820 0%, #1b2430 40%, #1f5c70 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(217,120,69,0.45), transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 text-white sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#e8915f]">
            Partner with {orgName}
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Ready when you are — donate, apply, gather, or vote
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            One seamless public site. Full admin control behind the curtain.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/donate"
            className="rounded-full px-5 py-3 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #d97845, #e8915f)" }}
          >
            Donate
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Contact the team
          </Link>
        </div>
      </div>
    </section>
  );
}

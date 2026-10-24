import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { PageHero } from "@/components/page-hero";
import { safeDbQuery } from "@/lib/safe-db";
import { PLACEHOLDERS } from "@splendor/ui/media";
import {
  EducationIllustration,
  WaterHealthIllustration,
  ShelterEmpowermentIllustration,
} from "@/components/illustrations";

export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const settings = await getSettings(["org_name", "mission", "vision", "values", "org_intro"]);
  const page = await safeDbQuery(
    () =>
      db.contentPage.findFirst({
        where: { slug: "about", status: "PUBLISHED" },
      }),
    null,
  );

  const valuesList = [
    {
      title: "Radical Transparency",
      desc: "Every Naira received is accounted for with provider-verified reconciliation and published outcomes.",
      icon: "✦",
    },
    {
      title: "Community Dignity",
      desc: "We co-create programmes directly alongside local families, respecting cultural heritage and autonomy.",
      icon: "🤝",
    },
    {
      title: "Sustainable Impact",
      desc: "We build enduring systems — from boreholes to classroom libraries — that thrive long after launch.",
      icon: "🌱",
    },
    {
      title: "Accountable Stewardship",
      desc: "Zero bureaucracy or administrative waste. Dedicated to placing resources where children need them most.",
      icon: "🛡️",
    },
  ];

  return (
    <div className="bg-[#f5f7f8] pb-24">
      <PageHero
        eyebrow="Our Story & Core Values"
        title={`About ${settings.org_name}`}
        subtitle="Driven by compassion, anchored in integrity. Discover how we partner with grassroots leaders to build stronger, healthier communities."
      />

      <div className="mx-auto max-w-6xl px-3.5 py-12 sm:px-6 sm:py-16">
        
        {/* Story & Intro Section */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
              Who We Are
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">
              Equipping communities to rise and thrive
            </h2>
            <div
              className="mt-5 space-y-4 text-xs leading-relaxed text-ink/80 sm:text-base sm:leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  page?.content ||
                  settings.org_intro ||
                  "<p>We believe every child deserves a safe classroom, clean water, and the opportunity to realize their fullest potential. Founded as a grassroots response to urgent educational and nutritional needs, we bridge generous givers worldwide with accountable, on-the-ground interventions.</p>",
              }}
            />

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-xs font-bold text-white shadow-md transition hover:brightness-110 active:scale-95"
              >
                <span>Support the Mission</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/programmes"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-xs font-semibold text-ink transition hover:border-teal active:scale-95"
              >
                <span>View Field Work</span>
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl">
              <div
                className="aspect-[4/3] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${PLACEHOLDERS.ngoCommunity})` }}
              />
              <div className="p-5 sm:p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ocean">
                  Community Focused
                </span>
                <p className="mt-1 font-display text-lg font-bold text-ink sm:text-xl">
                  Local leadership at the heart of every project
                </p>
                <p className="mt-2 text-xs text-ink/70 sm:text-sm">
                  We don't impose solutions from afar. Our initiatives are driven by local educators, nurses, and elders who understand community priorities best.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, and Values Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/15 text-teal">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-ocean">Our Mission</h3>
            <div
              className="mt-3 text-xs leading-relaxed text-ink/75 sm:text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  settings.mission ||
                  "<p>To equip vulnerable families and children with high-quality education, healthcare access, and economic opportunity through verified community action.</p>",
              }}
            />
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/15 text-coral">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-coral">Our Vision</h3>
            <div
              className="mt-3 text-xs leading-relaxed text-ink/75 sm:text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  settings.vision ||
                  "<p>A society where every child wakes up with a nutritious meal, attends an empowering school, and looks forward to a future filled with dignity and hope.</p>",
              }}
            />
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-emerald-700">Our Values</h3>
            <div
              className="mt-3 text-xs leading-relaxed text-ink/75 sm:text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  settings.values ||
                  "<p>Uncompromising Integrity · Boundless Empathy · Relentless Transparency · Local Partnership</p>",
              }}
            />
          </div>
        </div>

        {/* Guiding Principles Grid */}
        <div className="mt-16 rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-10">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-teal">
              Standards of Excellence
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              The principles behind every initiative
            </h3>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valuesList.map((val) => (
              <div key={val.title} className="rounded-2xl border border-line/70 bg-mist/50 p-5">
                <span className="text-2xl">{val.icon}</span>
                <h4 className="mt-3 font-display text-lg font-bold text-ink">{val.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

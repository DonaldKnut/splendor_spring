import Link from "next/link";
import { db } from "@/lib/db";
import { PageHero } from "@/components/page-hero";
import { safeDbQuery } from "@/lib/safe-db";

export const metadata = { title: "Programmes & Initiatives" };

export default async function ProgrammesPage() {
  const items = await safeDbQuery(
    () =>
      db.programme.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
    [],
  );

  const defaultShowcase = [
    {
      id: "edu-init",
      slug: "classroom-bridge-initiative",
      title: "Classroom Bridge & Scholar Kits",
      tag: "Education",
      summary:
        "Providing textbooks, solar reading lanterns, math workbooks, and uniform kits to children in rural elementary schools, ensuring every child can read and learn safely.",
      impact: "1,200+ Students Supported",
    },
    {
      id: "water-init",
      slug: "community-clean-water-hubs",
      title: "Community Clean Water Hubs",
      tag: "Clean Water",
      summary:
        "Drilling modern community solar boreholes and providing household purification systems to permanently eliminate waterborne illnesses in vulnerable settlements.",
      impact: "6 Neighbourhood Wells Installed",
    },
    {
      id: "nutrition-init",
      slug: "school-nutrition-care-basket",
      title: "School Nutrition & Care Basket",
      tag: "Nutrition",
      summary:
        "Delivering fortified hot school meals and monthly emergency nutritional supplies to elderly caregivers and single mothers facing food insecurity.",
      impact: "25,000+ Meals Served",
    },
    {
      id: "health-init",
      slug: "maternal-infant-health-outreach",
      title: "Maternal & Infant Health Outreach",
      tag: "Healthcare",
      summary:
        "Partnering with local clinics to provide free prenatal checkups, emergency vitamins, mosquito nets, and child immunisations.",
      impact: "850+ Mothers Assisted",
    },
  ];

  return (
    <div className="bg-[#f5f7f8] pb-24">
      <PageHero
        eyebrow="Community Action"
        title="Our Programmes & Initiatives"
        subtitle="Explore active projects focused on quality education, clean water, healthcare access, and family dignity across our partner communities."
      />

      <div className="mx-auto max-w-6xl px-3.5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {items.length > 0 ? (
            items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal hover:shadow-xl sm:p-8"
              >
                <div>
                  <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal">
                    Active Initiative
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-ink/70 sm:text-sm">
                    {item.summary || item.content.replace(/<[^>]+>/g, "").slice(0, 180)}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                  <Link
                    href={`/programmes/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean hover:underline"
                  >
                    <span>Read Details</span>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/donate"
                    className="rounded-full bg-coral/10 px-3.5 py-1.5 text-xs font-bold text-coral transition hover:bg-coral hover:text-white"
                  >
                    Support This
                  </Link>
                </div>
              </article>
            ))
          ) : (
            defaultShowcase.map((p) => (
              <article
                key={p.id}
                className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal hover:shadow-xl sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal">
                      {p.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      {p.impact}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-ink/70 sm:text-sm">
                    {p.summary}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                  <span className="text-xs text-ink/50">Verified Community Project</span>
                  <Link
                    href="/donate"
                    className="rounded-full bg-coral px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 active:scale-95"
                  >
                    Donate to This
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Impact Guarantee Banner */}
        <div className="mt-16 rounded-[2rem] border border-line bg-gradient-to-r from-ocean to-teal p-6 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e8915f]">
                Want to partner on a programme?
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Collaborate with us on grassroots transformation
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                We work with philanthropic foundations, corporate CSR initiatives, and individual visionaries to scale verified community solutions.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3.5 text-xs font-bold text-ocean shadow-md transition hover:bg-slate-100 active:scale-95"
            >
              Partner with Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

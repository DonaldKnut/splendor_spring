import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";
import { SCHOOL_BRAND, SCHOOL_GALLERY } from "@/lib/media-gallery";
import { SOCIAL_IMPACT } from "@/lib/social-impact";
import Link from "next/link";
import { AboutHeroSlider } from "@/components/about-hero-slider";

export const metadata = {
  title: "About Our School | Splendor Spring School",
  description:
    "Learn about Splendor Spring School in Makoko, Lagos — our mission, classes, approach to learning, core values, and founder.",
};

const CLASSES = [
  {
    stage: "Kindergarten",
    age: "Ages 2 – 3",
    title: "Play and early learning",
    body: "Children learn through play, songs, stories and sharing with friends. We help them settle in, speak clearly and feel safe at school.",
    accent: "var(--c-gold)",
  },
  {
    stage: "Nursery 1 & 2",
    age: "Ages 3 – 5",
    title: "Reading, writing and numbers",
    body: "Phonics, early reading, counting and good classroom habits. Children grow ready for primary school with care and encouragement.",
    accent: "var(--c-emerald)",
  },
  {
    stage: "Primary 1 – 6",
    age: "Ages 5 – 11",
    title: "Strong academics and character",
    body: "English, Mathematics, Basic Science, Social Studies, Civic Education, Creative Arts and moral instruction — preparing pupils for secondary school.",
    accent: "var(--c-sky)",
  },
];

const CORE_VALUES = [
  {
    name: "Excellence",
    text: "We encourage every child to do their best and keep improving.",
  },
  {
    name: "Integrity",
    text: "We teach honesty, responsibility and good character every day.",
  },
  {
    name: "Compassion",
    text: "We care for one another and recognise the dignity of every child.",
  },
  {
    name: "Godly values & moral integrity",
    text: "We build strong moral foundations and faith that guide the choices children make.",
  },
  {
    name: "Inclusiveness",
    text: "Every child deserves a chance to learn and thrive, whatever their background.",
  },
  {
    name: "Service",
    text: "We teach children to help their families, community and society.",
  },
];

const APPROACH = [
  {
    title: "Phonics and reading",
    desc: "Children learn letter sounds, blending and reading step by step from nursery into primary.",
  },
  {
    title: "Mathematics that makes sense",
    desc: "Counting, problem-solving and everyday number work using clear, practical methods.",
  },
  {
    title: "Science and discovery",
    desc: "Simple experiments, nature study, hygiene and care for our environment.",
  },
  {
    title: "Arts and culture",
    desc: "Drawing, crafts, music, cultural activities and speaking in front of others with confidence.",
  },
  {
    title: "Character and values",
    desc: "Lessons and daily practice that shape honesty, kindness, discipline and respect for others.",
  },
  {
    title: "Progress parents can see",
    desc: "Continuous assessment and the parent portal so families can follow each term’s growth.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings([
    "school_name",
    "school_intro",
    "school_motto",
    "school_proprietor",
    "school_address",
    "mission",
    "vision",
    "values",
    "educational_approach",
  ]);
  let page: Awaited<ReturnType<typeof db.contentPage.findFirst>> = null;
  try {
    page = await db.contentPage.findFirst({
      where: { slug: "about", status: "PUBLISHED" },
    });
  } catch {
    page = null;
  }

  const motto = settings.school_motto || "Nurturing to Greater Heights";
  const founder = "Mrs. Opeyemi Elebiju Josephine";
  const founderTitle = "Founder & Director, Splendor Spring School Ltd.";

  return (
    <>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(185,28,44,0.2), transparent 45%),
            linear-gradient(105deg, rgba(11,17,32,0.92) 0%, rgba(11,17,32,0.72) 48%, rgba(15,28,54,0.95) 100%),
            linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)
          `,
        }}
      >
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="text-center lg:col-span-7 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#d42a3a]">
                {motto}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                About Our School
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                A warm school in Makoko, Lagos, where children learn, grow and are cared for.{" "}
                {SOCIAL_IMPACT.short}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href="/contact" className="btn btn-gold btn-md">
                  Enquire for admission →
                </Link>
                <Link
                  href="#our-classes"
                  className="btn rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  See our classes
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:p-4">
                <AboutHeroSlider slides={[...SCHOOL_GALLERY.aboutHero]} />
                <div className="mt-3 px-1 text-center">
                  <p className="font-display text-sm font-semibold text-white">
                    {motto}
                  </p>
                  <p className="text-xs text-white/50">Kindergarten · Nursery · Primary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Our School */}
      <section id="about-our-school" className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 shadow-[var(--shadow-sm)] md:p-12">
          <p className="section-label">About Our School</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-[var(--c-text)] sm:text-3xl">
            Who we are
          </h2>
          <div
            className="prose-school mt-6 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base"
            dangerouslySetInnerHTML={{
              __html: page?.content || settings.school_intro,
            }}
          />
          <div className="mt-8 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-5 sm:p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--c-crimson,#b91c2c)]">
              {SOCIAL_IMPACT.eyebrow}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-[var(--c-text)] sm:text-2xl">
              {SOCIAL_IMPACT.title}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base">
              {SOCIAL_IMPACT.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section
        id="mission-vision"
        className="py-16 sm:py-20"
        style={{ background: "var(--c-surface-2)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="section-label">What guides us</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
              Our Mission and Vision
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 shadow-[var(--shadow-xs)]">
              <h3 className="font-display text-2xl font-bold text-[var(--c-sky)]">Our Mission</h3>
              <div
                className="mt-4 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base"
                dangerouslySetInnerHTML={{
                  __html:
                    settings.mission ||
                    "To provide accessible, affordable and quality education — including free education for children whose parents genuinely cannot afford fees — in a safe, caring environment where every child can grow academically, socially and morally.",
                }}
              />
            </div>
            <div className="rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 shadow-[var(--shadow-xs)]">
              <h3 className="font-display text-2xl font-bold text-[var(--c-gold)]">Our Vision</h3>
              <div
                className="mt-4 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base"
                dangerouslySetInnerHTML={{
                  __html:
                    settings.vision ||
                    "To raise confident, knowledgeable, compassionate and responsible children who can reach their full potential and serve their families and communities.",
                }}
              />
            </div>
          </div>

          <p className="mt-8 text-center font-display text-lg font-semibold text-[var(--c-text)] sm:text-xl">
            Motto: <em>“{motto}”</em>
          </p>
        </div>
      </section>

      {/* Our Classes */}
      <section id="our-classes" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="section-label">What we offer</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
            Our Classes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--c-text-3)]">
            From Kindergarten through Primary — clear stages for every child&apos;s age and growth.
          </p>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {CLASSES.map((s, idx) => (
            <div
              key={s.stage}
              className="flex flex-col rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-sm"
            >
              <span
                className="inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ background: "var(--c-surface-3)", color: "var(--c-text-2)" }}
              >
                {s.age}
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider" style={{ color: s.accent }}>
                Class {idx + 1}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-[var(--c-text)]">{s.stage}</h3>
              <p className="mt-1 text-sm font-semibold text-[var(--c-text-3)]">{s.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--c-text-3)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Approach to Learning */}
      <section
        id="our-approach"
        className="py-16 sm:py-20"
        style={{ background: "var(--c-surface-2)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 max-w-2xl">
            <p className="section-label">How we teach</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
              Our Approach to Learning
            </h2>
            <p className="mt-3 text-sm text-[var(--c-text-3)] sm:text-base">
              {settings.educational_approach ||
                "We combine strong reading, writing and mathematics with practical learning, creative activities and character development — so children understand what they learn and how to use it."}
            </p>
            <div className="section-divider" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {APPROACH.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-xs"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--c-ice)] text-xs font-bold text-[var(--c-sky)]">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-[var(--c-text)]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-3)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section id="our-values" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="section-label">What we stand for</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--c-text-3)]">
            Six values that shape how we teach, care and grow together.
          </p>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((v) => (
            <div
              key={v.name}
              className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 shadow-[var(--shadow-xs)]"
            >
              <h3 className="font-display text-base font-bold text-[var(--c-text)]">{v.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--c-text-3)]">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Founder */}
      <section id="meet-our-founder" className="pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="section-label">Leadership</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
              Meet Our Founder
            </h2>
            <div className="section-divider mx-auto" />
          </div>
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 55%, var(--c-slate) 100%)",
            }}
          >
            <div className="grid items-center gap-8 p-6 sm:gap-10 sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:p-12">
              <div className="mx-auto w-full max-w-[17rem] sm:max-w-[19rem]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
                  <img
                    src={SCHOOL_BRAND.proprietor}
                    alt={`${founder}, ${founderTitle}`}
                    className="h-full w-full object-cover object-top"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">{founder}</h3>
                <p className="mt-2 text-sm font-semibold text-[#d42a3a] sm:text-base">{founderTitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Mrs. Opeyemi Elebiju Josephine founded Splendor Spring School so every child can
                  learn — including families who pay affordable fees, and children who receive free
                  education when parents genuinely cannot afford school fees. Her work is rooted in
                  care, moral guidance and solid foundational academics for children in Makoko.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <Link href="/contact" className="btn btn-gold btn-sm">
                    Talk to us →
                  </Link>
                  <Link
                    href="/partnerships"
                    className="btn rounded-xl border border-white/20 bg-white/10 text-sm text-white hover:bg-white/20"
                  >
                    Educational partnerships
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

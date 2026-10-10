import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";
import { SCHOOL_BRAND } from "@/lib/media-gallery";
import Link from "next/link";
import { AboutMissionIllustration } from "@/components/illustrations";

export const metadata = {
  title: "About Us | Splendor Spring School",
  description: "Learn about our mission, vision, values, early years foundation, and child-centred primary education in Makoko, Lagos.",
};

const SECTIONS = [
  {
    stage: "Crèche / Daycare",
    age: "3 months – 2 years",
    title: "Reception & Early Nurturing",
    body: "Gentle, hygienic, and stimulating infant care designed to build sensory development, emotional security, and social curiosity in a warm environment.",
    icon: "👶",
    accent: "var(--c-sky)",
  },
  {
    stage: "Kindergarten",
    age: "2 – 3 years",
    title: "Discovery & Active Play",
    body: "Play-based exploration that sparks oral vocabulary, fine motor coordination, imaginative storytelling, and joyful social interaction with peers.",
    icon: "🎨",
    accent: "var(--c-gold)",
  },
  {
    stage: "Nursery 1 & 2",
    age: "3 – 5 years",
    title: "Foundational Literacy & Phonics",
    body: "Systematic Jolly Phonics, early numeracy, pencil grip mastery, science curiosity, and moral instruction to foster confident school readiness.",
    icon: "📖",
    accent: "var(--c-emerald)",
  },
  {
    stage: "Primary Basic 1 – 6",
    age: "5 – 11 years",
    title: "Academic Rigour & Character",
    body: "Comprehensive curriculum blending mathematics, English, sciences, ICT, arts, civic studies, and leadership development for secondary school excellence.",
    icon: "🎓",
    accent: "#6366f1",
  },
];

const CORE_VALUES = [
  {
    name: "Excellence",
    text: "We motivate every pupil to exceed standards and pursue mastery in both academics and practical skills.",
    icon: "🏆",
    color: "var(--c-sky)",
    bg: "var(--c-ice)",
  },
  {
    name: "Integrity",
    text: "Honesty, moral uprightness, and truthfulness are woven into every daily interaction and classroom lesson.",
    icon: "⚖️",
    color: "var(--c-emerald)",
    bg: "var(--c-emerald-pale)",
  },
  {
    name: "Compassion",
    text: "We nurture empathetic hearts that respect others, celebrate uniqueness, and care for peers.",
    icon: "❤️",
    color: "#f43f5e",
    bg: "#ffe4e6",
  },
  {
    name: "Respect",
    text: "Honouring teachers, elders, classmates, and school properties with genuine dignity and mutual courtesy.",
    icon: "🤝",
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    name: "Faith & Morals",
    text: "Anchored in sound Christian and universal moral tenets that anchor children's choices throughout life.",
    icon: "🕊️",
    color: "var(--c-gold)",
    bg: "var(--c-gold-pale)",
  },
  {
    name: "Creativity & STEAM",
    text: "Encouraging curiosity, problem-solving, artistic expression, and independent analytical thinking.",
    icon: "💡",
    color: "#0284c7",
    bg: "#e0f2fe",
  },
  {
    name: "Inclusiveness",
    text: "Every child, regardless of background, deserves equal warmth, high-tier instruction, and unwavering belief.",
    icon: "🌟",
    color: "#059669",
    bg: "#d1fae5",
  },
  {
    name: "Service & Impact",
    text: "Teaching children early the joy of contributing positively to family, community, and the nation.",
    icon: "🌱",
    color: "#d97706",
    bg: "#fef3c7",
  },
];

const METHODOLOGY_PILLARS = [
  {
    title: "Jolly Phonics & Reading Fluency",
    desc: "Multi-sensory synthetic phonics where children master sounds, blending, and vocabulary from nursery through primary.",
  },
  {
    title: "Hands-on Mathematical Reasoning",
    desc: "Concrete-pictorial-abstract problem solving, mental maths, and real-life arithmetic applications.",
  },
  {
    title: "Digital Literacy & Basic Computing",
    desc: "Familiarising pupils with computer fundamentals, typing, and digital tools for 21st-century readiness.",
  },
  {
    title: "Science & Environmental Discovery",
    desc: "Practical experiments, nature observation, hygiene awareness, and basic ecological stewardship.",
  },
  {
    title: "Expressive Arts & Cultural Heritage",
    desc: "Drawing, crafts, cultural appreciation, music, and public speaking that nurture self-confidence.",
  },
  {
    title: "Continuous Assessment & Online Portals",
    desc: "Transparent CA testing, exam analytics, and instant parent portal access to monitor term-by-term growth.",
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
  const proprietor = settings.school_proprietor || "Mrs. Opeyemi Elebiju";

  const pillars = [
    {
      title: "Our Mission",
      body: settings.mission || "To provide accessible, high-quality, and character-building nursery and primary education that nurtures every child's God-given talents to greater heights.",
      accent: "var(--c-sky)",
      accentBg: "var(--c-ice)",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7c.39-.39.39-1.02 0-1.41-.39-.39-1.03-.39-1.42 0z" />
        </svg>
      ),
    },
    {
      title: "Our Vision",
      body: settings.vision || "To be a beacon of academic excellence and moral leadership in Lagos, raising disciplined, inquisitive, and compassionate future pioneers.",
      accent: "var(--c-gold)",
      accentBg: "var(--c-gold-pale)",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      ),
    },
    {
      title: "Our Motto",
      body: `<em>“${motto}”</em><p class="mt-2 text-sm text-[var(--c-text-3)]">A daily reminder that with diligent instruction and godly values, no child's background limits their altitude.</p>`,
      accent: "var(--c-emerald)",
      accentBg: "var(--c-emerald-pale)",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ── 1. Hero Section with Illustration ───────────────────────────── */}
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
                ★ {motto}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                About {settings.school_name}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                A warm, child-centred citadel of learning in Makoko, Lagos. We provide holistic early childhood and primary education where every pupil is nurtured to excel.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href="/contact" className="btn btn-gold btn-md">
                  Enquire for admission →
                </Link>
                <Link
                  href="#learning-stages"
                  className="btn rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  Explore curriculum
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <AboutMissionIllustration className="h-60 w-full" />
                <div className="mt-3 text-center">
                  <p className="font-display text-sm font-semibold text-white">
                    Rooted in Values · Reaching Greater Heights
                  </p>
                  <p className="text-xs text-white/50">Comprehensive Early Years &amp; Basic Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. School Story / Intro Section ─────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 shadow-[var(--shadow-sm)] md:p-12">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-[var(--c-sky)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--c-sky)]">
              Welcome from our heart
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-[var(--c-text)] sm:text-3xl">
            Building strong foundations for tomorrow’s leaders
          </h2>
          <div
            className="prose-school mt-6 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base"
            dangerouslySetInnerHTML={{
              __html: page?.content || settings.school_intro,
            }}
          />
        </div>
      </section>

      {/* ── 3. Pillars: Mission, Vision, Motto ──────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ background: "var(--c-surface-2)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="section-label">Our Guiding Light</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
              Mission, Vision &amp; Motto
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 shadow-[var(--shadow-xs)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-xl)]"
              >
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: item.accentBg, color: item.accent }}
                >
                  {item.icon}
                </div>
                <h3 className="font-display text-2xl font-bold" style={{ color: item.accent }}>
                  {item.title}
                </h3>
                <div
                  className="mt-4 text-sm leading-relaxed text-[var(--c-text-2)]"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ background: item.accent }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Learning Stages / Educational Pathway ────────────────────── */}
      <section id="learning-stages" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="section-label">Academic Pathway</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
            Educational Stages at Splendor
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--c-text-3)]">
            Thoughtfully tailored developmental cohorts from infant care through the culmination of primary schooling.
          </p>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s, idx) => (
            <div
              key={s.stage}
              className="group relative flex flex-col justify-between rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="rounded-full bg-[var(--c-surface-3)] px-2.5 py-1 text-[11px] font-bold text-[var(--c-text-2)]">
                    {s.age}
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--c-sky)]">
                  Stage 0{idx + 1}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-[var(--c-text)]">
                  {s.stage}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[var(--c-text-3)]">
                  {s.title}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--c-text-3)]">
                  {s.body}
                </p>
              </div>
              <div className="mt-5 border-t border-[var(--c-border)] pt-3">
                <span className="text-[11px] font-semibold text-[var(--c-sky)] group-hover:underline">
                  Cohort enrollment open →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. How We Teach: STEAM & 21st-Century Methodologies ─────────── */}
      <section className="py-20" style={{ background: "var(--c-surface-2)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-2xl">
            <p className="section-label">Teaching Methodology</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
              Holistic Learning Pillars
            </h2>
            <p className="mt-3 text-sm text-[var(--c-text-3)]">
              We combine foundational academic mastery with practical discovery, moral resilience, and creative expression.
            </p>
            <div className="section-divider" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {METHODOLOGY_PILLARS.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-xs transition hover:shadow-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--c-ice)] text-xs font-bold text-[var(--c-sky)]">
                  0{i + 1}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-[var(--c-text)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--c-text-3)]">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Core Values Grid ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="section-label">Moral Architecture</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
            Our 8 Core Values
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--c-text-3)]">
            Guiding principles that shape character, conduct, and relationships across every classroom.
          </p>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_VALUES.map((v) => (
            <div
              key={v.name}
              className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 shadow-[var(--shadow-xs)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-xs"
                style={{ background: v.bg }}
              >
                {v.icon}
              </div>
              <h3 className="font-display text-base font-bold text-[var(--c-text)]">
                {v.name}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--c-text-3)]">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Leadership & Proprietress ────────────────────────────────── */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: "linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 55%, var(--c-slate) 100%)",
            }}
          >
            <div className="grid items-center gap-8 p-6 sm:gap-10 sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:p-12">
              <div className="mx-auto w-full max-w-[17rem] sm:max-w-[19rem]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
                  <img
                    src={SCHOOL_BRAND.proprietor}
                    alt={`${proprietor}, Proprietor of Splendor Spring School`}
                    className="h-full w-full object-cover object-top"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d42a3a]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#d42a3a]">
                  School Leadership
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                  {proprietor}
                </h2>
                <p className="mt-1 text-sm font-semibold text-[#d42a3a]">
                  Proprietress &amp; Visionary Founder
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Founded by Mrs. Opeyemi Elebiju Josephine out of an enduring commitment to accessible, world-class education for young minds. Her vision ensures that every child receives genuine care, moral guidance, and foundational academics to thrive anywhere in the world.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <Link href="/contact" className="btn btn-gold btn-sm">
                    Connect with leadership →
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

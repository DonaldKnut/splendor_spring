import Link from "next/link";
import { buildWhatsAppUrl } from "@splendor/shared/whatsapp";
import { getSettings } from "@/lib/settings";
import { SCHOOL_CONTACT, toWhatsAppDigits } from "@/lib/school-contact";
import { SOCIAL_IMPACT } from "@/lib/social-impact";

export const metadata = {
  title: "Educational Partnerships | Splendor Spring School",
  description:
    "Partner with Splendor Spring School in Makoko, Lagos — learn about our mission, the children we serve, and how to support our work.",
};

export default async function PartnershipsPage() {
  const settings = await getSettings([
    "school_name",
    "whatsapp_number",
    "school_email",
    "school_address",
  ]);
  const waNumber = settings.whatsapp_number || SCHOOL_CONTACT.whatsapp;
  const email = settings.school_email || SCHOOL_CONTACT.email;
  const wa = buildWhatsAppUrl(
    toWhatsAppDigits(waNumber),
    "Hello Splendor Spring School, I am interested in an educational partnership or supporting the school's work."
  );

  return (
    <>
      <div
        className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(185,28,44,0.18), transparent 45%),
            linear-gradient(105deg, rgba(11,17,32,0.92) 0%, rgba(11,17,32,0.75) 50%, rgba(15,28,54,0.95) 100%),
            linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)
          `,
        }}
      >
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d42a3a]/90">
            Work with us
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Educational Partnerships
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            Splendor Spring School welcomes individuals and organisations who want to support
            quality education for children in Makoko, Lagos.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-bold text-[var(--c-text)] sm:text-3xl">
          Our mission
        </h2>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base">
          {SOCIAL_IMPACT.paragraphs.map((p) => (
            <p key={p.slice(0, 28)}>{p}</p>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-[var(--c-text)] sm:text-3xl">
          The children we serve
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base">
          We serve children from Kindergarten through Primary in Makoko. Many come from low-income
          families. Some pay affordable fees; others receive free education when parents genuinely
          cannot afford school fees. Today we nurture over 200 children with a dedicated team of
          teachers.
        </p>

        <h2 className="mt-12 font-display text-2xl font-bold text-[var(--c-text)] sm:text-3xl">
          Our educational activities
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base">
          <li>Strong foundations in reading, writing and mathematics</li>
          <li>Phonics and early literacy in the nursery years</li>
          <li>Science discovery, creative arts and cultural activities</li>
          <li>Character formation rooted in godly values and moral integrity</li>
          <li>Exhibitions, partnerships and learning beyond the classroom</li>
        </ul>

        <h2 className="mt-12 font-display text-2xl font-bold text-[var(--c-text)] sm:text-3xl">
          How you can support us
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--c-text-2)] sm:text-base">
          Partners may support learning materials, classroom improvement, teacher development,
          educational programmes, or direct support that helps more children stay in school. We are
          open to thoughtful conversations with individuals, churches, NGOs, schools and
          organisations who share our commitment to children in underserved communities.
        </p>

        <div className="mt-10 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-[var(--c-text)]">Contact us</h3>
          <p className="mt-2 text-sm text-[var(--c-text-3)]">
            {settings.school_address || SCHOOL_CONTACT.address}
          </p>
          <p className="mt-1 text-sm text-[var(--c-text-3)]">
            <a href={`mailto:${email}`} className="font-semibold text-[var(--c-sky)] hover:underline">
              {email}
            </a>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm rounded-xl"
              >
                WhatsApp about partnership →
              </a>
            ) : null}
            <Link href="/contact" className="btn btn-ghost btn-sm rounded-xl border-[var(--c-border)]">
              Contact form
            </Link>
            <Link href="/about" className="btn btn-ghost btn-sm rounded-xl border-[var(--c-border)]">
              About our school
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

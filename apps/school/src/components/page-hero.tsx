import { HERO_GLOW, HERO_WASH } from "@splendor/ui/media";

/** Dark top band that underlaps the fixed transparent header (same wash as home hero). */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      className="relative overflow-hidden px-5 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32"
      style={{
        backgroundImage: `
          ${HERO_GLOW},
          ${HERO_WASH},
          linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)
        `,
      }}
    >
      <div className="relative mx-auto max-w-6xl">
        {eyebrow ? <p className="hero-eyebrow mb-4">{eyebrow}</p> : null}
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            {subtitle}
          </p>
        ) : null}
        <div
          className="mt-6 h-1 w-16 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--c-sky), var(--c-gold))" }}
        />
      </div>
    </div>
  );
}

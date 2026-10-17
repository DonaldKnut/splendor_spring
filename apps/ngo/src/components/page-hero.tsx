import { NGO_HERO_GLOW, NGO_HERO_WASH } from "@splendor/ui/media";

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
          ${NGO_HERO_GLOW},
          ${NGO_HERO_WASH},
          linear-gradient(135deg, #1b2430 0%, #1f5c70 55%, #2f8f8a 100%)
        `,
      }}
    >
      <div className="relative mx-auto max-w-6xl">
        {eyebrow ? (
          <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#e8915f] sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            {subtitle}
          </p>
        ) : null}
        <div
          className="mt-6 h-1 w-16 rounded-full"
          style={{ background: "linear-gradient(90deg, #2f8f8a, #d97845)" }}
        />
      </div>
    </div>
  );
}

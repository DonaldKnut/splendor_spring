import React from "react";

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
    <div className="relative overflow-hidden bg-[#0e1622] px-3.5 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-32">
      {/* Background radial glowing gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full sm:h-[500px] sm:w-[500px]"
          style={{
            background: "radial-gradient(circle, rgba(47,143,138,0.3) 0%, rgba(31,92,112,0.15) 50%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute bottom-0 right-[10%] h-[260px] w-[260px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(217,120,69,0.2) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8915f] sm:text-xs">
              {eyebrow}
            </span>
          </div>
        ) : null}

        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm lg:text-base">
            {subtitle}
          </p>
        ) : null}

        <div
          className="mt-6 h-1 w-20 rounded-full"
          style={{ background: "linear-gradient(90deg, #2f8f8a, #d97845)" }}
        />
      </div>
    </div>
  );
}

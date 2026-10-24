"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Tier {
  amount: number;
  label: string;
  impactTitle: string;
  impactDesc: string;
  metric: string;
  icon: string;
  color: string;
}

const TIERS: Tier[] = [
  {
    amount: 5000,
    label: "₦5,000",
    impactTitle: "Nutritional Support",
    impactDesc: "Provides 15 hot, nutrient-dense school lunches for children in vulnerable rural communities.",
    metric: "15 School Lunches",
    icon: "🍲",
    color: "#d97845",
  },
  {
    amount: 15000,
    label: "₦15,000",
    impactTitle: "Clean Water & Hygiene",
    impactDesc: "Supplies a family with durable water filtration units and 6 months of essential hygiene kits.",
    metric: "1 Family / 6 Months Water",
    icon: "💧",
    color: "#2f8f8a",
  },
  {
    amount: 50000,
    label: "₦50,000",
    impactTitle: "Classroom Learning Pack",
    impactDesc: "Equips 4 children with full-year school supplies, backpacks, workbooks, and uniform kits.",
    metric: "4 Complete School Kits",
    icon: "📚",
    color: "#1f5c70",
  },
  {
    amount: 120000,
    label: "₦120,000",
    impactTitle: "Community Health Outreach",
    impactDesc: "Sponsors free primary healthcare consultations, prenatal supplements, and malaria screenings for 25 mothers.",
    metric: "25 Mothers & Infants Supported",
    icon: "🩺",
    color: "#059669",
  },
  {
    amount: 250000,
    label: "₦250,000",
    impactTitle: "Grassroots Empowerment Grant",
    impactDesc: "Funds a vocational start-up grant for women caregivers to launch sustainable neighbourhood micro-enterprises.",
    metric: "1 Micro-Enterprise Funded",
    icon: "🌱",
    color: "#e11d48",
  },
];

export function ImpactCalculator() {
  const [selectedIdx, setSelectedIdx] = useState(1);
  const activeTier = TIERS[selectedIdx];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-[#1b2430] via-[#1f5c70] to-[#245462] p-4 text-white shadow-2xl sm:p-8 md:p-10">
      {/* Ambient decorative glowing orbs */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-teal/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-coral/25 blur-3xl" />

      <div className="relative z-10">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8915f]">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#e8915f]" />
            Real Impact Estimator
          </div>
          <span className="text-xs text-white/60">
            100% Verified Community Direct Aid
          </span>
        </div>

        {/* Section Title */}
        <div className="mt-4">
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            See the life change your giving creates
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
            Select an amount below to discover how every Naira directly equips a child, heals a patient, or uplifts a family.
          </p>
        </div>

        {/* Amount Selector Pills - Super responsive even for 344px */}
        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {TIERS.map((tier, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={tier.amount}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`flex-1 min-w-[76px] sm:min-w-[96px] rounded-xl px-2.5 py-2 sm:px-4 sm:py-3 text-center transition-all duration-300 ${
                  isSelected
                    ? "scale-[1.03] bg-gradient-to-r from-coral to-[#e8915f] font-bold text-white shadow-lg shadow-coral/30 ring-2 ring-white/30"
                    : "bg-white/10 text-white/80 hover:bg-white/20 active:scale-95"
                }`}
              >
                <span className="block text-xs font-bold sm:text-sm">{tier.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Dynamic Impact Display Card */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition-all duration-500 sm:p-6">
          <div className="flex items-start gap-3.5 sm:gap-5">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner sm:h-16 sm:w-16 sm:text-3xl"
              style={{ background: "rgba(255, 255, 255, 0.15)" }}
            >
              {activeTier.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8915f]">
                  {activeTier.impactTitle}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                  {activeTier.metric}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/90 sm:text-base">
                {activeTier.impactDesc}
              </p>
            </div>
          </div>

          {/* Impact Gauge Visualizer */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] text-white/60">
              <span>Community Impact Reach</span>
              <span className="font-semibold text-white/90">Tier {selectedIdx + 1} of {TIERS.length}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((selectedIdx + 1) / TIERS.length) * 100}%`,
                  background: "linear-gradient(90deg, #2f8f8a 0%, #d97845 100%)",
                }}
              />
            </div>
          </div>

          {/* Action CTA Row */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-white/65">
              <span>Direct verification via Paystack & Flutterwave</span>
            </div>
            <Link
              href={`/donate?amount=${activeTier.amount}`}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              style={{
                background: "linear-gradient(135deg, #d97845, #e8915f)",
                boxShadow: "0 8px 24px rgba(217,120,69,0.4)",
              }}
            >
              <span>Give {activeTier.label} Now</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

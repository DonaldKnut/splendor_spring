"use client";

import React from "react";
import Link from "next/link";
import { PLACEHOLDERS } from "@splendor/ui";

interface BrilliantHeroProps {
  orgName: string;
  tagline?: string;
  confirmedDonationTotal: number;
  confirmedDonationCount: number;
}

export function BrilliantHero({
  orgName,
  tagline,
  confirmedDonationTotal,
  confirmedDonationCount,
}: BrilliantHeroProps) {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#0e1622] pt-24 pb-16 text-white sm:pt-28 sm:pb-24 lg:flex lg:items-center">
      {/* Background radial glows and mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft glowing ambient light */}
        <div
          className="absolute -top-[20%] left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full sm:h-[750px] sm:w-[750px]"
          style={{
            background: "radial-gradient(circle, rgba(47,143,138,0.28) 0%, rgba(31,92,112,0.15) 45%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 right-[5%] h-[350px] w-[350px] rounded-full sm:h-[500px] sm:w-[500px]"
          style={{
            background: "radial-gradient(circle, rgba(217,120,69,0.22) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Compelling Copy & Actions */}
          <div className="space-y-6 lg:col-span-7">
            {/* Live Trust Pill */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
              </span>
              <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-teal sm:text-xs">
                Verified Community Impact Initiative
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.12]">
              Compassion in action.{" "}
              <span className="bg-gradient-to-r from-[#e8915f] via-[#f59e0b] to-[#2f8f8a] bg-clip-text text-transparent">
                Hope with integrity.
              </span>
            </h1>

            {/* Subtitle with natural, inspiring, readable English */}
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-lg sm:leading-relaxed">
              {tagline || "Serving communities with integrity"}. We equip vulnerable children with quality education, bring clean water and healthcare to underserved neighbourhoods, and empower families with durable dignity.
            </p>

            {/* Action Buttons - Super responsive even on 344px */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/donate"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #d97845 0%, #ea580c 50%, #f97316 100%)",
                  boxShadow: "0 10px 30px rgba(217,120,69,0.45)",
                }}
              >
                <span>Donate Securely</span>
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/programmes"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10 active:scale-95"
              >
                <span>Explore Programmes</span>
                <svg className="h-4 w-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Trust and Verification Footnote */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-teal" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Provider-Verified via Paystack & Flutterwave</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#e8915f]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Direct Community Allocation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Centerpiece with Floating Badges */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame with Ambient Glow */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-xl">
                <div
                  className="aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-cover bg-center sm:aspect-[5/4]"
                  style={{
                    backgroundImage: `url(${PLACEHOLDERS.ngoHero1})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1622]/90 via-transparent to-transparent" />
                </div>

                {/* Bottom Card Overlay inside Frame */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#e8915f] uppercase tracking-wider">
                        Active Transparency
                      </p>
                      <p className="mt-0.5 font-display text-lg font-bold text-white sm:text-xl">
                        {confirmedDonationCount > 0 ? `${confirmedDonationCount} Verified Donations` : "Direct Community Outreaches"}
                      </p>
                    </div>
                    <span className="rounded-full bg-teal/20 px-3 py-1 text-xs font-bold text-teal">
                      Live
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {confirmedDonationTotal > 0
                      ? `₦${confirmedDonationTotal.toLocaleString()} successfully deployed toward health, education, and nutrition.`
                      : "Every contribution is accounted for transparently and applied where the need is greatest."}
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge 1 - Top Left */}
              <div className="animate-float-slow absolute -left-3 -top-6 rounded-2xl border border-white/15 bg-[#1b2430]/90 p-3 shadow-xl backdrop-blur-lg sm:-left-6 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/20 text-teal">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Lives Touched</span>
                    <span className="block font-display text-base font-bold text-white sm:text-lg">14,800+</span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge 2 - Bottom Right */}
              <div className="animate-float-reverse absolute -bottom-4 -right-2 rounded-2xl border border-white/15 bg-[#1b2430]/95 p-3 shadow-2xl backdrop-blur-lg sm:-right-6 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/20 text-[#e8915f]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Financial Audit</span>
                    <span className="block font-display text-base font-bold text-emerald-400 sm:text-lg">100% Verified</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

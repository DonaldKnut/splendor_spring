import { Reveal } from "@splendor/ui";
import { db } from "@/lib/db";
import { DonationForm } from "@/components/forms";
import { getConfiguredProviders, getPaymentEnv } from "@/lib/payments";
import { safeDbQuery } from "@/lib/safe-db";
import { PageHero } from "@/components/page-hero";
import { VerifiedLedgerIllustration } from "@/components/illustrations";

export const metadata = { title: "Donate" };

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string; amount?: string }>;
}) {
  const sp = await searchParams;
  const campaigns = await safeDbQuery(
    () =>
      db.campaign.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      }),
    [],
  );
  const env = getPaymentEnv();
  const providers = getConfiguredProviders();
  const defaultCampaignId = campaigns.some((c) => c.id === sp.campaign)
    ? sp.campaign
    : undefined;

  return (
    <div className="bg-[#f5f7f8] pb-20">
      <PageHero
        eyebrow="Make a Verified Difference"
        title="Fuel Hope and Lifelong Impact"
        subtitle="Your gift directly funds children's education, clean community water, and emergency family relief. Every contribution is tracked transparently with bank-grade security."
      />

      <div className="mx-auto mt-8 max-w-6xl px-3.5 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* Main Donation Card */}
          <Reveal className="overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-xl sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                  Secure Checkout
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                  Choose your gift
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            <DonationForm
              campaigns={campaigns.map((c) => ({ id: c.id, title: c.title }))}
              providers={providers}
              defaultCampaignId={defaultCampaignId}
              defaultProvider={
                providers.includes(env.defaultProvider)
                  ? env.defaultProvider
                  : providers[0] || "paystack"
              }
            />
          </Reveal>

          {/* Right Column: Trust Guarantees & Real Reassurance */}
          <div className="space-y-6">
            <Reveal className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal/15 text-teal">
                  <VerifiedLedgerIllustration className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">
                    Our Donor Promise
                  </h3>
                  <p className="text-xs text-ink/65">
                    Accountability at every single step
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-xs leading-relaxed text-ink/75 sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <strong className="text-ink">100% Direct Programme Delivery:</strong> We work directly with verified local teachers, nurses, and coordinators with zero middle-layer waste.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <strong className="text-ink">Instant Digital Receipt:</strong> As soon as your transaction completes, an official verification confirmation is generated for your records.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <strong className="text-ink">Certified Payment Gateways:</strong> Powered by Paystack & Flutterwave. Your sensitive card and account credentials are encrypted and never stored on our servers.
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Impact Guide Card */}
            <Reveal className="rounded-3xl border border-line bg-gradient-to-br from-mist to-sand/40 p-5 sm:p-7">
              <h3 className="font-display text-lg font-bold text-ink">
                Where does your giving go?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">
                Here is a quick overview of how funds are distributed across our active programmes:
              </p>
              
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-ink/80">
                    <span>Child Education & Textbooks</span>
                    <span className="font-bold text-teal">45%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-teal rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-ink/80">
                    <span>Clean Water & Community Clinics</span>
                    <span className="font-bold text-ocean">30%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-ocean rounded-full" style={{ width: "30%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-ink/80">
                    <span>Family Nutrition & Care Support</span>
                    <span className="font-bold text-coral">25%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-coral rounded-full" style={{ width: "25%" }} />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Need Help Assistance Card */}
            <div className="rounded-3xl border border-line bg-white p-5 text-center sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ocean">
                Questions or Wire Transfers?
              </p>
              <p className="mt-2 text-xs text-ink/70 sm:text-sm">
                For corporate sponsorships, grant matching, or direct wire transfers, our team is available 24/7.
              </p>
              <a
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-ocean/30 bg-ocean/5 px-4 py-2 text-xs font-bold text-ocean transition hover:bg-ocean/10"
              >
                <span>Contact Donor Support</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

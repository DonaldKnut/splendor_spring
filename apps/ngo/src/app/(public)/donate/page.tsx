import { PLACEHOLDERS, Reveal } from "@splendor/ui";
import { NGO_HERO_GLOW, NGO_HERO_WASH } from "@splendor/ui/media";
import { db } from "@/lib/db";
import { DonationForm } from "@/components/forms";
import { getConfiguredProviders, getPaymentEnv } from "@/lib/payments";
import { safeDbQuery } from "@/lib/safe-db";

export const metadata = { title: "Donate" };

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>;
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
    <div>
      <section
        className="relative overflow-hidden px-5 pb-16 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-32"
        style={{
          backgroundImage: `
            ${NGO_HERO_GLOW},
            ${NGO_HERO_WASH},
            url(${PLACEHOLDERS.ngoHero3})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative mx-auto max-w-3xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#e8915f]">
            Support
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Donate</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-lg">
            Choose Paystack or Flutterwave. Keys are read from environment variables — no code
            changes required when credentials arrive.
          </p>
          <div
            className="mt-6 h-1 w-16 rounded-full"
            style={{ background: "linear-gradient(90deg, #2f8f8a, #d97845)" }}
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.1fr_.9fr]">
        <Reveal className="rounded-3xl border border-line bg-white p-6 shadow-sm">
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
        <Reveal className="space-y-4 text-sm text-ink/70">
          <h2 className="font-display text-2xl text-ink">How verification works</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Checkout is initialized server-side with a unique reference.</li>
            <li>Return URL and webhooks both re-verify with the provider API.</li>
            <li>Webhook signatures are validated (Paystack HMAC / Flutterwave verif-hash).</li>
            <li>Duplicate webhook events are ignored via idempotent event keys.</li>
            <li>Only SUCCESS records count toward confirmed totals.</li>
          </ul>
          <p>
            Webhooks:
            <br />
            <code className="text-xs">/api/webhooks/paystack</code>
            <br />
            <code className="text-xs">/api/webhooks/flutterwave</code>
          </p>
        </Reveal>
      </div>
    </div>
  );
}

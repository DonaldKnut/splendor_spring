import Link from "next/link";
import type { PaymentProviderName } from "@splendor/payments";
import { confirmDonationFromProvider } from "@/lib/actions/donations";
import { Alert, Card } from "@/components/ui";

export default async function DonateVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string; provider?: string; tx_ref?: string }>;
}) {
  const sp = await searchParams;
  const reference = sp.reference || sp.trxref || sp.tx_ref;
  const provider = (sp.provider === "flutterwave" ? "flutterwave" : "paystack") as PaymentProviderName;

  if (!reference) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <Alert tone="error">Missing payment reference.</Alert>
      </div>
    );
  }

  let status = "PENDING";
  let error: string | null = null;
  try {
    const result = await confirmDonationFromProvider(reference, provider);
    status = result.donation.status;
  } catch (err) {
    error = err instanceof Error ? err.message : "Verification failed";
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Card>
        <h1 className="font-display text-2xl">Donation status</h1>
        <p className="mt-2 text-sm text-ink/70">
          Reference: {reference} · Provider: {provider}
        </p>
        {error ? (
          <div className="mt-4">
            <Alert tone="error">{error}</Alert>
          </div>
        ) : status === "SUCCESS" ? (
          <div className="mt-4">
            <Alert tone="success">
              Payment verified successfully with {provider}. Thank you for your donation.
            </Alert>
          </div>
        ) : status === "FAILED" ? (
          <div className="mt-4">
            <Alert tone="error">Payment was not successful.</Alert>
          </div>
        ) : (
          <div className="mt-4">
            <Alert>
              Payment is still pending verification. If you completed payment, webhook confirmation
              may update this shortly.
            </Alert>
          </div>
        )}
        <Link href="/donate" className="mt-6 inline-block text-sm text-ocean underline">
          Back to donate
        </Link>
      </Card>
    </div>
  );
}

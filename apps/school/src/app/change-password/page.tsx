import { Suspense } from "react";
import { AuthShell } from "@splendor/ui";
import { SessionProvider } from "@/components/session-provider";
import { ChangePasswordForm } from "@/components/change-password-form";
import { schoolAuthSlides } from "@/lib/auth-promo";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Change password" };

const passwordSlides = [
  {
    ...schoolAuthSlides[0],
    id: "secure",
    badge: "Security",
    title: "Protect your portal",
    subtitle:
      "A strong password keeps student records, results, and family access private.",
  },
  {
    ...schoolAuthSlides[1],
    id: "access",
    badge: "Access",
    title: "One account, clear control",
    subtitle: "Change your password any time — sessions stay encrypted and verified.",
  },
  {
    ...schoolAuthSlides[2],
    id: "trust",
    badge: "Trust",
    title: "Built for school days",
    subtitle: "Temporary credentials expire after first use. You own your password from here.",
  },
];

export default async function ChangePasswordPage() {
  const settings = await getSettings(["school_name"]);
  const brand = settings.school_name || "Splendor Spring School";

  return (
    <SessionProvider>
      <AuthShell brand={brand} slides={passwordSlides} accent="school">
        <Suspense
          fallback={
            <div className="space-y-3">
              <div className="h-3 w-24 animate-pulse rounded bg-black/5" />
              <div className="h-8 w-48 animate-pulse rounded bg-black/5" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-black/5" />
            </div>
          }
        >
          <ChangePasswordForm />
        </Suspense>
      </AuthShell>
    </SessionProvider>
  );
}

import { Suspense } from "react";
import { AuthShell } from "@splendor/ui";
import { LoginForm } from "@/components/login-form";
import { schoolAuthSlides } from "@/lib/auth-promo";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Login" };

export default async function LoginPage() {
  const settings = await getSettings(["school_name", "school_tagline"]);
  const brand = settings.school_name || "Splendor Spring School";

  return (
    <AuthShell brand={brand} slides={schoolAuthSlides} accent="school">
      <Suspense
        fallback={
          <div className="space-y-3">
            <div className="h-3 w-24 animate-pulse rounded bg-black/5" />
            <div className="h-8 w-40 animate-pulse rounded bg-black/5" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-black/5" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-black/5" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

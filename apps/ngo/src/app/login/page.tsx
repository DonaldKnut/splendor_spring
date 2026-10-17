import { AuthShell } from "@splendor/ui";
import { LoginForm } from "@/components/login-form";
import { ngoAuthSlides } from "@/lib/auth-promo";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Login" };

export default async function LoginPage() {
  const settings = await getSettings(["org_name"]);
  const brand = settings.org_name || "Splendor NGO";

  return (
    <AuthShell brand={brand} slides={ngoAuthSlides} accent="ngo">
      <LoginForm />
    </AuthShell>
  );
}

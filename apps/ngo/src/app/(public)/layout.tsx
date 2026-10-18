import { AnimatedMain, SiteFooter, SiteHeader, WhatsAppButton } from "@/components/site-chrome";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings([
    "org_name",
    "org_address",
    "org_phone",
    "org_email",
    "whatsapp_number",
    "whatsapp_default_message",
  ]);

  return (
    <div className="relative min-h-svh overflow-x-clip bg-[#f5f7f8]">
      <SiteHeader orgName={settings.org_name} />
      <AnimatedMain>{children}</AnimatedMain>
      <SiteFooter
        orgName={settings.org_name}
        address={settings.org_address}
        phone={settings.org_phone}
        email={settings.org_email}
      />
      <WhatsAppButton
        number={settings.whatsapp_number}
        message={settings.whatsapp_default_message}
      />
    </div>
  );
}

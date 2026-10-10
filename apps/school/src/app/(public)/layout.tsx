import {
  AnimatedMain,
  SiteFooter,
  SiteHeader,
  WhatsAppButton,
} from "@/components/site-chrome";
import { getSettings } from "@/lib/settings";
import { SCHOOL_CONTACT } from "@/lib/school-contact";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings([
    "school_name",
    "school_address",
    "school_phone",
    "school_email",
    "school_facebook",
    "whatsapp_number",
    "whatsapp_default_message",
  ]);

  return (
    <div className="relative min-h-svh overflow-x-clip">
      <SiteHeader schoolName={settings.school_name} />
      <AnimatedMain>{children}</AnimatedMain>
      <SiteFooter
        schoolName={settings.school_name}
        address={settings.school_address || SCHOOL_CONTACT.address}
        phone={settings.school_phone || SCHOOL_CONTACT.phoneDisplay}
        email={settings.school_email || SCHOOL_CONTACT.email}
        facebook={settings.school_facebook || SCHOOL_CONTACT.facebook}
      />
      <WhatsAppButton
        number={settings.whatsapp_number || SCHOOL_CONTACT.whatsapp}
        message={settings.whatsapp_default_message || SCHOOL_CONTACT.whatsappMessage}
      />
    </div>
  );
}

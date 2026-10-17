import { buildWhatsAppUrl } from "@splendor/shared/whatsapp";
import { ContactForm } from "@/components/forms";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings([
    "org_name",
    "org_address",
    "org_phone",
    "org_email",
    "whatsapp_number",
    "whatsapp_default_message",
  ]);
  const wa = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_default_message);

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact"
        subtitle={`Reach ${settings.org_name} with enquiries.`}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink">Reach us directly</h2>
          <div className="mt-6 space-y-2 text-sm text-ink/70">
            {settings.org_address ? <p>{settings.org_address}</p> : null}
            {settings.org_phone ? <p>{settings.org_phone}</p> : null}
            {settings.org_email ? <p>{settings.org_email}</p> : null}
          </div>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15"
            >
              Chat on WhatsApp
            </a>
          ) : (
            <p className="mt-6 text-sm text-ink/60">
              WhatsApp will appear once a number is configured in settings.
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </>
  );
}

import { buildWhatsAppUrl } from "@splendor/shared/whatsapp";
import { ContactForm } from "@/components/forms";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Contact Us" };

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
    <div className="bg-[#f5f7f8] pb-24">
      <PageHero
        eyebrow="Get In Touch"
        title="We'd Love to Hear From You"
        subtitle={`Reach out to the ${settings.org_name} team for programme partnerships, donor inquiries, volunteer opportunities, or general questions.`}
      />

      <div className="mx-auto max-w-6xl px-3.5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Direct Channels */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
                Direct Communication
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                Always here to support our community
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-ink/75 sm:text-sm">
                Whether you want to sponsor a child, contribute educational materials, or invite us to your neighbourhood, our team is ready to assist.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-3">
              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <strong className="block text-xs font-bold uppercase tracking-wider text-ink/60">
                    Office Location
                  </strong>
                  <p className="mt-1 text-xs text-ink/80 sm:text-sm">
                    {settings.org_address || "Community Resource Center, Lagos, Nigeria"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <strong className="block text-xs font-bold uppercase tracking-wider text-ink/60">
                    Email Correspondence
                  </strong>
                  <a
                    href={`mailto:${settings.org_email || "support@splendorinitiative.org"}`}
                    className="mt-1 block text-xs font-medium text-ocean hover:underline sm:text-sm"
                  >
                    {settings.org_email || "support@splendorinitiative.org"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <strong className="block text-xs font-bold uppercase tracking-wider text-ink/60">
                    Direct Line
                  </strong>
                  <p className="mt-1 text-xs text-ink/80 sm:text-sm">
                    {settings.org_phone || "+234 (0) 800-SPLENDOR"}
                  </p>
                </div>
              </div>
            </div>

            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:brightness-105 active:scale-95 sm:w-auto"
              >
                <span>Chat on Official WhatsApp</span>
              </a>
            ) : null}
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-xl sm:p-8 md:p-10">
              <span className="text-xs font-bold uppercase tracking-wider text-teal">
                Send an Enquiry
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                How can we assist you today?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">
                Fill in the details below and a coordinator will reply within 24 hours.
              </p>

              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

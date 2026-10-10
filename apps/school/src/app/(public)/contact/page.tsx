import { buildWhatsAppUrl } from "@splendor/shared/whatsapp";
import { ContactForm } from "@/components/contact-form";
import { getSettings } from "@/lib/settings";
import { SCHOOL_CONTACT, toWhatsAppDigits } from "@/lib/school-contact";
import { ContactIllustration } from "@/components/illustrations";

export const metadata = {
  title: "Contact Us & Campus Location | Splendor Spring School",
  description: "Reach Splendor Spring School in Makoko, Lagos. Telephone, WhatsApp enquiries, school visiting hours, and admission directions.",
};

const FAQS = [
  {
    q: "How do I enroll my child into Crèche, Nursery or Primary?",
    a: "You can visit the school office on weekdays or submit an inquiry using the form below. Our admissions officer will schedule an assessment and provide the enrollment kit.",
  },
  {
    q: "How can parents check student results online?",
    a: "Parents receive a portal account login via email. You can sign in using the 'Portal Login' button at the top of the website to view and download term report cards.",
  },
  {
    q: "What are the school visiting and office hours?",
    a: "Administrative reception is open Monday through Friday from 7:30 AM to 4:00 PM. Parents may also arrange weekend consultations by appointment.",
  },
  {
    q: "Are school bus services or lunch programs provided?",
    a: "Please inquire directly with the administration desk or via WhatsApp for current transport routes and meal subscription options.",
  },
];

export default async function ContactPage() {
  const settings = await getSettings([
    "school_name",
    "school_address",
    "school_phone",
    "school_email",
    "school_facebook",
    "whatsapp_number",
    "whatsapp_default_message",
  ]);

  const address = settings.school_address || SCHOOL_CONTACT.address;
  const phone = settings.school_phone || SCHOOL_CONTACT.phoneDisplay;
  const email = settings.school_email || SCHOOL_CONTACT.email;
  const facebook = settings.school_facebook || SCHOOL_CONTACT.facebook;
  const instagram = "https://www.instagram.com/splendorspringschool?psln=ZHBsOGh3aDFlbWlw";
  const waNumber = settings.whatsapp_number || SCHOOL_CONTACT.whatsapp;
  const waMessage =
    settings.whatsapp_default_message || SCHOOL_CONTACT.whatsappMessage;
  const wa = buildWhatsAppUrl(toWhatsAppDigits(waNumber), waMessage);

  const contactDetails = [
    {
      label: "Campus Address",
      value: address,
      desc: "Makoko, Lagos State, Nigeria",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      ),
    },
    {
      label: "Telephone Lines",
      value: phone,
      desc: "Direct line to administrative reception",
      href: `tel:${SCHOOL_CONTACT.phones[0]}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      ),
    },
    {
      label: "Email Address",
      value: email,
      desc: "Admissions, partnerships and record inquiries",
      href: `mailto:${email}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
    },
    {
      label: "Instagram Community",
      value: "@splendorspringschool",
      desc: "School highlights, student activities & memories",
      href: instagram,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      label: "Facebook Page",
      value: "Splendor Spring School",
      desc: "Announcements & parent interaction",
      href: facebook,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 13.5h2.5l.5-3H14v-1.5c0-.8.2-1.3 1.4-1.3H17V5.1C16.7 5.1 15.8 5 14.7 5 12.2 5 10.5 6.5 10.5 9.1V10.5H8v3h2.5V21h3.5v-7.5z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ── 1. Hero with Illustration ──────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(185,28,44,0.2), transparent 45%),
            linear-gradient(105deg, rgba(11,17,32,0.92) 0%, rgba(11,17,32,0.72) 48%, rgba(15,28,54,0.95) 100%),
            linear-gradient(135deg, var(--c-midnight) 0%, var(--c-navy-light) 60%, var(--c-slate) 100%)
          `,
        }}
      >
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="text-center lg:col-span-7 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#d42a3a]">
                We are here for your child
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Get in touch with us
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                Have questions regarding admissions, tuition, pupil transfers, or curriculum? Our administrative team welcomes your message and campus visit.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold btn-md"
                  >
                    💬 Chat on WhatsApp
                  </a>
                ) : null}
                <a
                  href="#contact-form-section"
                  className="btn rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  Send a message ↓
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <ContactIllustration className="h-44 w-full sm:h-52" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Contact Details & Message Form Section ──────────────────── */}
      <section id="contact-form-section" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Direct Contact Cards (6 cols) */}
          <div className="space-y-6 lg:col-span-6">
            <div>
              <p className="section-label">Connect directly</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[var(--c-text)] sm:text-3xl">
                Reach our administration
              </h2>
              <p className="mt-2 text-sm text-[var(--c-text-3)]">
                Our office is situated in Makoko, Lagos. We respond to all telephone, email, and WhatsApp communications promptly.
              </p>
            </div>

            <div className="space-y-3.5">
              {contactDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="group flex items-start gap-4 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4 shadow-xs transition hover:border-[var(--c-sky)]/40 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--c-ice)] text-[var(--c-sky)]">
                    {detail.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--c-text-3)]">
                      {detail.label}
                    </p>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.href.startsWith("http") ? "_blank" : undefined}
                        rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-0.5 block break-words text-sm font-semibold text-[var(--c-text)] transition hover:text-[var(--c-sky)]"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-semibold text-[var(--c-text)]">
                        {detail.value}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-[var(--c-text-3)]">{detail.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours Box */}
            <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">⏰</span>
                <h3 className="font-display text-sm font-bold text-[var(--c-text)]">
                  Office &amp; Visiting Hours
                </h3>
              </div>
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-xl bg-[var(--c-surface)] p-2.5 border border-[var(--c-border)]">
                  <p className="font-semibold text-[var(--c-text)]">Monday – Friday</p>
                  <p className="text-[var(--c-text-3)]">7:30 AM – 4:00 PM</p>
                </div>
                <div className="rounded-xl bg-[var(--c-surface)] p-2.5 border border-[var(--c-border)]">
                  <p className="font-semibold text-[var(--c-text)]">Weekend Enquiries</p>
                  <p className="text-[var(--c-text-3)]">By Appointment / WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (6 cols) */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <span className="rounded-full bg-[var(--c-ice)] px-3 py-1 text-xs font-semibold text-[var(--c-sky)]">
                  Online Inquiry
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-[var(--c-text)]">
                  Send us a message
                </h3>
                <p className="mt-1 text-xs text-[var(--c-text-3)]">
                  Fill in your details below and our team will get back to you shortly.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Frequently Asked Questions Section ──────────────────────── */}
      <section className="py-16 sm:py-20" style={{ background: "var(--c-surface-2)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="section-label">Common Questions</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--c-text-3)]">
              Quick answers to help you navigate admissions, academic sessions, and portal access.
            </p>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-xs"
              >
                <h3 className="font-display text-base font-bold text-[var(--c-text)]">
                  {faq.q}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-[var(--c-text-3)]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

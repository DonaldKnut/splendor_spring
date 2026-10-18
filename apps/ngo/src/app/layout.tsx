import type { Metadata } from "next";
import { Instrument_Serif, Sora } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";

/** Keep root metadata/layout from requiring a live DB during `next build`. */
export const dynamic = "force-dynamic";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-loaded",
  display: "swap",
});

const body = Sora({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings(["org_name", "org_tagline"]);
  return {
    title: {
      default: settings.org_name,
      template: `%s | ${settings.org_name}`,
    },
    description: settings.org_tagline,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <style>{`
          :root {
            --font-display: var(--font-display-loaded), "Instrument Serif", Georgia, serif;
            --font-body: var(--font-body-loaded), "Sora", "Segoe UI", sans-serif;
          }
        `}</style>
        {children}
      </body>
    </html>
  );
}

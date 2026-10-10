import type { Metadata } from "next";
import { DM_Sans, Figtree } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";

/** Clean geometric headers — sharp, premium, easy to read at every size. */
const display = Figtree({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Clean body & subtext — calm, professional, comfortable for long reading. */
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings(["school_name", "school_tagline"]);
  return {
    title: {
      default: settings.school_name,
      template: `%s | ${settings.school_name}`,
    },
    description: settings.school_tagline,
    metadataBase: new URL("https://splendorschool.edu.ng"),
    openGraph: {
      type: "website",
      locale: "en_NG",
      siteName: settings.school_name,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <meta name="theme-color" content="#1c100a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased">
        <style>{`
          :root {
            --font-display: var(--font-display-loaded), "Figtree", "Segoe UI", sans-serif;
            --font-body: var(--font-body-loaded), "DM Sans", "Segoe UI", sans-serif;
          }
        `}</style>
        {children}
      </body>
    </html>
  );
}

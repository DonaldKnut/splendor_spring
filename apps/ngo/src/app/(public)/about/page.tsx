import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { PageHero } from "@/components/page-hero";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const settings = await getSettings(["org_name", "mission", "vision", "values", "org_intro"]);
  const page = await db.contentPage.findFirst({
    where: { slug: "about", status: "PUBLISHED" },
  });

  return (
    <>
      <PageHero
        eyebrow="Organisation"
        title={`About ${settings.org_name}`}
        subtitle="Mission, vision, and the story behind the work."
      />
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
        <div
          className="space-y-3 text-ink/80"
          dangerouslySetInnerHTML={{ __html: page?.content || settings.org_intro }}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Mission", settings.mission],
            ["Vision", settings.vision],
            ["Values", settings.values],
          ].map(([title, body]) => (
            <section key={title} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <h2 className="font-display text-xl text-ocean">{title}</h2>
              <div
                className="mt-3 text-sm text-ink/75"
                dangerouslySetInnerHTML={{
                  __html: body || "<p>Content will be published by administrators.</p>",
                }}
              />
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

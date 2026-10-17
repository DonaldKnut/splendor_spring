import Link from "next/link";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { PageHero } from "@/components/page-hero";

export const metadata = { title: "Programmes" };

export default async function ProgrammesPage() {
  const items = await db.programme.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="Programmes & projects"
        subtitle="Published initiatives managed by the organisation."
      />
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
        {items.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/programmes/${item.slug}`}
                className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal hover:shadow-md"
              >
                <h2 className="font-display text-xl">{item.title}</h2>
                <p className="mt-2 text-sm text-ink/70">
                  {item.summary || item.content.replace(/<[^>]+>/g, "").slice(0, 160)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No programmes published yet" />
        )}
      </div>
    </>
  );
}

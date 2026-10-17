import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHero } from "@/components/page-hero";

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await db.programme.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!item) notFound();

  return (
    <>
      <PageHero title={item.title} subtitle={item.summary || undefined} eyebrow="Programme" />
      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
        <div
          className="space-y-3 text-ink/80"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </article>
    </>
  );
}

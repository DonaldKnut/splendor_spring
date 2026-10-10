import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHero } from "@/components/page-hero";

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await db.contentPage.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!page) notFound();

  return (
    <>
      <PageHero title={page.title} subtitle={page.excerpt || undefined} />
      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
        <div
          className="prose-school space-y-3"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </>
  );
}

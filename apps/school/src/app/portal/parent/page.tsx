import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { SignOutButton } from "@/components/sign-out-button";

export default async function ParentPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PARENT") redirect("/login");

  const parent = await db.parentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      children: {
        include: {
          student: { include: { class: true } },
        },
      },
    },
  });
  if (!parent) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex justify-end no-print">
        <SignOutButton />
      </div>
      <PageHeader
        title="Parent portal"
        description="View published results for your linked children only."
      />
      {parent.children.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {parent.children.map((link) => (
            <Card key={link.id}>
              <h2 className="font-display text-lg">
                {link.student.firstName} {link.student.lastName}
              </h2>
              <p className="text-sm text-ink/65">
                {link.student.admissionNumber}
                {link.student.class ? ` · ${link.student.class.name}` : ""}
              </p>
              <Link
                href={`/portal/parent/${link.student.id}`}
                className="mt-3 inline-block text-sm font-semibold text-forest underline"
              >
                View results
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No linked students"
          description="Ask the school administrator to link your children to this account."
        />
      )}
    </div>
  );
}

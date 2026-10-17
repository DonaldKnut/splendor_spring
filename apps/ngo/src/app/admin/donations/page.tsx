import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import { guardPage } from "@/lib/guard";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { ExportDonationsButton } from "@/components/export-donations";

export default async function DonationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await guardPage(() => requirePermission("view_donations"));
  const sp = await searchParams;
  const where: {
    status?: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "ABANDONED";
    OR?: Array<Record<string, unknown>>;
  } = {};
  if (sp.status) where.status = sp.status as typeof where.status;
  if (sp.q) {
    where.OR = [
      { reference: { contains: sp.q } },
      { donorEmail: { contains: sp.q } },
      { donorName: { contains: sp.q } },
    ];
  }

  const donations = await db.donation.findMany({
    where,
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <PageHeader
        title="Donations"
        description="Only SUCCESS records are provider-verified. Manual success marking is not allowed."
      />
      <Card className="mb-4">
        <form className="flex flex-wrap gap-2">
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Search reference / email / name"
            className="rounded-md border border-line px-3 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="rounded-md border border-line px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="ABANDONED">ABANDONED</option>
          </select>
          <button className="rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white">
            Filter
          </button>
          <ExportDonationsButton />
        </form>
      </Card>
      {donations.length ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-sand/50">
              <tr>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Donor</th>
                <th className="px-3 py-2">Campaign</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-line/70">
                  <td className="px-3 py-2">{d.reference}</td>
                  <td className="px-3 py-2">
                    {d.amount} {d.currency}
                  </td>
                  <td className="px-3 py-2">{d.status}</td>
                  <td className="px-3 py-2">
                    {d.anonymous ? "Anonymous" : `${d.donorName ?? "—"} (${d.donorEmail})`}
                  </td>
                  <td className="px-3 py-2">{d.campaign?.title ?? "—"}</td>
                  <td className="px-3 py-2">{new Date(d.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No donations found" />
      )}
    </div>
  );
}

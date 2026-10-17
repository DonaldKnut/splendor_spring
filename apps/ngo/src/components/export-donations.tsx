"use client";

import { useTransition } from "react";
import { exportDonationsCsv } from "@/lib/actions/donations";
import { Button } from "@/components/ui";

export function ExportDonationsButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const csv = await exportDonationsCsv();
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `donations-${Date.now()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        })
      }
    >
      {pending ? "Exporting..." : "Export CSV"}
    </Button>
  );
}

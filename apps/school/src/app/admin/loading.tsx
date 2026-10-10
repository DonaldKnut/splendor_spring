import { BrandSpinner } from "@/components/brand-spinner";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-16">
      <BrandSpinner size="xl" label="Loading school admin…" />
    </div>
  );
}

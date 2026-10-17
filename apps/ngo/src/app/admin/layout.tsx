import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
import { SessionProvider } from "@/components/session-provider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "HEAD_ADMIN" && session.user.role !== "SUB_ADMIN") {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col md:flex-row" style={{ background: "#f5f7f8" }}>
        <AdminNav
          name={session.user.name}
          role={session.user.role}
          permissions={session.user.permissions}
        />
        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}

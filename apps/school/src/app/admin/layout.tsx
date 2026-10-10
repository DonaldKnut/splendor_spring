import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/components/session-provider";
import { AdminNav } from "@/components/admin-nav";
import { AdminTourProvider, TourLaunchButton } from "@/components/admin-guide";
import { AdminScrollLock } from "@/components/admin-scroll-lock";
import { authOptions } from "@/lib/auth";
import type { Permission } from "@/lib/permissions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (
    session.user.role !== "HEAD_ADMIN" &&
    session.user.role !== "SUB_ADMIN" &&
    session.user.role !== "TEACHER"
  ) {
    redirect("/portal");
  }

  return (
    <SessionProvider>
      <AdminTourProvider role={session.user.role}>
        <AdminScrollLock />
        <div
          className="admin-shell flex h-svh max-h-svh flex-col overflow-hidden md:flex-row"
          style={{ background: "var(--c-surface-2)" }}
        >
          <AdminNav
            role={session.user.role}
            permissions={session.user.permissions as Permission[]}
            name={session.user.name}
            email={session.user.email ?? ""}
          />
          <div className="admin-main min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
            <div className="admin-main-inner mx-auto max-w-7xl px-2.5 py-4 min-[300px]:px-3 min-[360px]:px-4 sm:px-5 sm:py-6 md:px-8 md:py-8">
              {children}
            </div>
          </div>
          <TourLaunchButton variant="fab" />
        </div>
      </AdminTourProvider>
    </SessionProvider>
  );
}

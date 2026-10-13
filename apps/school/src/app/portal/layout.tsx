import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/components/session-provider";
import { PortalTourProvider } from "@/components/portal-guide";
import { authOptions } from "@/lib/auth";
import type { PortalRole } from "@/lib/portal-tour-steps";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const portalRole: PortalRole | null =
    role === "STUDENT" || role === "PARENT" || role === "TEACHER" ? role : null;

  return (
    <SessionProvider>
      {portalRole ? (
        <PortalTourProvider role={portalRole}>{children}</PortalTourProvider>
      ) : (
        children
      )}
    </SessionProvider>
  );
}

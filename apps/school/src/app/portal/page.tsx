import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PortalIndexPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  switch (session.user.role) {
    case "HEAD_ADMIN":
    case "SUB_ADMIN":
    case "TEACHER":
      redirect("/admin");
    case "STUDENT":
      redirect("/portal/student");
    case "PARENT":
      redirect("/portal/parent");
    default:
      redirect("/login");
  }
}

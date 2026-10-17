import { redirect } from "next/navigation";
import { AuthError } from "@/lib/rbac";

export async function guardPage<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.status === 401) redirect("/login");
      redirect("/admin");
    }
    throw err;
  }
}

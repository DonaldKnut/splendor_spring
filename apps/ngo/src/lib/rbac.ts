import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { ALL_PERMISSIONS, type Permission } from "./permissions";
import type { SessionUser } from "./auth-types";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new AuthError("Unauthorized", 401);
  if (session.user.status !== "ACTIVE") throw new AuthError("Inactive", 403);
  return session.user;
}

export async function requireRole(...roles: Array<"HEAD_ADMIN" | "SUB_ADMIN">) {
  const user = await requireSession();
  if (!roles.includes(user.role)) throw new AuthError("Forbidden", 403);
  return user;
}

export async function requirePermission(...needed: Permission[]) {
  const user = await requireSession();
  if (user.role === "HEAD_ADMIN") return user;
  const ok = needed.every((p) => user.permissions.includes(p));
  if (!ok) throw new AuthError("Forbidden", 403);
  return user;
}

export function effectivePermissions(user: SessionUser): Permission[] {
  if (user.role === "HEAD_ADMIN") return [...ALL_PERMISSIONS];
  return user.permissions;
}

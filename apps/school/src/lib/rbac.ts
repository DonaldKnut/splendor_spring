import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { ALL_PERMISSIONS, type Permission } from "./permissions";
import type { SessionUser } from "./auth-types";

export async function requireSession(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new AuthError("Unauthorized", 401);
  }
  if (session.user.status !== "ACTIVE") {
    throw new AuthError("Account is inactive", 403);
  }
  return session.user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireSession();
  if (!roles.includes(user.role)) {
    throw new AuthError("Forbidden", 403);
  }
  return user;
}

export async function requirePermission(
  ...needed: Permission[]
): Promise<SessionUser> {
  const user = await requireSession();
  if (user.role === "HEAD_ADMIN") return user;
  if (user.role !== "SUB_ADMIN" && user.role !== "TEACHER") {
    throw new AuthError("Forbidden", 403);
  }
  const has = needed.every((p) => user.permissions.includes(p));
  if (!has) throw new AuthError("Forbidden", 403);
  return user;
}

export function isStaff(role: Role): boolean {
  return role === "HEAD_ADMIN" || role === "SUB_ADMIN" || role === "TEACHER";
}

export function isAdmin(role: Role): boolean {
  return role === "HEAD_ADMIN" || role === "SUB_ADMIN";
}

export function effectivePermissions(user: SessionUser): Permission[] {
  if (user.role === "HEAD_ADMIN") return [...ALL_PERMISSIONS];
  return user.permissions;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

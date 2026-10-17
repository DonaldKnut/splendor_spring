import type { Role } from "@/generated/prisma";
import type { Permission } from "./permissions";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: string;
  mustChangePassword: boolean;
  emailVerified: boolean;
  permissions: Permission[];
};

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
  interface User extends SessionUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: string;
    mustChangePassword: boolean;
    emailVerified: boolean;
    permissions: Permission[];
    lastRefresh?: number;
  }
}

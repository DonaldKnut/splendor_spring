import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { verifyPassword } from "./password";
import type { Permission } from "./permissions";
import "./auth-types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;
        const user = await db.user.findUnique({
          where: { email },
          include: { permissions: true },
        });
        if (!user || user.status !== "ACTIVE") return null;
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;
        if (!user.emailVerifiedAt) return null;
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
          emailVerified: true,
          permissions: user.permissions.map((p) => p.permission as Permission),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.mustChangePassword = user.mustChangePassword;
        token.emailVerified = Boolean(user.emailVerified);
        token.permissions = user.permissions;
      }
      const lastRefresh = (token.lastRefresh as number | undefined) ?? 0;
      const shouldRefresh = !lastRefresh || Date.now() - lastRefresh > 5 * 60 * 1000;
      if (token.id && (user || shouldRefresh)) {
        const fresh = await db.user.findUnique({
          where: { id: token.id as string },
          include: { permissions: true },
        });
        if (!fresh || fresh.status !== "ACTIVE") {
          token.status = "INACTIVE";
        } else {
          token.status = fresh.status;
          token.role = fresh.role;
          token.mustChangePassword = fresh.mustChangePassword;
          token.emailVerified = Boolean(fresh.emailVerifiedAt);
          token.permissions = fresh.permissions.map(
            (p) => p.permission as Permission
          );
          token.name = fresh.name;
          token.email = fresh.email;
        }
        token.lastRefresh = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email as string,
        name: token.name as string,
        role: token.role,
        status: token.status,
        mustChangePassword: token.mustChangePassword,
        emailVerified: Boolean(token.emailVerified),
        permissions: token.permissions ?? [],
      };
      return session;
    },
  },
};

import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { ngoPrisma?: PrismaClient };

export const db =
  globalForPrisma.ngoPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.ngoPrisma = db;

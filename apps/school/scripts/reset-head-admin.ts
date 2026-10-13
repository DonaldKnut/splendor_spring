import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = (
    process.env.SCHOOL_HEAD_ADMIN_EMAIL ?? "admin@splendorschool.local"
  ).toLowerCase();
  const password =
    process.env.SCHOOL_HEAD_ADMIN_PASSWORD ?? "ChangeMeOnFirstLogin!";
  const name = process.env.SCHOOL_HEAD_ADMIN_NAME ?? "Head Administrator";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
      role: "HEAD_ADMIN",
      status: "ACTIVE",
      mustChangePassword: false,
      emailVerifiedAt: new Date(),
    },
    update: {
      name,
      passwordHash,
      role: "HEAD_ADMIN",
      status: "ACTIVE",
      mustChangePassword: false,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(
    JSON.stringify(
      {
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        password,
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

import "dotenv/config";
import bcrypt from "bcrypt";

import {
  UserRole,
  UserStatus,
} from "../generated/prisma/client.js";

import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = "admin@mfchikankari.com";
  const password = "Admin@123";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      firstName: "Admin",
      lastName: "User",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      firstName: "Admin",
      lastName: "User",
      email,
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log("Admin created successfully:", {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    status: admin.status,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
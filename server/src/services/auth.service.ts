import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const PASSWORD_SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  if (input.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: {
        phone: input.phone,
      },
      select: {
        id: true,
      },
    });

    if (existingPhone) {
      throw new Error("PHONE_ALREADY_EXISTS");
    }
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    PASSWORD_SALT_ROUNDS,
  );

  return prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || null,
      passwordHash,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
  });
}
export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("ACCOUNT_NOT_ACTIVE");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const tokenPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const refreshTokenExpiresAt = new Date();
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: refreshTokenExpiresAt,
      },
    }),

    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    }),
  ]);

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
}
import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../lib/prisma.js";
import type {
  ListUsersQuery,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
} from "../schemas/user.schema.js";

const userListSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  emailVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  wholesaleApplication: {
    select: {
      id: true,
      businessName: true,
      status: true,
      reviewedAt: true,
    },
  },
  _count: {
    select: {
      orders: true,
    },
  },
} satisfies Prisma.UserSelect;

const userDetailsSelect = {
  ...userListSelect,
  emailVerifiedAt: true,
  passwordChangedAt: true,
  wholesaleApplication: true,
  orders: {
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
    },
  },
} satisfies Prisma.UserSelect;

export async function listUsers(
  query: ListUsersQuery,
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;
  const search = query.search?.trim();

  const where: Prisma.UserWhereInput = {
    ...(query.role
      ? {
          role: query.role,
        }
      : {}),

    ...(query.status
      ? {
          status: query.status,
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: userListSelect,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(
  userId: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userDetailsSelect,
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}

export async function updateUserStatus(
  userId: string,
  input: UpdateUserStatusInput,
  currentAdminId: string,
) {
  if (userId === currentAdminId) {
    throw new Error(
      "ADMIN_CANNOT_CHANGE_OWN_STATUS",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (
    user.role === "ADMIN" &&
    input.status !== "ACTIVE"
  ) {
    throw new Error(
      "ADMIN_ACCOUNT_CANNOT_BE_DISABLED",
    );
  }

  if (user.status === input.status) {
    throw new Error(
      "USER_STATUS_ALREADY_SET",
    );
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: input.status,
    },
    select: userListSelect,
  });
}

export async function updateUserRole(
  userId: string,
  input: UpdateUserRoleInput,
  currentAdminId: string,
) {
  if (userId === currentAdminId) {
    throw new Error(
      "ADMIN_CANNOT_CHANGE_OWN_ROLE",
    );
  }

  return prisma.$transaction(
    async (transaction) => {
      const user =
        await transaction.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            role: true,
            status: true,
            wholesaleApplication: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      if (user.status === "DELETED") {
        throw new Error(
          "DELETED_USER_ROLE_CANNOT_BE_CHANGED",
        );
      }

      if (user.role === input.role) {
        throw new Error(
          "USER_ROLE_ALREADY_SET",
        );
      }

      if (input.role === "WHOLESALE") {
        if (
          !user.wholesaleApplication ||
          user.wholesaleApplication.status !==
            "APPROVED"
        ) {
          throw new Error(
            "WHOLESALE_APPLICATION_NOT_APPROVED",
          );
        }
      }

      const updatedUser =
        await transaction.user.update({
          where: {
            id: userId,
          },
          data: {
            role: input.role,
          },
          select: userListSelect,
        });

      if (
        input.role === "CUSTOMER" &&
        user.wholesaleApplication?.status ===
          "APPROVED"
      ) {
        await transaction.wholesaleApplication.update({
          where: {
            userId,
          },
          data: {
            status: "REJECTED",
            reviewedAt: new Date(),
            rejectionReason:
              "Wholesale access removed by administrator.",
          },
        });
      }

      return updatedUser;
    },
  );
}
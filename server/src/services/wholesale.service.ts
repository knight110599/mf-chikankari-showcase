import { prisma } from "../lib/prisma.js";
import type {
  CreateWholesaleApplicationInput,
  ListWholesaleApplicationsQuery,
  ReviewWholesaleApplicationInput,
} from "../schemas/wholesale.schema.js";

export async function createWholesaleApplication(
  userId: string,
  input: CreateWholesaleApplicationInput,
) {
  const user = await prisma.user.findUnique({
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

  if (user.status !== "ACTIVE") {
    throw new Error("USER_INACTIVE");
  }

  if (user.role === "ADMIN") {
    throw new Error("ADMIN_CANNOT_APPLY");
  }

  if (user.role === "WHOLESALE") {
    throw new Error("ALREADY_WHOLESALE");
  }

  if (user.wholesaleApplication) {
    if (user.wholesaleApplication.status === "PENDING") {
      throw new Error("APPLICATION_ALREADY_PENDING");
    }

    if (user.wholesaleApplication.status === "APPROVED") {
      throw new Error("APPLICATION_ALREADY_APPROVED");
    }

    return prisma.wholesaleApplication.update({
      where: {
        userId,
      },
      data: {
        businessName: input.businessName,
        businessType: input.businessType,
        businessPhone: input.businessPhone,
        businessEmail: input.businessEmail,
        gstNumber: input.gstNumber,
        panNumber: input.panNumber,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        expectedMonthlyOrderValue:
          input.expectedMonthlyOrderValue,
        notes: input.notes,
        status: "PENDING",
        reviewedAt: null,
        rejectionReason: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });
  }

  return prisma.wholesaleApplication.create({
    data: {
      userId,
      businessName: input.businessName,
      businessType: input.businessType,
      businessPhone: input.businessPhone,
      businessEmail: input.businessEmail,
      gstNumber: input.gstNumber,
      panNumber: input.panNumber,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      country: input.country,
      expectedMonthlyOrderValue:
        input.expectedMonthlyOrderValue,
      notes: input.notes,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });
}

export async function getMyWholesaleApplication(
  userId: string,
) {
  return prisma.wholesaleApplication.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
        },
      },
    },
  });
}

export async function listWholesaleApplications(
  query: ListWholesaleApplicationsQuery,
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const search = query.search?.trim();

  const where = {
    ...(query.status
      ? {
          status: query.status,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              businessName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              businessEmail: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              businessPhone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              gstNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              panNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              user: {
                is: {
                  OR: [
                    {
                      firstName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      lastName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      email: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      phone: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                },
              },
            },
          ],
        }
      : {}),
  };

  const [applications, total] = await Promise.all([
    prisma.wholesaleApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.wholesaleApplication.count({
      where,
    }),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getWholesaleApplicationById(
  applicationId: string,
) {
  const application =
    await prisma.wholesaleApplication.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        user: {
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
            updatedAt: true,
          },
        },
      },
    });

  if (!application) {
    throw new Error("APPLICATION_NOT_FOUND");
  }

  return application;
}

export async function reviewWholesaleApplication(
  applicationId: string,
  input: ReviewWholesaleApplicationInput,
) {
  return prisma.$transaction(async (transaction) => {
    const application =
      await transaction.wholesaleApplication.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              status: true,
            },
          },
        },
      });

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    if (application.user.status !== "ACTIVE") {
      throw new Error("USER_INACTIVE");
    }

    if (input.action === "APPROVE") {
      if (application.status === "APPROVED") {
        throw new Error("APPLICATION_ALREADY_APPROVED");
      }

      await transaction.user.update({
        where: {
          id: application.userId,
        },
        data: {
          role: "WHOLESALE",
        },
      });

      return transaction.wholesaleApplication.update({
        where: {
          id: applicationId,
        },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          rejectionReason: null,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              role: true,
              status: true,
            },
          },
        },
      });
    }

    if (application.status === "REJECTED") {
      throw new Error("APPLICATION_ALREADY_REJECTED");
    }

    await transaction.user.update({
      where: {
        id: application.userId,
      },
      data: {
        role: "CUSTOMER",
      },
    });

    return transaction.wholesaleApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: "REJECTED",
        reviewedAt: new Date(),
        rejectionReason: input.rejectionReason,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        },
      },
    });
  });
}
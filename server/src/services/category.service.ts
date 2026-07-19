import { prisma } from "../lib/prisma.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema.js";

interface GetCategoriesOptions {
  includeInactive?: boolean;
  page: number;
  limit: number;
  search?: string;
}

export async function createCategory(
  input: CreateCategoryInput,
) {
  return prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function getCategories(
  options: GetCategoriesOptions,
) {
  const {
    includeInactive = false,
    page,
    limit,
    search,
  } = options;

  const skip = (page - 1) * limit;

  const where = {
    ...(!includeInactive && {
      isActive: true,
    }),
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),

    prisma.category.count({
      where,
    }),
  ]);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return category;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
) {
  await getCategoryById(id);

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      ...(input.name !== undefined && {
        name: input.name,
      }),
      ...(input.slug !== undefined && {
        slug: input.slug,
      }),
      ...(input.description !== undefined && {
        description: input.description || null,
      }),
      ...(input.imageUrl !== undefined && {
        imageUrl: input.imageUrl || null,
      }),
      ...(input.isActive !== undefined && {
        isActive: input.isActive,
      }),
      ...(input.sortOrder !== undefined && {
        sortOrder: input.sortOrder,
      }),
    },
  });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (category._count.products > 0) {
    throw new Error("CATEGORY_HAS_PRODUCTS");
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
}
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema.js";

interface GetProductsOptions {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  featured?: boolean;
  newArrival?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy: "createdAt" | "name" | "price" | "stock";
  sortOrder: "asc" | "desc";
}

export async function createProduct(
  input: CreateProductInput,
) {
  const category = await prisma.category.findUnique({
    where: {
      id: input.categoryId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (!category.isActive) {
    throw new Error("CATEGORY_INACTIVE");
  }

  const primaryImages =
    input.images?.filter((image) => image.isPrimary) ?? [];

  if (primaryImages.length > 1) {
    throw new Error("MULTIPLE_PRIMARY_IMAGES");
  }

  return prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      sku: input.sku,
      shortDescription: input.shortDescription || null,
      description: input.description || null,
      price: new Prisma.Decimal(input.price),
      wholesalePrice:
        input.wholesalePrice !== undefined
          ? new Prisma.Decimal(input.wholesalePrice)
          : null,
      stock: input.stock ?? 0,
      minimumWholesaleQuantity:
        input.minimumWholesaleQuantity ?? null,
      fabric: input.fabric || null,
      sizes: input.sizes,
      status: input.status ?? "DRAFT",
isFeatured: input.isFeatured ?? false,
isNewArrival: input.isNewArrival ?? false,
categoryId: input.categoryId,

      images:
        input.images && input.images.length > 0
          ? {
              create: input.images.map((image, index) => ({
                url: image.url,
                altText: image.altText || null,
                sortOrder: image.sortOrder ?? index,
                isPrimary:
                  image.isPrimary ??
                  (primaryImages.length === 0 && index === 0),
              })),
            }
          : undefined,
    },

    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getProducts(
  options: GetProductsOptions,
) {
  const {
  page,
  limit,
  search,
  categoryId,
  status,
  featured,
  newArrival,
  minPrice,
  maxPrice,
  inStock,
  sortBy,
  sortOrder,
} = options;

  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(categoryId && {
      categoryId,
    }),

    ...(status && {
      status,
    }),

    ...(featured !== undefined && {
      isFeatured: featured,
    }),

    ...(newArrival !== undefined && {
      isNewArrival: newArrival,
    }),

    ...((minPrice !== undefined ||
      maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && {
          gte: new Prisma.Decimal(minPrice),
        }),
        ...(maxPrice !== undefined && {
          lte: new Prisma.Decimal(maxPrice),
        }),
      },
    }),

    ...(inStock !== undefined && {
      stock: inStock
        ? {
            gt: 0,
          }
        : {
            equals: 0,
          },
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        [sortBy]: sortOrder,
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return product;
}
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (
    !product ||
    product.status !== "ACTIVE"
  ) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return product;
}
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
) {
  const existingProduct = await getProductById(id);

  if (input.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: {
        id: input.categoryId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!category) {
      throw new Error("CATEGORY_NOT_FOUND");
    }

    if (!category.isActive) {
      throw new Error("CATEGORY_INACTIVE");
    }
  }

  const primaryImages =
    input.images?.filter((image) => image.isPrimary) ?? [];

  if (primaryImages.length > 1) {
    throw new Error("MULTIPLE_PRIMARY_IMAGES");
  }

  return prisma.$transaction(async (transaction) => {
    if (input.images !== undefined) {
      await transaction.productImage.deleteMany({
        where: {
          productId: id,
        },
      });
    }

    return transaction.product.update({
      where: {
        id: existingProduct.id,
      },

      data: {
        ...(input.name !== undefined && {
          name: input.name,
        }),

        ...(input.slug !== undefined && {
          slug: input.slug,
        }),

        ...(input.sku !== undefined && {
          sku: input.sku,
        }),

        ...(input.shortDescription !== undefined && {
          shortDescription: input.shortDescription || null,
        }),

        ...(input.description !== undefined && {
          description: input.description || null,
        }),

        ...(input.price !== undefined && {
          price: new Prisma.Decimal(input.price),
        }),

        ...(input.wholesalePrice !== undefined && {
          wholesalePrice:
            input.wholesalePrice === null
              ? null
              : new Prisma.Decimal(input.wholesalePrice),
        }),

        ...(input.stock !== undefined && {
          stock: input.stock,
        }),

        ...(input.minimumWholesaleQuantity !== undefined && {
          minimumWholesaleQuantity:
            input.minimumWholesaleQuantity,
        }),

        ...(input.fabric !== undefined && {
          fabric: input.fabric || null,
        }),

        ...(input.sizes !== undefined && {
          sizes: input.sizes,
        }),

        ...(input.status !== undefined && {
          status: input.status,
        }),

        ...(input.isFeatured !== undefined && {
          isFeatured: input.isFeatured,
        }),

        ...(input.categoryId !== undefined && {
          categoryId: input.categoryId,
        }),

        ...(input.images !== undefined && {
          images:
            input.images.length > 0
              ? {
                  create: input.images.map((image, index) => ({
                    url: image.url,
                    altText: image.altText || null,
                    sortOrder: image.sortOrder ?? index,
                    isPrimary:
                      image.isPrimary ??
                      (primaryImages.length === 0 &&
                        index === 0),
                  })),
                }
              : undefined,
        }),
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  });
}

export async function deleteProduct(id: string) {
  await getProductById(id);

  await prisma.product.delete({
    where: {
      id,
    },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
      category: {
        isActive: true,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 12,

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}
export async function getNewArrivalProducts() {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isNewArrival: true,
      category: {
        isActive: true,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 8,

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}
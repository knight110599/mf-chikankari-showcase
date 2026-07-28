import {
  Prisma,
  StockMovementType,
} from "../../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type {
  AdjustStockInput,
  CreateVariantInput,
  RestockInput,
  UpdateVariantInput,
} from "../schemas/inventory.schema.js";

interface GetInventoryOptions {
  page: number;
  limit: number;
  search?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
}

interface GetInventoryHistoryOptions {
  page: number;
  limit: number;
  type?: StockMovementType;
}

function isPrismaUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

async function getProductOrThrow(
  productId: string,
  transaction: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const product = await transaction.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      sizes: true,
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return product;
}

async function getVariantOrThrow(
  variantId: string,
  transaction: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const variant = await transaction.productVariant.findUnique({
    where: {
      id: variantId,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
  });

  if (!variant) {
    throw new Error("VARIANT_NOT_FOUND");
  }

  return variant;
}

async function synchroniseProductInventory(
  transaction: Prisma.TransactionClient,
  productId: string,
) {
  const variants = await transaction.productVariant.findMany({
    where: {
      productId,
      isActive: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: {
      size: true,
      stock: true,
    },
  });

  const totalStock = variants.reduce(
    (total, variant) => total + variant.stock,
    0,
  );

  const sizes = Array.from(
    new Set(
      variants
        .map((variant) => variant.size.trim())
        .filter(Boolean),
    ),
  );

  await transaction.product.update({
    where: {
      id: productId,
    },
    data: {
      stock: totalStock,
      sizes,
    },
  });
}

async function ensureSingleDefaultVariant(
  transaction: Prisma.TransactionClient,
  productId: string,
  excludedVariantId?: string,
) {
  await transaction.productVariant.updateMany({
    where: {
      productId,
      ...(excludedVariantId && {
        id: {
          not: excludedVariantId,
        },
      }),
      isDefault: true,
    },
    data: {
      isDefault: false,
    },
  });
}

function formatInventoryProduct<
  T extends {
    stock: number;
    variants: Array<{
      stock: number;
      reservedStock: number;
      lowStockThreshold: number;
      isActive: boolean;
    }>;
  },
>(product: T) {
  const activeVariants = product.variants.filter(
    (variant) => variant.isActive,
  );

  const totalVariantStock = activeVariants.reduce(
    (total, variant) => total + variant.stock,
    0,
  );

  const totalReservedStock = activeVariants.reduce(
    (total, variant) => total + variant.reservedStock,
    0,
  );

  const availableStock = Math.max(
    totalVariantStock - totalReservedStock,
    0,
  );

  const lowStockVariants = activeVariants.filter(
    (variant) =>
      variant.stock > 0 &&
      variant.stock <= variant.lowStockThreshold,
  ).length;

  const outOfStockVariants = activeVariants.filter(
    (variant) => variant.stock <= 0,
  ).length;

  return {
    ...product,
    inventorySummary: {
      legacyStock: product.stock,
      totalStock: totalVariantStock,
      reservedStock: totalReservedStock,
      availableStock,
      activeVariants: activeVariants.length,
      lowStockVariants,
      outOfStockVariants,
    },
  };
}

export async function getInventory(
  options: GetInventoryOptions,
) {
  const {
    page,
    limit,
    search,
    lowStock,
    outOfStock,
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
          variants: {
            some: {
              OR: [
                {
                  sku: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  barcode: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  size: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      ],
    }),

    ...(outOfStock === true && {
      variants: {
        some: {
          isActive: true,
          stock: 0,
        },
      },
    }),

    ...(lowStock === true && {
      variants: {
        some: {
          isActive: true,
          stock: {
            gt: 0,
          },
        },
      },
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        updatedAt: "desc",
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
          take: 1,
        },
        variants: {
          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  let formattedProducts = products.map(formatInventoryProduct);

  /*
   * Prisma cannot directly compare one database column against another
   * in a normal where filter. Therefore, exact low-stock comparison is
   * performed after fetching the records.
   */
  if (lowStock === true) {
    formattedProducts = formattedProducts.filter((product) =>
      product.variants.some(
        (variant) =>
          variant.isActive &&
          variant.stock > 0 &&
          variant.stock <= variant.lowStockThreshold,
      ),
    );
  }

  return {
    products: formattedProducts,
    pagination: {
      page,
      limit,
      total:
        lowStock === true
          ? formattedProducts.length
          : total,
      totalPages:
        lowStock === true
          ? Math.ceil(formattedProducts.length / limit)
          : Math.ceil(total / limit),
    },
  };
}

export async function getProductInventory(
  productId: string,
) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
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
      variants: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return formatInventoryProduct(product);
}

export async function getProductInventoryHistory(
  productId: string,
  options: GetInventoryHistoryOptions,
) {
  await getProductOrThrow(productId);

  const {
    page,
    limit,
    type,
  } = options;

  const skip = (page - 1) * limit;

  const where: Prisma.StockMovementWhereInput = {
    productId,
    ...(type && {
      type,
    }),
  };

  const [movements, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        variant: {
          select: {
            id: true,
            size: true,
            sku: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),

    prisma.stockMovement.count({
      where,
    }),
  ]);

  return {
    movements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createProductVariant(
  productId: string,
  input: CreateVariantInput,
  createdById?: string,
) {
  try {
    return await prisma.$transaction(async (transaction) => {
      const product = await getProductOrThrow(
        productId,
        transaction,
      );

      if (input.reservedStock > input.stock) {
        throw new Error(
          "RESERVED_STOCK_EXCEEDS_STOCK",
        );
      }

      if (input.isDefault) {
        await ensureSingleDefaultVariant(
          transaction,
          productId,
        );
      }

      const existingVariantCount =
        await transaction.productVariant.count({
          where: {
            productId,
          },
        });

      const variant =
        await transaction.productVariant.create({
          data: {
            productId,
            size: input.size,
            sku: input.sku,
            barcode: input.barcode || null,
            stock: input.stock,
            reservedStock: input.reservedStock,
            lowStockThreshold:
              input.lowStockThreshold,
            costPrice:
              input.costPrice !== undefined
                ? new Prisma.Decimal(input.costPrice)
                : null,
            weightGrams: input.weightGrams ?? null,
            isDefault:
              input.isDefault ||
              existingVariantCount === 0,
            isActive: input.isActive,
            sortOrder: input.sortOrder,
          },
        });

      if (variant.stock > 0) {
        await transaction.stockMovement.create({
          data: {
            productId,
            variantId: variant.id,
            createdById: createdById ?? null,
            type: StockMovementType.INITIAL_STOCK,
            quantity: variant.stock,
            previousStock: 0,
            newStock: variant.stock,
            productNameSnapshot: product.name,
            productSkuSnapshot: product.sku,
            variantSizeSnapshot: variant.size,
            variantSkuSnapshot: variant.sku,
            reference: "Variant creation",
            note: "Initial stock recorded when variant was created.",
          },
        });
      }

      await synchroniseProductInventory(
        transaction,
        productId,
      );

      return transaction.productVariant.findUnique({
        where: {
          id: variant.id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              stock: true,
              sizes: true,
            },
          },
        },
      });
    });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(",")
        : String(error.meta?.target ?? "");

      if (target.includes("barcode")) {
        throw new Error("BARCODE_ALREADY_EXISTS");
      }

      if (
        target.includes("productId") &&
        target.includes("size")
      ) {
        throw new Error("VARIANT_SIZE_ALREADY_EXISTS");
      }

      throw new Error("VARIANT_SKU_ALREADY_EXISTS");
    }

    throw error;
  }
}

export async function updateProductVariant(
  variantId: string,
  input: UpdateVariantInput,
) {
  try {
    return await prisma.$transaction(async (transaction) => {
      const existingVariant = await getVariantOrThrow(
        variantId,
        transaction,
      );

      if (input.isDefault === true) {
        await ensureSingleDefaultVariant(
          transaction,
          existingVariant.productId,
          variantId,
        );
      }

      if (
        input.isDefault === false &&
        existingVariant.isDefault
      ) {
        const anotherActiveVariant =
          await transaction.productVariant.findFirst({
            where: {
              productId: existingVariant.productId,
              id: {
                not: variantId,
              },
              isActive: true,
            },
            orderBy: [
              {
                sortOrder: "asc",
              },
              {
                createdAt: "asc",
              },
            ],
            select: {
              id: true,
            },
          });

        if (anotherActiveVariant) {
          await transaction.productVariant.update({
            where: {
              id: anotherActiveVariant.id,
            },
            data: {
              isDefault: true,
            },
          });
        }
      }

      if (
        input.isActive === false &&
        existingVariant.reservedStock > 0
      ) {
        throw new Error(
          "VARIANT_HAS_RESERVED_STOCK",
        );
      }

      const variant =
        await transaction.productVariant.update({
          where: {
            id: variantId,
          },
          data: {
            ...(input.sku !== undefined && {
              sku: input.sku,
            }),

            ...(input.barcode !== undefined && {
              barcode: input.barcode || null,
            }),

            ...(input.lowStockThreshold !== undefined && {
              lowStockThreshold:
                input.lowStockThreshold,
            }),

            ...(input.costPrice !== undefined && {
              costPrice: new Prisma.Decimal(
                input.costPrice,
              ),
            }),

            ...(input.weightGrams !== undefined && {
              weightGrams: input.weightGrams,
            }),

            ...(input.isDefault !== undefined && {
              isDefault: input.isDefault,
            }),

            ...(input.isActive !== undefined && {
              isActive: input.isActive,
            }),

            ...(input.sortOrder !== undefined && {
              sortOrder: input.sortOrder,
            }),
          },
        });

      if (
        input.isActive === false &&
        variant.isDefault
      ) {
        const replacement =
          await transaction.productVariant.findFirst({
            where: {
              productId: variant.productId,
              id: {
                not: variant.id,
              },
              isActive: true,
            },
            orderBy: [
              {
                sortOrder: "asc",
              },
              {
                createdAt: "asc",
              },
            ],
          });

        await transaction.productVariant.update({
          where: {
            id: variant.id,
          },
          data: {
            isDefault: false,
          },
        });

        if (replacement) {
          await transaction.productVariant.update({
            where: {
              id: replacement.id,
            },
            data: {
              isDefault: true,
            },
          });
        }
      }

      await synchroniseProductInventory(
        transaction,
        existingVariant.productId,
      );

      return transaction.productVariant.findUnique({
        where: {
          id: variantId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              stock: true,
              sizes: true,
            },
          },
        },
      });
    });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(",")
        : String(error.meta?.target ?? "");

      if (target.includes("barcode")) {
        throw new Error("BARCODE_ALREADY_EXISTS");
      }

      throw new Error("VARIANT_SKU_ALREADY_EXISTS");
    }

    throw error;
  }
}

export async function restockProductVariant(
  variantId: string,
  input: RestockInput,
  createdById?: string,
) {
  return prisma.$transaction(async (transaction) => {
    const variant = await getVariantOrThrow(
      variantId,
      transaction,
    );

    if (!variant.isActive) {
      throw new Error("VARIANT_INACTIVE");
    }

    const previousStock = variant.stock;
    const newStock = previousStock + input.quantity;

    const updatedVariant =
      await transaction.productVariant.update({
        where: {
          id: variantId,
        },
        data: {
          stock: newStock,
        },
      });

    await transaction.stockMovement.create({
      data: {
        productId: variant.productId,
        variantId: variant.id,
        createdById: createdById ?? null,
        type: StockMovementType.RESTOCK,
        quantity: input.quantity,
        previousStock,
        newStock,
        productNameSnapshot: variant.product.name,
        productSkuSnapshot: variant.product.sku,
        variantSizeSnapshot: variant.size,
        variantSkuSnapshot: variant.sku,
        reference: "Manual restock",
        note: input.note || null,
      },
    });

    await synchroniseProductInventory(
      transaction,
      variant.productId,
    );

    return updatedVariant;
  });
}

export async function adjustProductVariantStock(
  variantId: string,
  input: AdjustStockInput,
  createdById?: string,
) {
  if (input.quantity === 0) {
    throw new Error("ZERO_STOCK_ADJUSTMENT");
  }

  return prisma.$transaction(async (transaction) => {
    const variant = await getVariantOrThrow(
      variantId,
      transaction,
    );

    if (!variant.isActive) {
      throw new Error("VARIANT_INACTIVE");
    }

    const previousStock = variant.stock;
    const newStock = previousStock + input.quantity;

    if (newStock < 0) {
      throw new Error("INSUFFICIENT_STOCK");
    }

    if (newStock < variant.reservedStock) {
      throw new Error(
        "STOCK_BELOW_RESERVED_QUANTITY",
      );
    }

    const movementType =
      input.quantity > 0
        ? StockMovementType.MANUAL_INCREASE
        : StockMovementType.MANUAL_DECREASE;

    const updatedVariant =
      await transaction.productVariant.update({
        where: {
          id: variantId,
        },
        data: {
          stock: newStock,
        },
      });

    await transaction.stockMovement.create({
      data: {
        productId: variant.productId,
        variantId: variant.id,
        createdById: createdById ?? null,
        type: movementType,
        quantity: input.quantity,
        previousStock,
        newStock,
        productNameSnapshot: variant.product.name,
        productSkuSnapshot: variant.product.sku,
        variantSizeSnapshot: variant.size,
        variantSkuSnapshot: variant.sku,
        reference: "Manual stock adjustment",
        note: input.note || null,
      },
    });

    await synchroniseProductInventory(
      transaction,
      variant.productId,
    );

    return updatedVariant;
  });
}
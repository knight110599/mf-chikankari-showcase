import { prisma } from "../lib/prisma.js";

type UserRole = "CUSTOMER" | "WHOLESALE" | "ADMIN";

type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type PaymentStatus =
  | "UNPAID"
  | "PAYMENT_PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

type OrderSource =
  | "WEBSITE"
  | "WHATSAPP"
  | "ADMIN";

interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  selectedSize?: string;
}

interface CreateOrderInput {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  orderNotes?: string;
  items: CreateOrderItemInput[];
}

interface CreateOrderOptions {
  userId?: string;
  userRole?: UserRole;
}

interface GetOrdersInput {
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  source?: OrderSource;
  sortOrder?: "asc" | "desc";
}

interface UpdateOrderStatusInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
        },
      },
    },
  },
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
} as const;

function generateOrderNumber(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const randomPart = Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase();

  return `MF-${year}${month}${day}-${randomPart}`;
}

function getPrimaryImage(
  images: Array<{
    url: string;
    isPrimary: boolean;
    sortOrder: number;
  }>,
): string | null {
  if (images.length === 0) {
    return null;
  }

  const primaryImage = images.find(
    (image) => image.isPrimary,
  );

  if (primaryImage) {
    return primaryImage.url;
  }

  const sortedImages = [...images].sort(
    (firstImage, secondImage) =>
      firstImage.sortOrder - secondImage.sortOrder,
  );

  return sortedImages[0]?.url ?? null;
}

function getProductUnitPrice(
  product: {
    price: unknown;
    wholesalePrice: unknown;
    minimumWholesaleQuantity: number | null;
  },
  quantity: number,
  userRole?: UserRole,
): number {
  const regularPrice = Number(product.price);

  const wholesalePrice =
    product.wholesalePrice !== null
      ? Number(product.wholesalePrice)
      : null;

  const minimumWholesaleQuantity =
    product.minimumWholesaleQuantity ?? 1;

  const qualifiesForWholesale =
    userRole === "WHOLESALE" &&
    wholesalePrice !== null &&
    quantity >= minimumWholesaleQuantity;

  return qualifiesForWholesale
    ? wholesalePrice
    : regularPrice;
}

function isUniqueConstraintError(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error)
  ) {
    return false;
  }

  return error.code === "P2002";
}

export async function createOrder(
  input: CreateOrderInput,
  options: CreateOrderOptions = {},
) {
  const productIds = [
    ...new Set(
      input.items.map((item) => item.productId),
    ),
  ];

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      images: {
        select: {
          url: true,
          isPrimary: true,
          sortOrder: true,
        },
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const productsById = new Map(
    products.map((product) => [
      product.id,
      product,
    ]),
  );

  const preparedItems = input.items.map((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    if (product.status !== "ACTIVE") {
      throw new Error(
        `PRODUCT_INACTIVE:${product.name}`,
      );
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `INSUFFICIENT_STOCK:${product.name}`,
      );
    }

    if (
      item.selectedSize &&
      product.sizes.length > 0 &&
      !product.sizes.includes(item.selectedSize)
    ) {
      throw new Error(
        `INVALID_SIZE:${product.name}`,
      );
    }

    const unitPrice = getProductUnitPrice(
      product,
      item.quantity,
      options.userRole,
    );

    const lineTotal =
      Math.round(
        unitPrice * item.quantity * 100,
      ) / 100;

    return {
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      productSlug: product.slug,
      productImage: getPrimaryImage(
        product.images,
      ),
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal =
    Math.round(
      preparedItems.reduce(
        (total, item) => total + item.lineTotal,
        0,
      ) * 100,
    ) / 100;

  const deliveryCharge = 0;

  const total =
    Math.round(
      (subtotal + deliveryCharge) * 100,
    ) / 100;

  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const orderNumber = generateOrderNumber();

      return await prisma.order.create({
        data: {
          orderNumber,
          userId: options.userId,

          customerFirstName:
            input.customerFirstName,
          customerLastName:
            input.customerLastName,
          customerEmail:
            input.customerEmail.toLowerCase(),
          customerPhone: input.customerPhone,

          addressLine1: input.addressLine1,
          addressLine2:
            input.addressLine2 || null,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country || "India",

          orderNotes: input.orderNotes || null,

          subtotal: subtotal.toFixed(2),
          deliveryCharge:
            deliveryCharge.toFixed(2),
          total: total.toFixed(2),

          status: "PENDING_CONFIRMATION",
          paymentStatus: "UNPAID",
          source: "WHATSAPP",

          items: {
            create: preparedItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productSku: item.productSku,
              productSlug: item.productSlug,
              productImage: item.productImage,
              selectedSize:
                item.selectedSize || null,
              quantity: item.quantity,
              unitPrice:
                item.unitPrice.toFixed(2),
              lineTotal:
                item.lineTotal.toFixed(2),
            })),
          },
        },
        include: orderInclude,
      });
    } catch (error) {
      lastError = error;

      if (!isUniqueConstraintError(error)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error(
    "ORDER_CREATION_FAILED",
  );
}

export async function getOrders(
  input: GetOrdersInput,
) {
  const {
    page,
    limit,
    search,
    status,
    paymentStatus,
    source,
    sortOrder = "desc",
  } = input;

  const skip = (page - 1) * limit;

  const where = {
    ...(status ? { status } : {}),
    ...(paymentStatus
      ? { paymentStatus }
      : {}),
    ...(source ? { source } : {}),
    ...(search
      ? {
          OR: [
            {
              orderNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customerFirstName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customerLastName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customerEmail: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customerPhone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [orders, total] =
    await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
        include: orderInclude,
      }),

      prisma.order.count({
        where,
      }),
    ]);

  const totalPages = Math.ceil(total / limit);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getOrderById(
  orderId: string,
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: orderInclude,
  });

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  input: UpdateOrderStatusInput,
) {
  const existingOrder =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        status: true,
      },
    });

  if (!existingOrder) {
    throw new Error("ORDER_NOT_FOUND");
  }

  const now = new Date();

  const timestampData: {
    confirmedAt?: Date | null;
    shippedAt?: Date | null;
    deliveredAt?: Date | null;
    cancelledAt?: Date | null;
  } = {};

  if (input.status === "CONFIRMED") {
    timestampData.confirmedAt = now;
    timestampData.cancelledAt = null;
  }

  if (input.status === "SHIPPED") {
    timestampData.shippedAt = now;
  }

  if (input.status === "DELIVERED") {
    timestampData.deliveredAt = now;
  }

  if (input.status === "CANCELLED") {
    timestampData.cancelledAt = now;
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      ...(input.status
        ? { status: input.status }
        : {}),

      ...(input.paymentStatus
        ? {
            paymentStatus:
              input.paymentStatus,
          }
        : {}),

      ...timestampData,
    },
    include: orderInclude,
  });
}
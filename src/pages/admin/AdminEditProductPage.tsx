import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminProductForm, {
  type ProductFormInitialValues,
} from "../../components/admin/AdminProductForm";
import type { ApiProduct } from "../../services/product.service";

interface ProductApiResponse {
  success: boolean;
  message: string;
  data: ApiProduct;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getPrimaryImageUrl(product: ApiProduct): string {
  if (!Array.isArray(product.images) || product.images.length === 0) {
    return "";
  }

  const primaryImage = product.images.find(
    (image) => image.isPrimary,
  );

  return primaryImage?.url ?? product.images[0]?.url ?? "";
}

function mapProductToFormValues(
  product: ApiProduct,
): ProductFormInitialValues {
  const productWithActivity = product as ApiProduct & {
    isActive?: boolean;
  };

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    category: product.categoryId,
    price: Number(product.price),
    wholesalePrice: Number(product.wholesalePrice ?? 0),
    stock: product.stock,
    fabric: product.fabric ?? "",
    sizes: product.sizes.join(", "),
    featured: product.isFeatured,
    active:
      productWithActivity.isActive ??
      product.status.toUpperCase() === "ACTIVE",
    image: getPrimaryImageUrl(product),
  };
}

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] =
    useState<ProductFormInitialValues | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoadError("Product ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError("");

      try {
        const token = localStorage.getItem("adminAccessToken");

        if (!token) {
          throw new Error(
            "Admin session has expired. Please log in again.",
          );
        }

        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(id)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result =
          (await response.json()) as ProductApiResponse;

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load product.",
          );
        }

        setInitialValues(
          mapProductToFormValues(result.data),
        );
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load product.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-8 text-sm text-[#6D746F] shadow-sm">
        Loading product...
      </div>
    );
  }

  if (loadError || !id || !initialValues) {
    return (
      <section className="rounded-[24px] border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl text-[#0F4C3A]">
          Unable to edit product
        </h1>

        <p className="mt-3 text-sm text-red-700">
          {loadError || "Product data is unavailable."}
        </p>

        <Link
          to="/admin/products"
          className="mt-6 inline-flex rounded-2xl bg-[#0F4C3A] px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Products
        </Link>
      </section>
    );
  }

  return (
    <AdminProductForm
      mode="edit"
      productId={id}
      initialValues={initialValues}
    />
  );
}
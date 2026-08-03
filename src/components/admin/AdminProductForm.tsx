import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  slug: z.string().min(3, "Slug is required"),
  sku: z.string().min(3, "SKU is required"),
  description: z.string().min(10, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(1, "Selling price must be greater than 0"),
  wholesalePrice: z.coerce
    .number()
    .min(0, "Wholesale price cannot be negative")
    .optional(),

  minimumWholesaleQuantity: z.coerce
    .number()
    .int("Minimum wholesale quantity must be a whole number")
    .min(1, "Minimum wholesale quantity must be at least 1"),

  stock: z.coerce
  .number()
  .int("Stock must be a whole number")
  .min(0, "Stock cannot be negative"),

fabric: z.string().optional(),
sizes: z.string().optional(),
featured: z.boolean(),
newArrival: z.boolean(),
status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormData = z.output<typeof productSchema>;

export interface ProductFormInitialValues {
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  wholesalePrice: number;
  minimumWholesaleQuantity: number;
  stock: number;
  fabric: string;
  sizes: string;
  featured: boolean;
  newArrival: boolean;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface CategoriesApiResponse {
  success?: boolean;
  data?: Category[] | { categories?: Category[] };
  categories?: Category[];
}

interface ProductMutationResponse {
  success?: boolean;
  message?: string;
}

interface AdminProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: ProductFormInitialValues;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyValues: ProductFormInitialValues = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  category: "",
  price: 0,
  wholesalePrice: 0,
  minimumWholesaleQuantity: 1,
  stock: 0,
  fabric: "",
  sizes: "",
  featured: false,
  newArrival: false,
  status: "DRAFT",
  image: "",
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15";

function extractCategories(result: CategoriesApiResponse): Category[] {
  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (result.data && "categories" in result.data) {
    return result.data.categories ?? [];
  }

  return result.categories ?? [];
}

export default function AdminProductForm({
  mode,
  productId,
  initialValues = emptyValues,
}: AdminProductFormProps) {
  const navigate = useNavigate();
  const isEditMode = mode === "edit";

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [imageUrl, setImageUrl] = useState(initialValues.image);
const [isUploadingImage, setIsUploadingImage] = useState(false);
const [uploadError, setUploadError] = useState("");
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(isEditMode);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEditMode);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  });

  const productName = watch("name");

  useEffect(() => {
    reset(initialValues);
    setIsSkuManuallyEdited(isEditMode);
    setIsSlugManuallyEdited(isEditMode);
  }, [initialValues, isEditMode, reset]);

  useEffect(() => {
    const slug = productName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const sku = productName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!isSlugManuallyEdited) {
      setValue("slug", slug, {
        shouldValidate: Boolean(slug),
      });
    }

    if (!isSkuManuallyEdited) {
      setValue("sku", sku, {
        shouldValidate: Boolean(sku),
      });
    }
  }, [productName, setValue, isSkuManuallyEdited, isSlugManuallyEdited]);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);

      try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
          throw new Error("Unable to load categories.");
        }

        const result = (await response.json()) as CategoriesApiResponse;
        setCategories(extractCategories(result));
      } catch (error) {
        console.error("Category loading error:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    void loadCategories();
  }, []);
const uploadImage = async (
  event: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setUploadError("");
  setIsUploadingImage(true);

  try {
    const token = localStorage.getItem("adminAccessToken");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Upload failed.");
    }

    setImageUrl(result.image.url);
  } catch (error) {
    setUploadError(
      error instanceof Error ? error.message : "Upload failed.",
    );
  } finally {
    setIsUploadingImage(false);
  }
};
  const onSubmit = async (data: ProductFormData) => {
    if (isEditMode && !productId) {
      setSubmitError("Product ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const token = localStorage.getItem("adminAccessToken");

   const payload = {
  name: data.name.trim(),
  slug: data.slug.trim(),
  sku: data.sku.trim().toUpperCase(),
  description: data.description.trim(),
  categoryId: data.category,
  price: data.price,
  wholesalePrice: data.wholesalePrice ?? 0,
  minimumWholesaleQuantity:
    data.minimumWholesaleQuantity,
  stock: data.stock,
  fabric: data.fabric?.trim() || undefined,
  sizes:
    data.sizes
      ?.split(",")
      .map((size) => size.trim())
      .filter(Boolean) || [],
  isFeatured: data.featured,
  isNewArrival: data.newArrival,
  status: data.status,
  images: imageUrl
    ? [
        {
          url: imageUrl,
          isPrimary: true,
        },
      ]
    : [],
};

const endpoint =
  mode === "edit" && productId
  
    ? `${API_URL}/products/${encodeURIComponent(productId)}`
    : `${API_URL}/products`;

    try {
      const response = await fetch(endpoint, {
  method: mode === "edit" ? "PATCH" : "POST",
  headers: {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  },
  body: JSON.stringify(payload),
});

      const result = (await response.json()) as ProductMutationResponse;

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isEditMode
              ? "Unable to update product."
              : "Unable to create product."),
        );
      }

      navigate("/admin/products", {
        replace: true,
        state: {
          successMessage: isEditMode
            ? "Product updated successfully."
            : "Product created successfully.",
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Unable to update product."
            : "Unable to create product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C3A] transition hover:text-[#B38E49]"
      >
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
          Catalog Management
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#6D746F]">
          {isEditMode
            ? "Update product information, pricing, inventory and storefront details."
            : "Add product information, pricing, inventory and storefront details."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[24px] border border-[#E2D8C7] bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="font-serif text-2xl text-[#0F4C3A]">
            Basic Information
          </h2>
          <p className="mt-1 text-sm text-[#7B837E]">
            Enter the product name, description and category.
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-[#263D35]">
              Product Name
            </span>
            <input
              type="text"
              {...register("name")}
              placeholder="Blue Cotton Chikankari Kurti"
              className={inputClassName}
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#263D35]">
              Slug
            </span>
            <input
              type="text"
              {...register("slug", {
                onChange: () => setIsSlugManuallyEdited(true),
              })}
              placeholder="blue-cotton-chikankari-kurti"
              className={inputClassName}
            />
            {errors.slug && (
              <p className="mt-2 text-xs text-red-600">
                {errors.slug.message}
              </p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#263D35]">SKU</span>
            <input
              type="text"
              {...register("sku", {
                onChange: (event) => {
                  event.target.value = event.target.value.toUpperCase();
                  setIsSkuManuallyEdited(true);
                },
              })}
              placeholder="MF-KURTI-001"
              className={inputClassName}
            />
            {errors.sku && (
              <p className="mt-2 text-xs text-red-600">
                {errors.sku.message}
              </p>
            )}
          </label>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-[#263D35]">
            Description
          </span>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="Enter product description..."
            className={`${inputClassName} resize-none`}
          />
          {errors.description && (
            <p className="mt-2 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-[#263D35]">
            Category
          </span>
          <select
            {...register("category")}
            disabled={isLoadingCategories}
            className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">
              {isLoadingCategories
                ? "Loading categories..."
                : "Select category"}
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-2 text-xs text-red-600">
              {errors.category.message}
            </p>
          )}
        </label>

        <div className="mt-8 border-t border-[#EEE7DC] pt-8">
          <h2 className="font-serif text-2xl text-[#0F4C3A]">Pricing</h2>
          <p className="mt-1 text-sm text-[#7B837E]">
            Set retail and wholesale pricing.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-[#263D35]">
                Selling Price
              </span>
              <input
                type="number"
                min="0"
                step="1"
                {...register("price")}
                placeholder="1499"
                className={inputClassName}
              />
              {errors.price && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.price.message}
                </p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#263D35]">
                Wholesale Price
              </span>
              <input
                type="number"
                min="0"
                step="1"
                {...register("wholesalePrice")}
                placeholder="899"
                className={inputClassName}
              />
              {errors.wholesalePrice && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.wholesalePrice.message}
                </p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#263D35]">
                Minimum Wholesale Quantity
              </span>

              <input
                type="number"
                min="1"
                step="1"
                {...register("minimumWholesaleQuantity")}
                placeholder="5"
                className={inputClassName}
              />

              {errors.minimumWholesaleQuantity && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.minimumWholesaleQuantity.message}
                </p>
              )}
            </label>
          </div>
        </div>

        <div className="mt-8 border-t border-[#EEE7DC] pt-8">
          <h2 className="font-serif text-2xl text-[#0F4C3A]">Inventory</h2>
          <p className="mt-1 text-sm text-[#7B837E]">
            Manage stock availability.
          </p>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-[#263D35]">
              Stock Quantity
            </span>
            <input
              type="number"
              min="0"
              step="1"
              {...register("stock")}
              placeholder="25"
              className={inputClassName}
            />
            {errors.stock && (
              <p className="mt-2 text-xs text-red-600">
                {errors.stock.message}
              </p>
            )}
          </label>
        </div>

        <div className="mt-8 border-t border-[#EEE7DC] pt-8">
          <h2 className="font-serif text-2xl text-[#0F4C3A]">
            Product Details
          </h2>
          <p className="mt-1 text-sm text-[#7B837E]">
            Add fabric, size and storefront information.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-[#263D35]">
                Fabric
              </span>
              <input
                type="text"
                {...register("fabric")}
                placeholder="Cotton"
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#263D35]">
                Sizes
              </span>
              <input
                type="text"
                {...register("sizes")}
                placeholder="S, M, L, XL"
                className={inputClassName}
              />
              <p className="mt-2 text-xs text-[#8A918D]">
                Separate multiple sizes with commas.
              </p>
            </label>
          </div>

          <label className="mt-5 block">
  <span className="text-sm font-semibold text-[#263D35]">
    Product Image
  </span>

  <input
    type="file"
    accept="image/*"
    onChange={uploadImage}
    disabled={isUploadingImage}
    className={inputClassName}
  />

  {isUploadingImage && (
    <p className="mt-2 text-sm text-[#B38E49]">
      Uploading image...
    </p>
  )}

  {uploadError && (
    <p className="mt-2 text-sm text-red-600">
      {uploadError}
    </p>
  )}

  {imageUrl && (
    <img
      src={imageUrl}
      alt="Product preview"
      className="mt-4 h-40 w-40 rounded-xl border border-[#DDD2C0] object-cover"
    />
  )}
</label>

<div className="mt-6 grid gap-4 sm:grid-cols-3">
  <label className="block">
    <span className="text-sm font-semibold text-[#263D35]">
      Product Status
    </span>

    <select {...register("status")} className={inputClassName}>
      <option value="DRAFT">Draft</option>
      <option value="ACTIVE">Active</option>
      <option value="ARCHIVED">Archived</option>
    </select>

    {errors.status && (
      <p className="mt-2 text-xs text-red-600">
        {errors.status.message}
      </p>
    )}
  </label>

  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-4 sm:mt-7">
    <input
      type="checkbox"
      {...register("featured")}
      className="h-5 w-5 accent-[#0F4C3A]"
    />

    <div>
      <p className="text-sm font-semibold text-[#263D35]">
        Featured Product
      </p>
      <p className="mt-1 text-xs text-[#7B837E]">
        Show this product in Featured Pieces.
      </p>
    </div>
  </label>

  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-4 sm:mt-7">
    <input
      type="checkbox"
      {...register("newArrival")}
      className="h-5 w-5 accent-[#0F4C3A]"
    />

    <div>
      <p className="text-sm font-semibold text-[#263D35]">
        New Arrival
      </p>
      <p className="mt-1 text-xs text-[#7B837E]">
        Show this product in The Collection section.
      </p>
    </div>
  </label>
</div>
        </div>

        {submitError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#EEE7DC] pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center rounded-2xl border border-[#DDD2C0] px-6 py-3 text-sm font-semibold text-[#263D35] transition hover:bg-[#F8F5F0]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-[#0F4C3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating Product..."
                : "Saving Product..."
              : isEditMode
                ? "Update Product"
                : "Save Product"}
          </button>
        </div>
      </form>
    </section>
  );
}
import {
  AlertCircle,
  Edit3,
  FolderTree,
  ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

type CategoriesResponse = {
  success?: boolean;
  message?: string;
  data?: Category[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

type CategoryResponse = {
  success?: boolean;
  message?: string;
  data?: Category;
};

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: string;
};

const initialFormState: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  isActive: true,
  sortOrder: "0",
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<
    string | null
  >(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [formData, setFormData] =
    useState<CategoryFormState>(initialFormState);
const [isUploadingImage, setIsUploadingImage] = useState(false);
const [uploadError, setUploadError] = useState("");
    
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/categories?includeInactive=true&limit=100`,
      );

      const result = (await response.json()) as CategoriesResponse;

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load categories.",
        );
      }

      setCategories(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load categories.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...categories]
      .filter((category) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          category.name.toLowerCase().includes(normalizedSearch) ||
          category.slug.toLowerCase().includes(normalizedSearch) ||
          category.description
            ?.toLowerCase()
            .includes(normalizedSearch)
        );
      })
      .sort((firstCategory, secondCategory) => {
        if (firstCategory.sortOrder !== secondCategory.sortOrder) {
          return firstCategory.sortOrder - secondCategory.sortOrder;
        }

        return firstCategory.name.localeCompare(
          secondCategory.name,
        );
      });
  }, [categories, searchTerm]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData(initialFormState);
    setErrorMessage("");
    setSuccessMessage("");
    setUploadError("");
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      isActive: category.isActive,
      sortOrder: String(category.sortOrder ?? 0),
    });

    setErrorMessage("");
    setSuccessMessage("");
    setUploadError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(initialFormState);
    setUploadError("");
  };

  const handleNameChange = (value: string) => {
    setFormData((currentFormData) => {
      const shouldUpdateSlug =
        !editingCategory ||
        currentFormData.slug ===
          generateSlug(currentFormData.name);

      return {
        ...currentFormData,
        name: value,
        slug: shouldUpdateSlug
          ? generateSlug(value)
          : currentFormData.slug,
      };
    });
  };
const uploadImage = async (
  event: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    setUploadError("Please select a valid image file.");
    event.target.value = "";
    return;
  }

  const maxFileSize = 5 * 1024 * 1024;

  if (file.size > maxFileSize) {
    setUploadError("Image size must not exceed 5 MB.");
    event.target.value = "";
    return;
  }

  setUploadError("");
  setErrorMessage("");
  setIsUploadingImage(true);

  try {
    const accessToken = localStorage.getItem("adminAccessToken");

    if (!accessToken) {
      throw new Error("Authentication required.");
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    const response = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: uploadData,
    });

    const result = (await response.json()) as {
      success?: boolean;
      message?: string;
      image?: {
        url?: string;
      };
    };

    if (!response.ok || !result.image?.url) {
      throw new Error(
        result.message || "Unable to upload category image.",
      );
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      imageUrl: result.image?.url || "",
    }));
  } catch (error) {
    setUploadError(
      error instanceof Error
        ? error.message
        : "Unable to upload category image.",
    );
  } finally {
    setIsUploadingImage(false);
    event.target.value = "";
  }
};
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const accessToken = localStorage.getItem("adminAccessToken");

    if (!accessToken) {
      setErrorMessage("Authentication required.");
      return;
    }

    const name = formData.name.trim();
    const slug = formData.slug.trim();
    const description = formData.description.trim();
    const imageUrl = formData.imageUrl.trim();
    const sortOrder = Number(formData.sortOrder);

    if (name.length < 2) {
      setErrorMessage(
        "Category name must contain at least 2 characters.",
      );
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setErrorMessage(
        "Slug can only contain lowercase letters, numbers and hyphens.",
      );
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setErrorMessage(
        "Sort order must be a non-negative integer.",
      );
      return;
    }

    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        setErrorMessage("Image URL must be valid.");
        return;
      }
    }

    const payload = {
      name,
      slug,
      description,
      imageUrl,
      isActive: formData.isActive,
      sortOrder,
    };

    try {
      setIsSaving(true);

      const endpoint = editingCategory
        ? `${API_URL}/categories/${editingCategory.id}`
        : `${API_URL}/categories`;

      const response = await fetch(endpoint, {
        method: editingCategory ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as CategoryResponse;

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Unable to ${
              editingCategory ? "update" : "create"
            } category.`,
        );
      }

      setSuccessMessage(
        result.message ||
          `Category ${
            editingCategory ? "updated" : "created"
          } successfully.`,
      );

      await loadCategories();

      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData(initialFormState);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `Unable to ${
              editingCategory ? "update" : "create"
            } category.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    const accessToken = localStorage.getItem("adminAccessToken");

    if (!accessToken) {
      setErrorMessage("Authentication required.");
      return;
    }

    try {
      setDeletingCategoryId(category.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/categories/${category.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to delete category.",
        );
      }

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) =>
            currentCategory.id !== category.id,
        ),
      );

      setSuccessMessage(
        result.message || "Category deleted successfully.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete category.",
      );
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
            Catalog Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
            Categories
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6D746F]">
            Create, organize and manage product categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F4C3A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B3B2F]"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {errorMessage && !isModalOpen && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle size={19} />
          {errorMessage}
        </div>
      )}

      {successMessage && !isModalOpen && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
        <label className="relative block">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A918D]"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search categories..."
            className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          />
        </label>

        <div className="mt-5 flex items-center justify-between border-t border-[#EEE7DC] pt-4">
          <p className="text-sm text-[#7B837E]">
            Showing{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {filteredCategories.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {categories.length}
            </span>{" "}
            categories
          </p>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-sm font-semibold text-[#B38E49] transition hover:text-[#8E6B2F]"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#E2D8C7] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-[#F8F5F0]">
              <tr className="border-b border-[#E2D8C7] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Slug
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Sort Order
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EEE7DC]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <Loader2
                      size={24}
                      className="mx-auto animate-spin text-[#0F4C3A]"
                    />

                    <p className="mt-3 text-sm text-[#7B837E]">
                      Loading categories...
                    </p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFE8DB] text-[#0F4C3A]">
                      <FolderTree size={25} />
                    </div>

                    <p className="mt-4 font-semibold text-[#263D35]">
                      No categories found
                    </p>

                    <p className="mt-1 text-sm text-[#8A918D]">
                      Create a category or change your search.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-[#FCFAF7]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EFE8DB] text-[#0F4C3A]">
                            <ImageIcon size={21} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="max-w-[260px] truncate text-sm font-semibold text-[#263D35]">
                            {category.name}
                          </p>

                          <p className="mt-1 max-w-[320px] truncate text-xs text-[#8A918D]">
                            {category.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#5E6964]">
                      {category.slug}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-[#263D35]">
                      {category.sortOrder}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {category.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(category)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD2C0] text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
                          title="Edit category"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void handleDelete(category)
                          }
                          disabled={
                            deletingCategoryId === category.id
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete category"
                        >
                          {deletingCategoryId === category.id ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E8DFD1] bg-white px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B38E49]">
                  Category Management
                </p>

                <h2 className="mt-1 font-serif text-3xl text-[#0F4C3A]">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-xl p-2 text-[#65706B] transition hover:bg-[#F4F1EB]"
                aria-label="Close modal"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {errorMessage && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={18} />
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#263D35]">
                    Category Name
                  </span>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      handleNameChange(event.target.value)
                    }
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Women's Kurtis"
                    className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#263D35]">
                    Slug
                  </span>

                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(event) =>
                      setFormData((currentFormData) => ({
                        ...currentFormData,
                        slug: generateSlug(event.target.value),
                      }))
                    }
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="womens-kurtis"
                    className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[#263D35]">
                  Description
                </span>

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      description: event.target.value,
                    }))
                  }
                  maxLength={500}
                  rows={4}
                  placeholder="Describe this category..."
                  className="w-full resize-none rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />

                <p className="text-right text-xs text-[#8A918D]">
                  {formData.description.length}/500
                </p>
              </label>

              <div className="space-y-3">
  <span className="block text-sm font-semibold text-[#263D35]">
    Category Image
  </span>

  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#DDD2C0] bg-[#FCFAF7] px-6 py-8 text-center transition hover:border-[#B38E49] hover:bg-[#F8F5F0]">
    <ImageIcon size={28} className="text-[#0F4C3A]" />

    <span className="mt-3 text-sm font-semibold text-[#263D35]">
      {isUploadingImage
        ? "Uploading image..."
        : formData.imageUrl
          ? "Replace category image"
          : "Upload category image"}
    </span>

    <span className="mt-1 text-xs text-[#8A918D]">
      PNG, JPG or WebP up to 5 MB
    </span>

    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={uploadImage}
      disabled={isUploadingImage || isSaving}
      className="hidden"
    />
  </label>

  {isUploadingImage && (
    <div className="flex items-center gap-2 text-sm text-[#B38E49]">
      <Loader2 size={17} className="animate-spin" />
      Uploading image to Cloudinary...
    </div>
  )}

  {uploadError && (
    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle size={17} />
      {uploadError}
    </div>
  )}

  {formData.imageUrl && (
    <div className="relative overflow-hidden rounded-2xl border border-[#DDD2C0] bg-[#F8F5F0]">
      <img
        src={formData.imageUrl}
        alt="Category preview"
        className="h-48 w-full object-cover"
      />

      <button
        type="button"
        onClick={() =>
          setFormData((currentFormData) => ({
            ...currentFormData,
            imageUrl: "",
          }))
        }
        disabled={isUploadingImage || isSaving}
        className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={15} />
        Remove
      </button>
    </div>
  )}
</div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-[#263D35]">
                    Sort Order
                  </span>

                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={formData.sortOrder}
                    onChange={(event) =>
                      setFormData((currentFormData) => ({
                        ...currentFormData,
                        sortOrder: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                  />
                </label>

                <label className="flex items-center justify-between rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#263D35]">
                      Active Status
                    </p>

                    <p className="mt-1 text-xs text-[#8A918D]">
                      Show category on storefront
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(event) =>
                      setFormData((currentFormData) => ({
                        ...currentFormData,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-5 w-5 accent-[#0F4C3A]"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#EEE7DC] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-2xl border border-[#DDD2C0] px-5 py-3 text-sm font-semibold text-[#5E6964] transition hover:bg-[#F8F5F0] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F4C3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {isUploadingImage
  ? "Uploading Image..."
  : isSaving
    ? "Saving..."
    : editingCategory
      ? "Update Category"
      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
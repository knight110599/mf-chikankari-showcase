import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [fabric, setFabric] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const fabrics = [
    "All",
    ...Array.from(new Set(products.map((product) => product.fabric))),
  ];

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesFabric = fabric === "All" || product.fabric === fabric;

      return matchesSearch && matchesCategory && matchesFabric;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });
  }, [search, category, fabric, sortBy]);

  function clearFilters() {
  setSearch("");
  setCategory("All");
  setFabric("All");
  setSortBy("default");
  setVisibleCount(6);
}
useEffect(() => {
  setVisibleCount(6);
}, [search, category, fabric, sortBy]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-3xl">
        <p
          className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
          style={{ fontFamily: "Poppins" }}
        >
          Shop Collection
        </p>

        <h1
          className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          All Products
        </h1>

        <p
          className="mt-5 text-lg leading-8 text-gray-600"
          style={{ fontFamily: "Poppins" }}
        >
          Explore authentic Lucknowi Chikankari kurtis, suit sets, dupattas
          and handcrafted collections.
        </p>
      </div>

      <div className="mt-10 rounded-[28px] border border-[#E8DCC5] bg-white p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-medium text-[#0F4C3A]"
              style={{ fontFamily: "Poppins" }}
            >
              Search products
            </label>

            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product name..."
              className="h-12 w-full rounded-full border border-[#D9C8A8] bg-[#F8F5F0] px-5 text-sm text-gray-700 outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
              style={{ fontFamily: "Poppins" }}
            />
          </div>

          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-sm font-medium text-[#0F4C3A]"
              style={{ fontFamily: "Poppins" }}
            >
              Category
            </label>

            <select
              id="category-filter"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-full border border-[#D9C8A8] bg-[#F8F5F0] px-4 text-sm text-gray-700 outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
              style={{ fontFamily: "Poppins" }}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="fabric-filter"
              className="mb-2 block text-sm font-medium text-[#0F4C3A]"
              style={{ fontFamily: "Poppins" }}
            >
              Fabric
            </label>

            <select
              id="fabric-filter"
              value={fabric}
              onChange={(event) => setFabric(event.target.value)}
              className="h-12 w-full rounded-full border border-[#D9C8A8] bg-[#F8F5F0] px-4 text-sm text-gray-700 outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
              style={{ fontFamily: "Poppins" }}
            >
              {fabrics.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Fabrics" : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 border-t border-[#E8DCC5] pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label
              htmlFor="sort-products"
              className="mb-2 block text-sm font-medium text-[#0F4C3A]"
              style={{ fontFamily: "Poppins" }}
            >
              Sort products
            </label>

            <select
              id="sort-products"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-12 min-w-[220px] rounded-full border border-[#D9C8A8] bg-[#F8F5F0] px-4 text-sm text-gray-700 outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10"
              style={{ fontFamily: "Poppins" }}
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#0F4C3A] px-6 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
            style={{ fontFamily: "Poppins" }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p
          className="text-sm text-gray-600"
          style={{ fontFamily: "Poppins" }}
        >
          Showing{" "}
          <span className="font-semibold text-[#0F4C3A]">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {visibleCount < filteredProducts.length && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((current) => current + 6)}
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#0F4C3A] px-8 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
                style={{ fontFamily: "Poppins" }}
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-[28px] border border-[#E8DCC5] bg-white p-8 text-center sm:p-12">
          <h2
            className="text-3xl text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            No products found
          </h2>

          <p
            className="mx-auto mt-3 max-w-md leading-7 text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            Try changing your search term or removing some filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex rounded-full bg-[#0F4C3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A3D2F]"
            style={{ fontFamily: "Poppins" }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 12;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        const response = await api.get("/products");
        if (active) setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        if (active) setError(requestError.message || "Failed to load products");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category).filter(Boolean).sort())], [products]);
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = !term || [p.name, p.description, p.category].some((v) => String(v || "").toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [products, search, category, sort]);

  useEffect(() => setPage(1), [search, category, sort]);
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-lg font-semibold">Loading products...</p></div>;
  if (error) return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-lg text-red-600">{error}</p></div>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">The NovaCart collection</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Shop all products</h1>
        <p className="mt-2 text-gray-500">Discover something you'll love.</p>
      </div>
      <div className="mb-8 grid gap-3 rounded-2xl bg-gray-50 p-4 md:grid-cols-[1fr_auto_auto]">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category" className="rounded-lg border border-gray-200 bg-white px-4 py-3">{categories.map((c) => <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="rounded-lg border border-gray-200 bg-white px-4 py-3"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select>
      </div>
      <div className="mb-5 flex items-center justify-between text-sm text-gray-500"><span>{filteredProducts.length} products found</span><span>Page {page} of {pageCount}</span></div>
      {visibleProducts.length === 0 ? <p className="rounded-xl bg-gray-50 py-16 text-center text-gray-500">No products match your search.</p> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      {pageCount > 1 && <div className="mt-10 flex items-center justify-center gap-4"><button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span className="text-sm text-gray-600">{page} / {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></div>}
    </main>
  );
}

export default Products;

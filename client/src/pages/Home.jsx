import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await api.get("/products");
        setFeaturedProducts(response.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load featured products:", error.message);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Featured Products
            </h2>

            <p className="text-gray-500 mt-2">
              Explore our most popular products.
            </p>
          </div>

          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

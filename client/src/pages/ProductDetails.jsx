import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/products/${id}`);
        if (active) setProduct(response.data);
      } catch (requestError) {
        if (active) {
          setProduct(null);
          setError(requestError.message || "Unable to load this product.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex flex-col gap-4 items-center justify-center text-red-600">{error}<Link to="/products" className="text-indigo-600">Back to Products</Link></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Product Not Found
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        <div className="p-8 flex items-center justify-center">
          <img
            src={imageFailed ? "/images/product-fallback.svg" : product.image}
            alt={product.name}
            onError={() => setImageFailed(true)}
            className="w-full max-w-md rounded-xl object-contain"
          />
        </div>

        <div className="p-8 flex flex-col justify-center">
          <span className="text-indigo-600 font-semibold">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mt-3">{product.name}</h1>

          <p className="text-yellow-500 text-xl mt-4">⭐ {product.rating}</p>

          <h2 className="text-3xl font-bold text-indigo-600 mt-6">
            ₹{product.price}
          </h2>

          <p className="text-gray-600 mt-6 leading-7">
            {product.description}
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => addToCart(product)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className="border border-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-600 hover:text-white transition"
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <Link to="/products" className="mt-8 text-indigo-600 font-semibold">
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

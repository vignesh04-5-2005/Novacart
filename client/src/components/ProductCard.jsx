import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [imageFailed, setImageFailed] = useState(false);
  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleWishlist = () => {
    if (isWishlisted) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-50 p-5">
        <img
          src={imageFailed ? "/images/product-fallback.svg" : product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">{product.category}</span>
        <button type="button" onClick={handleWishlist} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-3 top-3 rounded-full bg-white p-3 shadow-md transition hover:scale-105">
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
      </div>
      <div className="p-5">
        <h2 className="line-clamp-1 text-lg font-bold text-gray-900">{product.name}</h2>
        <p className="mt-2 min-h-10 line-clamp-2 text-sm text-gray-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-extrabold text-indigo-700">₹{Number(product.price).toLocaleString("en-IN")}</span>
          <span className="text-sm font-semibold text-amber-500">★ {Number(product.rating || 0).toFixed(1)}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => addToCart(product)} disabled={product.stock <= 0} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400">
            <FaShoppingCart /> {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
          <Link to={`/product/${product._id}`} className="rounded-lg border border-indigo-600 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">View</Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

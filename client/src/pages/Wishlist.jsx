import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../Context/WishlistContext";
import { CartContext } from "../Context/CartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>

        <Link
          to="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">My Wishlist</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold">{product.name}</h2>

                <p className="text-gray-500 mt-2">{product.category}</p>

                <p className="text-indigo-600 text-2xl font-bold mt-4">
                  ₹{product.price}
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;

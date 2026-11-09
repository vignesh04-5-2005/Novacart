import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUserCircle } from "react-icons/fa";

import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import { AuthContext } from "../Context/AuthContext";

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-extrabold tracking-wide">
          NovaCart
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-yellow-300 transition">
            Home
          </Link>

          <Link to="/products" className="hover:text-yellow-300 transition">
            Products
          </Link>

          <Link to="/wishlist" className="relative">
            <FaHeart size={22} />

            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <FaShoppingCart size={22} />

            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2">
                <FaUserCircle size={24} />
                {user.name || "Profile"}
              </Link>

              {/* Admin Dashboard */}
              {user.isAdmin === true && (
                <Link
                  to="/admin"
                  className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

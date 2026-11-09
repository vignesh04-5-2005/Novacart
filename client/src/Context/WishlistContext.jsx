import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from backend
  const fetchWishlist = async () => {
    if (!user?.token) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/wishlist");

      setWishlist(response.data.products || []);
    } catch (error) {
      console.error(
        "Failed to fetch wishlist:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // Load whenever user logs in
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  // Add product
  const addToWishlist = async (product) => {
    if (!user?.token) {
      throw new Error("Please login to add products to wishlist");
    }

    try {
      const response = await api.post("/wishlist", {
        productId: product._id,
      });

      setWishlist(response.data.products || []);
    } catch (error) {
      console.error(
        "Failed to add to wishlist:",
        error.response?.data?.message || error.message,
      );

      throw new Error(
        error.response?.data?.message || "Failed to add product to wishlist",
      );
    }
  };

  // Remove product
  const removeFromWishlist = async (id) => {
    try {
      const response = await api.delete(`/wishlist/${id}`);

      setWishlist(response.data.products || []);
    } catch (error) {
      console.error(
        "Failed to remove from wishlist:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      await api.delete("/wishlist");

      setWishlist([]);
    } catch (error) {
      console.error(
        "Failed to clear wishlist:",
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;

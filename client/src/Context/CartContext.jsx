import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Convert backend cart format to frontend format
  const formatCartItems = (cart) => {
    if (!cart || !cart.items) {
      return [];
    }

    return cart.items.map((item) => ({
      ...item.product,
      quantity: item.quantity,
    }));
  };

  // Get user's cart from backend
  const fetchCart = async () => {
    if (!user?.token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/cart");

      setCartItems(formatCartItems(response.data));
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // Load cart whenever user logs in
  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add product
  const addToCart = async (product) => {
    if (!user?.token) {
      throw new Error("Please login to add products to cart");
    }

    try {
      const response = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      setCartItems(formatCartItems(response.data));
    } catch (error) {
      console.error(
        "Failed to add to cart:",
        error.response?.data?.message || error.message,
      );

      throw new Error(
        error.response?.data?.message || "Failed to add product to cart",
      );
    }
  };

  // Remove product
  const removeFromCart = async (id) => {
    try {
      const response = await api.delete(`/cart/${id}`);

      setCartItems(formatCartItems(response.data));
    } catch (error) {
      console.error(
        "Failed to remove from cart:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Increase quantity
  const increaseQuantity = async (id) => {
    const item = cartItems.find((item) => item._id === id);

    if (!item) return;

    try {
      const response = await api.put(`/cart/${id}`, {
        quantity: item.quantity + 1,
      });

      setCartItems(formatCartItems(response.data));
    } catch (error) {
      console.error(
        "Failed to increase quantity:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (id) => {
    const item = cartItems.find((item) => item._id === id);

    if (!item || item.quantity <= 1) {
      return;
    }

    try {
      const response = await api.put(`/cart/${id}`, {
        quantity: item.quantity - 1,
      });

      setCartItems(formatCartItems(response.data));
    } catch (error) {
      console.error(
        "Failed to decrease quantity:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await api.delete("/cart");

      setCartItems([]);
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;

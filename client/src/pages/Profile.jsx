import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import api from "../services/api";

function Profile() {
  const { user } = useContext(AuthContext);
  const { cartItems, loading: cartLoading } = useContext(CartContext);
  const { wishlist, loading: wishlistLoading } = useContext(WishlistContext);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError("");

        const response = await api.get("/orders/myorders");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(
          "Failed to fetch profile orders:",
          error.response?.data?.message || error.message,
        );

        setOrdersError("Unable to load orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user?.token]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Total quantity of all cart products
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  // Number of wishlist products
  const wishlistCount = wishlist.length;

  const cards = [
    {
      title: "Orders",
      count: ordersLoading ? "..." : ordersError ? "—" : orders.length,
      description: "View your orders and track their status",
      link: "/orders",
      color: "indigo",
    },
    {
      title: "Wishlist",
      count: wishlistLoading ? "..." : wishlistCount,
      description: "View your saved products",
      link: "/wishlist",
      color: "green",
    },
    {
      title: "Cart Items",
      count: cartLoading ? "..." : cartCount,
      description: "View products in your shopping cart",
      link: "/cart",
      color: "yellow",
    },
  ];

  const styles = {
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    yellow: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Profile Information */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-600 mt-2">{user.email}</p>
            <p className="text-sm text-green-600 mt-2">Account Active</p>
          </div>
        </div>

        <hr className="my-8" />

        {/* Dashboard Statistics */}
        <h2 className="text-2xl font-bold mb-6">My Dashboard</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className={`${styles[card.color]} rounded-xl p-6 text-center transition duration-200 hover:shadow-md hover:-translate-y-1`}
            >
              <h2 className="text-4xl font-bold">{card.count}</h2>

              <p className="mt-2 font-semibold text-gray-800">{card.title}</p>

              <p className="mt-2 text-sm text-gray-600">{card.description}</p>

              <p className="mt-4 text-sm font-semibold">View Details →</p>
            </Link>
          ))}
        </div>

        {ordersError && (
          <p className="text-sm text-red-500 mt-4">
            {ordersError}. Please try refreshing the page.
          </p>
        )}

        <hr className="my-8" />

        <div className="flex flex-wrap gap-4">
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;

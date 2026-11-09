import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/myorders");

        setOrders(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error.response?.data?.message || error.message,
        );

        setError(error.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>

        <Link
          to="/products"
          className="mt-5 bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">No Orders Yet</h1>

        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>

        <Link
          to="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>

                  <p className="font-semibold">{order._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>

                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>

                  <p className="font-semibold text-indigo-600">
                    {order.orderStatus}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total</p>

                  <p className="font-bold text-lg">₹{order.totalPrice}</p>
                </div>
              </div>

              <div className="border-t mt-5 pt-5">
                <p className="font-semibold mb-3">Items</p>

                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>

                        <p className="text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t">
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700"
                >
                  VIEW ORDER
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;

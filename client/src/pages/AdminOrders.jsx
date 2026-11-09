import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/admin");

        setOrders(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch admin orders:",
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
        <p className="text-xl font-semibold">Loading all orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>

        <Link
          to="/"
          className="mt-5 bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Admin Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {/* Customer */}
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>

                    <p className="font-bold">{order.user?.name || "Unknown"}</p>

                    <p className="text-gray-500">
                      {order.user?.email || "No email"}
                    </p>
                  </div>

                  {/* Order ID */}
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>

                    <p className="font-semibold break-all">{order._id}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>

                    <p className="font-bold text-indigo-600">
                      {order.orderStatus}
                    </p>
                  </div>

                  {/* Total */}
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

                        <div>
                          <p className="font-semibold">{item.name}</p>

                          <p className="text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 text-sm text-gray-500">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;

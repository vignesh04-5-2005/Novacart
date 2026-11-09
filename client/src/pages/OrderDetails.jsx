import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);

        setOrder(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch order:",
          error.response?.data?.message || error.message,
        );

        setError(error.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error || "Order not found"}</p>

        <Link
          to="/orders"
          className="mt-5 bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <Link to="/orders" className="text-indigo-600 font-semibold">
          ← Back to My Orders
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between gap-5 border-b pb-6">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>

              <p className="font-bold text-lg">{order._id}</p>

              <p className="text-gray-500 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Status</p>

              <p className="text-lg font-bold text-indigo-600">
                {order.orderStatus}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

            <div className="bg-gray-50 rounded-lg p-5">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>

              <p className="text-gray-600 mt-2">
                {order.shippingAddress.address}
              </p>

              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </p>

              <p className="text-gray-600">{order.shippingAddress.country}</p>

              <p className="text-gray-600 mt-2">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Payment Information</h2>

            <div className="bg-gray-50 rounded-lg p-5">
              <p>
                <span className="font-semibold">Method:</span>{" "}
                {order.paymentMethod}
              </p>

              <p className="mt-2">
                <span className="font-semibold">Payment Status:</span>{" "}
                {order.paymentStatus}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>

                    <p className="text-gray-500 mt-1">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between text-lg">
              <span>Items Price</span>
              <span>₹{order.itemsPrice}</span>
            </div>

            <div className="flex justify-between text-lg mt-3">
              <span>Shipping</span>
              <span>
                {order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice}`}
              </span>
            </div>

            <div className="flex justify-between text-2xl font-bold text-indigo-600 mt-4">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

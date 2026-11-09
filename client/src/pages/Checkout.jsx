import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import api from "../services/api";

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shippingPrice = itemsPrice >= 500 ? 0 : 50;

  const total = itemsPrice + shippingPrice;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await api.post("/orders", {
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: "India",
          phone: form.phone,
        },
        paymentMethod,
      });

      console.log("Order created:", response.data);

      // Clear frontend cart after successful order
      await clearCart();

      navigate("/success");
    } catch (error) {
      console.error(
        "Failed to place order:",
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
      );

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to place order",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>

        <button
          onClick={() => navigate("/products")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {/* Shipping Information */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Shipping Information</h2>

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="address"
              placeholder="Address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-5">Payment Method</h2>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE" disabled>Online Payment (Coming soon)</option>
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-5 text-center">{error}</p>
        )}

        {/* Order Summary */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-bold">Order Summary</h2>

          <p className="mt-4 text-lg">Items: {cartItems.length}</p>

          <p className="text-lg mt-2">Items Price: ₹{itemsPrice}</p>

          <p className="text-lg mt-2">
            Shipping: {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
          </p>

          <p className="text-2xl font-bold text-indigo-600 mt-2">
            Total: ₹{total}
          </p>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-8 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

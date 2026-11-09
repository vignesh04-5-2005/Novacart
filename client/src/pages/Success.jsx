import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function Success() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
        <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />

        <h1 className="text-4xl font-bold text-gray-800">Order Successful!</h1>

        <p className="text-gray-600 mt-4 leading-7">
          Thank you for shopping with NovaCart.
          <br />
          Your order has been placed successfully.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/orders"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>

        <Link
          to="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                <div>
                  <h2 className="text-2xl font-bold">{item.name}</h2>

                  <p className="text-indigo-600 font-semibold mt-2">
                    ₹{item.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  -
                </button>

                <span className="text-xl font-bold">{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item._id)}
                  disabled={item.quantity >= item.stock}
                  title={item.quantity >= item.stock ? "Maximum available stock reached" : "Increase quantity"}
                  className="bg-gray-200 px-4 py-2 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-10 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Total: ₹{total}</h2>

          <Link
            to="/checkout"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;

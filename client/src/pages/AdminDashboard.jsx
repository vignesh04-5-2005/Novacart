import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch products and orders
  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsResponse, ordersResponse] = await Promise.all([
        api.get("/products"),
        api.get("/orders/admin"),
      ]);

      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error("Admin dashboard error:", error);

      setError(
        error.response?.data?.message || "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Product form changes
  const handleProductChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update product
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const productData = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);

        setMessage("Product updated successfully");
      } else {
        await api.post("/products", productData);

        setMessage("Product created successfully");
      }

      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });

      setEditingProduct(null);

      fetchData();
    } catch (error) {
      console.error("Product save error:", error);

      setError(error.response?.data?.message || "Failed to save product");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/products/${id}`);

      setMessage("Product deleted successfully");

      fetchData();
    } catch (error) {
      console.error("Product delete error:", error);

      setError(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Update order
  const updateOrder = async (id, orderStatus, paymentStatus) => {
    try {
      setError("");
      setMessage("");

      await api.put(`/orders/admin/${id}`, {
        orderStatus,
        paymentStatus,
      });

      setMessage("Order updated successfully");

      fetchData();
    } catch (error) {
      console.error("Order update error:", error);

      setError(error.response?.data?.message || "Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Messages */}

        {message && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-5">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* Product Form */}

        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleProductSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={productForm.name}
              onChange={handleProductChange}
              required
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={productForm.description}
              onChange={handleProductChange}
              required
              rows="3"
              className="w-full border rounded-lg p-3"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={productForm.price}
                onChange={handleProductChange}
                required
                min="0"
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={productForm.category}
                onChange={handleProductChange}
                required
                className="w-full border rounded-lg p-3"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={productForm.stock}
                onChange={handleProductChange}
                required
                min="0"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={productForm.image}
              onChange={handleProductChange}
              required
              className="w-full border rounded-lg p-3"
            />

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>

              {editingProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);

                    setProductForm({
                      name: "",
                      description: "",
                      price: "",
                      category: "",
                      image: "",
                      stock: "",
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products */}

        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Products</h2>

          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-xl p-5 flex flex-col md:flex-row gap-5 md:items-center md:justify-between"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>

                    <p className="text-gray-500">{product.category}</p>

                    <p className="font-semibold text-indigo-600">
                      ₹{product.price}
                    </p>

                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Customer Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-xl p-5">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>

                      <p className="font-bold">
                        {order.user?.name || "Unknown"}
                      </p>

                      <p className="text-gray-500">
                        {order.user?.email || "No email"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>

                      <p className="font-semibold break-all">{order._id}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Total</p>

                      <p className="font-bold">₹{order.totalPrice}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Date</p>

                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="border-t mt-5 pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold mb-2">
                        Order Status
                      </label>

                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateOrder(
                            order._id,
                            e.target.value,
                            order.paymentStatus,
                          )
                        }
                        className="w-full border rounded-lg p-3"
                      >
                        <option value="Processing">Processing</option>

                        <option value="Shipped">Shipped</option>

                        <option value="Delivered">Delivered</option>

                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Payment Status
                      </label>

                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          updateOrder(
                            order._id,
                            order.orderStatus,
                            e.target.value,
                          )
                        }
                        className="w-full border rounded-lg p-3"
                      >
                        <option value="Pending">Pending</option>

                        <option value="Paid">Paid</option>

                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const validateShippingAddress = (address) => {
  const requiredFields = ["fullName", "address", "city", "state", "postalCode", "phone"];
  if (!address || typeof address !== "object") return "Shipping address is required";
  for (const field of requiredFields) {
    if (typeof address[field] !== "string" || !address[field].trim()) {
      return `${field} is required`;
    }
  }
  if (!/^\d{10}$/.test(address.phone.trim())) {
    return "Phone number must contain exactly 10 digits";
  }
  if (!/^\d{6}$/.test(address.postalCode.trim())) {
    return "Postal code must contain exactly 6 digits";
  }
  return null;
};

// Restore previously deducted stock if order creation fails part-way through.
const restoreStock = async (deductedItems) => {
  for (const item of deductedItems) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity } },
    );
  }
};

// Create order
const createOrder = async (req, res) => {
  let deductedItems = [];
  let orderSaved = false;

  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body;
    const addressError = validateShippingAddress(shippingAddress);
    if (addressError) {
      return res.status(400).json({ message: addressError });
    }

    // ONLINE is not enabled until a real payment gateway and verified webhook exist.
    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Online payment is not available yet. Please choose Cash on Delivery.",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = [];
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          message: "Your cart contains a product that is no longer available. Refresh your cart and try again.",
        });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ message: "Cart contains an invalid quantity" });
      }

      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      });
    }

    const itemsPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const shippingPrice = itemsPrice >= 500 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;

    // Atomic conditional updates prevent two customers buying the same last unit.
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!updatedProduct) {
        const currentProduct = await Product.findById(item.product).select("name stock");
        await restoreStock(deductedItems);
        deductedItems = [];
        return res.status(409).json({
          message: currentProduct
            ? `Not enough stock for ${currentProduct.name}. Only ${currentProduct.stock} item(s) remain.`
            : `${item.name} is no longer available.`,
        });
      }
      deductedItems.push({ productId: item.product, quantity: item.quantity });
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: (shippingAddress.country || "India").trim(),
        phone: shippingAddress.phone.trim(),
      },
      paymentMethod: "COD",
      paymentStatus: "Pending",
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    orderSaved = true;

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    if (!orderSaved && deductedItems.length > 0) {
      try {
        await restoreStock(deductedItems);
      } catch (restoreError) {
        console.error("STOCK RESTORE ERROR:", restoreError);
      }
    }
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const validOrderStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    const validPaymentStatuses = ["Pending", "Paid", "Failed"];
    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};

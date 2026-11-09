const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const isValidQuantity = (value) => Number.isInteger(Number(value)) && Number(value) >= 1;

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart) {
      return res.json({
        items: [],
      });
    }

    // Remove stale cart entries if an admin has deleted a product.
    const validItems = cart.items.filter((item) => item.product);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      await cart.save();
      return res.json(await Cart.findById(cart._id).populate("items.product"));
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get cart",
      error: error.message,
    });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (!isValidQuantity(quantity)) {
      return res.status(400).json({ message: "Quantity must be a positive whole number" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < Number(quantity)) {
      return res.status(400).json({
        message: `Only ${product.stock} item(s) are currently in stock`,
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId,
      );

      if (itemIndex > -1) {
        const nextQuantity = cart.items[itemIndex].quantity + Number(quantity);
        if (nextQuantity > product.stock) {
          return res.status(400).json({
            message: `Only ${product.stock} item(s) are currently in stock`,
          });
        }
        cart.items[itemIndex].quantity = nextQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
    );

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    if (!isValidQuantity(quantity)) {
      return res.status(400).json({
        message: "Quantity must be a positive whole number",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} item(s) are currently in stock`,
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    item.quantity = Number(quantity);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product",
      error: error.message,
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.json({
        items: [],
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

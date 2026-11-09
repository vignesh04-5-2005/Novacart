const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    }).populate("products");

    if (!wishlist) {
      return res.json({
        products: [],
      });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get wishlist",
      error: error.message,
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId,
      );

      if (alreadyExists) {
        return res.status(400).json({
          message: "Product already in wishlist",
        });
      }

      wishlist.products.push(productId);

      await wishlist.save();
    }

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
      "products",
    );

    res.status(200).json(populatedWishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
      "products",
    );

    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.json({
        products: [],
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.json({
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};

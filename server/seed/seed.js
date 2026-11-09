const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const products = require("./products");

dotenv.config();

const seedProducts = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing from server/.env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    let inserted = 0;
    let refreshed = 0;

    for (const product of products) {
      const { name, image, ...newProductFields } = product;
      const result = await Product.updateOne(
        { name },
        {
          $set: { image },
          $setOnInsert: { name, ...newProductFields },
        },
        { upsert: true, runValidators: true },
      );
      if (result.upsertedCount) inserted += 1;
      else refreshed += 1;
    }

    const total = await Product.countDocuments();
    console.log(`Catalogue sync complete: ${inserted} new products added, ${refreshed} existing product images refreshed.`);
    console.log(`Total products currently in database: ${total}`);
    console.log("Existing stock values, users, carts, and orders were not intentionally modified.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();

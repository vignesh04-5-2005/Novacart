const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Create server/.env using server/.env.example.");
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to a random secret of at least 32 characters.");
  }

  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`NovaCart API listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`Failed to start NovaCart API: ${error.message}`);
  process.exit(1);
});

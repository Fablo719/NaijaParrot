const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,           // Disable Mongoose buffering
      serverSelectionTimeoutMS: 30000, // 30s - good for cold starts
      socketTimeoutMS: 45000,
      // Optional: reduce pool size for serverless
      maxPoolSize: 5,
      minPoolSize: 1,
    };

    const uri = process.env.DATABASE_URI;
    if (!uri) {
      throw new Error("❌ DATABASE_URI is not defined in environment variables");
    }

    console.log("🔄 Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        cached.promise = null;   // Reset on failure so next call retries
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

module.exports = connectDB;
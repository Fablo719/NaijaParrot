const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // If connecting in progress, return the same promise
    if (connectionPromise) {
        return connectionPromise;
    }

    const uri = process.env.DATABASE_URI || process.env.MONGODB_URL;

    if (!uri) {
        throw new Error("❌ MongoDB URI is missing. Please check your Vercel Environment Variables. Expected: DATABASE_URI or MONGODB_URL");
    }

    connectionPromise = mongoose.connect(uri, {
        // Optional: good defaults for serverless
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log("✅ Database connected successfully");
    })
    .catch((err) => {
        connectionPromise = null;
        console.error("❌ MongoDB connection failed:", err.message);
        throw err;
    });

    return connectionPromise;
};

module.exports = connectDB;
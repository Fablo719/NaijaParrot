const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("✅ Already connected");
        return;
    }

    if (connectionPromise) return connectionPromise;

    const uri = process.env.DATABASE_URI || process.env.MONGODB_URL;

    console.log("=== ENVIRONMENT DEBUG START ===");
    console.log("DATABASE_URI exists?", !!process.env.DATABASE_URI);
    console.log("MONGODB_URL exists?", !!process.env.MONGODB_URL);
    console.log("FORCE_REBUILD value:", process.env.FORCE_REBUILD);
    console.log("All DB/MONGO/URI keys:", 
        Object.keys(process.env)
            .filter(k => /DB|MONGO|URI|FORCE/i.test(k))
            .map(k => `${k}: ${process.env[k] ? 'SET' : 'undefined'}`)
    );
    console.log("URI length (if present):", uri ? uri.length : 0);
    console.log("=== ENVIRONMENT DEBUG END ===");

    if (!uri) {
        throw new Error(`❌ MongoDB URI is missing. Available keys: ${Object.keys(process.env).filter(k => /DB|MONGO|URI/i.test(k)).join(', ')}`);
    }

    connectionPromise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
    })
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => {
        connectionPromise = null;
        console.error("❌ Connection failed:", err.message);
        throw err;
    });

    return connectionPromise;
};

module.exports = connectDB;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();   // ← Load env vars as early as possible

app.set("view engine", 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50Mb" }));
app.use(cors());

// Import routers AFTER env is loaded, but BEFORE connecting (still safe)
const UserRouter = require('./routers/user.routes');
const PostRouter = require('./routers/post.routes');
const ProfileRouter = require('./routers/profile.routes');

const connectDB = require("./database/connectDB");

// Mount routes
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/posts', PostRouter);
app.use('/api/v1', ProfileRouter);

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// ====================== CONNECTION LOGIC ======================
const startServer = async () => {
  try {
    await connectDB();                    // Wait for connection
    console.log("✅ Database connected successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error.message);
    process.exit(1);   // Exit on critical DB failure
  }
};

// Run in all environments (remove the NODE_ENV check)
startServer();

module.exports = app;
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Routes
const connectDB = require("./database/connectDB");
const UserRouter = require("./routers/user.routes");
const PostRouter = require("./routers/post.routes");

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/posts", PostRouter);

// Cache DB connection
let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
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

// DB
// const DATABASE_URL = process.env.DATABASE_URI || process.env.MONGODB_URI;

// mongoose
//   .connect(DATABASE_URL)
//   .then(() => console.log("✅ DB connected"))
//   .catch((err) => console.log("❌ DB error:", err.message));

// // Server
// const PORT = process.env.PORT || 5008;
// app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

app.listen(process.env.PORT, (err) =>{
  if (err) {
    console.log("error starting server", err);
  } else {
    console.log(`server started successfully`);
  }
});

module.exports=async(req, res)=>{
  await connectDB()

  return app(req, res)
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50Mb" }));
app.use(cors());

// Routes
const UserRouter = require('./routers/user.routes');
const PostRouter = require('./routers/post.routes');

app.use('/api/v1/users', UserRouter);
app.use('/api/v1/posts', PostRouter);

// Database connection
// const DATABASE_URL = process.env.DATABASE_URI || process.env.MONGODB_URI;
// console.log("Attempting to connect to MongoDB...");

// mongoose.connect(DATABASE_URL)
//     .then(() => {
//         console.log("✅ Database connected successfully");
//     })
//     .catch((error) => {
//         console.log("❌ Failed to connect to DB");
//         console.log("Error details:", error.message);
//     });

// Server
const PORT = process.env.PORT || 5008;
app.listen(PORT, (err) => {
    if (err) {
        console.log("❌ Error starting server:", err);
    } else {
        console.log(`🚀 Server started successfully on port ${PORT}`);
    }
});

module.exports=async (req, res) => {
    await connectDB()

    return app(req, res)
    
}
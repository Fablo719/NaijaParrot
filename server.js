const express = require("express");
const cors = require('cors');
const connectDB = require("./database/connectDB");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50Mb" }));
app.use(cors());

// Routes
app.use('/api/v1/users', require('./routers/user.routes'));
app.use('/api/v1/posts', require('./routers/post.routes'));
app.use('/api/v1', require('./routers/profile.routes'));

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Vercel Serverless Handler
module.exports = async (req, res) => {
    try {
        await connectDB();        // Connect first
        return app(req, res);     // Then handle the request
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
module.exports=async(req, res)=>{
  await connectDB()

  return app(req, res)
}
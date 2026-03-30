const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  createPost,
  getAllPosts,
  getUserPosts,
  addComment,
  likePost,
  sharePost,
  deletePost,
  updatePost,
  savePost,
  getSavedPosts,
  searchPosts,
  getUserResponses,
} = require("../controllers/post.controller");

// ADMIN
router.get("/admin/posts", auth, admin, getAllPosts);

// CREATE & FETCH
router.post("/createPost", auth, createPost);
router.get("/getAllPosts", auth, getAllPosts);

// UPDATE & DELETE (FIXED)
router.put("/:postId", auth, admin, updatePost);
router.delete("/admin/post/:postId", auth, admin, deletePost);

// USER POSTS
router.get("/user/:userId", auth, getUserPosts);

// SEARCH & SAVE
router.get("/search", auth, searchPosts);
router.post("/:postId/save", auth, savePost);
router.get("/saved/posts", auth, getSavedPosts);
router.get("/responses/me", auth, getUserResponses);

// INTERACTIONS
router.post("/:postId/like", auth, likePost);
router.post("/:postId/comment", auth, addComment);
router.post("/:postId/share", auth, sharePost);

module.exports = router;
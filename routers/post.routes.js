const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
    createPost,
    getAllPosts,
    getUserPosts,
    likePost,
    addComment,
    sharePost,
    deletePost,
    searchPosts,
    savePost,
    getSavedPosts,
    getUserResponses,
    updatePost
} = require('../controllers/post.controller');

// ADMIN POST ROUTES
router.get('/admin/posts', auth, admin, getAllPosts);
router.delete('/admin/post/:postId', auth, admin, deletePost);
router.patch('/admin/updatepost/:postId', auth, admin, updatePost);

router.patch('/:postId', auth, updatePost);
router.post('/createPost', auth, createPost);
router.get('/getAllPosts', auth, getAllPosts);
router.get('/user/:userId', auth, getUserPosts);
router.get('/search', auth, searchPosts);
router.post('/:postId/save', auth, savePost);
router.post('/delete/post', auth, deletePost);
router.get('/saved/posts', auth, getSavedPosts);
router.get('/responses/me', auth, getUserResponses);

// Interaction routes
router.post('/:postId/like', auth, likePost);
router.post('/:postId/comment', auth, addComment);
router.post('/:postId/share', auth, sharePost);

// Delete route
router.delete('/:postId', auth, deletePost);

module.exports = router;
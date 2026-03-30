const express = require('express');
const { createUser, editUser, getAllUsers, deleteUser, login, getMe } = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const admin = require("../middleware/admin");
const router = express.Router();

// Public routes
router.post('/register', createUser);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);
router.patch('/edituser/:id', auth, editUser);
router.get('/getUsers', auth, getAllUsers);
router.delete('/deleteUser/:id', auth, deleteUser);
// ADMIN USER ROUTES
router.get('/admin/users', auth, admin, getAllUsers);
router.delete('/admin/user/:id', auth, admin, deleteUser);
module.exports = router;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// Register User
const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

   try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const saltround = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltround);
        
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

       const token = jwt.sign(
  {
    id: newUser._id,
    email: newUser.email,
    name: `${newUser.firstName} ${newUser.lastName}`,
    role: newUser.role
  },
  process.env.SECRET_KEY,
  { expiresIn: "7d" }
);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                name: `${newUser.firstName} ${newUser.lastName}`,
                role: newUser.role   
            }
        });

    } catch (error) {
        console.log("Create user error:", error);
        res.status(400).json({
            success: false,
            message: "User creation failed",
            error: error.message
        });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id,
            role: user.role 
             },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role   
            }
        });

    } catch (error) {
        console.log("Login error:", error);
        res.status(400).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

// Get Current User
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "User not found",
            error: error.message
        });
    }
};

// Edit User
const editUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        console.log("Edit error:", error);
        res.status(400).json({
            success: false,
            message: "User update failed",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Failed to retrieve users",
            error: error.message
        });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
};

module.exports = { createUser, editUser, getAllUsers, login, deleteUser, getMe };
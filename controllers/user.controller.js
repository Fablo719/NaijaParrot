const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// -------------------- REGISTER USER --------------------
const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // 1️⃣ Check required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 2️⃣ Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // 3️⃣ Validate password strength (min 6 chars, at least one letter and one number)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters and include letters and numbers"
            });
        }

        // 4️⃣ Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // 5️⃣ Hash password
        const saltround = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltround);

        // 6️⃣ Create user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        // 7️⃣ Generate JWT
        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
                name: `${newUser.firstName} ${newUser.lastName}`,
                role: newUser.role || "user"
            },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        // 8️⃣ Send response
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
                role: newUser.role || "user"
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

// -------------------- LOGIN USER --------------------
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
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

// -------------------- GET CURRENT USER --------------------
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
        res.status(400).json({ success: false, message: "User not found", error: error.message });
    }
};

// -------------------- EDIT USER --------------------
const editUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.log("Edit error:", error);
        res.status(400).json({ success: false, message: "User update failed", error: error.message });
    }
};

// -------------------- GET ALL USERS --------------------
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: "Access denied" });

        const users = await User.find().select('-password');
        res.status(200).json({ success: true, message: "Users retrieved successfully", users });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Failed to retrieve users", error: error.message });
    }
};

// -------------------- DELETE USER --------------------
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Failed to delete user", error: error.message });
    }
};

// -------------------- EXPORT CONTROLLERS --------------------
module.exports = { createUser, login, getMe, editUser, getAllUsers, deleteUser };

// Register User : POST /api/user/register

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1️⃣ Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required details",
            });
        }

        // 2️⃣ Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Create user (store ONLY hashed password)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // 5️⃣ Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6️⃣ Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 7️⃣ Send response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};


// Login User : POST /api/user/login


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // 2️⃣ Check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 3️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 4️⃣ Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5️⃣ Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // 6️⃣ Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};


// check Auth: /api/user/is-auth


export const isAuth = async (req, res) => {
    try {
        // 🔑 userId comes from auth middleware
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Auth Check Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};



// Logout User : POST /api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 0,
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error("Logout Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Logout failed",
        });
    }
};

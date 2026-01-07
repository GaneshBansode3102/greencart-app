// Login seller:/api/seller/login

// controllers/sellerControllers.js
import jwt from "jsonwebtoken";

export const sellerLogin = async (req, res) => {
    const { email, password } = req.body;

    if (
        email !== process.env.SELLER_EMAIL ||
        password !== process.env.SELLER_PASSWORD
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: "Seller logged in successfully",
    });
};


// check seller IsAuth: /api/seller/is-auth

export const isSelllerAuth = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Seller authenticated",
    });
};




// seller Logout User : POST /api/seller/logout


export const sellerlogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

import User from "../models/User.js"

// Update user CartData : api/cart/update
export const updateCart = async (req, res) => {
    try {

        const { userId, cartItems } = req.body
        await User.findByIdAndUpdate(userId, { cartItems });
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {

        console.error("Cart Updated Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to Cart Updated",
        });

    }
}
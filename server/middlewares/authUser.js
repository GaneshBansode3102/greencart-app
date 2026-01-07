

// middlewares/authUser.js
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // 1️⃣ Check token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Token missing",
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach userId to request (SAFE)
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;

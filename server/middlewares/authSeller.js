// // middlewares/authSeller.js
// import jwt from "jsonwebtoken";

// const authSeller = (req, res, next) => {
//   try {
//     const { sellerToken } = req.cookies;

//     if (!sellerToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized",
//       });
//     }

//     const decoded = jwt.verify(
//       sellerToken,
//       process.env.JWT_SECRET
//     );

//     if (decoded.email !== process.env.SELLER_EMAIL) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid seller",
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// export default authSeller;



// middlewares/authSeller.js
import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    // ✅ MATCH COOKIE NAME EXACTLY
    const { sellertoken } = req.cookies;

    if (!sellertoken) {
      return res.status(401).json({
        success: false,
        message: "Seller not authorized",
      });
    }

    const decoded = jwt.verify(
      sellertoken,
      process.env.JWT_SECRET
    );

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Invalid seller",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired seller token",
    });
  }
};

export default authSeller;

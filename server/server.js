

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import userRouter from "./routes/UserRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/ProductRoutes.js";
import cartRouter from "./routes/CartRoute.js";
import addressRouter from "./routes/AddressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripWebhooks } from "./controllers/orderController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

/* -------------------- DB CONNECTION -------------------- */
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary()
    console.log("✅ Database connected");

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

/* -------------------- CORS CONFIG -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://greencart-app-av9z.vercel.app/"
];

app.post('./stripe', express.raw({ type: 'application/json' }), stripWebhooks)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.send("✅ API is working");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);









/* -------------------- GLOBAL ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

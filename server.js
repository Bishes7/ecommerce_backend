import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { errorHandler, notfound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB(); // connection to MongoDB

const PORT = process.env.PORT || 8000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// // Middleware to parse incoming JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// get method
app.get("/", (req, res) => {
  res.send("server is live");
});

// path to products routes
app.use("/api/products", productRoutes);

// path to user routes
app.use("/api/users", userRoutes);

// path to order routes
app.use("/api/orders", orderRoutes);

// routes to upload photos
app.use("/api/upload", uploadRoutes);

// Make uploads folder static
const __dirname = path.resolve(); // Set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//  path to paypal
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// message route
app.use("/api/message", messageRoutes);

app.use("/api/test", testRoutes);

// payment routes
app.use("/api/payment", paymentRoutes);

// middleware to catch errors
app.use(notfound);
app.use(errorHandler);

// listening the port
app.listen(PORT, (error) =>
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`)
);

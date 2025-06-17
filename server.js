import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notfound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
dotenv.config();

connectDB(); // connection to MongoDB

const PORT = process.env.PORT;

const app = express();

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

// middleware to catch errors
app.use(notfound);
app.use(errorHandler);

// listening the port
app.listen(PORT, (error) =>
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`)
);

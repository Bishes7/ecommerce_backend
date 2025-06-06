import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler, notfound } from "./middleware/errorMiddleware.js";
dotenv.config();

connectDB(); // connection to MongoDB

const PORT = process.env.PORT;

const app = express();

// get method
app.get("/", (req, res) => {
  res.send("server is live");
});

// path to products
app.use("/api/products", productRoutes);

// middleware to catch errors
app.use(notfound);
app.use(errorHandler);

// listening the port
app.listen(PORT, (error) =>
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`)
);

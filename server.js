import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
dotenv.config();

connectDB(); // connection to MongoDB

const PORT = process.env.PORT;

const app = express();

// get method
app.get("/", (req, res) => {
  res.send("server is live");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

// find the products from id
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

// listening the port
app.listen(PORT, (error) =>
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`)
);

import mongoose from "mongoose";
import csv from "csvtojson";
import dotenv from "dotenv";

import connectDB from "./config/dbConnect.js";
import productModel from "./model/productSchema.js";

dotenv.config();
connectDB();

const importProducts = async () => {
  try {
    const products = await csv().fromFile("products_template.csv");

    const formattedProducts = products.map((p) => ({
      name: p.name,
      image: p.image,
      brand: p.brand || "Generic",
      category: p.category,
      description: p.description,
      price: Number(p.price),
      countInStock: Number(p.stock),
      isExternal: p.isExternal === "TRUE",
    }));

    await productModel.insertMany(formattedProducts);
    console.log("Products Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importProducts();

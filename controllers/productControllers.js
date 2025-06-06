import asyncHandler from "../middleware/asyncHandler.js";
import productModel from "../model/productSchema.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await productModel.find({});
  res.status(200).json(products); // send products to the client
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

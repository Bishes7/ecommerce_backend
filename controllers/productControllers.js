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

// create Product  - Admin Only
export const createProduct = asyncHandler(async (req, res) => {
  const product = new productModel({
    name: "Sample name",
    price: 0,
    user: req.userInfo._id,
    image: "/image/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Update Product - Admin Only
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await productModel.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Delete product - Admin only
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);

  if (product) {
    await productModel.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product Deleted" });
  } else {
    res.status(400);
    throw new Error("Product not found");
  }
});

// Create a product review
export const createProductReview = asyncHandler(async (req, res) => {
  console.log("🔐 userInfo:", req.userInfo);

  const { rating, comment } = req.body;

  const product = await productModel.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.userInfo._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    // create a new review object
    const review = {
      name: req.userInfo.name,
      rating: Number(rating),
      comment,
      user: req.userInfo._id,
    };

    product.reviews.push(review);
    console.log("📦 Product with reviews:", product.reviews);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(200).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

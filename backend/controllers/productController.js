import { validationResult } from "express-validator";

import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc Create new product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const [createdProduct] = await Product.insertMany([
    {
      user: req.user._id,
      name: "Sample name",
      image: "/images/sample.jpg",
      brand: "Sample brand",
      category: "Sample category",
      description: "Sample description",
      numReviews: 0,
      price: 0,
      countInStock: 0,
    },
  ]);

  // OR
  // const product = new Product({
  //   user: req.user._id,
  //   name: 'Sample name',
  //   image: '/images/sample.jpg',
  //   brand: 'Sample brand',
  //   category: 'Sample category',
  //   description: 'Sample description',
  //   numReviews: 0,
  //   price: 0,
  //   countInStock: 0
  // });
  // const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, image, brand, category, description, price, countInStock } =
    req.body;

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
  });

  res.status(200).json(updatedProduct);
  // if product is not found this route handler throws an error and the errorMiddleware.js - errorHandler() intercepts it, https://expressjs.com/en/guide/error-handling.html
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedProduct);
});

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  // handle pagination
  const perPage = Number(req.query.perPage) || 3; // number of products per page; can also be received as query param
  const page = Number(req.query.page) || 1; // retrieve the page requested as a query param from the URL

  // handle search term
  const searchTerm = req.query.searchTerm
    ? { name: { $regex: req.query.searchTerm, $options: "i" } }
    : {};

  const count = await Product.countDocuments(searchTerm); // returns the number of all products
  const pages = Math.ceil(count / perPage);

  // this is done when frontend requests a page which doesnt exist; `overridePage` is needed as `page` is read-only!!!
  let overridePage;
  if (pages < page) overridePage = pages;

  const products = await Product.find(searchTerm)
    .limit(perPage)
    .skip(perPage * ((overridePage || page) - 1));
  res.json({ products, page: overridePage || page, pages, perPage });
});

// @desc Fetch a product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
  // if product is not found this route handler throws an error and the errorMiddleware.js - errorHandler() intercepts it, https://expressjs.com/en/guide/error-handling.html
});

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  // Find the validation errors in this request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ mesage: "Review added" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }

  res.status(201).json(createdProduct);
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({rating: -1}).limit(3); // sort in `descending` order i.e. 5, 4, 3 etc AND return the first 3 only
  res.status(200).json(products);
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts, 
};

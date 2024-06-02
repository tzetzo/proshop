import { Router } from "express";
import { check } from "express-validator";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { auth, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").get(getProducts).post(auth, admin, createProduct); // same as:
// router.get("/", getProducts);

// its important for this route to be BEFORE "/:id" otherwise `top` will be interpreted as `id` 
router.route("/top").get(getTopProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(auth, admin, updateProduct)
  .delete(auth, admin, deleteProduct);

router.route("/:id/reviews").post(
  auth, // validate the rating and comment
  [
    check("rating", "Please choose a rating between 1 and 5").isIn([1,2,3,4,5]),
    check("comment", "Please write a comment of min 30 characters").isLength({ min: 30 }),
  ],
  createProductReview
);

export default router;

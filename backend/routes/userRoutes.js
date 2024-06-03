import { Router } from "express";
import { check } from "express-validator";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { auth, admin } from "../middleware/authMiddleware.js";
import checkObjectId from '../middleware/checkObjectId.js';

const router = Router();

// we can chain routes with same url and different methods
router
  .route("/")
  .post(
    [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Please enter a password with 6 or more characters"
      ).isLength({ min: 6 }),
    ],
    registerUser
  )
  .get(auth, admin, getUsers);

router.route("/login").post(loginUser);
router.route("/logout").post(auth, logoutUser); // we need auth so to have req.user available
router
  .route("/profile")
  .get(auth, getUserProfile)
  .put(
    auth,
    // validate the name, email or password if provided
    [
      check("name", "Name is required").optional().not().isEmpty(),
      check("email", "Please include a valid email").optional().isEmail(),
      check("password", "Please enter a password with 6 or more characters")
        .optional()
        .isLength({ min: 6 }),
    ],
    updateUserProfile
  );

router
  .route("/:id")
  .get(auth, admin, checkObjectId, getUserById)
  .delete(auth, admin, checkObjectId, deleteUser)
  .put(
    auth,
    admin,
    checkObjectId,
    // validate the name, email, password or isAdmin if provided
    [
      check("name", "Name is required").optional().not().isEmpty(),
      check("email", "Please include a valid email").optional().isEmail(),
      check("password", "Please enter a password with 6 or more characters")
        .optional()
        .isLength({ min: 6 }),
      check("isAdmin", "Please enter a Boolean for isAdmin")
      .optional()
      .isBoolean(),
    ],
    updateUser
  );

export default router;

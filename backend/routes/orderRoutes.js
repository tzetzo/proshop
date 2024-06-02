import { Router } from "express";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders,
} from "../controllers/orderController.js";
import { auth, admin } from "../middleware/authMiddleware.js";

const router = Router();

// we can chain routes with same url and different methods
router
  .route("/")
  .post(
    auth,
    createOrder
  )
  .get(auth, admin, getAllOrders);

router.route("/myorders").get(auth, getMyOrders);


router.route("/:id").get(auth, getOrderById);
router
  .route("/:id/pay")
  .put(
    auth,
    updateOrderToPaid
  );
  router
  .route("/:id/deliver")
  .put(
    auth,
    admin,
    updateOrderToDelivered
  );



export default router;

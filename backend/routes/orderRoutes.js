import { Router } from "express";

import {
    createOrder,
    deleteOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders,
} from "../controllers/orderController.js";
import { auth, admin } from "../middleware/authMiddleware.js";
import checkObjectId from '../middleware/checkObjectId.js';

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


router.route("/:id").get(auth, checkObjectId, getOrderById).delete(auth, checkObjectId, deleteOrder);
router
  .route("/:id/pay")
  .put(
    auth,
    checkObjectId,
    updateOrderToPaid
  );
  router
  .route("/:id/deliver")
  .put(
    auth,
    admin,
    checkObjectId,
    updateOrderToDelivered
  );



export default router;

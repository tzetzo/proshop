import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc Create new order
// @route POST /api/orders
// @access Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (cartItems?.length === 0) {
    res.status(400);
    throw new Error("No items ordered");
  }

  // get the cart items from our database
  const itemsFromDB = await Product.find({
    _id: { $in: cartItems.map((item) => item._id) },
  });

  // map over the cart items and use the price from our items from database
  const dbCartItems = cartItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );
    return {
      ...itemFromClient,
      price: matchingItemFromDB.price,
      // swapping `_id` for `productId`
      productId: itemFromClient._id,
      _id: null,
    };
  });

  // calculate prices
  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
  calcPrices(dbCartItems);

  const order = new Order({
    // await Order.create({ ... }) as alternative, see productController
    user: req.user._id,
    cartItems: dbCartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    // delete UNPAID orders 15 minutes after they are created (might need to wait 1 min more to see it deleted in https://cloud.mongodb.com/)
    // the other part of the implementation is in orderModel.js
    expireAt: Date.now() + 15 * 60 * 1000 // ( 15 minutes * 60 seconds) * 1000 milliseconds
  });

  try {
    const createdOrder = await order.save();
    if (!createdOrder) {
      res.status(503);
      throw new Error("Unable to create order, try again");
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(503);
    throw new Error("Unable to create order, try again");
  }
});

// @desc Delete order
// @route DELETE /api/orders/:id
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
  // the admins can delete any order
  if(req.user.isAdmin){
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedOrder);
  }
  
  // for regular users they can delete only their orders
  try {
    const deletedOrder = await Order.findOneAndDelete({_id: req.params.id, user: req.user._id});
    if(!deletedOrder) throw new Error("Cannot delete order");
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Get order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      isDelivered: true,
      deliveredAt: Date.now(),
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user", // from the users collection include the name and email
    ["name", "email"]
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json(order);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", ["id", "name"]);
  res.status(200).json(orders);
});

export {
  createOrder,
  deleteOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
};

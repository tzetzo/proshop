import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      // the user who created the order
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // the user comes from the User collection
    },
    cartItems: [
      {
        // user can order several different products; this can be extracted in separate Schema like reviewSchema
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      // default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      // default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      // default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      // default: 0.0,
    },
    isPaid: {
      type: Boolean,
      // required: true,
      default: false,
    },
    paidAt: { type: Date },
    isDelivered: {
      type: Boolean,
      // required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
      // required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // adds two properties of type Date to your schema - createdAt & updatedAt
  }
);

// garbage collection of unpaid orders
// https://www.mongodb.com/docs/manual/tutorial/expire-data/
// in orderController.js we set the expiration time
orderSchema.index(
  { expireAt: 1 }, // creates index for the expireAt field!
  { partialFilterExpression: { isPaid: false }, expireAfterSeconds: 0 }
);

// orderSchema.index(
//   { createdAt: 1 }, // creates index for the auto created createdAt field!
//   { partialFilterExpression: { isPaid: false }, expireAfterSeconds: 15 * 60 } // 15 minutes * 60 seconds
// );

const Order = mongoose.model("Order", orderSchema);

export default Order;

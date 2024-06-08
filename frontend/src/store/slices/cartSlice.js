import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../utils/cartUtils";

// ebay also uses localstorage to save our choice of products so far
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((i) => i._id === item._id);

      if (existItem) {
        // if the item already exists we overide it with the new item added
        state.cartItems = state.cartItems.map((i) =>
          i._id === item._id ? item : i,
        );
      } else {
        state.cartItems.push(item);
        // state.cartItems = [...state.cartItems, item];
      }

      // state = updateCart(state); // dont do this!!!
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload,
      );
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  resetCart,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

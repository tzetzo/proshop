import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./apis/api";
import { cartReducer } from "./slices/cartSlice";
import { authReducer } from "./slices/authSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  // devTools: process.env.NODE_ENV !== "production", // true by default
});

// setupListeners(store.dispatch);

export { store };

// central export place for all hooks!
export {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useUploadImageMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
} from "./apis/productsApi";
export {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "./apis/usersApi";
export {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderToDeliveredMutation,
} from "./apis/ordersApi";

// central export place for all action creators!
export {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  resetCart,
} from "./slices/cartSlice";
export { setCredentials, removeCredentials } from "./slices/authSlice";

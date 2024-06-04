import { ORDERS_URL, PAYPAL_URL } from "../../constants";
import { api } from "./api";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: ORDERS_URL,
        method: "POST",
        body,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, orderDetails }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: orderDetails,
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    updateOrderToDelivered: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/deliver`,
        method: "PUT",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderToDeliveredMutation,
} = ordersApi;

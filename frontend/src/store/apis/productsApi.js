import { PRODUCTS_URL, UPLOAD_URL } from "../../constants";
import { api } from "./api";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "PUT",
        body,
      }),
      // we want to refetch the products after the update because we redirect to `/admin/productlist`
      invalidatesTags: ["getProducts"],
    }),
    uploadImage: builder.mutation({
      query: (body) => ({
        url: UPLOAD_URL,
        method: "POST",
        body,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getProducts: builder.query({
      query: ({ page, perPage, searchTerm }) => ({
        url: PRODUCTS_URL,
        params: {
          // includes `?page=3&perPage=6&searchTerm=iPhone` in the request as query params
          page,
          perPage,
          searchTerm,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["getProducts"],
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProductReview: builder.mutation({
      query: ({ id, body }) => ({
        url: `${PRODUCTS_URL}/${id}/reviews`,
        method: "POST",
        body,
      }),
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
        method: "GET"
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useUploadImageMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
} = productsApi;

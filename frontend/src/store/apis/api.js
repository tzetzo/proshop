import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants";

// the api makes it easy to interact with the backend server
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), //to use axios instead https://medium.com/@prashanta0234/using-axios-instance-with-interceptors-in-redux-toolkit-query-rtk-query-a4111eab5eaa
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({}),
});

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("x-auth-token", token);
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // Public - get all products
    getAllProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    // Vendor - get own products by vendorId
    getVendorProducts: builder.query({
      query: (vendorId) => `/products/vendorProducts/${vendorId}`,
      providesTags: ["Product"],
    }),
    // Get single product
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
    // Vendor - create product
    createProduct: builder.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    // Vendor - update product
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    // Vendor - delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetVendorProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
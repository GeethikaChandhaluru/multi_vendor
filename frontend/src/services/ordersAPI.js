import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000/api",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("x-auth-token", token);
            return headers;
        },
    }),
    tagTypes: ["Order", "Cart"],
    endpoints: (builder) => ({
        getCart: builder.query({
            query: (userId) => `/orders/cart/${userId}`,
            providesTags: ["Cart"],
        }),
        updateCart: builder.mutation({
            query: ({ userId, cartItems }) => ({
                url: "/orders/addToCart",
                method: "POST",
                body: { userId, cartItems },
            }),
            invalidatesTags: ["Cart"],
        }),
        // Place order from full cart
        createOrder: builder.mutation({
            query: () => ({ url: "/orders", method: "POST", body: {} }),
            invalidatesTags: ["Order", "Cart"],
        }),
        // Buy Now — single product, skip cart
        buyNow: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: "/orders/buyNow",
                method: "POST",
                body: { productId, quantity },
            }),
            invalidatesTags: ["Order"],
        }),
        getMyOrders: builder.query({
            query: () => "/orders/myorders",
            providesTags: ["Order"],
        }),
        getVendorOrders: builder.query({
            query: () => "/orders",
            providesTags: ["Order"],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `/orders/${orderId}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Order"],
        }),
        // Buyer cancel — restores stock on backend
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `/orders/${orderId}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useUpdateCartMutation,
    useCreateOrderMutation,
    useBuyNowMutation,
    useGetMyOrdersQuery,
    useGetVendorOrdersQuery,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
} = ordersApi;
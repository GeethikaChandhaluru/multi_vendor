// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/auth" }),
  endpoints: (builder) => ({
    // getAllTodos: builder.query({
    //   query: () => `/`,
    // }),
    login: builder.mutation({
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
      }),
      // Response includes: token, role, name, id, and role-specific data
      transformResponse: (response) => response,
    }),
    signup: builder.mutation({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),
    // deleteTodoItem: builder.mutation({
    //   query: (id) => {
    //     return {
    //       url: `/${id}`,
    //       method: "DELETE",
    //     };
    //   },
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useSignupMutation, useLoginMutation } = authApi;
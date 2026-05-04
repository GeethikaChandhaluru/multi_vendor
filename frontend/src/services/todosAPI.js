// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://multi-vendor-80b3.onrender.com/todos" }),
  endpoints: (builder) => ({
    getAllTodos: builder.query({
      query: () => `/`,
    }),
    addTodoItem: builder.mutation({
      query: (todo) => ({
        url: "/",
        method: "POST",
        body: todo,
      }),
    }),
    deleteTodoItem: builder.mutation({
      query: (id) => {
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTodosQuery,
  useLazyGetAllTodosQuery,
  useAddTodoItemMutation,
  useDeleteTodoItemMutation,
} = todosApi;

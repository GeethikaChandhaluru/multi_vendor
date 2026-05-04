import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import todolistReducer from "../features/todolist/todolistSlice";
import likedislikeReducer from "../features/likesdislikes/likesdislikesSlice";
import { productsApi } from "../services/productsAPI";
import { recipesApi } from "../services/recipesAPI";
import { todosApi } from "../services/todosAPI";
import { authApi } from "../services/auth";
import { ordersApi } from "../services/ordersAPI";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counterReducer,
    todolistReducer,
    likedislikeReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [recipesApi.reducerPath]: recipesApi.reducer,
    [todosApi.reducerPath]: todosApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      recipesApi.middleware,
      todosApi.middleware,
      authApi.middleware,
      ordersApi.middleware,
    ),
});

setupListeners(store.dispatch);
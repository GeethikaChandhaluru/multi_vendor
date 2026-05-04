import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Counter from "./features/counter/Counter.jsx";
import Todolist from "./features/todolist/Todolist.jsx";
import Products from "./features/products/Products.jsx";
import Recipes from "./features/recipes/Recipes.jsx";
import RecipeDetails from "./features/recipes/RecipeDetails.jsx";
import Mytodos from "./features/mytodos/Mytodos.jsx";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";

// Vendor pages
import VendorDashboard from "./features/vendor/VendorDashboard.jsx";
import AddProduct from "./features/vendor/AddProduct.jsx";
import ManageProducts from "./features/vendor/ManageProducts.jsx";
import VendorOrders from "./features/vendor/VendorOrders.jsx";

// Buyer pages
import BuyerDashboard from "./features/buyer/BuyerDashboard.jsx";
import BrowseProducts from "./features/buyer/BrowseProducts.jsx";
import Cart from "./features/buyer/Cart.jsx";
import MyOrders from "./features/buyer/MyOrders.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/counter", element: <Counter /> },
      { path: "/todolist", element: <Todolist /> },
      { path: "/products", element: <Products /> },
      {
        path: "/recipes",
        element: <Recipes />,
        children: [
          { path: "/recipes/recipeDetails/:id", element: <RecipeDetails /> },
        ],
      },
      { path: "/mytodos", element: <Mytodos /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },

      // Vendor routes
      { path: "/vendor/dashboard", element: <VendorDashboard /> },
      { path: "/vendor/add-product", element: <AddProduct /> },
      { path: "/vendor/products", element: <ManageProducts /> },
      { path: "/vendor/orders", element: <VendorOrders /> },

      // Buyer routes
      { path: "/buyer/dashboard", element: <BuyerDashboard /> },
      { path: "/buyer/browse", element: <BrowseProducts /> },
      { path: "/buyer/cart", element: <Cart /> },
      { path: "/buyer/orders", element: <MyOrders /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
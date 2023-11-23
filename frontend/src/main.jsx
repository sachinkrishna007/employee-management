import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPrivateRoutes from "./screens/adminScreens/AdminprivateRoute.jsx";
import Adduser from "./screens/adminScreens/Adduser.jsx";

import AdminLoginScreen from "./screens/adminScreens/LoginScreen.jsx";
import AdminHomeScreen from "./screens/adminScreens/homeScreen.jsx";
import UsersManagementScreen from "./screens/adminScreens/userManagement.jsx";

import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* ===================================== Admin Routes ===================================== */}

      <Route path="/admin/login" element={<AdminLoginScreen />} />
      <Route path="/admin" element={<AdminHomeScreen />} />
      <Route path="" element={<AdminPrivateRoutes />}>
        <Route path="/admin/manage-users" element={<UsersManagementScreen />} />
        <Route path="/admin/add-users" element={<Adduser />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);

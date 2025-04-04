import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Account,
  Checkout,
  PageNotFound,
  OrderSuccess,
  AddProduct,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import { Toaster } from "react-hot-toast";

// Định nghĩa biến CSS chung
import "./styles.css";

// Redirect functions
const AdminRedirect = () => {
  window.location.href = "http://localhost:3001";
  return null;
};

const AdminLoginRedirect = () => {
  window.location.href = "http://localhost:3001/login";
  return null;
};

// Simple loading component
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>Đang tải...</div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop>
        <Provider store={store}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Products />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/admin-login" element={<AdminLoginRedirect />} />
              <Route path="/admin" element={<AdminRedirect />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="/product/*" element={<PageNotFound />} />
            </Routes>
          </PageTransition>
        </Provider>
      </ScrollToTop>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);

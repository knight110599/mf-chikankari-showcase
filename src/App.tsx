import { Route, Routes } from "react-router-dom";

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";

import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import WholesaleRegistrationPage from "./pages/WholesaleRegistrationPage";

import AccountPage from "./pages/account/AccountPage";

import AdminAddProductPage from "./pages/admin/AdminAddProductPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminWholesalePage from "./pages/admin/AdminWholesalePage";

import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

function App() {
  return (
    <Routes>
      {/* Customer website */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        <Route path="products" element={<ProductsPage />} />
        <Route
          path="products/:slug"
          element={<ProductDetailsPage />}
        />
<Route
  path="/wholesale"
  element={<WholesaleRegistrationPage />}
/>
        <Route path="categories" element={<CategoriesPage />} />
        <Route
          path="categories/:slug"
          element={<CategoryProductsPage />}
        />

        <Route path="cart" element={<CartPage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<AccountPage />} />
          <Route
            path="checkout"
            element={<CheckoutPage />}
          />
        </Route>
      </Route>

      {/* Public admin login */}
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Protected admin area */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="dashboard"
            element={<AdminDashboardPage />}
          />

          <Route
            path="products"
            element={<AdminProductsPage />}
          />

          <Route
            path="products/new"
            element={<AdminAddProductPage />}
          />

          <Route
            path="products/:id/edit"
            element={<AdminEditProductPage />}
          />

          <Route
            path="categories"
            element={<AdminCategoriesPage />}
          />

<Route
  path="inventory"
  element={<AdminInventoryPage />}
/>
<Route
  path="/admin/wholesale"
  element={<AdminWholesalePage />}
/>
          <Route
            path="orders"
            element={<AdminOrdersPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
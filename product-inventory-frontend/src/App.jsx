import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import ProductDetails from './pages/ProductDetails';
import CategoryDetails from './pages/CategoryDetails';
import AddProductForm from './pages/AddProductForm';
import AddCategoryForm from './pages/AddCategoryForm';
import UpdateProduct from './pages/UpdateProduct';
import UpdateCategory from './pages/UpdateCategory';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import ChangePasswordForm from './pages/ChangePasswordForm';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import ForgotPasswordForm from "./pages/ForgotPasswordForm";
import ChangePasswordFromOtpForm from './pages/ChangePasswordFromOtpForm';


const RequireAuth = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole') || 'ADMIN';
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4] dark:bg-base-200 w-full overflow-x-hidden">
      {!hideNavbar && <Navbar />}
      <div className="w-full">{children}</div>
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Shared Routes */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />
          <Route path="/product/:id" element={<RequireAuth><ProductDetails /></RequireAuth>} />
          <Route path="/category/:id" element={<RequireAuth><CategoryDetails /></RequireAuth>} />
          <Route path="/change-password" element={<RequireAuth><ChangePasswordForm /></RequireAuth>} />
          
          {/* Admin */}
          <Route path="/add-product" element={<RequireAuth allowedRoles={['ADMIN']}><AddProductForm /></RequireAuth>} />
          <Route path="/add-category" element={<RequireAuth allowedRoles={['ADMIN']}><AddCategoryForm /></RequireAuth>} />
          <Route path="/update-product/:id" element={<RequireAuth allowedRoles={['ADMIN']}><UpdateProduct /></RequireAuth>} />
          <Route path="/update-category/:id" element={<RequireAuth allowedRoles={['ADMIN']}><UpdateCategory /></RequireAuth>} />
          
          {/* Customer */}
          <Route path="/cart" element={<RequireAuth allowedRoles={['CUSTOMER']}><Cart /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth allowedRoles={['CUSTOMER']}><Orders /></RequireAuth>} />

          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ChangePasswordFromOtpForm />} />
        </Routes>
      </AppLayout>
    </CartProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Background3D from './components/Background3D';
import Home from './pages/Home';
import Login from './pages/Login';
import PolicyPage from './pages/PolicyPage';
import AdminLogin from './components/admin/Login';
import AdminDashboard from './components/admin/Dashboard';

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Consumer Routes */}
          <Route
            path="/"
            element={
              <>
                <Background3D />
                <Navbar />
                <Cart />
                <Wishlist />
                <Home />
              </>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/policy/:slug" element={<PolicyPage />} />

          {/* Admin Routes — Completely Separate UI */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}

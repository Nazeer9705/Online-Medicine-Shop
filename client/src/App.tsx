import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { MobileBottomNav } from './components/ui/MobileBottomNav';
import { MediAssistDrawer } from './components/common/MediAssistDrawer';
import { VoiceSearchModal } from './components/common/VoiceSearchModal';

// Pages
import { HomePage } from './pages/public/HomePage';
import { MedicinesPage } from './pages/public/MedicinesPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { PrescriptionsPage } from './pages/customer/PrescriptionsPage';

import { SellerDashboard } from './pages/seller/SellerDashboard';
import { PharmacistDashboard } from './pages/pharmacist/PharmacistDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-slate-500">Authenticating session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const [isMediAssistOpen, setIsMediAssistOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          onOpenMediAssist={() => setIsMediAssistOpen(true)}
          onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicines/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Routes */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute roles={['CUSTOMER']}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={['CUSTOMER']}><CustomerOrdersPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/prescriptions" element={<ProtectedRoute roles={['CUSTOMER']}><PrescriptionsPage /></ProtectedRoute>} />

            {/* Role Portals */}
            <Route path="/seller/dashboard" element={<ProtectedRoute roles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />
            <Route path="/pharmacist/dashboard" element={<ProtectedRoute roles={['PHARMACIST']}><PharmacistDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
      <MobileBottomNav />

      <MediAssistDrawer isOpen={isMediAssistOpen} onClose={() => setIsMediAssistOpen(false)} />
      <VoiceSearchModal isOpen={isVoiceSearchOpen} onClose={() => setIsVoiceSearchOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

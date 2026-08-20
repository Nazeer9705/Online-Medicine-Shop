import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User as UserIcon, MapPin, Pill, ShieldCheck, Truck, Bot, Mic, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  onOpenMediAssist: () => void;
  onOpenVoiceSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMediAssist, onOpenVoiceSearch }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistProductIds } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* 1. Top Announcement Bar */}
      <div className="bg-teal-700 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Free delivery on orders above ₹499</span>
            <span className="hidden sm:flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Medicines</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onOpenMediAssist} className="flex items-center gap-1 bg-teal-800 hover:bg-teal-900 px-2 py-0.5 rounded transition">
              <Bot className="w-3.5 h-3.5 text-yellow-300" /> MediAssist AI Helper
            </button>
            <span className="hidden md:inline">Need assistance? Call: 1800-MEDICARE</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-teal-700 text-white p-2 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">MEDI<span className="text-teal-700">CARE</span></span>
            <span className="block text-[10px] tracking-wider text-slate-500 font-semibold uppercase -mt-1">Online Pharmacy</span>
          </div>
        </Link>

        {/* Location Picker */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg cursor-pointer transition">
          <MapPin className="w-4 h-4 text-teal-700" />
          <div>
            <span className="block font-semibold text-slate-900">Deliver to</span>
            <span className="text-[11px]">Hyderabad 500081</span>
          </div>
        </div>

        {/* Global Mega Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines, brands & health products (e.g. Paracetamol, Vitamin C)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={onOpenVoiceSearch}
              title="Voice Search"
              className="absolute right-3 text-slate-400 hover:text-teal-700 transition"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Actions Controls */}
        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="relative p-2 text-slate-600 hover:text-teal-700 transition">
            <Heart className="w-5 h-5" />
            {wishlistProductIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistProductIds.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 px-3 py-2 rounded-xl font-medium text-sm transition">
            <ShoppingCart className="w-5 h-5 text-teal-700" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="bg-teal-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Account Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 transition"
              >
                <UserIcon className="w-4 h-4 text-teal-700" />
                <span className="max-w-[100px] truncate">{user.fname}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.fname} {user.lname}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {user.role}
                    </span>
                  </div>

                  {user.role === 'CUSTOMER' && (
                    <>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Dashboard</Link>
                      <Link to="/orders" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">My Orders</Link>
                      <Link to="/prescriptions" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Prescriptions</Link>
                    </>
                  )}

                  {user.role === 'SELLER' && (
                    <>
                      <Link to="/seller/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Seller Portal</Link>
                      <Link to="/seller/products" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Manage Products</Link>
                      <Link to="/seller/inventory" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Stock & Batches</Link>
                    </>
                  )}

                  {user.role === 'PHARMACIST' && (
                    <Link to="/pharmacist/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Rx Approval Queue</Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Admin Console</Link>
                  )}

                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 3. Category Links Navigation Bar */}
      <nav className="border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto text-xs font-semibold text-slate-700 py-2.5 scrollbar-none">
          <Link to="/medicines" className="hover:text-teal-700 whitespace-nowrap">All Medicines</Link>
          <Link to="/medicines?category=pain-relief" className="hover:text-teal-700 whitespace-nowrap">Pain Relief</Link>
          <Link to="/medicines?category=vitamins-supplements" className="hover:text-teal-700 whitespace-nowrap">Vitamins & Immunity</Link>
          <Link to="/medicines?category=diabetes-care" className="hover:text-teal-700 whitespace-nowrap">Diabetes Care</Link>
          <Link to="/medicines?category=cold-flu" className="hover:text-teal-700 whitespace-nowrap">Cold & Cough</Link>
          <Link to="/medicines?category=medical-devices" className="hover:text-teal-700 whitespace-nowrap">Medical Devices</Link>
          <Link to="/offers" className="text-teal-700 font-bold whitespace-nowrap flex items-center gap-1">🔥 Special Offers</Link>
          <Link to="/blog" className="hover:text-teal-700 whitespace-nowrap">Health Blog</Link>
          <Link to="/about" className="hover:text-teal-700 whitespace-nowrap">About Us</Link>
          <Link to="/faq" className="hover:text-teal-700 whitespace-nowrap">FAQ & Help</Link>
        </div>
      </nav>
    </header>
  );
};

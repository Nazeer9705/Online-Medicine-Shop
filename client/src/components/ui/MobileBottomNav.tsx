import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Grid, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 py-2 px-4 flex items-center justify-around text-xs shadow-lg">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link to="/medicines" className={`flex flex-col items-center gap-1 ${isActive('/medicines') ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
        <Search className="w-5 h-5" />
        <span>Search</span>
      </Link>

      <Link to="/cart" className={`relative flex flex-col items-center gap-1 ${isActive('/cart') ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 right-2 bg-teal-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
        <span>Cart</span>
      </Link>

      <Link to={user ? (user.role === 'SELLER' ? '/seller/dashboard' : '/dashboard') : '/login'} className={`flex flex-col items-center gap-1 ${isActive('/dashboard') || isActive('/login') ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
        <UserIcon className="w-5 h-5" />
        <span>Account</span>
      </Link>
    </div>
  );
};

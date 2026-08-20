import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Heart, FileText, MapPin, User, LogOut, ShieldCheck } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-teal-700/60 text-teal-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Verified Medicare Customer
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Good day, {user.fname} 👋</h1>
          <p className="text-xs text-teal-100 mt-1">Manage your pharmacy orders, upload prescriptions, and view address book.</p>
        </div>

        <button onClick={logout} className="bg-teal-700/80 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/orders" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-center space-y-2 group">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit mx-auto group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xs text-slate-800">My Orders</h3>
          <p className="text-[10px] text-slate-500">Track medicine shipments</p>
        </Link>

        <Link to="/prescriptions" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-center space-y-2 group">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl w-fit mx-auto group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xs text-slate-800">Prescriptions</h3>
          <p className="text-[10px] text-slate-500">Upload & view approvals</p>
        </Link>

        <Link to="/wishlist" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-center space-y-2 group">
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl w-fit mx-auto group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xs text-slate-800">Saved Wishlist</h3>
          <p className="text-[10px] text-slate-500">Favorite health products</p>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
          <div className="bg-teal-50 text-teal-600 p-3 rounded-xl w-fit mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xs text-slate-800">Account Safety</h3>
          <p className="text-[10px] text-slate-500">Secured with 2FA & JWT</p>
        </div>
      </div>

      {/* User Profile Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-700" /> Account Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div><span className="text-slate-400 block">Full Name</span><strong className="text-slate-900">{user.fname} {user.lname}</strong></div>
          <div><span className="text-slate-400 block">Email Address</span><strong className="text-slate-900">{user.email}</strong></div>
          <div><span className="text-slate-400 block">Phone Number</span><strong className="text-slate-900">{user.phone || 'N/A'}</strong></div>
          <div><span className="text-slate-400 block">Role</span><strong className="text-teal-700 uppercase">{user.role}</strong></div>
        </div>
      </div>
    </div>
  );
};

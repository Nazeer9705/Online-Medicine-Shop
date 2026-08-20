import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'SELLER') navigate('/seller/dashboard');
      else if (user.role === 'PHARMACIST') navigate('/pharmacist/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-teal-700 text-white p-3 rounded-2xl w-fit mx-auto">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your Medicare account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                required
                placeholder="e.g. john.doe@medicare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-teal-100 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
          <strong className="block text-slate-800 font-bold mb-1">Quick Demo Login Accounts:</strong>
          <div>Customer: <code className="bg-white px-1 font-bold text-teal-800">john.doe@medicare.com</code> / pass123</div>
          <div>Seller: <code className="bg-white px-1 font-bold text-teal-800">apex.pharma@medicare.com</code> / pass123</div>
          <div>Pharmacist: <code className="bg-white px-1 font-bold text-teal-800">pharmacist@medicare.com</code> / pass123</div>
          <div>Admin: <code className="bg-white px-1 font-bold text-teal-800">admin@medicare.com</code> / admin123</div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account? <Link to="/register" className="text-teal-700 font-bold">Register Now</Link>
        </div>
      </div>
    </div>
  );
};

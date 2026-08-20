import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const CartPage: React.FC = () => {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'MEDICARE10') {
      const disc = (subtotal * 10) / 100;
      setDiscount(disc);
      setCouponApplied('MEDICARE10');
    } else if (couponCode.trim().toUpperCase() === 'WELCOME50') {
      setDiscount(50);
      setCouponApplied('WELCOME50');
    } else {
      alert('Invalid coupon code. Try MEDICARE10 or WELCOME50');
    }
  };

  const deliveryFee = subtotal > 499 || items.length === 0 ? 0 : 40;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="bg-teal-50 text-teal-700 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Explore our wide range of pharmaceutical products and essential health supplies.</p>
        <Link to="/medicines" className="inline-block bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-teal-100">
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart ({items.length} items)</h1>
        <button onClick={clearCart} className="text-xs font-semibold text-red-600 hover:underline">Clear Cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <img src={item.product?.image || 'images/pills.png'} alt={item.product?.pname} className="w-16 h-16 object-contain bg-slate-50 p-2 rounded-xl" />

              <div className="flex-1">
                <h3 className="font-bold text-xs text-slate-900">{item.product?.pname}</h3>
                <p className="text-[10px] text-slate-500">{item.product?.dosageForm} • {item.product?.strength}</p>
                <div className="text-xs font-extrabold text-slate-900 mt-1">{formatCurrency(item.product?.sellingPrice || 0)}</div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 font-bold text-slate-600 hover:bg-slate-200 text-xs">-</button>
                <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 font-bold text-slate-600 hover:bg-slate-200 text-xs">+</button>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 h-fit space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Order Summary</h3>

          {/* Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Coupon (MEDICARE10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-semibold"
              />
            </div>
            <button type="submit" className="bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-slate-900">
              Apply
            </button>
          </form>

          {couponApplied && (
            <div className="text-[11px] text-green-700 font-bold bg-green-50 p-2 rounded-lg">
              ✓ Coupon '{couponApplied}' applied!
            </div>
          )}

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
            <div className="flex justify-between"><span>Delivery Fee</span><span>{deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : formatCurrency(deliveryFee)}</span></div>
            <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total</span>
              <span className="text-teal-700">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout', { state: { couponCode: couponApplied } })}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-100 transition"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

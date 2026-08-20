import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { fetchApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const couponCode = location.state?.couponCode || '';
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CreditCard'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    name: 'John Doe',
    phone: '9876543210',
    addressLine: '123 Health Avenue, Flat 4B',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081'
  });

  const deliveryFee = subtotal > 499 ? 0 : 40;
  const discount = couponCode === 'MEDICARE10' ? (subtotal * 10) / 100 : (couponCode === 'WELCOME50' ? 50 : 0);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const hasRxItem = items.some(i => i.product?.prescriptionRequired);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod,
          couponCode
        })
      });

      alert('Order Placed Successfully! Order No: ' + res.order.orderNo);
      navigate('/orders');
    } catch (err: any) {
      alert('Order Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Secure Order Checkout</h1>

      {hasRxItem && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="block font-bold mb-0.5">Prescription Required (Rx):</strong>
            Your order contains prescription-required medication. Ensure your prescription has been submitted for pharmacist verification.
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-teal-700" /> Shipping Address
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" required value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input type="tel" required value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input type="text" required value={address.addressLine} onChange={e => setAddress({ ...address, addressLine: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input type="text" required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Postal Code</label>
                <input type="text" required value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-teal-700" /> Payment Option
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { id: 'COD', label: 'Cash on Delivery (Pay when delivered)', icon: '💵' },
                { id: 'UPI', label: 'UPI / Google Pay / PhonePe (Instant Gateway)', icon: '⚡' },
                { id: 'CreditCard', label: 'Credit / Debit Card', icon: '💳' },
              ].map(opt => (
                <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${paymentMethod === opt.id ? 'border-teal-700 bg-teal-50/50 font-bold text-teal-900' : 'border-slate-200 bg-slate-50'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id as any)} />
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 h-fit space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Order Details</h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-xs text-slate-700">
                <span className="truncate max-w-[140px]">{item.product?.pname} x{item.quantity}</span>
                <span className="font-bold">{formatCurrency((item.product?.sellingPrice || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span></div>
            <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-teal-700">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-teal-100 transition disabled:opacity-50"
          >
            {submitting ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

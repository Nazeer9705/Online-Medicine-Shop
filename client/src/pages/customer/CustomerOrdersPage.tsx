import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { OrderTimeline } from '../../components/common/OrderTimeline';
import { Package, Clock, XCircle } from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/orders')
      .then(res => setOrders(res.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await fetchApi(`/orders/${orderId}/cancel`, { method: 'PATCH' });
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
        alert('Order cancelled successfully.');
      } catch (err: any) {
        alert(err.message || 'Error cancelling order');
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading your orders...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Orders & Purchases</h1>
        <p className="text-xs text-slate-500">Track current medicine delivery status and purchase history</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No orders placed yet</h3>
          <p className="text-xs text-slate-500">Your completed pharmacy purchases will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Order No: </span>
                  <strong className="text-slate-900 font-bold">{order.orderNo}</strong>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="text-slate-500">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {order.status}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Progress Timeline */}
              {order.status !== 'Cancelled' && (
                <div className="px-6 border-b border-slate-100">
                  <OrderTimeline status={order.status} />
                </div>
              )}

              {/* Items List */}
              <div className="p-4 space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-3">
                      <img src={item.product?.image || 'images/pills.png'} alt={item.product?.pname} className="w-10 h-10 object-contain bg-slate-50 p-1 rounded-lg" />
                      <div>
                        <h4 className="font-bold text-slate-900">{item.product?.pname}</h4>
                        <span className="text-[10px] text-slate-400">Qty: {item.quantity} • Unit: {formatCurrency(item.unitPrice)}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              {['Confirmed', 'Pending', 'Processing'].includes(order.status) && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

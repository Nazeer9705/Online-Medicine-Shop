import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Store, Package, TrendingUp, AlertTriangle, Plus, RefreshCw } from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal Form State
  const [showModal, setShowModal] = useState(false);
  const [newProd, setNewProd] = useState({
    pid: '',
    pname: '',
    description: '',
    composition: '',
    mrp: '',
    sellingPrice: '',
    initialStock: '100',
    dosageForm: 'Tablet',
    strength: '500mg'
  });

  const loadSellerData = async () => {
    try {
      const [resAnal, resInv, resOrd] = await Promise.all([
        fetchApi('/seller/analytics'),
        fetchApi('/inventory'),
        fetchApi('/seller/orders')
      ]);
      setAnalytics(resAnal.analytics);
      setInventory(resInv.inventory || []);
      setOrders(resOrd.orderItems || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...newProd,
          categoryId: 'cat-pain-relief' // Fallback category ID
        })
      });
      alert('Product created and added to inventory!');
      setShowModal(false);
      loadSellerData();
    } catch (err: any) {
      alert(err.message || 'Error creating product');
    }
  };

  const handleRestock = async (invId: string) => {
    const qty = prompt('Enter quantity to add to stock:', '50');
    if (qty && parseInt(qty) > 0) {
      try {
        await fetchApi(`/inventory/${invId}/restock`, {
          method: 'PATCH',
          body: JSON.stringify({ restockQuantity: parseInt(qty) })
        });
        loadSellerData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading vendor portal...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Vendor Management Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Apex Pharmacy Supplies Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage product catalog, FEFO stock batches, and customer sales orders</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-900 transition"
        >
          <Plus className="w-4 h-4" /> Add New Medicine
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Vendor Revenue</span>
          <h3 className="text-xl font-extrabold text-slate-900">{formatCurrency(analytics?.totalRevenue || 0)}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Sales Orders</span>
          <h3 className="text-xl font-extrabold text-slate-900">{analytics?.totalOrders || 0}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Managed Products</span>
          <h3 className="text-xl font-extrabold text-slate-900">{analytics?.totalProducts || 0}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alerts</span>
          <h3 className="text-xl font-extrabold text-amber-600">{analytics?.lowStockCount || 0}</h3>
        </div>
      </div>

      {/* Stock & Batch Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between">
          <span>Live Inventory & FEFO Stock Levels</span>
          <span className="text-xs text-slate-400 font-normal">Auto FEFO First-Expire-First-Out active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Product ID</th>
                <th className="p-3">Medicine Name</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Reorder Threshold</th>
                <th className="p-3">Batch Expiry</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold">{inv.product?.pid}</td>
                  <td className="p-3 font-bold text-slate-900">{inv.product?.pname}</td>
                  <td className="p-3 font-extrabold">
                    <span className={inv.quantity <= inv.reorderLevel ? 'text-red-600' : 'text-slate-900'}>
                      {inv.quantity} units
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{inv.reorderLevel} units</td>
                  <td className="p-3 text-slate-500">{inv.batches?.[0]?.expDate || '2026-12-31'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleRestock(inv.id)}
                      className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Register New Product in Catalog</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product ID (PID)</label>
                  <input type="text" required placeholder="e.g. P107" value={newProd.pid} onChange={e => setNewProd({ ...newProd, pid: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Medicine Name</label>
                  <input type="text" required placeholder="e.g. Cetirizine 10mg" value={newProd.pname} onChange={e => setNewProd({ ...newProd, pname: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Composition</label>
                <input type="text" required placeholder="Cetirizine Hydrochloride 10mg" value={newProd.composition} onChange={e => setNewProd({ ...newProd, composition: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹)</label>
                  <input type="number" required placeholder="50" value={newProd.mrp} onChange={e => setNewProd({ ...newProd, mrp: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input type="number" required placeholder="38" value={newProd.sellingPrice} onChange={e => setNewProd({ ...newProd, sellingPrice: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input type="number" required value={newProd.initialStock} onChange={e => setNewProd({ ...newProd, initialStock: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea rows={2} required placeholder="Product indications and use instructions..." value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 font-bold p-2.5 rounded-xl text-slate-700">Cancel</button>
                <button type="submit" className="flex-1 bg-teal-700 font-bold p-2.5 rounded-xl text-white hover:bg-teal-800">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

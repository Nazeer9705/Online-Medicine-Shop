import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Users, Store, Package, FileText, DollarSign, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/admin/stats'),
      fetchApi('/admin/users')
    ]).then(([resStats, resUsers]) => {
      setStats(resStats.stats);
      setUsers(resUsers.users || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading admin console...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl flex items-center justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">System Administration Console</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Executive Platform Metrics</h1>
          <p className="text-xs text-slate-400 mt-1">Platform revenue governance, user administration, and system audit logs</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Platform Revenue</span>
          <h3 className="text-xl font-extrabold text-teal-700">{formatCurrency(stats?.totalRevenue || 0)}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Registered Customers</span>
          <h3 className="text-xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Verified Vendors</span>
          <h3 className="text-xl font-extrabold text-slate-900">{stats?.totalSellers || 0}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-amber-600 font-medium">Pending Prescriptions</span>
          <h3 className="text-xl font-extrabold text-amber-600">{stats?.pendingPrescriptions || 0}</h3>
        </div>
      </div>

      {/* User Governance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 font-bold text-slate-900 text-sm">
          User Accounts & Access Governance
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{u.fname} {u.lname}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3 text-slate-500">{u.phone || 'N/A'}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-[10px] uppercase text-slate-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-green-700 font-bold">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

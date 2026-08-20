import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Prescription } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Award, CheckCircle2, XCircle, FileText, Clock } from 'lucide-react';

export const PharmacistDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = () => {
    fetchApi('/prescriptions')
      .then(res => setPrescriptions(res.prescriptions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleReview = async (id: string, status: 'Approved' | 'Rejected') => {
    const notes = prompt(`Enter pharmacist clinical notes for ${status.toLowerCase()}ing:`, `Rx verified by licensed Pharmacist Sarah Jenkins`);
    if (notes !== null) {
      try {
        await fetchApi(`/prescriptions/${id}/review`, {
          method: 'PATCH',
          body: JSON.stringify({ status, notes })
        });
        loadQueue();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading pharmacist verification queue...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-teal-900 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-teal-800 p-3 rounded-2xl text-yellow-300">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Licensed Pharmacist Verification Queue</h1>
            <p className="text-xs text-teal-200">Review doctor prescription uploads for Rx medication validation</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 font-bold text-slate-900 text-sm flex justify-between">
          <span>Pending & Reviewed Prescriptions</span>
          <span className="text-xs text-slate-400 font-normal">Total: {prescriptions.length}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {prescriptions.map(rx => (
            <div key={rx.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <strong className="text-slate-900 text-sm">{rx.fileName}</strong>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rx.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    rx.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rx.status}
                  </span>
                </div>
                <p className="text-slate-600">Patient: <strong>{rx.user?.fname} {rx.user?.lname}</strong> ({rx.user?.email})</p>
                <p className="text-slate-400 text-[11px]">Uploaded on: {formatDate(rx.createdAt)} | Notes: {rx.notes}</p>
              </div>

              {rx.status === 'Pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview(rx.id, 'Approved')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-green-100"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Rx
                  </button>
                  <button
                    onClick={() => handleReview(rx.id, 'Rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-red-100"
                  >
                    <XCircle className="w-4 h-4" /> Reject Rx
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 font-medium italic">Reviewed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

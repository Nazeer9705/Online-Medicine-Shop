import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Prescription } from '../../types';
import { formatDate } from '../../utils/formatters';
import { FileText, Upload, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchPrescriptions = () => {
    fetchApi('/prescriptions')
      .then(res => setPrescriptions(res.prescriptions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await fetchApi('/prescriptions', {
        method: 'POST',
        body: JSON.stringify({ notes })
      });
      alert('Prescription uploaded successfully for Pharmacist review.');
      setNotes('');
      fetchPrescriptions();
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading prescriptions...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Prescription Verification Portal</h1>
        <p className="text-xs text-slate-500">Upload doctor prescriptions for pharmacist inspection and order validation</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Upload className="w-4 h-4 text-teal-700" /> Upload New Doctor Prescription
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Upload File (JPG, PNG, PDF)</label>
            <input type="file" className="w-full text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-2" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Notes for Pharmacist (Optional)</label>
            <textarea
              rows={2}
              placeholder="Add details about your doctor or medication requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Submit for Pharmacist Review'}
          </button>
        </form>
      </div>

      {/* Prescriptions History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm">
          Submitted Prescription History
        </div>

        {prescriptions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No prescriptions uploaded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {prescriptions.map(rx => (
              <div key={rx.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2.5 rounded-xl text-teal-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{rx.fileName}</h4>
                    <p className="text-[10px] text-slate-500">{rx.notes}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{formatDate(rx.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    rx.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    rx.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rx.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                    {rx.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                    {rx.status === 'Pending' && <Clock className="w-3 h-3" />}
                    {rx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

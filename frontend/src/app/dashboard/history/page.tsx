'use client';

import { motion } from 'framer-motion';
import { History, FileText, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/history/${user.id || user._id}`);
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setHistoryData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Loading your history...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Medical Visit History
        </h1>
      </header>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Visit History</h2>
        <p className="text-slate-500">A complete record of your past consultations and AI-generated health plans.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Past Consultations
          </h3>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-100">
            <Sparkles className="w-3 h-3" />
            AI ENABLED
          </div>
        </div>

        <div className="overflow-x-auto">
          {historyData.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No previous visit history found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[15%]">Token</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[15%]">Visit Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[35%]">Your Symptoms</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[20%] text-center">Clinical Records</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[15%] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyData.map((record, index) => (
                  <tr 
                    key={index} 
                    className={`transition-colors hover:bg-slate-50/80 ${index === 0 ? 'bg-emerald-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-800 text-white uppercase tracking-wider">
                        {record.tokenNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 text-sm">
                        {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500 italic text-sm">"{record.symptomsRaw || 'No symptoms reported'}"</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <FileText className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {record.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" />
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold uppercase tracking-wider">
                          <Clock className="w-4 h-4" />
                          {record.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}

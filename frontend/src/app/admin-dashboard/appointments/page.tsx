'use client';

import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Appointments() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/all`);
        const data = await res.json();
        if (res.ok) setTokens(data);
      } catch (err) {
        console.error('Error fetching tokens:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
    
    // Auto-refresh every 5 seconds for live view
    const interval = setInterval(fetchTokens, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">Manage scheduled visits and walk-in capacities.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1C4235]" /> Today's Tokens
          </h2>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading && tokens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    Fetching live appointments...
                  </td>
                </tr>
              ) : tokens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No appointments found.</td>
                </tr>
              ) : (
                tokens.map((token, idx) => (
                  <tr key={token._id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{token.tokenNumber}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{token.patientId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        token.riskLevel === 'HIGH' || token.riskLevel === 'CRITICAL' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {token.riskLevel || 'LOW'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        token.status === 'BOOKED' ? 'bg-amber-100 text-amber-700' :
                        token.status === 'ARRIVED' ? 'bg-blue-100 text-blue-700' :
                        token.status === 'WAITING' ? 'bg-purple-100 text-purple-700' :
                        token.status === 'IN_CONSULTATION' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {token.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

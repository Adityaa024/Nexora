'use client';

import { History, FileText, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GlobalHistory() {
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/all`);
        if (res.ok) {
          const data = await res.json();
          setHistoryData(data.map((t: any) => ({
            id: t._id,
            token: t.tokenNumber,
            patient: t.patientId?.name || 'Walk-in Patient',
            date: new Date(t.createdAt).toLocaleDateString(),
            type: 'General', // We can derive this if needed later
            status: t.status
          })));
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Global History</h1>
        <p className="text-slate-500 text-sm mt-1">Hospital-wide clinical records and consultation logs.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-[#1C4235]" /> Past Consultations Archive
          </h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Token</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {historyData.map((record, index) => (
              <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-[#1C4235] text-sm">{record.token}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{record.patient}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{record.date}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{record.type}</td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 bg-[#1C4235] hover:bg-[#112F24] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
                    <FileText className="w-3 h-3" /> View Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

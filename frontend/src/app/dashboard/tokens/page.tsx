'use client';

import { Ticket, Clock, CheckCircle2 } from 'lucide-react';
import { useQueueStore } from '../../../store/useQueueStore';
import { useEffect, useState } from 'react';

export default function MyTokens() {
  const { activeTokens, setActiveTokens } = useQueueStore();
  const [myUserId, setMyUserId] = useState('');
  const [myPatientName, setMyPatientName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setMyUserId(user.id);
      setMyPatientName(user.name || user.firstName + ' ' + user.lastName || 'Guest Patient');
    }
  }, []);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/active`);
        const data = await res.json();
        if (res.ok) {
          const normalized = data.map((t: any) => ({
            id: t._id,
            token: t.tokenNumber,
            name: t.patientId?.name || 'Unknown',
            patientId: t.patientId?._id || t.patientId || null,
            status: t.status,
            priorityScore: t.priorityScore,
            riskLevel: t.riskLevel,
            estimatedWaitTimeMinutes: t.estimatedWaitTimeMinutes || 10
          }));
          setActiveTokens(normalized);
        }
      } catch (err) {
        console.error('Failed to sync live queue:', err);
      }
    };

    fetchQueue();
    const queueInterval = setInterval(fetchQueue, 3000);
    return () => clearInterval(queueInterval);
  }, [setActiveTokens]);

  const myTokenIndex = activeTokens.findIndex(
    (token: any) =>
      (myUserId && (token.patientId === myUserId || token.patientId?._id === myUserId)) || (!myUserId && token.name === myPatientName)
  );

  const myTokens = activeTokens.filter((token: any) => 
    (myUserId && (token.patientId === myUserId || token.patientId?._id === myUserId)) || (!myUserId && token.name === myPatientName)
  );

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          My Active Tokens
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your active queue tickets for the current day.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myTokens.length > 0 ? (
          myTokens.map((token: any, index: number) => (
            <div key={token.id} className="bg-gradient-to-br from-[#02563D] to-[#057A55] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">
                    {index === myTokens.length - 1 ? 'Current Token' : 'Previous Token'}
                  </p>
                  <h2 className="text-4xl font-black">{token.token}</h2>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/30 uppercase">
                  {token.status}
                </span>
              </div>

              <div className="bg-[#024430]/50 rounded-xl p-4 flex justify-between items-center border border-[#0A9167]">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4ADE80]" />
                  <span className="font-medium text-emerald-50">Est. Wait: {token.estimatedWaitTimeMinutes || '--'} min</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Priority</p>
                  <p className="font-bold text-amber-300">{token.riskLevel || 'STANDARD'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col justify-center items-center text-slate-400">
             <CheckCircle2 className="w-16 h-16 mb-4 text-slate-200" />
             <p className="font-bold text-lg text-slate-500">No active tokens found</p>
             <p className="text-sm mt-2">You haven't booked any tokens today. Head to the dashboard to book one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

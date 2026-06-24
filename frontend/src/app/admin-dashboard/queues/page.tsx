'use client';

import { motion } from 'framer-motion';
import { ListTree, Play, UserPlus, Clock, Settings, Stethoscope, Brain, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQueueStore } from '../../../store/useQueueStore';
import { toast } from 'sonner';

export default function ManageQueues() {
  const { activeTokens, setActiveTokens } = useQueueStore();
  const [avgTime, setAvgTime] = useState(10);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allTokens, setAllTokens] = useState<any[]>([]);

  const fetchQueue = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/active`);
      const data = await res.json();
      if (res.ok) {
        setActiveTokens(data);
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    }
    try {
      const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/all`);
      const data2 = await res2.json();
      if (res2.ok) setAllTokens(data2);
    } catch (err) {
      console.error('Failed to fetch all tokens:', err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    const storedAvg = localStorage.getItem('avgWait');
    if (storedAvg) setAvgTime(Number(storedAvg));
    
    return () => clearInterval(interval);
  }, [setActiveTokens]);

  const handleAddPatient = async () => {
    if (!newPatientName || !newPatientEmail) {
      toast.error('Please enter both Full Name and Email');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: '64f1b2c3e4d5a6b7c8d9e0f1', // Dummy admin/walkin ID 
          symptomsRaw: `Walk-in Patient: ${newPatientName} (${newPatientEmail})`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setNewPatientName('');
        setNewPatientEmail('');
        fetchQueue();
        toast.success(`Patient registered. Token assigned: ${data.tokenNumber}`);
      } else {
        toast.error('Failed to add walk-in patient.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallNext = async () => {
    const waitingList = activeTokens.filter((t: any) => t.status === 'WAITING' || t.status === 'ARRIVED' || t.status === 'BOOKED');
    
    try {
      if (waitingList.length > 0) {
        const nextToken = waitingList[0];
        
        // Optimistic UI Update
        setActiveTokens(activeTokens.map((t: any) => 
          t._id === nextToken._id ? { ...t, status: 'IN_CONSULTATION' } : t
        ));

        // Fire and forget
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: nextToken._id, newState: 'IN_CONSULTATION' })
        });

        // Announce it
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/announce`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: nextToken._id })
        });
      }
      fetchQueue();
    } catch (err) {
      console.error('Failed to call next token', err);
    }
  };

  const handleEndSession = async () => {
    const currentActive = activeTokens.find((t: any) => t.status === 'IN_CONSULTATION');
    if (!currentActive) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: currentActive._id, newState: 'COMPLETED' })
      });
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const currentlySeeing = activeTokens.find((t: any) => t.status === 'IN_CONSULTATION');
  const waitingPatients = activeTokens.filter((t: any) => t.status === 'WAITING' || t.status === 'ARRIVED' || t.status === 'BOOKED');

  // Stats calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysTokens = allTokens.filter(t => t.createdAt && t.createdAt.startsWith(todayStr));
  const seenTodayCount = todaysTokens.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Queues (Receptionist)</h1>
          <p className="text-slate-500 text-sm mt-1">Control active consulting rooms and add walk-ins instantly.</p>
        </div>
      </header>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111827] rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[40px]"></div>
          <div className="flex items-center gap-2 mb-1 z-10">
            <h3 className="text-4xl font-black text-pink-400">
              {currentlySeeing ? (currentlySeeing.tokenNumber?.split('-').pop() || currentlySeeing.token?.split('-').pop()) : '--'}
            </h3>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider z-10">Serving now</p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px]"></div>
          <div className="flex items-center gap-2 mb-1 z-10">
            <h3 className="text-4xl font-black text-orange-400">{waitingPatients.length}</h3>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider z-10">In queue</p>
        </div>

        <div className="bg-[#111827] rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px]"></div>
          <div className="flex items-center gap-2 mb-1 z-10">
            <h3 className="text-4xl font-black text-indigo-400">{seenTodayCount}</h3>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider z-10">Seen today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><UserPlus className="w-5 h-5 text-[#1C4235]" /> Quick Add Patient</h2>
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <input 
              type="text" 
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              placeholder="Full Name"
              className="w-full sm:flex-1 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#4ADE80]"
            />
            <input 
              type="email" 
              value={newPatientEmail}
              onChange={(e) => setNewPatientEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full sm:flex-1 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-[#4ADE80]"
            />
            <button disabled={isSubmitting} onClick={handleAddPatient} className="w-full sm:w-auto bg-[#1C4235] whitespace-nowrap text-white px-5 py-2 rounded-lg font-medium hover:bg-[#112F24] disabled:opacity-50 transition-colors shrink-0">
              Assign Token
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">Registers patient and automatically assigns a live token number.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><Settings className="w-5 h-5 text-[#1C4235]" /> Queue Settings</h2>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Average Consultation Time:</span>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={avgTime}
                onChange={(e) => {
                  setAvgTime(Number(e.target.value));
                  localStorage.setItem('avgWait', e.target.value); // Sync to patient
                }}
                className="w-20 border border-slate-200 rounded-lg px-3 py-1 text-center outline-none focus:border-[#4ADE80]"
              />
              <span className="text-slate-500 text-sm">min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Queue List */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-[#1C4235] p-4 flex justify-between items-center">
              <h2 className="text-white font-bold flex items-center gap-2">
                <ListTree className="w-5 h-5 text-[#4ADE80]" />
                General Practitioner Room 1
              </h2>
              <span className="bg-[#4ADE80] text-[#1C4235] text-xs font-black px-2 py-1 rounded-full uppercase tracking-wider">Live</span>
            </div>
            
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div>
                 <h3 className="font-bold text-slate-800 text-lg">Next in line</h3>
                 <p className="text-slate-500 text-sm">{waitingPatients.length} patients waiting</p>
              </div>
              <button onClick={handleCallNext} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" /> Call Next Patient
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {waitingPatients.map((q: any, idx: number) => (
                  <div key={q._id || q.id || idx} className={`flex justify-between items-center bg-white border p-3 rounded-lg shadow-sm ${q.status === 'BOOKED' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                      <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-md">{q.tokenNumber || q.token}</span>
                      <span className="font-medium text-slate-800">{q.name || q.patientId?.name || 'Walk-in'}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{q.status}</span>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Est. Wait: {(idx + 1) * avgTime} min
                    </div>
                  </div>
                ))}
                {waitingPatients.length === 0 && (
                  <div className="text-center py-8 text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-xl">
                    Queue is empty.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Active Clinical Session Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-fit sticky top-6">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <h2 className="text-lg font-bold">Active Clinical Session</h2>
            <Stethoscope className="w-6 h-6 opacity-70" />
          </div>
          
          {currentlySeeing ? (
            <div className="flex-1 p-6 flex flex-col">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider border border-blue-200">
                  {currentlySeeing.tokenNumber || currentlySeeing.token}
                </div>
                <h3 className="text-2xl font-black text-slate-800">{currentlySeeing.patientId?.name || currentlySeeing.name || 'Walk-in Patient'}</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Risk Level: <span className="text-slate-800">{currentlySeeing.riskLevel}</span> (Score: {currentlySeeing.priorityScore})</p>
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Reported Symptoms</label>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 border border-slate-100 mb-4 whitespace-pre-wrap">
                  {currentlySeeing.symptomsRaw || 'None recorded'}
                </div>

                {currentlySeeing.aiRationale && (
                  <>
                    <label className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Brain className="w-3 h-3" /> AI Triage Rationale
                    </label>
                    <div className="bg-purple-50 p-4 rounded-xl text-sm text-purple-900 border border-purple-100">
                      {currentlySeeing.aiRationale}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <button 
                  onClick={async () => {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/announce`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ tokenId: currentlySeeing._id || currentlySeeing.id })
                    });
                    toast.success('Patient announced on screens!');
                  }}
                  className="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 py-3 rounded-xl font-bold transition-colors"
                >
                  Announce Again
                </button>
                <button 
                  onClick={handleEndSession}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  End Consultation
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 min-h-[400px]">
               <div className="bg-white p-6 rounded-full shadow-sm border border-slate-100 mb-4">
                  <CheckCircle2 className="w-12 h-12 text-slate-300" />
               </div>
               <p className="font-medium text-slate-500">No active consultation</p>
               <p className="text-sm mt-2 text-center max-w-xs">Call the next patient from the queue to start a session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

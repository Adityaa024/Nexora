'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Brain, AlertTriangle, UserPlus, Stethoscope, CheckCircle2, PhoneCall, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminControlRoom() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEmergency, setHasEmergency] = useState(false);
  const [emergencyToken, setEmergencyToken] = useState<any>(null);
  const [newPatientNotification, setNewPatientNotification] = useState<{ time: string } | null>(null);

  // Walk-in Modal State
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinSymptoms, setWalkinSymptoms] = useState('');
  const [isBookingWalkin, setIsBookingWalkin] = useState(false);

  // Live Queue Fetching
  const fetchQueue = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/active`);
      const data = await res.json();
      
      const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/all`);
      const allData = await allRes.json();

      if (res.ok && allRes.ok) {
        setTokens(prev => {
          // If queue size increased, trigger new patient notification tag
          if (prev.length > 0 && data.length > prev.length) {
            setNewPatientNotification({
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            setTimeout(() => setNewPatientNotification(null), 8000);
          }
          return data;
        });
        
        setAllTokens(allData);
        
        // Check for emergencies (Critical risk)
        const critical = data.find((t: any) => t.riskLevel === 'CRITICAL' && t.status !== 'IN_CONSULTATION' && t.status !== 'COMPLETED');
        if (critical) {
          setHasEmergency(true);
          setEmergencyToken(critical);
        } else {
          setHasEmergency(false);
        }
      }
    } catch (err) {
      console.error('Error fetching active queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingWalkin(true);
    try {
      // First, create a dummy user or just pass a hardcoded patientId for walk-ins if backend allows it.
      // Alternatively, we should have a /api/queue/book-walkin. Assuming normal book works if we pass a random valid ID.
      // For demo, we use the admin's ID or a dummy ID.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: '64f1b2c3e4d5a6b7c8d9e0f1', // Fallback ID
          symptomsRaw: `${walkinName} (Walk-in): ${walkinSymptoms}`
        })
      });
      if (res.ok) {
        setIsWalkinModalOpen(false);
        setWalkinName('');
        setWalkinSymptoms('');
        fetchQueue();
      } else {
        alert('Failed to book walk-in patient.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBookingWalkin(false);
    }
  };

  const handleCallPatient = async (tokenId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId, newState: 'IN_CONSULTATION' })
      });
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndSession = async (tokenId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId, newState: 'COMPLETED' })
      });
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const activeSession = tokens.find(t => t.status === 'IN_CONSULTATION');
  const waitingTokens = tokens.filter(t => t.status === 'WAITING' || t.status === 'ARRIVED' || t.status === 'BOOKED');
  
  // Calculate today's stats
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysTokens = allTokens.filter(t => t.createdAt && t.createdAt.startsWith(todayStr));
  const completedCount = todaysTokens.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 relative">
      <header className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Control Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4"/> Superuser Access
          </div>
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </header>

      {/* Emergency Banner */}
      {hasEmergency && emergencyToken && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white rounded-2xl p-6 shadow-lg shadow-red-600/20 flex items-start gap-4 mb-8 border border-red-500"
        >
          <AlertTriangle className="w-10 h-10 shrink-0 mt-1 animate-pulse" />
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wide">Emergency Detected</h2>
            <p className="text-red-100 text-lg mt-1 font-medium">
              AI has flagged a critical patient ({emergencyToken.tokenNumber}). Immediate triage required.
            </p>
          </div>
          <button 
            className="ml-auto bg-white text-red-600 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-red-50 transition-colors"
            onClick={() => handleCallPatient(emergencyToken._id)}
          >
            Call Immediately
          </button>
        </motion.div>
      )}

      {/* Overview Cards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Overview</h2>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Data
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Today's Summary Widget */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-full relative z-10 pr-4">
              <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">Today's Summary</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 text-sm font-bold text-slate-500">
                <div className="flex items-center justify-between gap-2">
                  <span>TODAY'S</span>
                  <span className="text-blue-600 text-lg">{todaysTokens.length}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>COMPLETED</span>
                  <span className="text-emerald-500 text-lg">{completedCount}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>SKIPPED</span>
                  <span className="text-amber-500 text-lg">0</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>WAITING</span>
                  <span className="text-blue-600 text-lg">{waitingTokens.length}</span>
                </div>
              </div>
            </div>
            
            <div className="ml-4 relative shrink-0 z-10 hidden sm:flex items-center gap-2">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center shadow-inner">
                <div className="w-7 h-7 bg-white border-2 border-red-500 rounded-full flex items-center justify-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <Link href="/admin-dashboard/queues" className="bg-[#333] hover:bg-black transition-colors rounded-xl w-12 h-16 flex items-center justify-center shadow-lg z-20 cursor-pointer hover:bg-emerald-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Link>
            </div>

            {/* Notification Tag Overlay */}
            <AnimatePresence>
              {newPatientNotification && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 bg-blue-600/95 backdrop-blur-sm z-30 flex items-center justify-center"
                >
                  <div className="text-white text-center">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block">New Patient</span>
                    <p className="font-bold">Added at {newPatientNotification.time}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active Tokens Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="bg-emerald-100 p-3 rounded-xl"><Users className="w-6 h-6 text-emerald-700"/></div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Total Active Tokens</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-slate-800">{tokens.length}</h3>
                <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full uppercase">
                  Inc. Consults
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start">
              <div className="bg-purple-100 p-3 rounded-xl"><Brain className="w-6 h-6 text-purple-700"/></div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                AI Active
              </span>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Predicted Wait</p>
              <h3 className="text-4xl font-black text-slate-800">{waitingTokens.length * 10} m</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Smart Queue Data Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-md"><Users className="w-4 h-4 text-white" /></div>
              Smart Queue
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setIsWalkinModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                Walk-in Patient
              </button>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-blue-100">
                Live
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient & Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waitingTokens.map(token => (
                  <tr key={token._id} className={`hover:bg-slate-50/80 transition-colors group ${token.riskLevel === 'CRITICAL' || token.riskLevel === 'HIGH' ? 'bg-red-50/30 border-l-4 border-l-red-500' : ''}`}>
                    <td className="px-6 py-5">
                      <div className={`font-bold font-mono text-sm ${token.riskLevel === 'CRITICAL' ? 'text-red-700' : 'text-slate-800'}`}>
                        {token.tokenNumber}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1 uppercase">
                        {token.status}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800">{token.patientId?.name || 'Walk-in / Unknown'}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[200px]" title={token.symptomsRaw}>
                        {token.symptomsRaw || 'No symptoms provided'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`font-black text-xl ${token.riskLevel === 'CRITICAL' ? 'text-red-600' : token.riskLevel === 'HIGH' ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {token.priorityScore.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase">{token.riskLevel}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleCallPatient(token._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <PhoneCall className="w-3 h-3" /> Call
                      </button>
                    </td>
                  </tr>
                ))}
                {waitingTokens.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Queue is empty.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Clinical Session Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <h2 className="text-lg font-bold">Active Clinical Session</h2>
            <Stethoscope className="w-6 h-6 opacity-70" />
          </div>
          
          {activeSession ? (
            <div className="flex-1 p-6 flex flex-col">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider border border-blue-200">
                  {activeSession.tokenNumber}
                </div>
                <h3 className="text-2xl font-black text-slate-800">{activeSession.patientId?.name || 'Walk-in Patient'}</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Risk Level: <span className="text-slate-800">{activeSession.riskLevel}</span> (Score: {activeSession.priorityScore})</p>
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Reported Symptoms</label>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 border border-slate-100 mb-4 whitespace-pre-wrap">
                  {activeSession.symptomsRaw || 'None recorded'}
                </div>

                {activeSession.aiRationale && (
                  <>
                    <label className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Brain className="w-3 h-3" /> AI Triage Rationale
                    </label>
                    <div className="bg-purple-50 p-4 rounded-xl text-sm text-purple-900 border border-purple-100">
                      {activeSession.aiRationale}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => handleEndSession(activeSession._id)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  End Consultation
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
               <div className="bg-white p-6 rounded-full shadow-sm border border-slate-100 mb-4">
                  <CheckCircle2 className="w-12 h-12 text-slate-300" />
               </div>
               <p className="font-medium text-slate-500">No active consultation</p>
               <p className="text-sm mt-2 text-center max-w-xs">Call the next patient from the queue to start a session.</p>
            </div>
          )}
        </div>
      </div>

      {/* Walk-in Modal */}
      <AnimatePresence>
        {isWalkinModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" /> Add Walk-in Patient
                </h3>
                <button 
                  onClick={() => setIsWalkinModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleWalkinSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Patient Name</label>
                  <input 
                    required
                    type="text"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Symptoms / Reason</label>
                  <textarea 
                    required
                    rows={4}
                    value={walkinSymptoms}
                    onChange={(e) => setWalkinSymptoms(e.target.value)}
                    placeholder="Describe symptoms for AI triage..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white resize-none"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsWalkinModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isBookingWalkin}
                    className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20"
                  >
                    {isBookingWalkin ? 'Generating Token...' : 'Add to Queue'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

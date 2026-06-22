'use client';

import { motion } from 'framer-motion';
import { Bot, MapPin, Activity, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useQueueStore } from '../../store/useQueueStore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientQueueSpace() {
  const { activeTokens, setActiveTokens } = useQueueStore();
  const [avgTime, setAvgTime] = useState(10);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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

  // Sync avgTime from localStorage and actively poll queue state for live updates
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/queue/active');
        const data = await res.json();
        if (res.ok) {
          // Normalize backend data to match expected frontend structure
          const normalized = data.map((t: any) => ({
            id: t._id,
            token: t.tokenNumber,
            name: t.patientId?.name || 'Unknown',
            patientId: t.patientId?._id || t.patientId || null,
            status: t.status,
            priorityScore: t.priorityScore,
            riskLevel: t.riskLevel
          }));
          setActiveTokens(normalized);
        }
      } catch (err) {
        console.error('Failed to sync live queue:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchQueue();
    const queueInterval = setInterval(fetchQueue, 3000);

    const avgInterval = setInterval(() => {
      const storedAvg = localStorage.getItem('avgWait');
      if (storedAvg) setAvgTime(Number(storedAvg));
    }, 1000);
    
    return () => {
      clearInterval(queueInterval);
      clearInterval(avgInterval);
    };
  }, [setActiveTokens]);
  
  // Find currently serving token
  const currentlyServing = activeTokens.find((t: any) => t.status === 'IN_CONSULTATION');
  
  // Calculate tokens ahead of current patient
  let tokensAhead = 0;
  let myToken: any = null;
  let isMyTurn = false;

  for (const token of activeTokens) {
    const isMatch = (myUserId && token.patientId === myUserId) || (!myUserId && token.name === myPatientName);
    
    if (isMatch) {
      myToken = token;
      if (token.status === 'IN_CONSULTATION') {
        isMyTurn = true;
      }
      break; // Stop counting tokens ahead once we reach the user's token
    }
    
    if (token.status === 'WAITING' || token.status === 'ARRIVED' || token.status === 'BOOKED') {
      tokensAhead++;
    }
  }

  const estimatedWait = tokensAhead * avgTime;

  const [isBooking, setIsBooking] = useState(false);
  const [formData, setFormData] = useState({ department: '', symptoms: '', time: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookToken = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Attempt to get user from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || !user.id) {
      toast.error("You must be logged in to book a token. ID missing.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/queue/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user.id,
          symptomsRaw: formData.symptoms
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to book');
      
      // Simulate socket push for demo if backend isn't linked
      const { activeTokens, setActiveTokens } = useQueueStore.getState();
      setActiveTokens([...activeTokens, {
        id: data._id || Date.now(),
        token: data.tokenNumber,
        name: myPatientName,
        patientId: user.id,
        status: 'BOOKED',
        priorityScore: data.priorityScore || 3,
        riskLevel: data.riskLevel || 'LOW'
      }] as any);
      
      setIsBooking(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to book token');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-500">
        <header className="flex justify-between items-end mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!myToken) {
    if (!isBooking) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-[#057A55]" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">No Active Token</h2>
            <p className="text-slate-500 mt-3 mb-8 text-sm leading-relaxed">
              You are not currently in any queue. Book a token now to get AI-triaged and assigned to a doctor.
            </p>
            <button 
              onClick={() => setIsBooking(true)}
              className="bg-[#02563D] text-white px-8 py-4 rounded-xl font-bold w-full hover:bg-[#057A55] transition-colors shadow-lg shadow-emerald-900/20"
            >
              Book New Token
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Book Consultation</h1>
        <p className="text-slate-500 mb-8">Please provide your details below. Our AI will analyze your symptoms to prioritize your queue position.</p>
        
        <form onSubmit={handleBookToken} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Department / Doctor</label>
            <select 
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#4ADE80] bg-slate-50 focus:bg-white transition-colors"
            >
              <option value="">Select Department...</option>
              <option value="general">General Practitioner (Room 1)</option>
              <option value="pediatrics">Pediatrics (Room 2)</option>
              <option value="cardiology">Cardiology (Room 3)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Describe Symptoms</label>
            <textarea 
              required
              rows={4}
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="E.g., I have been experiencing a severe headache and slight fever since yesterday morning..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#4ADE80] bg-slate-50 focus:bg-white transition-colors resize-none"
            />
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Bot className="w-3 h-3" /> Gemini 1.5 Pro will analyze this text for triage.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Preferred Time Block</label>
            <div className="grid grid-cols-3 gap-3">
              {['Morning', 'Afternoon', 'Evening'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onPointerDown={() => setFormData({ ...formData, time: t })}
                  onClick={() => setFormData({ ...formData, time: t })}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    formData.time === t 
                      ? 'border-[#057A55] bg-emerald-50 text-[#057A55]' 
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button 
              type="button"
              onClick={() => setIsBooking(false)}
              className="flex-1 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-[#02563D] text-white py-4 rounded-xl font-bold hover:bg-[#057A55] transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              {isSubmitting ? 'Analyzing & Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Queue Status</h1>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium">{myPatientName}</span>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome back, {myPatientName} 👋</h2>
        <p className="text-slate-500 mb-8">Here's your real-time queue status synced live with the reception.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Token Card */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`border rounded-2xl p-8 flex flex-col items-center relative overflow-hidden transition-colors duration-500 ${isMyTurn ? 'bg-blue-50 border-blue-200' : 'bg-gradient-to-b from-white to-slate-50 border-slate-200'}`}
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[#057A55] font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4" />
                {isMyTurn ? "IT'S YOUR TURN!" : "Your Token"}
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Token Number</p>
                <h1 className={`text-6xl font-black tracking-tight ${isMyTurn ? 'text-blue-700' : 'text-[#02563D]'}`}>
                  {myToken.token}
                </h1>
              </div>

              <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                {/* Dummy QR code using actual generated logic */}
                <QRCodeSVG value={`VALIDATE-${myToken.token}`} size={160} level="H" fgColor="#02563D" />
              </div>

              <div className="grid grid-cols-3 w-full mt-10 pt-6 border-t border-slate-200 text-center gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Currently Seeing</p>
                  <p className="text-2xl font-bold text-slate-800">{currentlyServing ? currentlyServing.token : '--'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tokens Ahead</p>
                  <p className="text-2xl font-bold text-slate-800">{tokensAhead}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isMyTurn ? 'bg-blue-600 border-blue-700 text-white shadow-lg animate-pulse' : 'bg-emerald-50 border-emerald-100'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isMyTurn ? 'text-blue-200' : 'text-[#057A55]'}`}>Est Wait Time</p>
                  <p className={`text-2xl font-bold ${isMyTurn ? 'text-white' : 'text-slate-800'}`}>{isMyTurn ? 'NOW' : `${estimatedWait} min`}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Insights Column */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-[#02563D] rounded-2xl p-6 text-emerald-50 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-6">
                <Bot className="w-5 h-5 text-[#4ADE80]" />
                <h3 className="font-bold text-lg">Queue Intelligence</h3>
              </div>

              <div className="bg-[#057A55] rounded-xl p-5 mb-4 border border-[#0A9167]">
                <p className="text-[#8DB4A6] text-xs font-bold uppercase tracking-wider mb-2">Live Computation</p>
                <div className="text-sm font-medium leading-relaxed text-white">
                  Wait time is dynamically computed based on {tokensAhead} patients ahead × {avgTime} minute moving average duration.
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl">
                <Activity className="w-5 h-5 text-[#4ADE80] animate-pulse" />
                <span className="text-sm font-medium">Real-time WebSocket active</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

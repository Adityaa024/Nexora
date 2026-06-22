'use client';

import { motion } from 'framer-motion';
import { ScanLine, Search, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

import jsQR from 'jsqr';

export default function CheckInScanner() {
  const [tokenInput, setTokenInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<{success: boolean, msg: string} | null>(null);

  const handleVerify = async (overrideToken?: string) => {
    const tokenToVerify = overrideToken || tokenInput;
    if (!tokenToVerify) return;
    
    setIsVerifying(true);
    setScanResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/queue/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenNumber: tokenToVerify })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      
      setScanResult({ success: true, msg: `Verified: ${data.patientId?.name || 'Patient'} marked as ARRIVED.` });
      if (!overrideToken) setTokenInput('');
    } catch (err: any) {
      setScanResult({ success: false, msg: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            const val = code.data;
            if (val.startsWith('VALIDATE-')) {
              const tokenValue = val.split('VALIDATE-')[1];
              setTokenInput(tokenValue);
              handleVerify(tokenValue);
            } else {
               setScanResult({ success: false, msg: 'Invalid QR Code format.' });
            }
          } else {
             setScanResult({ success: false, msg: 'No QR code found in the image.' });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Check-in Scanner</h1>
        <p className="text-slate-500 text-sm mt-1">Scan patient QR codes or manually enter token IDs to mark arrival.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="w-64 h-64 border-4 border-dashed border-[#1C4235] rounded-xl flex items-center justify-center bg-slate-50 relative overflow-hidden">
            <Scanner 
              onScan={(result) => {
                if (result && result.length > 0) {
                  const val = result[0].rawValue;
                  if (val.startsWith('VALIDATE-')) {
                    setTokenInput(val.split('VALIDATE-')[1]);
                    handleVerify(); // Auto verify if we can
                  }
                }
              }}
              formats={['qr_code']}
            />
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-[#4ADE80] shadow-[0_0_15px_#4ADE80] opacity-70 pointer-events-none"
            />
          </div>
          <p className="mt-6 text-slate-600 font-medium">Position patient QR code within the frame</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Camera active: Front Desk Webcam 1</p>
          
          <div className="mt-2 text-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider block mb-2">- OR -</span>
            <label className="bg-emerald-100 text-[#1C4235] border border-emerald-200 px-6 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-emerald-200 transition-colors inline-block text-sm shadow-sm">
              Upload from Desktop
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#1C4235]" /> Manual Override
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">ENTER TOKEN NUMBER</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. T-20260412-1"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4ADE80] outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
                <button 
                  onClick={() => handleVerify()}
                  disabled={isVerifying}
                  className="bg-[#1C4235] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#112F24] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" /> {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              {scanResult && (
                <div className={`mt-3 p-3 rounded-lg text-sm font-medium border ${scanResult.success ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {scanResult.msg}
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Scans</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">T-20260412-{i}</span>
                      <p className="text-xs text-slate-500">Just now</p>
                    </div>
                    <span className="bg-[#4ADE80]/20 text-[#1C4235] text-xs font-bold px-2 py-1 rounded">ARRIVED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

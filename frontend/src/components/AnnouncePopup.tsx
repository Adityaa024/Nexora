'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueueStore } from '../store/useQueueStore';

export default function AnnouncePopup() {
  const { announcedToken, setAnnouncedToken } = useQueueStore();

  useEffect(() => {
    if (announcedToken) {
      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setAnnouncedToken(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [announcedToken, setAnnouncedToken]);

  return (
    <AnimatePresence>
      {announcedToken && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAnnouncedToken(null)}
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] border border-slate-800 rounded-3xl p-12 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
          >
            {/* Subtle glow effect behind the text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/20 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="relative z-10">
              <h4 className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
                Now Calling
              </h4>
              
              <h1 className="text-8xl font-black text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]">
                {announcedToken.tokenNumber?.split('-').pop() || announcedToken.token?.split('-').pop()}
              </h1>
              
              <h2 className="text-2xl text-slate-200 font-medium mb-8">
                {announcedToken.patientId?.name || announcedToken.name || 'Walk-in Patient'}
              </h2>
              
              <p className="text-slate-500 text-xs">
                tap anywhere to dismiss
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

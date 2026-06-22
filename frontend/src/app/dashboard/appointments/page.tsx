'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';

export default function MyAppointments() {
  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          My Appointments
        </h1>
        <p className="text-slate-500 text-sm mt-1">View your upcoming scheduled clinical visits.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#057A55]" /> Upcoming Schedule
          </h2>
        </div>

        <div className="p-6">
          <div className="border border-slate-200 rounded-xl p-5 hover:border-[#057A55] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#057A55]"></div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-800">General Checkup - Dr. Smith</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Tomorrow, April 13</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 10:30 AM</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Room 1</span>
                </div>
              </div>
              <button className="text-[#057A55] font-medium text-sm hover:underline">Reschedule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Settings, User, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PatientProfile() {
  const [profile, setProfile] = useState({ name: 'Guest', email: 'sumit@example.com' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setProfile({
        name: user.name || user.firstName + ' ' + user.lastName || 'Guest Patient',
        email: user.email || 'guest@example.com'
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Profile Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal information and account preferences.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-6 mb-8">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#057A55]/10" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
            <p className="text-[#057A55] font-medium flex items-center gap-1 mt-1"><User className="w-4 h-4"/> Patient Account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">EMAIL ADDRESS</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
              <Mail className="w-5 h-5 text-slate-400" /> {profile.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">PHONE NUMBER</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
              <Phone className="w-5 h-5 text-slate-400" /> +1 (555) 000-0000
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">ADDRESS</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
              <MapPin className="w-5 h-5 text-slate-400" /> 123 Health Ave, Medical District
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4">
          <button className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50 border border-slate-200">Cancel</button>
          <button className="px-6 py-2 rounded-lg bg-[#057A55] text-white font-medium hover:bg-[#02563D]">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

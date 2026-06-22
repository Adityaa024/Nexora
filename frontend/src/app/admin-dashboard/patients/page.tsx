'use client';

import { Users, Search, Filter, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ManagePatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Since we don't have a dedicated /api/users endpoint in the backend right now,
  // we'll still use dummy data for the list, but implement the functional "Add Patient" action.
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/patients');
        if (res.ok) {
          const data = await res.json();
          setPatients(data.map((p: any) => ({
            id: p._id,
            name: p.name,
            email: p.email,
            date: new Date(p.createdAt).toLocaleDateString()
          })));
        }
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      }
    };
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'PATIENT'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', password: '', age: '' });
        fetchPatients();
        toast.success('Patient added successfully!');
      } else {
        toast.error(`Failed to add patient: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-slate-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Patients</h1>
          <p className="text-slate-500 text-sm mt-1">Database of registered patients and profiles.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-[#1C4235] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#112F24] transition-colors shadow-lg shadow-[#1C4235]/20">
          <Plus className="w-5 h-5" /> Add New Patient
        </button>
      </header>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Register Patient</h2>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#4ADE80]" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#4ADE80]" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#4ADE80]" placeholder="••••••••" />
                <p className="text-xs text-slate-400 mt-1">Provide a default password so they can log in to the portal.</p>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-[#057A55] text-white font-bold py-4 rounded-xl mt-4 hover:bg-[#046244] disabled:opacity-50">
                {isSubmitting ? 'Registering...' : 'Create Patient Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients by name, phone, or ID..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#4ADE80] outline-none"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Visit</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{p.email}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{p.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#1C4235] font-medium text-sm hover:underline">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

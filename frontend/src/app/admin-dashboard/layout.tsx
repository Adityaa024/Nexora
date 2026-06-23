'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, ScanLine, ListTree, Calendar, Users, History, BrainCircuit, LogOut, CheckSquare, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainLinks = [
    { name: 'Overview', href: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Check-in Scanner', href: '/admin-dashboard/scanner', icon: ScanLine },
    { name: 'Manage Queues', href: '/admin-dashboard/queues', icon: ListTree },
    { name: 'Appointments', href: '/admin-dashboard/appointments', icon: Calendar },
    { name: 'Manage Patients', href: '/admin-dashboard/patients', icon: Users },
  ];

  const recordLinks = [
    { name: 'Global History', href: '/admin-dashboard/history', icon: History },
    { name: 'AI Analytics', href: '/admin-dashboard/analytics', icon: BrainCircuit, badge: 'AI' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-[#112F24] text-[#E0E7E4] flex-col z-50 shadow-xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex`}>
        <div className="p-6 mb-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#1C4235] p-2 rounded-lg">
              <CheckSquare className="w-6 h-6 text-[#4ADE80]" />
            </div>
            <span className="text-2xl font-black tracking-tight">NEXORA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="mb-6">
            <p className="text-[#84A194] text-[10px] font-bold uppercase tracking-widest px-4 mb-2">Main</p>
            <nav className="space-y-1">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive 
                        ? 'bg-[#1C4235] text-white shadow-inner border border-[#2D5A4A]' 
                        : 'hover:bg-[#1C4235]/50 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#4ADE80]' : 'text-[#84A194]'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="text-[#84A194] text-[10px] font-bold uppercase tracking-widest px-4 mb-2">Records & AI</p>
            <nav className="space-y-1">
              {recordLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive 
                        ? 'bg-[#1C4235] text-white shadow-inner border border-[#2D5A4A]' 
                        : 'hover:bg-[#1C4235]/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#4ADE80]' : 'text-[#84A194]'}`} />
                      {link.name}
                    </div>
                    {link.badge && (
                      <span className="bg-[#4ADE80] text-[#112F24] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-[#1C4235] p-1.5 rounded-lg">
              <CheckSquare className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">NEXORA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </header>
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-end bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">Admin User</span>
              <span className="text-xs text-slate-500">System Administrator</span>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-[#1C4235] font-bold">
              A
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="ml-4 flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto mt-16 md:mt-0">
            {children}
          </div>
        </div>

        {/* Beautiful Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-6xl mx-auto px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#1C4235] p-1.5 rounded-lg">
                    <CheckSquare className="w-4 h-4 text-[#4ADE80]" />
                  </div>
                  <span className="text-lg font-bold text-slate-800 tracking-tight">NEXORA</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Next-generation patient flow intelligence.
                </p>
              </div>
              <div className="md:ml-auto">
                <h4 className="font-bold text-slate-800 mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link href="/admin-dashboard" className="hover:text-emerald-600 transition-colors">Overview</Link></li>
                  <li><Link href="/admin-dashboard/queues" className="hover:text-emerald-600 transition-colors">Manage Queues</Link></li>
                  <li><Link href="/admin-dashboard/scanner" className="hover:text-emerald-600 transition-colors">Check-in Scanner</Link></li>
                </ul>
              </div>
              <div className="md:ml-auto">
                <h4 className="font-bold text-slate-800 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-emerald-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-emerald-600 transition-colors">IT Documentation</a></li>
                  <li><a href="#" className="hover:text-emerald-600 transition-colors">System Status</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
              <p>&copy; {new Date().getFullYear()} NEXORA Systems. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#112F24] text-white p-4 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-[#1C4235] p-1.5 rounded-lg">
            <CheckSquare className="w-5 h-5 text-[#4ADE80]" />
          </div>
          <span className="text-xl font-bold tracking-tight">NEXORA</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="text-red-400 p-2"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button className="p-2 text-[#84A194]">
            <div className="w-6 h-0.5 bg-current mb-1"></div>
            <div className="w-6 h-0.5 bg-current mb-1"></div>
            <div className="w-6 h-0.5 bg-current"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

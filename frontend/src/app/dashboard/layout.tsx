'use client';

import { Home, Ticket, Calendar, History, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Tokens', href: '/dashboard/tokens', icon: Ticket },
    { name: 'My Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-[240px] bg-[#02563D] text-white flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#057A55] p-2 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">NEXORA</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-[#057A55] text-white shadow-inner' 
                    : 'text-[#8DB4A6] hover:bg-[#057A55]/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[240px] w-full overflow-x-hidden flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-end bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">Patient Account</span>
              <span className="text-xs text-slate-500">Active</span>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-[#02563D] font-bold">
              P
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="ml-4 flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> 
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto mt-16 md:mt-0">
            {children}
          </div>
        </div>

        {/* Beautiful Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-5xl mx-auto px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#057A55] p-1.5 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-black text-slate-800 tracking-tight">NEXORA</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Next-generation patient flow intelligence.
                </p>
              </div>
              <div className="md:ml-auto">
                <h4 className="font-bold text-slate-800 mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link href="/dashboard" className="hover:text-emerald-600 transition-colors">Book Token</Link></li>
                  <li><Link href="/dashboard/tokens" className="hover:text-emerald-600 transition-colors">My Active Tokens</Link></li>
                  <li><Link href="/dashboard/profile" className="hover:text-emerald-600 transition-colors">Profile Settings</Link></li>
                </ul>
              </div>
              <div className="md:ml-auto">
                <h4 className="font-bold text-slate-800 mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><span className="text-slate-400">Emergency:</span> <a href="tel:911" className="hover:text-red-600 transition-colors text-slate-700 font-medium">911</a></li>
                  <li><span className="text-slate-400">Support:</span> <a href="mailto:support@qms.com" className="hover:text-emerald-600 transition-colors">support@qms.com</a></li>
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#02563D] text-white p-4 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-[#057A55] p-1.5 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">NEXORA</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="text-red-300 p-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
          <button className="p-2">
            {/* Mobile menu button (placeholder) */}
            <div className="w-6 h-0.5 bg-white mb-1"></div>
            <div className="w-6 h-0.5 bg-white mb-1"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

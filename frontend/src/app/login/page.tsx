'use client';

import { useState } from 'react';
import { SignInPage } from '@/components/ui/sign-in';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';
import { toast } from 'sonner';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Fallback to state if FormData is empty due to controlled inputs
    const formData = new FormData(e.currentTarget);
    const formEmail = formData.get('email') as string || email;
    const formPassword = formData.get('password') as string || password;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formEmail, password: formPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on role
      window.location.href = data.user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email,
          name: user.displayName
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google Login failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Successfully logged in with Google!');
      window.location.href = data.user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        title={<span className="font-light text-foreground tracking-tighter">Welcome Back</span>}
        description={
          <div className="space-y-4">
            <p>Sign in to your NEXORA account</p>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-sm w-fit shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <p className="font-bold text-emerald-800 mb-2 uppercase tracking-wider text-[10px]">Demo Admin Access</p>
                <div className="flex flex-col gap-1 mb-3">
                  <p className="text-emerald-700/80 text-xs flex justify-between gap-4">Email: <span className="font-semibold text-emerald-900">admin@admin.com</span></p>
                  <p className="text-emerald-700/80 text-xs flex justify-between gap-4">Password: <span className="font-semibold text-emerald-900">admin</span></p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('admin@admin.com');
                    setPassword('admin');
                    toast.success('Demo credentials loaded!');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B] transition-all shadow-md active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Quick Load Staff Demo Credentials
                </button>
              </div>
            </div>
          </div>
        }
        error={error}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateAccount={() => window.location.href = '/signup'}
      />
    </div>
  );
}

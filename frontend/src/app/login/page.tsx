'use client';

import { useState } from 'react';
import { SignInPage } from '@/components/ui/sign-in';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';
import { toast } from 'sonner';

export default function LoginPage() {
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-sm w-fit shadow-sm">
              <p className="font-bold text-emerald-800 mb-1 uppercase tracking-wider text-xs">Demo Admin Access</p>
              <p className="text-emerald-700">Email: <span className="font-semibold">admin@admin.com</span></p>
              <p className="text-emerald-700">Password: <span className="font-semibold">admin</span></p>
            </div>
          </div>
        }
        error={error}
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateAccount={() => window.location.href = '/signup'}
      />
    </div>
  );
}

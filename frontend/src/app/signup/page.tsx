'use client';

import { useState } from 'react';
import { SignUpPage } from '@/components/ui/sign-up';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';
import { toast } from 'sonner';

export default function SignupPage() {
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `${firstName} ${lastName}`.trim(),
          email: email, 
          password: password,
          role: 'PATIENT'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      
      // Navigate to login after successful registration
      window.location.href = '/login';
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email,
          name: user.displayName
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google Signup failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Successfully registered and logged in with Google!');
      window.location.href = data.user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <SignUpPage
        title={<span className="font-light text-foreground tracking-tighter">Create Patient Account</span>}
        description="Join NEXORA and unlock a seamless clinical experience."
        error={error}
        heroImageSrc="https://images.unsplash.com/photo-1551076805-e1869043e560?w=2160&q=80"
        onSignUp={handleSignUp}
        onGoogleSignIn={handleGoogleSignIn}
        onLogin={() => window.location.href = '/login'}
      />
    </div>
  );
}

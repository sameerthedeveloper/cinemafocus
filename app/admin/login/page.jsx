"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Invalid login credentials.");
      } else {
        // Refresh the router so the proxy can reflect the updated session
        router.refresh();
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="bg-background p-8 rounded-2xl border border-border w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
           {/* Using a placeholder text if image path is changed or omitted */}
           <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
             CF
           </div>
           <h1 className="text-2xl font-medium tracking-tight">
             Admin Portal
           </h1>
        </div>
        
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-primary outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cinemafocus.com"
              required
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-muted-foreground">Password</label>
             <input 
               type="password" 
               className="w-full p-3 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-primary outline-none transition-all"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="••••••••"
               required
             />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

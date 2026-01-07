import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(isRegistering ? 'Registration failed' : 'Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="bg-background p-8 rounded-2xl border border-border w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
           <img src={logo} alt="Logo" className="h-8 mx-auto opacity-80" />
           <h1 className="text-2xl font-medium tracking-tight">
             {isRegistering ? 'Create Admin Account' : 'Admin Portal'}
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
             />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

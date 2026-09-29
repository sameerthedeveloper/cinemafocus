"use client";

import React, { useState } from 'react';
import { KeyRound, Loader2, CheckCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/aws/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to change password.');
        return;
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Reveal className="p-4 md:p-8 max-w-2xl mx-auto animate-fade-in pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Account</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your admin login credentials.</p>
      </div>

      <div className="bg-background border border-border rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <KeyRound size={20} />
          </div>
          <h2 className="text-lg font-medium">Change Password</h2>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        {success && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2">
            <CheckCircle size={16} />
            Password changed successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Current Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-primary outline-none transition-all"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">New Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-primary outline-none transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-input bg-transparent focus:ring-1 focus:ring-primary outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </Reveal>
  );
}

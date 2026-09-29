"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/aws/queryClient';
import { Shield, User, UserCheck, Users2, Plus, Trash2, AlertCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'dealer',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this user's role record? Their sign-in stays active until you disable it in AWS Cognito.")) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Creates the Cognito sign-in and the role record together (admin-only Lambda).
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          email: formData.email.trim(),
          name: formData.name.trim(),
          role: formData.role,
          password: formData.password,
        });

      if (dbError) throw dbError;
      
      fetchUsers();
      setShowModal(false);
      setFormData({ email: '', password: '', name: '', role: 'dealer' });
    } catch (error) {
      console.error("Error adding user:", error);
      setError(
        error?.status === 404
          ? "Creating users isn't available yet: the latest backend update hasn't been deployed. Deploy the infra changes (POST /users), then try again."
          : error?.status === 403
            ? "Your account isn't allowed to create users."
            : `Couldn't create the user: ${error?.message || 'unknown error'}`
      );
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (role === 'owner') return 'bg-green-50 text-green-700 border-green-200';
    if (role === 'dealer') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-zinc-100 text-zinc-600 border-zinc-200';
  };

  return (
    <Reveal className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-3">
             <Users2 className="text-primary" />
             Access Control
           </h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage who can sign in, and what they can do.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          Add User
        </button>
      </header>

      {/* Users List */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden overflow-x-auto shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-secondary/30 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">User Identities</th>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Role</th>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Joined At</th>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
             {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                       <Shield size={32} className="animate-pulse opacity-20" />
                       <span className="text-sm font-medium">Loading users…</span>
                    </div>
                  </td>
                </tr>
             ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="p-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                           {user.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
                        </div>
                        <div>
                           <span className="font-medium block text-sm">{user.name || user.email?.split('@')[0]}</span>
                           <span className="text-[11px] text-muted-foreground font-mono">{user.email}</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeClass(user.role)}`}>
                      {user.role === 'admin' ? <Shield size={10} /> : <UserCheck size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Pending'}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Remove Record">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
             ))}
             {!loading && users.length === 0 && (
                <tr>
                   <td colSpan="4" className="p-12 text-center text-muted-foreground">
                      <div className="max-w-xs mx-auto space-y-2">
                         <Users2 size={40} className="mx-auto opacity-10" />
                         <p className="font-medium text-foreground">No records found</p>
                         <p className="text-xs">No users have been added yet.</p>
                      </div>
                   </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
         <Reveal className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-background rounded-2xl w-full max-w-md shadow-xl border border-border p-6 space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-medium tracking-tight">Add User</h2>
                 <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">X</button>
              </div>

              <div className="p-3 bg-blue-50 text-blue-700 text-[11px] rounded-lg border border-blue-200 flex gap-2 items-start">
                 <AlertCircle size={14} className="shrink-0 mt-0.5" />
                 <p>Creates a sign-in for this person and assigns their role. Share the password with them securely; they can sign in straight away.</p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Display Name</label>
                   <input 
                     type="text" 
                     required 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none transition-all" 
                     placeholder="John Doe"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">User Email</label>
                   <input 
                     type="email" 
                     required 
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none transition-all" 
                     placeholder="user@example.com"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Password</label>
                   <input
                     type="password"
                     required
                     minLength={8}
                     autoComplete="new-password"
                     value={formData.password}
                     onChange={e => setFormData({...formData, password: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none transition-all"
                     placeholder="At least 8 characters"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Access Role</label>
                   <select 
                     value={formData.role}
                     onChange={e => setFormData({...formData, role: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none transition-all"
                   >
                     <option value="owner">Owner (portal login only, read-only)</option>
                     <option value="dealer">Dealer</option>
                     <option value="admin">Admin (full admin console)</option>
                   </select>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50">
                      {saving ? 'Creating…' : 'Create user'}
                    </button>
                 </div>
              </form>
           </div>
         </Reveal>
      )}
    </Reveal>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Shield, User, UserCheck, Users2, Plus, Trash2, AlertCircle } from 'lucide-react';

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
    if (window.confirm("Are you sure you want to remove this user's role record from the database? This does not delete their Supabase Auth account.")) {
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
      // NOTE: Creating a user for someone else requires the Service Role Key 
      // which is not safe to use in the client-side. 
      // For now, we will only insert the record into the 'users' table.
      // In a real scenario, this should be done via a Supabase Edge Function or 
      // a Server Action using the Service Role Key.
      
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          email: formData.email,
          name: formData.name,
          role: formData.role
        });
      
      if (dbError) throw dbError;
      
      fetchUsers();
      setShowModal(false);
      setFormData({ email: '', password: '', name: '', role: 'dealer' });
      alert("User record created in database. Note: Administrative user creation in Auth requires the Service Role Key to be configured in an Edge Function.");
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to create user record: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'bg-purple-50 text-purple-700';
    if (role === 'dealer') return 'bg-blue-50 text-blue-700';
    return 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-3">
             <Users2 className="text-primary" />
             Access Control
           </h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage administrative and dealer roles.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          Add User Record
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
                       <span className="text-sm font-medium">Fetching secure records...</span>
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
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Remove Record">
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
                         <p className="text-xs">Database query returned an empty set for public.users</p>
                      </div>
                   </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-background rounded-2xl w-full max-w-md shadow-xl border border-border p-6 space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-medium tracking-tight">Assign User Role</h2>
                 <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">X</button>
              </div>

              <div className="p-3 bg-blue-50 text-blue-700 text-[11px] rounded-lg border border-blue-100 flex gap-2 items-start">
                 <AlertCircle size={14} className="shrink-0 mt-0.5" />
                 <p>This adds a role record to the <b>users</b> table. The user must still register or be added via the Supabase Dashboard to authenticate.</p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
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
                   <label className="text-sm font-medium">Access Role</label>
                   <select 
                     value={formData.role}
                     onChange={e => setFormData({...formData, role: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none transition-all"
                   >
                     <option value="dealer">Dealer (Portal Visibility)</option>
                     <option value="admin">Admin (System Access)</option>
                   </select>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50">
                      {saving ? 'Saving...' : 'Assign Role'}
                    </button>
                 </div>
              </form>
           </div>
         </div>
      )}
    </div>
  );
}

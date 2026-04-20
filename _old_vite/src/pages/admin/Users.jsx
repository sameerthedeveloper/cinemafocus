import React, { useEffect, useState } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Loader2, Plus, Trash2, Shield, User, UserCheck, Users2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        const simpleSnap = await getDocs(collection(db, 'users'));
        setUsers(simpleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user? This removes their role but does not delete their Firebase Auth account.")) {
      try {
        await deleteDoc(doc(db, 'users', id));
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
      // Create Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Add to users collection with role
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        createdAt: Date.now()
      });
      
      fetchUsers();
      setShowModal(false);
      setFormData({ email: '', password: '', name: '', role: 'dealer' });
    } catch (error) {
      console.error("Error adding user:", error);
      setError(error.message);
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
             User Management
           </h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage users and their access roles.</p>
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
      <div className="bg-background rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-sm text-muted-foreground">User</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Role</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Added On</th>
              <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
             {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           {user.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
                        </div>
                        <div>
                           <span className="font-medium block">{user.name || user.email.split('@')[0]}</span>
                           <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeClass(user.role)}`}>
                      {user.role === 'admin' ? <Shield size={12} /> : <UserCheck size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(user.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
             ))}
             {users.length === 0 && (
                <tr>
                   <td colSpan="4" className="p-8 text-center text-muted-foreground">
                      No users found. Add your first user to get started.
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
              <h2 className="text-xl font-medium">Add New User</h2>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Name</label>
                   <input 
                     type="text" 
                     required 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                     placeholder="John Doe"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Email Address</label>
                   <input 
                     type="email" 
                     required 
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                     placeholder="dealer@company.com"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Password</label>
                   <input 
                     type="password" 
                     required 
                     minLength={6}
                     value={formData.password}
                     onChange={e => setFormData({...formData, password: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                     placeholder="••••••••"
                   />
                   <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Role</label>
                   <select 
                     value={formData.role}
                     onChange={e => setFormData({...formData, role: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none"
                   >
                     <option value="dealer">Dealer (Portal Access)</option>
                     <option value="admin">Admin (Full Access)</option>
                   </select>
                   <p className="text-xs text-muted-foreground">
                     Dealers can access the portal. Admins have full access.
                   </p>
                 </div>
                 <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                      {saving ? 'Creating...' : 'Create User'}
                    </button>
                 </div>
              </form>
           </div>
         </div>
      )}
    </div>
  );
};

export default Users;

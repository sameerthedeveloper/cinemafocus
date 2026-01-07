import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Plus, Trash2, Shield, User } from 'lucide-react';

const Users = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    role: 'Admin', // Default role
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admins"));
      setAdmins(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this admin access? This does not delete their account, only their listing here.")) {
      try {
        await deleteDoc(doc(db, "admins", id));
        setAdmins(admins.filter(a => a.id !== id));
      } catch (error) {
        console.error("Error removing admin:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "admins"), {
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString()
      });
      fetchAdmins();
      setShowModal(false);
      setFormData({ email: '', role: 'Admin' });
    } catch (error) {
      console.error("Error adding admin:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <header className="flex justify-between items-center mb-10">
        <div>
           <h1 className="text-3xl font-medium tracking-tight">User Settings</h1>
           <p className="text-muted-foreground mt-1">Manage admin access and roles.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Admin
        </button>
      </header>

      {/* Admins List */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
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
             {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="p-4 flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={16} />
                     </div>
                     <span className="font-medium">{admin.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <Shield size={12} />
                      {admin.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(admin.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
             ))}
             {admins.length === 0 && (
                <tr>
                   <td colSpan="4" className="p-8 text-center text-muted-foreground">
                      No admins listed yet. Add yourself or others.
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
              <h2 className="text-xl font-medium">Grant Access</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Email Address</label>
                   <input 
                     type="email" 
                     required 
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                     placeholder="colleague@cinemafocus.com"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Role</label>
                   <select 
                     value={formData.role}
                     onChange={e => setFormData({...formData, role: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none"
                   >
                     <option>Admin</option>
                     <option>Editor</option>
                     <option>Viewer</option>
                   </select>
                 </div>
                 <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                      {saving ? 'Adding...' : 'Add User'}
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

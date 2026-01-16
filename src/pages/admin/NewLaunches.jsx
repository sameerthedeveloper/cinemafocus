import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Sparkles } from 'lucide-react';

const NewLaunches = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaunches();
  }, []);

  const fetchLaunches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "new_launches"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLaunches(data);
    } catch (error) {
      console.error("Error fetching new launches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this launch?")) {
      try {
        await deleteDoc(doc(db, "new_launches", id));
        setLaunches(launches.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Launches</h1>
          <p className="text-muted-foreground mt-1">Manage new product arrivals</p>
        </div>
        <Link to="/admin/new-launches/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Add New
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/20 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Product Name</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Brand</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {launches.map((launch) => (
              <tr key={launch.id} className="hover:bg-secondary/10 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                   {launch.images && launch.images[0] && (
                       <img src={launch.images[0]} alt={launch.name} className="w-10 h-10 rounded object-cover" />
                   )}
                   {launch.name}
                </td>
                <td className="p-4 text-muted-foreground">{launch.brand}</td>
                <td className="p-4 text-muted-foreground">${launch.price?.toLocaleString()}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleDelete(launch.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {launches.length === 0 && (
               <tr>
                 <td colSpan="4" className="p-8 text-center text-muted-foreground">No new launches found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewLaunches;

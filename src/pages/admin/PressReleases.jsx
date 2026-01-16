import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Newspaper } from 'lucide-react';

const PressReleases = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "press_releases"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReleases(data);
    } catch (error) {
      console.error("Error fetching press releases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this press release?")) {
      try {
        await deleteDoc(doc(db, "press_releases", id));
        setReleases(releases.filter(item => item.id !== id));
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
          <h1 className="text-3xl font-bold text-foreground">Press Releases</h1>
          <p className="text-muted-foreground mt-1">Manage news and announcements</p>
        </div>
        <Link to="/admin/press-releases/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Add New
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/20 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {releases.map((release) => (
              <tr key={release.id} className="hover:bg-secondary/10 transition-colors">
                <td className="p-4 font-medium">{release.title}</td>
                <td className="p-4 text-muted-foreground">{release.date}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleDelete(release.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {releases.length === 0 && (
               <tr>
                 <td colSpan="3" className="p-8 text-center text-muted-foreground">No press releases found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PressReleases;

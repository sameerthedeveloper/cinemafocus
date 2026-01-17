import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const EditPressRelease = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    excerpt: '',
    imageUrl: '',
    content: ''
  });

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const docRef = doc(db, "press_releases", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData({ ...docSnap.data() });
        } else {
          alert("Press release not found!");
          navigate('/admin/press-releases');
        }
      } catch (error) {
        console.error("Error fetching press release:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelease();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, "press_releases", id);
      await updateDoc(docRef, formData);
      navigate('/admin/press-releases');
    } catch (error) {
      console.error("Error updating press release:", error);
      alert("Failed to update press release");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20 md:pb-8 animate-fade-in">
      <Link to="/admin/press-releases" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to Press Releases
      </Link>
      
      <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-8">Edit Press Release</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 md:p-8 rounded-xl border border-border shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input 
            required
            type="text" 
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input 
            required
            type="date" 
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Cover Image</label>
           <ImageUpload 
             onUploadComplete={(url) => setFormData({...formData, imageUrl: url})}
             initialImage={formData.imageUrl}
           />
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Excerpt</label>
           <textarea 
             required
             rows="3"
             className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
             value={formData.excerpt}
             onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
           />
        </div>

        {/* 
        <div>
           <label className="block text-sm font-medium mb-2">Full Content</label>
           <textarea 
             rows="6"
             className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
             value={formData.content}
             onChange={(e) => setFormData({...formData, content: e.target.value})}
           />
        </div>
        */}

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Update Release'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPressRelease;

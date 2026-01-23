import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const AddPressRelease = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    imageUrl: '', // For now, manual URL or we can integrate upload later
    content: ''   // Future proofing
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "press_releases"), formData);
      navigate('/admin/press-releases');
    } catch (error) {
      console.error("Error adding press release:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20 md:pb-8 animate-fade-in">
      <Link to="/admin/press-releases" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to Press Releases
      </Link>
      
      <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-8">Add New Press Release</h1>

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

        <div>
           <label className="block text-sm font-medium mb-2">PDF Document URL (Optional)</label>
           <input 
             type="url" 
             className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
             value={formData.pdfUrl || ''}
             onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
             placeholder="https://example.com/file.pdf"
           />
           <p className="text-xs text-muted-foreground mt-1">Direct link to a PDF file.</p>
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
            disabled={loading}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Publish Release'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPressRelease;

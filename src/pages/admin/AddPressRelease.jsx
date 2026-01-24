import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, ImageIcon } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import ContentBlockBuilder from '../../components/admin/ContentBlockBuilder';

const AddPressRelease = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPortal = location.pathname.includes('/portal');
  const basePath = isPortal ? '/portal' : '/admin';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    coverImages: [], // Multiple cover images
    pdfUrl: '',
    contentBlocks: [] 
  });

  const handleAddCoverImage = (url) => {
    if (url) {
      setFormData({
        ...formData, 
        coverImages: [...(formData.coverImages || []), url]
      });
    }
  };

  const handleRemoveCoverImage = (index) => {
    const newImages = formData.coverImages.filter((_, i) => i !== index);
    setFormData({ ...formData, coverImages: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Keep backward compatibility: set imageUrl to first cover image
      const dataToSave = {
        ...formData,
        imageUrl: formData.coverImages?.[0] || ''
      };
      await addDoc(collection(db, "press_releases"), dataToSave);
      navigate(`${basePath}/press-releases`);
    } catch (error) {
      console.error("Error adding press release:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20 md:pb-8 animate-fade-in">
      <Link to={`${basePath}/press-releases`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
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

        {/* Multiple Cover Images */}
        <div>
           <label className="block text-sm font-medium mb-2">Cover Images</label>
           <p className="text-xs text-muted-foreground mb-3">Upload multiple images. The first image will be used as the main cover.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
             {formData.coverImages?.map((img, idx) => (
               <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-secondary/10 border border-border">
                 <img src={img} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover" />
                 <button 
                   type="button"
                   onClick={() => handleRemoveCoverImage(idx)}
                   className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Trash2 size={12} />
                 </button>
                 {idx === 0 && (
                   <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                     Main
                   </span>
                 )}
               </div>
             ))}
             
             {/* Add New Image */}
             <div className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/5">
               <ImageUpload 
                 onUploadComplete={handleAddCoverImage}
               />
             </div>
           </div>
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

        <div className="pt-4 border-t border-border">
           <ContentBlockBuilder 
             blocks={formData.contentBlocks || []} 
             onChange={(blocks) => setFormData({...formData, contentBlocks: blocks})} 
           />
        </div>

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

import React, { useState, useId } from 'react';
import { supabase, storageBucket } from '../lib/supabase';
import { Upload, X, Loader2 } from 'lucide-react';

const ImageUpload = ({ onUploadComplete, initialImage = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const inputId = useId(); // Unique ID for each instance

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from(storageBucket)
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(fileName);

      const url = urlData.publicUrl;
      setImageUrl(url);
      onUploadComplete(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl('');
    onUploadComplete('');
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center transition-colors hover:border-primary/50 bg-secondary/10 relative">
        
        {imageUrl ? (
           <div className="relative group">
              <img src={imageUrl} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
              <button 
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
           </div>
        ) : (
          <>
            <input 
               type="file" 
               accept="image/*" 
               onChange={handleFileChange} 
               className="hidden" 
               id={inputId}
               disabled={uploading}
            />
            <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center gap-3">
               <div className="p-4 bg-background rounded-full shadow-sm">
                 {uploading ? <Loader2 className="animate-spin text-primary" size={24} /> : <Upload size={24} className="text-primary" />}
               </div>
               <span className="font-medium">{uploading ? 'Uploading...' : 'Click to Upload Image'}</span>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

"use client";

import React, { useState, useId } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2 } from 'lucide-react';

const BUCKET = 'images';

export default function ImageUpload({ onUploadComplete, initialImage = '' }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const inputId = useId();
  const supabase = createClient();

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1920;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      if (file.type.startsWith('image/')) {
        file = await compressImage(file);
      }

      const fileName = `uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
      onUploadComplete(publicUrl);
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
}

"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminGalleryPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', image: null });
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this gallery item?")) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete item: " + error.message);
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewProject({ ...newProject, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.image) return alert("Please select an image");
    
    setSaving(true);
    try {
      // 1. Upload Image to Supabase Storage
      const fileExt = newProject.image.name.split('.').pop();
      const fileName = `projects/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, newProject.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // 2. Insert into Supabase table
      const { error: dbError } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          category: 'Residential', // Default category
          image_url: publicUrl,
        });
      
      if (dbError) throw dbError;

      fetchProjects();
      setShowModal(false);
      setNewProject({ title: '', image: null });
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Gallery</h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage showcase items and portfolio images.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          Add Item
        </button>
      </header>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
             <div key={project.id} className="group relative bg-background rounded-2xl border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
               <div className="aspect-video bg-secondary/20 relative overflow-hidden">
                 <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 <button 
                    onClick={() => handleDelete(project.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
               <div className="p-4 flex-1">
                  <h3 className="font-medium truncate">{project.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{project.category}</p>
               </div>
             </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/30 rounded-2xl border-dashed border-2 border-border font-medium">
              No gallery items found. Click 'Add Item' to start.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-background rounded-2xl w-full max-w-md shadow-xl border border-border p-6 space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-medium">Add New Image</h2>
                 <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">X</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Title</label>
                   <input 
                     type="text" 
                     required 
                     value={newProject.title} 
                     onChange={e => setNewProject({...newProject, title: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                     placeholder="e.g. Modern Home Theater"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Image File</label>
                   <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/20 transition-colors relative cursor-pointer group">
                      <input type="file" required accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {newProject.image ? (
                        <div className="text-primary font-medium flex items-center justify-center gap-2">
                          <ImageIcon size={18} /> {newProject.image.name}
                        </div>
                      ) : (
                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                          <ImageIcon className="mx-auto mb-2 opacity-50" />
                          <span>Click or drag image to upload</span>
                        </div>
                      )}
                   </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium disabled:opacity-50">
                      {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                      {saving ? 'Creating...' : 'Add Item'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

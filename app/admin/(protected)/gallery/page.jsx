"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Image as ImageIcon, Loader2, Edit2, Star, Move } from 'lucide-react';
import { revalidateData } from '@/lib/actions';

function ImagePositionAdjuster({ value, onChange }) {
  const parsePos = (val) => {
    if (!val || val === 'center') return { x: 50, y: 50 };
    if (val === 'top') return { x: 50, y: 0 };
    if (val === 'bottom') return { x: 50, y: 100 };
    if (val === 'left') return { x: 0, y: 50 };
    if (val === 'right') return { x: 100, y: 50 };
    if (val === 'top left') return { x: 0, y: 0 };
    if (val === 'top right') return { x: 100, y: 0 };
    if (val === 'bottom left') return { x: 0, y: 100 };
    if (val === 'bottom right') return { x: 100, y: 100 };

    const parts = String(val).split(' ');
    if (parts.length === 2) {
      const x = parseInt(parts[0], 10);
      const y = parseInt(parts[1], 10);
      if (!isNaN(x) && !isNaN(y)) return { x, y };
    }
    return { x: 50, y: 50 };
  };

  const { x, y } = parsePos(value);

  const setPos = (newX, newY) => {
    onChange(`${newX}% ${newY}%`);
  };

  const presets = [
    { label: 'Top Left', x: 0, y: 0 },
    { label: 'Top', x: 50, y: 0 },
    { label: 'Top Right', x: 100, y: 0 },
    { label: 'Left', x: 0, y: 50 },
    { label: 'Center', x: 50, y: 50 },
    { label: 'Right', x: 100, y: 50 },
    { label: 'Bottom Left', x: 0, y: 100 },
    { label: 'Bottom', x: 50, y: 100 },
    { label: 'Bottom Right', x: 100, y: 100 },
  ];

  return (
    <div className="space-y-3 bg-secondary/20 p-3.5 rounded-xl border border-border">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-1.5 text-foreground">
          <Move size={14} className="text-primary" /> Manual Focal Position
        </span>
        <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px]">
          {x}% {y}%
        </span>
      </div>

      {/* Sliders */}
      <div className="space-y-2.5 text-xs">
        <div>
          <div className="flex justify-between mb-1 text-muted-foreground text-[11px]">
            <span>Horizontal Position (Left ↔ Right)</span>
            <span className="font-mono">{x}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={x} 
            onChange={(e) => setPos(parseInt(e.target.value, 10), y)}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1 text-muted-foreground text-[11px]">
            <span>Vertical Position (Top ↕ Bottom)</span>
            <span className="font-mono">{y}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={y} 
            onChange={(e) => setPos(x, parseInt(e.target.value, 10))}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Presets Grid */}
      <div className="pt-1">
        <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">Quick Presets</span>
        <div className="grid grid-cols-3 gap-1">
          {presets.map((p) => {
            const isSelected = x === p.x && y === p.y;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setPos(p.x, p.y)}
                className={`py-1 px-1.5 text-[10px] font-medium rounded transition-colors truncate ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-background hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', image: null, featured: true, image_position: '50% 50%' });
  const [editingProject, setEditingProject] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('featured', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (project) => {
    const newFeaturedState = !project.featured;
    // Optimistic update
    setProjects(projects.map(p => p.id === project.id ? { ...p, featured: newFeaturedState } : p));

    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: newFeaturedState })
        .eq('id', project.id);

      if (error) throw error;
      await revalidateData('projects');
    } catch (error) {
      console.error("Error updating featured status:", error);
      // Revert optimistic update
      setProjects(projects.map(p => p.id === project.id ? { ...p, featured: project.featured } : p));
      alert("Failed to update featured status: " + error.message);
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
        await revalidateData('projects');
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete item: " + error.message);
      }
    }
  };

  const handleEditImageChange = (e) => {
    if (e.target.files[0]) {
      setEditingProject({ ...editingProject, newImageFile: e.target.files[0] });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = editingProject.image_url;

      if (editingProject.newImageFile) {
        const fileExt = editingProject.newImageFile.name.split('.').pop();
        const fileName = `projects/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, editingProject.newImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const imgPos = editingProject.image_position || editingProject.imagePosition || '50% 50%';

      const { error } = await supabase
        .from('projects')
        .update({ 
          title: editingProject.title,
          featured: editingProject.featured || false,
          image_url: imageUrl,
          image_position: imgPos
        })
        .eq('id', editingProject.id);

      if (error) throw error;
      
      setProjects(projects.map(p => p.id === editingProject.id ? { 
        ...p, 
        title: editingProject.title, 
        featured: editingProject.featured,
        image_url: imageUrl,
        image_position: imgPos,
        imagePosition: imgPos
      } : p));
      setEditingProject(null);
      await revalidateData('projects');
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update item: " + error.message);
    } finally {
      setSaving(false);
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
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
          title: newProject.title,
          category: 'Residential', // Default category
          image_url: publicUrl,
          featured: newProject.featured,
          image_position: newProject.image_position || '50% 50%'
        });
      
      if (dbError) throw dbError;

      await revalidateData('projects');
      fetchProjects();
      setShowModal(false);
      setNewProject({ title: '', image: null, featured: true, image_position: '50% 50%' });
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
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage showcase items, adjust manual focal crop coordinates, and set featured photos for the home page.</p>
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
             <div key={project.id} className={`group relative bg-background rounded-2xl border ${project.featured ? 'border-amber-500/50 shadow-sm' : 'border-border'} overflow-hidden flex flex-col hover:border-primary/50 transition-colors`}>
               <div className="aspect-video bg-secondary/20 relative overflow-hidden">
                 <img 
                   src={project.image_url} 
                   alt={project.title} 
                   style={{ objectPosition: project.image_position || project.imagePosition || '50% 50%' }}
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                 />
                 
                 {/* Featured Badge */}
                 {project.featured && (
                   <div className="absolute top-2 left-2 z-10">
                     <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-black rounded-full shadow flex items-center gap-1 backdrop-blur-md">
                       <Star size={12} fill="currentColor" /> Featured on Home
                     </span>
                   </div>
                 )}

                 <div className="absolute top-2 right-2 flex gap-2 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                   <button 
                      onClick={() => toggleFeatured(project)}
                      className={`p-2 rounded-lg shadow-sm transition-colors ${project.featured ? 'bg-amber-500 text-black hover:bg-amber-600' : 'bg-black/60 text-white hover:bg-black/80'}`}
                      title={project.featured ? "Unfeature from Home" : "Feature on Home Page"}
                   >
                     <Star size={16} fill={project.featured ? "currentColor" : "none"} />
                   </button>
                   <button 
                      onClick={() => setEditingProject({ ...project, image_position: project.image_position || project.imagePosition || '50% 50%' })}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
                      title="Edit Details / Change Image"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition-colors"
                      title="Delete Image"
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>
               </div>
               <div className="p-4 flex-1 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium truncate">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{project.category}</span>
                      {(project.image_position || project.imagePosition) && (project.image_position || project.imagePosition) !== 'center' && (project.image_position || project.imagePosition) !== '50% 50%' && (
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-mono">
                          Crop: {project.image_position || project.imagePosition}
                        </span>
                      )}
                    </div>
                  </div>
                  {project.featured && (
                    <span className="text-amber-500 text-xs font-medium shrink-0 ml-2" title="Featured on Homepage">Home Featured</span>
                  )}
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

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-background rounded-2xl w-full max-w-md shadow-xl border border-border p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-medium">Add New Image</h2>
                 <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground font-medium">X</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Caption</label>
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
                   <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-secondary/20 transition-colors relative cursor-pointer group">
                      <input type="file" required accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {newProject.image ? (
                        <div className="space-y-2">
                          <div className="w-full aspect-video rounded-lg overflow-hidden bg-secondary/40 relative border border-border">
                            <img 
                              src={URL.createObjectURL(newProject.image)} 
                              alt="Preview" 
                              style={{ objectPosition: newProject.image_position || '50% 50%' }}
                              className="w-full h-full object-cover transition-all duration-150" 
                            />
                          </div>
                          <div className="text-primary font-medium text-xs flex items-center justify-center gap-1.5 truncate">
                            <ImageIcon size={14} /> {newProject.image.name}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground group-hover:text-primary transition-colors py-4">
                          <ImageIcon className="mx-auto mb-2 opacity-50" />
                          <span>Click or drag image to upload</span>
                        </div>
                      )}
                   </div>
                 </div>

                 {/* Manual Focal Position Adjuster */}
                 <ImagePositionAdjuster 
                   value={newProject.image_position || '50% 50%'}
                   onChange={(val) => setNewProject({ ...newProject, image_position: val })}
                 />

                 {/* Featured Checkbox */}
                 <div className="pt-1">
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={newProject.featured} 
                       onChange={e => setNewProject({...newProject, featured: e.target.checked})}
                       className="w-4 h-4 rounded text-primary focus:ring-primary border-border" 
                     />
                     <span className="text-sm font-medium flex items-center gap-1.5">
                       <Star size={15} className={newProject.featured ? "text-amber-500 fill-amber-500" : "text-muted-foreground"} />
                       Set as Featured on Home Page
                     </span>
                   </label>
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

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-background rounded-2xl w-full max-w-md shadow-xl border border-border p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-medium">Edit Image Details</h2>
                 <button onClick={() => setEditingProject(null)} className="text-muted-foreground hover:text-foreground font-medium">X</button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                 {/* Image Preview & Change Input */}
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Image File</label>
                   <div className="relative border-2 border-dashed border-border rounded-lg p-3 text-center hover:bg-secondary/20 transition-colors cursor-pointer group flex flex-col items-center gap-2">
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-secondary/40 relative border border-border">
                        <img 
                          src={editingProject.newImageFile ? URL.createObjectURL(editingProject.newImageFile) : editingProject.image_url} 
                          alt={editingProject.title} 
                          style={{ objectPosition: editingProject.image_position || editingProject.imagePosition || '50% 50%' }}
                          className="w-full h-full object-cover transition-all duration-150"
                        />
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleEditImageChange} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      />
                      {editingProject.newImageFile ? (
                        <div className="text-primary text-xs font-medium flex items-center justify-center gap-1.5">
                          <ImageIcon size={14} /> New file selected: {editingProject.newImageFile.name}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <ImageIcon size={14} /> Click or drag to replace image (Optional)
                        </div>
                      )}
                   </div>
                 </div>

                 {/* Manual Focal Position Adjuster */}
                 <ImagePositionAdjuster 
                   value={editingProject.image_position || editingProject.imagePosition || '50% 50%'}
                   onChange={(val) => setEditingProject({ 
                     ...editingProject, 
                     image_position: val,
                     imagePosition: val 
                   })}
                 />

                 <div className="space-y-2">
                   <label className="text-sm font-medium">Caption</label>
                   <input 
                     type="text" 
                     required 
                     value={editingProject.title} 
                     onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                     className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                     placeholder="e.g. Modern Home Theater"
                   />
                 </div>

                 {/* Featured Checkbox */}
                 <div className="pt-1">
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={editingProject.featured || false} 
                       onChange={e => setEditingProject({...editingProject, featured: e.target.checked})}
                       className="w-4 h-4 rounded text-primary focus:ring-primary border-border" 
                     />
                     <span className="text-sm font-medium flex items-center gap-1.5">
                       <Star size={15} className={editingProject.featured ? "text-amber-500 fill-amber-500" : "text-muted-foreground"} />
                       Set as Featured on Home Page
                     </span>
                   </label>
                 </div>

                 <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setEditingProject(null)} className="px-5 py-2 text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium disabled:opacity-50">
                      {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}




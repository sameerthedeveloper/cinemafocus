import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', image: null });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
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
      // 1. Upload Image
      const storageRef = ref(storage, `projects/${Date.now()}_${newProject.image.name}`);
      await uploadBytes(storageRef, newProject.image);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Save to Firestore
      await addDoc(collection(db, "projects"), {
        title: newProject.title,
        imageUrl,
        createdAt: serverTimestamp()
      });

      fetchProjects();
      setShowModal(false);
      setNewProject({ title: '', image: null });
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in pb-20">
      <header className="flex justify-between items-center mb-10">
        <div>
           <h1 className="text-3xl font-medium tracking-tight">Projects</h1>
           <p className="text-muted-foreground mt-1">Manage gallery portfolio items.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Project
        </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
           <div key={project.id} className="group relative bg-background rounded-2xl border border-border overflow-hidden">
             <div className="aspect-video bg-secondary/20 relative">
               <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
               <button 
                  onClick={() => handleDelete(project.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
               >
                 <Trash2 size={16} />
               </button>
             </div>
             <div className="p-4">
                <h3 className="font-medium truncate">{project.title}</h3>
             </div>
           </div>
        ))}
        {projects.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/30 rounded-2xl border-dashed border-2 border-border">
            No projects added yet.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-background rounded-2xl w-full max-w-md shadow-xl border border-border p-6 space-y-6">
              <h2 className="text-xl font-medium">Add New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Project Title</label>
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
                   <label className="text-sm font-medium">Project Image</label>
                   <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/20 transition-colors relative cursor-pointer">
                      <input type="file" required accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {newProject.image ? (
                        <div className="text-primary font-medium flex items-center justify-center gap-2">
                          <ImageIcon size={18} /> {newProject.image.name}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <ImageIcon className="mx-auto mb-2 opacity-50" />
                          <span>Click to upload image</span>
                        </div>
                      )}
                   </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                      {saving ? 'Uploading...' : 'Create Project'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

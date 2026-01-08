import React, { useEffect, useState } from 'react';
import Section from '../components/Section';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        let formatted = [];
        if (!snapshot.empty) {
            formatted = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
             // Fallback for missing index or empty
             const simpleSnap = await getDocs(collection(db, 'projects'));
             formatted = simpleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        setProjects(formatted);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="animate-fade-in">
      <Section className="text-center pt-20 pb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Our Projects</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A visual journey through some of our most exquisite home cinema and audio installations.
        </p>
      </Section>

      <div className="container px-4 mx-auto pb-24">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
             {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className={`relative overflow-hidden rounded-sm group ${idx % 3 === 0 ? 'md:col-span-2' : ''} ${idx % 5 === 0 ? 'lg:row-span-2 h-full' : ''}`}
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <p className="text-white font-serif italic text-lg tracking-wider">{project.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary/20 rounded-lg">
            <p className="text-muted-foreground">No projects uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

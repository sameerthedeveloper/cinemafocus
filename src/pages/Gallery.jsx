import React, { useEffect, useState } from 'react';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Loader2, X } from 'lucide-react';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Try to fetch with ordering first (requires compound index)
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const formatted = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(formatted);
      } catch (error) {
        console.warn("Ordered fetch failed (likely missing index), attempting fallback:", error);
        try {
            // Fallback to simple unordered fetch
            const simpleSnap = await getDocs(collection(db, 'projects'));
            const formatted = simpleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Optional: Client-side sort if needed, though simple fallback is often enough for "just working"
            setProjects(formatted);
        } catch (fallbackError) {
            console.error("Error fetching projects:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <div className="animate-fade-in">
      <SEO title="Gallery" description="A visual journey through some of our most exquisite home cinema and audio installations." />
      <Section className="text-center pt-20 pb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Our Clients</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A visual journey through some of our most exquisite home cinema and audio installations.
        </p>
      </Section>

      <div className="container px-4 mx-auto pb-24">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="relative overflow-hidden rounded-xl aspect-[4/3] group shadow-sm hover:shadow-md transition-all bg-black"
              >
                {/* Full revealed image (Bottom layer) */}
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                
                {/* Cropped cover image (Top layer) - Fades out on hover */}
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pointer-events-none z-10">
                   <p className="text-white font-medium text-lg tracking-wide">{project.title}</p>
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

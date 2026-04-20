import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { products, categories, hero, trustBadges } from '../../lib/seed-data';
import { Database, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

const ReseedButton = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'
    const [message, setMessage] = useState('');

    const handleReseed = async () => {
        if (!window.confirm("WARNING: This will DELETE ALL current products, categories, and content in Firestore and replace them with the default seed data. This cannot be undone. Are you sure?")) {
            return;
        }

        setLoading(true);
        setStatus(null);
        setMessage('Starting reseed process...');

        try {
            const batch = writeBatch(db);
            
            // Helper to delete collection
            const deleteCollection = async (collectionName) => {
                const snapshot = await getDocs(collection(db, collectionName));
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });
            };

            setMessage('Clearing existing data...');
            // 1. Delete existing data from collections we manage
            await Promise.all([
                deleteCollection('products'),
                deleteCollection('categories'),
                deleteCollection('hero'),
                deleteCollection('site_content'),
                // We typically don't delete messages or users/admins during a content reset
            ]);

            // Commit deletions first (optional, but cleaner batching)
            // Actually, let's just do it all in one batch if it fits, or separate batches.
            // Firestore batch limit is 500 operations. If we have many items, we might need multiple commits.
            // For safety, let's commit the delete batch first.
            await batch.commit();

            // Create new batch for adds
            const addBatch = writeBatch(db);

            setMessage('Seeding categories...');
            for (const cat of categories) {
                // Use slug as ID for cleaner URLs and references
                const ref = doc(db, 'categories', cat.slug); 
                addBatch.set(ref, cat);
            }

            setMessage('Seeding products...');
            for (const prod of products) {
                const ref = doc(db, 'products', prod.slug);
                addBatch.set(ref, prod);
            }

            setMessage('Seeding hero section...');
            addBatch.set(doc(db, 'hero', 'main'), hero);

            setMessage('Seeding trust badges...');
            addBatch.set(doc(db, 'site_content', 'trust_badges'), { items: trustBadges });

            await addBatch.commit();

            setStatus('success');
            setMessage('Database successfully reset to default state.');
            
            // Reload page after short delay to show fresh data
            setTimeout(() => {
                 window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("Reseed failed:", error);
            setStatus('error');
            setMessage('Failed to reseed database: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <button 
                onClick={handleReseed} 
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 rounded-lg transition-all text-sm font-medium"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
                Reset Database
            </button>

            {/* Status Feedback */}
            {message && (
                <div className={`text-xs flex items-center gap-1.5 ${
                    status === 'error' ? 'text-destructive' : 
                    status === 'success' ? 'text-green-600' : 
                    'text-muted-foreground'
                }`}>
                    {status === 'error' && <AlertTriangle size={12} />}
                    {status === 'success' && <CheckCircle size={12} />}
                    {message}
                </div>
            )}
        </div>
    );
};

export default ReseedButton;

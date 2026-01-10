import React, { useState, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { Download, Upload, Loader2, AlertTriangle, CheckCircle, FileJson } from 'lucide-react';

const BackupTools = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success', 'error'
    const fileInputRef = useRef(null);

    const handleBackup = async () => {
        setLoading(true);
        setStatus(null);
        setMessage('Generating backup...');

        try {
            const collectionsToBackup = ['products', 'categories', 'hero', 'site_content'];
            const backupData = {};

            for (const colName of collectionsToBackup) {
                const snapshot = await getDocs(collection(db, colName));
                backupData[colName] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }

            backupData['_meta'] = {
                timestamp: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cinemafocus-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setStatus('success');
            setMessage('Backup downloaded successfully.');
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Backup failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreTrigger = () => {
        if (window.confirm("Confirm Restore: This will merge the backup data into your current database. Existing records with same IDs will be updated. Existing records NOT in the backup will be safe.")) {
            fileInputRef.current?.click();
        }
    };

    const handleRestore = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setStatus(null);
        setMessage('Reading backup file...');

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data._meta) {
                        throw new Error("Invalid backup file: Missing metadata.");
                    }

                    setMessage('Merging data...');
                    
                    // Start batch for inserts/updates
                    const batch = writeBatch(db);
                    let opCount = 0;
                    
                    const collections = ['products', 'categories', 'hero', 'site_content'];
                    for (const colName of collections) {
                        if (data[colName] && Array.isArray(data[colName])) {
                            data[colName].forEach(item => {
                                const { id, ...docData } = item;
                                // Merge data: Updates existing fields, keeps others, adds new docs if missing.
                                batch.set(doc(db, colName, id), docData, { merge: true });
                                opCount++;
                            });
                        }
                    }

                    if (opCount > 0) {
                         await batch.commit();
                         setStatus('success');
                         setMessage(`Database updated successfully (${opCount} items processed).`);
                         
                         // Reload to refresh UI
                         setTimeout(() => window.location.reload(), 2000);
                    } else {
                        setStatus('success');
                        setMessage('No data found in backup to restore.');
                    }

                } catch (err) {
                    console.error(err);
                    setStatus('error');
                    setMessage('Invalid JSON or Restore Failed: ' + err.message);
                }
            };
            reader.readAsText(file);

        } catch (error) {
            setStatus('error');
            setMessage('Restore failed: ' + error.message);
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
                <FileJson size={18} className="text-primary" /> 
                Backup & Restore
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <button 
                    onClick={handleBackup} 
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/70 rounded-lg transition-colors border border-border text-sm font-medium"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Export JSON
                </button>

                <div className="flex-1">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleRestore} 
                        className="hidden" 
                        accept=".json"
                    />
                    <button 
                        onClick={handleRestoreTrigger}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/70 rounded-lg transition-colors border border-border text-sm font-medium"
                    >
                         {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        Import JSON
                    </button>
                </div>
            </div>

            {/* Status Feedback */}
            {message && (
                <div className={`text-xs flex items-center gap-1.5 mt-2 ${
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

export default BackupTools;

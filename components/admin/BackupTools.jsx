"use client";

import React, { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Download, Upload, Loader2, AlertTriangle, CheckCircle, FileJson } from 'lucide-react';

export default function BackupTools() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success', 'error'
    const fileInputRef = useRef(null);
    const supabase = createClient();

    const collectionsToBackup = [
        'products', 
        'categories', 
        'new_launches', 
        'press_releases', 
        'projects', 
        'messages', 
        'users', 
        'site_settings'
    ];

    const handleBackup = async () => {
        setLoading(true);
        setStatus(null);
        setMessage('Generating Supabase backup...');

        try {
            const backupData = {};

            for (const table of collectionsToBackup) {
                const { data, error } = await supabase.from(table).select('*');
                if (error) throw error;
                backupData[table] = data;
            }

            backupData['_meta'] = {
                timestamp: new Date().toISOString(),
                version: '2.0-supabase',
                source: 'Supabase Postgres'
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cinemafocus-supabase-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
        if (window.confirm("Confirm Restore: This will merge the backup data into your Supabase database. Existing records with same IDs will be overwritten. Continue?")) {
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
                    const rawContent = e.target.result;
                    let data = JSON.parse(rawContent);
                    
                    let opCount = 0;
                    
                    setMessage('Restoring tables...');
                    
                    for (const table of collectionsToBackup) {
                        if (data[table] && Array.isArray(data[table])) {
                            // Postgres upsert (on conflict do update)
                            const { error } = await supabase
                                .from(table)
                                .upsert(data[table]);
                                
                            if (error) {
                                console.error(`Error restoring ${table}:`, error);
                                throw new Error(`Failed to restore ${table}: ${error.message}`);
                            }
                            opCount += data[table].length;
                        }
                    }

                    if (opCount > 0) {
                         setStatus('success');
                         setMessage(`Database restored successfully (${opCount} records processed).`);
                         setTimeout(() => window.location.reload(), 2000);
                    } else {
                        setStatus('success');
                        setMessage('No valid data found in backup.');
                    }

                } catch (err) {
                    console.error(err);
                    setStatus('error');
                    setMessage('Restore Failed: ' + err.message);
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
        <div className="bg-background border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-medium flex items-center gap-2">
                <FileJson size={18} className="text-primary" /> 
                Supabase Backup & Restore
            </h3>
            
            <p className="text-xs text-muted-foreground">
                Export or import your entire PostgreSQL data as a JSON file.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <button 
                    onClick={handleBackup} 
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/70 rounded-lg transition-colors border border-border text-sm font-medium disabled:opacity-50"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Export Data (JSON)
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
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/70 rounded-lg transition-colors border border-border text-sm font-medium disabled:opacity-50"
                    >
                         {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        Import Data (JSON)
                    </button>
                </div>
            </div>

            {message && (
                <div className={`text-xs flex items-center gap-1.5 mt-2 p-2 rounded-md ${
                    status === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 
                    status === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 
                    'text-muted-foreground'
                }`}>
                    {status === 'error' && <AlertTriangle size={12} />}
                    {status === 'success' && <CheckCircle size={12} />}
                    {message}
                </div>
            )}
        </div>
    );
}

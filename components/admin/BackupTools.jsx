"use client";

import React, { useState, useRef } from 'react';
import { createClient } from '@/lib/aws/queryClient';
import { Download, Upload, Loader2, AlertTriangle, CheckCircle, FileJson } from 'lucide-react';

const SETTING_IDS = [
    'general', 'hero_main', 'philosophy', 'footer', 'trust_badges',
    'maintenance', 'seo', 'product_seo', 'custom_routes',
];

const TABLES = ['products', 'categories', 'new_launches', 'press_releases', 'projects', 'messages', 'users'];
const BACKUP_VERSION = '3.0-aws';
const CHUNK = 5; // parallel writes per batch, keeps API Gateway / Lambda / Dynamo from throttling

const chunked = async (items, fn) => {
    for (let i = 0; i < items.length; i += CHUNK) {
        await Promise.all(items.slice(i, i + CHUNK).map(fn));
    }
};

export default function BackupTools() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success', 'error'
    const fileInputRef = useRef(null);
    const db = createClient();

    const handleBackup = async () => {
        setLoading(true);
        setStatus(null);
        setMessage('Generating AWS backup...');

        try {
            const backupData = {};
            const counts = {};

            for (const table of TABLES) {
                setMessage(`Reading ${table}...`);
                const { data, error } = await db.from(table).select('*');
                if (error) throw new Error(`${table}: ${error.message}`);
                backupData[table] = data || [];
                counts[table] = backupData[table].length;
            }

            // site_settings has no list endpoint: read each known setting by id.
            setMessage('Reading site_settings...');
            const settings = [];
            for (const id of SETTING_IDS) {
                const { data, error } = await db.from('site_settings').select('*').eq('id', id).single();
                if (error) {
                    if (error.status === 404) continue; // setting never saved
                    throw new Error(`site_settings/${id}: ${error.message}`);
                }
                if (data) settings.push(data);
            }
            backupData.site_settings = settings;
            counts.site_settings = settings.length;

            backupData._meta = {
                timestamp: new Date().toISOString(),
                version: BACKUP_VERSION,
                source: 'AWS DynamoDB',
                counts,
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cinemafocus-aws-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            setStatus('success');
            setMessage(`Backup downloaded (${total} records).`);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Backup failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreTrigger = () => {
        if (window.confirm("Confirm Restore: this writes the backup into your AWS database. Records with the same IDs will be overwritten. Continue?")) {
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
            const data = JSON.parse(await file.text());
            if (!data || typeof data !== 'object' || !data._meta) throw new Error('Not a valid backup file');

            let done = 0;
            const skipped = [];
            const failed = [];

            for (const table of [...TABLES, 'site_settings']) {
                const rows = data[table];
                if (!Array.isArray(rows) || rows.length === 0) continue;
                setMessage(`Restoring ${table} (${rows.length})...`);

                let toWrite = rows;
                if (table === 'messages') {
                    // The messages API can only update status on an existing message
                    // (a PUT on a missing id would create a broken partial row), so
                    // only restore messages that still exist.
                    const { data: existing } = await db.from('messages').select('*');
                    const ids = new Set((existing || []).map((m) => m.id));
                    toWrite = rows.filter((m) => ids.has(m.id));
                    if (toWrite.length < rows.length) skipped.push(`${rows.length - toWrite.length} deleted messages`);
                }

                await chunked(toWrite, async (row) => {
                    if (row.id === undefined) { failed.push(`${table}: row without id`); return; }
                    const { error } = await db.from(table).upsert(row);
                    if (error) failed.push(`${table}/${row.id}: ${error.message}`);
                    else done++;
                });
            }

            if (failed.length) {
                console.error('Restore failures:', failed);
                setStatus('error');
                setMessage(`Restored ${done}, failed ${failed.length}. First: ${failed[0]}`);
            } else {
                setStatus('success');
                setMessage(`Restored ${done} records${skipped.length ? ` (skipped ${skipped.join(', ')})` : ''}.`);
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            console.error(error);
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
                AWS Backup & Restore
            </h3>
            
            <p className="text-xs text-muted-foreground">
                Export or import your DynamoDB content (products, categories, launches, press, projects, messages, users, site settings) as a JSON file.
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

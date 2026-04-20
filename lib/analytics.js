"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const usePageTracking = () => {
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const trackView = async () => {
            // Don't track admin pages or during development if needed
            if (pathname.startsWith('/admin')) return;

            const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            try {
                // Atomic increment in Supabase is best done via RPC or a trigger
                // Since we don't have a specific stats table yet, we could use site_settings 
                // or just skip for now. But for completeness, let's assume a 'stats' table exists.
                
                /*
                // SQL for this:
                // CREATE TABLE stats (date DATE PRIMARY KEY, count INTEGER DEFAULT 0);
                // INSERT INTO stats (date, count) VALUES ('...', 1) ON CONFLICT (date) DO UPDATE SET count = stats.count + 1;
                */

                // For now, we'll try to update a 'stats' table if it exists
                const { data, error } = await supabase.rpc('increment_stat', { d: dateStr });
                
                // Fallback: If RPC doesn't exist, we'll try a basic upsert (less atomic but workable)
                if (error) {
                    const { data: current } = await supabase
                        .from('stats')
                        .select('count')
                        .eq('date', dateStr)
                        .single();
                    
                    const newCount = (current?.count || 0) + 1;
                    
                    await supabase
                        .from('stats')
                        .upsert({ date: dateStr, count: newCount });
                }
            } catch (err) {
                console.error("Analytics Error:", err);
            }
        };

        trackView();
    }, [pathname]);
};

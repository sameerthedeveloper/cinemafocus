"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { incrementStat } from '@/lib/aws/adapter';

export const usePageTracking = () => {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin')) return;

        // Public, increment-only counter (DynamoDB Stats table via /api/aws proxy)
        incrementStat().catch((err) => console.error("Analytics Error:", err));
    }, [pathname]);
};

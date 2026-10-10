'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { pingRecentlyChanged } from '@/lib/indexnow';

const INDEXED_TAGS = new Set(['products', 'categories', 'press']);

/**
 * Revalidates the cache for a given tag.
 * Used by the admin panel to ensure data changes are reflected on the public site immediately.
 */
export async function revalidateData(tag) {
    if (tag) {
        revalidateTag(tag);
        if (INDEXED_TAGS.has(tag)) after(() => pingRecentlyChanged());
        console.log(`[Cache] Revalidated tag: ${tag}`);
    } else {
        revalidatePath('/');
        console.log(`[Cache] Revalidated all paths`);
    }
}

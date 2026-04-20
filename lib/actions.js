'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Revalidates the cache for a given tag.
 * Used by the admin panel to ensure data changes are reflected on the public site immediately.
 */
export async function revalidateData(tag) {
    if (tag) {
        revalidateTag(tag);
        console.log(`[Cache] Revalidated tag: ${tag}`);
    } else {
        revalidatePath('/');
        console.log(`[Cache] Revalidated all paths`);
    }
}

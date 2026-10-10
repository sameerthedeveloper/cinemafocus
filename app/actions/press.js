'use server';

import { revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { pingRecentlyChanged } from '@/lib/indexnow';

export async function revalidatePressCache() {
  revalidateTag('press', 'max');
  after(() => pingRecentlyChanged());
}

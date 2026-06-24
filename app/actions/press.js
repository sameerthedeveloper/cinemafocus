'use server';

import { revalidateTag } from 'next/cache';

export async function revalidatePressCache() {
  revalidateTag('press', 'max');
}

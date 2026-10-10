import { buildLlmsFull } from '@/lib/llms';

export const revalidate = 3600;

export async function GET() {
  const body = await buildLlmsFull();
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

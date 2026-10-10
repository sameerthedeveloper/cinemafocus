import { SITE } from '@/lib/site';

const DISALLOW = ['/admin/', '/portal/', '/api/', '/*?bypass=true', '/*?offline=true'];

// AI search / assistant crawlers. Explicitly allowed (same disallows as everyone).
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots() {
  const isProd = process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Block staging / vercel branch previews from double indexing
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}

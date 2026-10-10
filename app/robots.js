import { SITE } from '@/lib/site';

const DISALLOW = ['/admin/', '/portal/', '/api/', '/*?bypass=true', '/*?offline=true'];

// AI crawlers, explicitly allowed (same disallows as everyone). Roles per vendor docs:
//   search / retrieval:   OAI-SearchBot (OpenAI), Claude-SearchBot (Anthropic), PerplexityBot
//   user-triggered fetch: ChatGPT-User, Claude-User, Perplexity-User (Perplexity says it generally ignores robots.txt)
//   training / data use:  GPTBot, ClaudeBot, Google-Extended (Gemini; not Search), Applebot-Extended
// Owner policy: allow all of the above. To opt out of training only, set the four training bots to `disallow: '/'`.
const AI_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots() {
  // Vercel preview deployments also run with NODE_ENV=production, so check VERCEL_ENV too
  const isPreview = !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  const isProd = !isPreview && (process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production');

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

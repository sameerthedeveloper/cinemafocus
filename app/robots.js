export default function robots() {
  const isProd = process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';
  const siteUrl = 'https://www.cinemafocus.in';

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
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/api/', 
        '/*?bypass=true',
        '/*?offline=true'
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets test builds use their own folder (NEXT_DIST_DIR=.next-verify) so they never touch a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  turbopack: {
    root: path.resolve('.'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      // AWS image CDN: CloudFront E2ET6E6X3C69LN (the layout's fallback origin is allowed even when the env var is unset)
      {
        protocol: 'https',
        hostname: "d2x0o69dm3vdcd.cloudfront.net",
        pathname: '/**',
      },
      // Store site image CDN (store.cinemafocus.in): used by hero slides that point at store product photos
      {
        protocol: 'https',
        hostname: "d54bgf57pn0o3.cloudfront.net",
        pathname: '/products/**',
      },
    ],
    // The optimizer is enabled. Source images on the CDN are often full-resolution PNG/JPG uploads
    // (1-4 MB); <Hero> and <OptimizedImage optimize> route them through it for AVIF/WebP + responsive
    // sizes. OptimizedImage still serves plain <img> where the image mode setting asks for that.
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 70, 75, 80],
    // Source URLs are content-addressed (timestamped filenames), so a long TTL is safe.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
  },
  async headers() {
    // Crawler-facing files: cache at the edge for an hour, serve stale while revalidating
    const cache = [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }];
    const rules = ['/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt'].map((source) => ({ source, headers: cache }));

    // Unversioned files in /public: revalidate daily, serve stale for a week. (Not immutable: the
    // filenames are not content-hashed. /_next/static is already immutable via Next.)
    rules.push({
      source: '/images/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
    });

    // Security headers. HSTS is deliberately not set here: Vercel already sends
    // `max-age=63072000`; includeSubDomains/preload need every subdomain verified HTTPS first.
    const cdn = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'd2x0o69dm3vdcd.cloudfront.net';
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      // Keeps window.opener isolated from cross-origin pages while still allowing our own popups.
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      // Enforced: only the directives that cannot break rendering.
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
    ];
    if (process.env.NODE_ENV === 'production') {
      // Report-only until the browser console shows no violations on real traffic. script-src needs
      // 'unsafe-inline' for Next's inline bootstrap scripts: a nonce would force every page to render
      // dynamically (no static/CDN caching). Trusted Types is intentionally not enabled yet.
      security.push({
        key: 'Content-Security-Policy-Report-Only',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          `img-src 'self' data: blob: https://${cdn} https://*.supabase.co https://images.unsplash.com https://placehold.co`,
          "font-src 'self' data:",
          "connect-src 'self' https://*.supabase.co",
          `media-src 'self' blob: https://${cdn}`,
          'frame-src https://maps.google.com https://www.google.com',
          "worker-src 'self' blob:",
          "manifest-src 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; '),
      });
    }
    rules.push({ source: '/:path*', headers: security });

    // Never index Vercel preview / non-production deployments
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
      rules.push({ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] });
    }
    return rules;
  },
  async redirects() {
    return [
      // www/apex canonicalisation is handled by the Vercel Domains setting, not here:
      // an app-level rule loops with Vercel's own apex<->www redirect. Canonical host = https://cinemafocus.in
      // 1. WordPress legacy category redirect to brand
      {
        source: '/product-category/:slug',
        destination: '/brand/:slug',
        permanent: true,
      },
      // 2. Next.js old category redirect to brand
      {
        source: '/category/:slug',
        destination: '/brand/:slug',
        permanent: true,
      },
      // 3. WordPress legacy single product redirect
      {
        source: '/shop/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
      // 4. WordPress legacy query string redirect fallback
      {
        source: '/wp-content/:path*',
        destination: '/images/:path*',
        permanent: true,
      },
      // 5. WordPress WooCommerce single product default URL structure
      {
        source: '/product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
      // 6. Legacy WordPress store main page
      {
        source: '/shop',
        destination: '/products',
        permanent: true,
      },
      // 7. Legacy contact-us URL structure
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      // 8. Legacy about-us URL structure
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      // 9. Legacy plural brands URL structure
      {
        source: '/brands/:slug',
        destination: '/brand/:slug',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;

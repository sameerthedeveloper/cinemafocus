import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      }
    ],
    qualities: [75, 90],
  },
  async redirects() {
    return [
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
      }
    ];
  },
};

export default nextConfig;

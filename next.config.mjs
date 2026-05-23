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
    // Deliverable 1: Move from runtime image optimization -> upload-time optimization.
    // Setting unoptimized: true disables global Vercel/Next.js runtime image transformations.
    // 
    // EDGE CASE NOTE:
    // If you plan to dynamically switch between 'runtime' or 'hybrid' modes from the Admin panel
    // without rebuilding/redeploying, unoptimized must be set to false (or commented out).
    // When unoptimized is true here, the unoptimized prop is forced on all Next.js <Image> tags,
    // rendering the database/admin mode toggle ineffective for runtime transformations.
    // To allow full dynamic toggling, keep unoptimized: false here and let the OptimizedImage
    // component manually apply the unoptimized prop based on the selected mode.
    unoptimized: true,
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

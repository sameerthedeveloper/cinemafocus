import { getProducts, getCategories, getPressReleases } from '@/lib/cms';

const BASE_URL = 'https://cinemafocus.in';

/**
 * Reusable helper to safely fetch database records and map them to standard sitemap objects.
 */
async function fetchSitemapEntries(fetcher, pathPrefix, priority, key = 'slug') {
  try {
    const items = await fetcher();
    if (!items || !Array.isArray(items)) return [];

    return items.map((item) => ({
      url: `${BASE_URL}${pathPrefix}/${item[key]}`,
      lastModified: new Date(item.updatedAt || item.created_at || new Date()),
      changeFrequency: 'weekly',
      priority,
    }));
  } catch (error) {
    console.error(`Error compiling sitemap entries for ${pathPrefix}:`, error);
    return [];
  }
}

export default async function sitemap() {
  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/gallery',
    '/location',
    '/press',
    '/products'
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/location' ? 'monthly' : 'daily',
    priority: route === '' ? 1.0 : route === '/location' ? 0.9 : 0.8,
  }));

  // 2. Fetch Dynamic Routes Concurrently to Optimize Server Response Time
  const [productRoutes, categoryRoutes, pressRoutes] = await Promise.all([
    fetchSitemapEntries(getProducts, '/products', 0.7),
    fetchSitemapEntries(getCategories, '/brand', 0.6),
    fetchSitemapEntries(getPressReleases, '/press', 0.5, 'id')
  ]);

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...pressRoutes];
}

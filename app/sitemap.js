import { getProducts, getCategories } from '@/lib/cms';

export default async function sitemap() {
  const baseUrl = 'https://cinemafocus.in';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/gallery',
    '/press',
    '/products'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch Dynamic Products
  let productRoutes = [];
  try {
    const products = await getProducts();
    if (products) {
      productRoutes = products.map((prod) => ({
        url: `${baseUrl}/products/${prod.slug}`,
        lastModified: new Date(prod.updatedAt || prod.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error compiling sitemap products:', error);
  }

  // 3. Fetch Dynamic Categories
  let categoryRoutes = [];
  try {
    const categories = await getCategories();
    if (categories) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/brand/${cat.slug}`,
        lastModified: new Date(cat.updatedAt || cat.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error compiling sitemap categories:', error);
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}

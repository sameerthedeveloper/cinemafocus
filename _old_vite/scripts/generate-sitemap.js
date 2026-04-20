import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // Load env vars from .env

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const generateSitemap = async () => {
    const SITE_URL = 'https://cinemafocus.in';

    const staticRoutes = [
        '',
        '/products',
        '/gallery',
        '/about',
        '/contact',
        '/press'
    ];

    let dynamicRoutes = [];

    try {
        const firebaseConfig = {
            apiKey: process.env.VITE_FIREBASE_API_KEY,
            authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.VITE_FIREBASE_APP_ID,
        };

        if (!firebaseConfig.apiKey) {
            throw new Error("Missing Firebase Config in Environment Variables");
        }

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log('Fetching products...');
        const productsSnap = await getDocs(collection(db, 'products'));
        productsSnap.forEach(doc => {
            const data = doc.data();
            if (data.slug) dynamicRoutes.push(`/products/${data.slug}`);
        });

        console.log('Fetching categories...');
        const categoriesSnap = await getDocs(collection(db, 'categories'));
        categoriesSnap.forEach(doc => {
            const data = doc.data();
            if (data.slug) dynamicRoutes.push(`/category/${data.slug}`);
        });

        console.log('Fetching press releases...');
        const pressSnap = await getDocs(collection(db, 'press_releases'));
        pressSnap.forEach(doc => {
            dynamicRoutes.push(`/press/${doc.id}`);
        });

    } catch (error) {
        console.warn('⚠️  Could not fetch dynamic routes. Generating static sitemap only.');
        console.warn('   Reason:', error.message);
        console.warn('   Make sure you have a .env file with VITE_FIREBASE_* variables.');
    }

    const routes = [...new Set([...staticRoutes, ...dynamicRoutes])]; // Dedup

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`;

    fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
    console.log(`✅ Sitemap generated at public/sitemap.xml with ${routes.length} URLs.`);
    process.exit(0);
};

generateSitemap();

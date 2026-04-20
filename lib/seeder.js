import { createClient } from "./supabase/client";
import { categories, products, hero, trustBadges, newLaunches, pressReleases, projects } from "./seed-data.js";

const supabase = createClient();
const BUCKET = 'images';

const ASSETS_TO_UPLOAD = [
    'hero-light.webp',
    'speakers.webp',
    'amplifiers.webp',
    'turntables.webp',
    'product-speakers.webp',
    'product-amp.webp'
];

const uploadAssetsToSupabase = async () => {
    console.log(`Starting Supabase asset upload...`);

    for (const filename of ASSETS_TO_UPLOAD) {
        try {
            // 1. Fetch local file
            const response = await fetch(`/images/${filename}`);
            if (!response.ok) throw new Error(`Missing local file: ${filename}`);
            const blob = await response.blob();

            // 2. Upload to Supabase Storage
            const { error } = await supabase.storage
                .from(BUCKET)
                .upload(filename, blob, {
                    upsert: true,
                    contentType: 'image/webp'
                });
            
            if (error) throw error;
            console.log(`Saved ${filename} to Supabase Storage.`);
        } catch (e) {
            console.warn(`Failed to upload ${filename}:`, e.message);
        }
    }

    console.log("Asset upload complete.");
};

export const seedDatabase = async () => {
    console.log("Starting database reset and seeding...");

    // 0. Ensure Assets exist in Supabase
    try {
        await uploadAssetsToSupabase();
    } catch (e) {
        console.error("Asset upload failed, continuing with data seeding...", e);
    }

    // 1. Clear existing data (One by one since multi-delete via SDK is limited without RLS bypass)
    console.log("Cleaning existing tables...");
    const tables = ['new_launches', 'products', 'categories', 'press_releases', 'projects', 'site_settings'];
    for (const table of tables) {
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        if (error) console.error(`Error clearing ${table}:`, error);
    }

    // 2. Write Seed Data

    // Seed Categories
    console.log("Seeding Categories...");
    const mappedCategories = categories.map(cat => ({
        id: cat.slug,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.imageUrl,
        description: cat.description,
        product_count: cat.productCount || 0,
        featured: cat.featured || false
    }));
    await supabase.from("categories").insert(mappedCategories);

    // Seed Products
    console.log("Seeding Products...");
    const mappedProducts = products.map(prod => ({
        id: prod.slug,
        name: prod.name,
        brand: prod.brand,
        price: prod.price,
        slug: prod.slug,
        category: prod.category,
        short_description: prod.shortDescription,
        long_description: prod.longDescription,
        images: prod.images,
        featured: prod.featured || false,
        specifications: prod.specifications || []
    }));
    await supabase.from("products").insert(mappedProducts);

    // Seed New Launches
    console.log("Seeding New Launches...");
    const mappedLaunches = newLaunches.map(launch => ({
        name: launch.name,
        brand: launch.brand,
        price: launch.price,
        slug: launch.slug,
        category: launch.category,
        short_description: launch.shortDescription,
        images: launch.images,
        featured: true,
        original_product_id: launch.originalProductId || launch.slug // Link to the product we just seeded
    }));
    await supabase.from("new_launches").insert(mappedLaunches);

    // Seed Press Releases
    console.log("Seeding Press Releases...");
    const mappedPRs = pressReleases.map(pr => ({
        title: pr.title,
        slug: pr.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        date: new Date(pr.date).toISOString().split('T')[0],
        excerpt: pr.excerpt,
        image_url: pr.imageUrl,
        cover_images: [pr.imageUrl],
        content_blocks: pr.contentBlocks || []
    }));
    await supabase.from("press_releases").insert(mappedPRs);

    // Seed Projects
    console.log("Seeding Projects...");
    const mappedProjects = projects.map(proj => ({
        title: proj.title,
        category: proj.category || 'Residential',
        image_url: proj.imageUrl,
        created_at: proj.createdAt || new Date().toISOString()
    }));
    await supabase.from("projects").insert(mappedProjects);

    // Seed Site Settings (Hero, Badges, Footer, SEO)
    console.log("Seeding Site Settings...");
    const settings = [
        {
            id: 'hero_main',
            data: hero
        },
        {
            id: 'trust_badges',
            data: { items: trustBadges }
        },
        {
            id: 'footer',
            data: {
                address: '123 Audio Lane, Sound City, SC 90210',
                phones: ['+1 (555) 123-4567'],
                email: 'contact@cinemafocus.com',
                workingHours: "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"
            }
        },
        {
            id: 'seo',
            data: {
                siteTitle: 'Cinema Focus',
                titleSuffix: '| Premium Audio',
                defaultDescription: 'Experience the ultimate in home audio and cinema.',
                defaultKeywords: 'audio, hifi, speakers, home theater, cinema focus'
            }
        },
        {
            id: 'general',
            data: {
                showDesktopMenu: true,
                showPrice: true,
                contactEmail: 'contact@cinemafocus.com'
            }
        }
    ];
    await supabase.from("site_settings").insert(settings);

    console.log("Database reset and seeded successfully with Supabase.");
};

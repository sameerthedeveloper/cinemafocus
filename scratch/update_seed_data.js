const fs = require('fs');
const path = require('path');

const productsJsonPath = '/Users/sameer/Developer/cinemafocus/public/supabase_products.json';
const categoriesJsonPath = '/Users/sameer/Developer/cinemafocus/public/supabase_categories.json';
const seedDataPath = '/Users/sameer/Developer/cinemafocus/lib/seed-data.js';

console.log("Loading products and categories...");
const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
const categories = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf8'));

// Format categories to match seed-data.js structure
const formattedCategories = categories.map(cat => ({
  name: cat.name,
  slug: cat.slug,
  imageUrl: cat.imageUrl,
  description: cat.description,
  productCount: products.filter(p => p.category === cat.slug).length
}));

const codeContent = `// Helper to get consistent image URL
const getImageUrl = (filename) => {
    return \`/images/\${filename}\`;
};

const heroImg = getImageUrl('hero-light.webp');
const speakersImg = getImageUrl('speakers.webp');
const subwoofersImg = getImageUrl('speakers.webp');
const amplifiersImg = getImageUrl('amplifiers.webp');
const turntablesImg = getImageUrl('turntables.webp');
const productSpeakersImg = getImageUrl('product-speakers.webp');
const productAmpImg = getImageUrl('product-amp.webp');

export const categories = ${JSON.stringify(formattedCategories, null, 4)};

export const products = ${JSON.stringify(products, null, 4)};

export const hero = {
    title: "Sound, unbound.",
    subtitle: "Experience music in its purest form with our curated collection of world-class audio systems.",
    ctaText: "Discover Collection",
    ctaLink: "/products",
    imageUrl: heroImg
};

export const trustBadges = [
    {
        icon: "Globe",
        title: "Global Shipping",
        description: "Insured delivery worldwide"
    },
    {
        icon: "ShieldCheck",
        title: "5-Year Warranty",
        description: "On all premium components"
    },
    {
        icon: "Headphones",
        title: "Expert Support",
        description: "Consult with audiophiles"
    },
    {
        icon: "Award",
        title: "Authorized Dealer",
        description: "100% Genuine Products"
    }
];

export const projects = [
    {
        title: "The Penthouse Suite",
        imageUrl: '/images/hero.webp',
        createdAt: new Date().toISOString()
    },
    {
        title: "Modern Minimalist Home",
        imageUrl: '/images/speakers.webp',
        createdAt: new Date().toISOString()
    },
    {
        title: "Professional Studio Setup",
        imageUrl: '/images/amplifiers.webp',
        createdAt: new Date().toISOString()
    }
];

export const newLaunches = [
    {
        slug: "sonus-faber-lumina-v",
        name: "Sonus faber Lumina V",
        brand: "Sonus faber",
        price: 2800,
        category: "floorstanding-speakers",
        shortDescription: "A compact floorstander that delivers a big sound.",
        longDescription: "The Lumina collection by Sonus faber presents an exciting change, new to the typical Sonus faber product design portfolio but still able to embody the history and values of the brand.",
        images: [
            "/images/speakers.webp",
            "https://images.unsplash.com/photo-1543512214-318c77a072d8?auto=format&fit=crop&q=80&w=800"
        ],
        featured: true,
        specifications: [
            { key: "Frequency Response", value: "38Hz - 24kHz" },
            { key: "Sensitivity", value: "89dB" },
            { key: "Impedance", value: "4 Ohms" }
        ]
    },
    {
        slug: "mcintosh-ma352",
        name: "McIntosh MA352",
        brand: "McIntosh",
        price: 7000,
        category: "tube-amplifiers",
        shortDescription: "Hybrid drive integrated amplifier.",
        longDescription: "The MA352 Integrated Amplifier is a hybrid design that combines the finest of vacuum tube and solid state audio design principles.",
        images: [
            "/images/amplifiers.webp",
            "https://images.unsplash.com/photo-1558434446-c22cb1546872?auto=format&fit=crop&q=80&w=800"
        ],
        featured: true,
        specifications: [
            { key: "Power Output", value: "200 Watts per channel" },
            { key: "Tubes", value: "12AX7A, 12AT7" }
        ]
    },
    {
        slug: "project-debut-pro",
        name: "Pro-Ject Debut PRO",
        brand: "Pro-Ject",
        price: 999,
        category: "turntables",
        shortDescription: "The new standard for entry-level audiophile turntables.",
        longDescription: "The Debut PRO brings an absolutely new design to Pro-Ject turntables. The audiophile turntable is convincing in all respects - not only visually, but also in terms of sound.",
        images: [
            "/images/turntables.webp",
            "https://images.unsplash.com/photo-1543512214-318c77a072d8?auto=format&fit=crop&q=80&w=800"
        ],
        featured: true,
        specifications: [
            { key: "Speed", value: "33, 45, 78" },
            { key: "Drive Principle", value: "Belt drive" }
        ]
    }
];

export const pressReleases = [
    {
        id: "pr-1",
        title: "Cinema Focus Wins 'Best Home Theater Installer' Award 2024",
        date: "October 15, 2024",
        excerpt: "We are proud to announce that Cinema Focus has been recognized as the top installer in the region for our dedication to excellence and customer satisfaction.",
        imageUrl: "/images/hero-light.webp"
    },
    {
        id: "pr-2",
        title: "Partnership Announcement with Sonus faber",
        date: "September 01, 2024",
        excerpt: "Cinema Focus is now an official Diamond Dealer for Sonus faber, bringing the full range of Italian masterpieces to our showroom.",
        imageUrl: "/images/speakers.webp"
    },
    {
        id: "pr-3",
        title: "Introducing Our New High-Fidelity Listening Room",
        date: "August 20, 2024",
        excerpt: "Experience audio like never before in our newly acoustically treated listening room, featuring the flagship KEF Blade One Meta.",
        imageUrl: "/images/amplifiers.webp"
    }
];
`;

fs.writeFileSync(seedDataPath, codeContent, 'utf8');
console.log("Successfully updated lib/seed-data.js with new products and categories!");

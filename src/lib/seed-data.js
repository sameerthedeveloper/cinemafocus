import { storageBucket } from './supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const bucketName = storageBucket;

// Helper to get consistent image URL
const getImageUrl = (filename) => {
    // Check if we have Supabase config (minimal check)
    if (supabaseUrl && bucketName) {
        // Construct public URL
        // Format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[filename]
        return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filename}`;
    }
    // Fallback to local
    return `/images/${filename}`;
};

// Map original local filenames to intended cloud filenames
// For simplicity, we assume the cloud filenames match these or we hardcode specific ones if known.
// Ideally, these files should exist in the bucket.
const heroImg = '/images/hero-light.webp';
const speakersImg = '/images/speakers.webp';
const subwoofersImg = '/images/speakers.webp'; // Reusing speakers for demo
const amplifiersImg = '/images/amplifiers.webp';
const turntablesImg = '/images/turntables.webp';
const productSpeakersImg = '/images/product-speakers.webp';
const productAmpImg = '/images/product-amp.webp';

export const categories = [
    {
        name: "Floorstanding Speakers",
        slug: "floorstanding-speakers",
        imageUrl: speakersImg,
        description: "Experience the full depth of sound with our flagship floorstanding speakers.",
        productCount: 12
    },
    {
        name: "Tube Amplifiers",
        slug: "tube-amplifiers",
        imageUrl: amplifiersImg,
        description: "Warm, rich, and authentic. The heart of any audiophile system.",
        productCount: 8
    },
    {
        name: "Turntables",
        slug: "turntables",
        imageUrl: turntablesImg,
        description: "Precision analog playback for the purist.",
        productCount: 5
    },
    {
        name: "Subwoofers",
        slug: "subwoofers",
        imageUrl: subwoofersImg,
        description: "Deep, articulate bass that you can feel.",
        productCount: 6
    }
];

export const products = [
    {
        slug: "kef-blade-one-meta",
        name: "KEE Blade One Meta",
        brand: "KEE",
        price: 35000,
        category: "floorstanding-speakers",
        shortDescription: "The world's first Single Apparent Source loudspeaker.",
        longDescription: "Blade is the attitude of giving all. It's about exploring the art of the possible, without preconceptions. KEF's engineers were given free rein to create the best loudspeaker they could, without design or cost restrictions. The result is Blade: a speaker that sounds like nothing else.",
        images: [
            productSpeakersImg,
            "https://images.unsplash.com/photo-1543512214-318c77a072d8?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1558434446-c22cb1546872?auto=format&fit=crop&q=80&w=800"
        ],
        featured: true,
        specifications: [
            { key: "Frequency Response", value: "27Hz - 45kHz" },
            { key: "Sensitivity", value: "88dB" },
            { key: "Impedance", value: "4 Ohms" },
            { key: "Dimensions", value: "1590 x 363 x 540 mm" },
            { key: "Impedance", value: "4 Ohms" },
            { key: "Sensitivity", value: "88dB" },
            { key: "Impedance", value: "4 Ohms" },
            { key: "Dimensions", value: "1590 x 363 x 540 mm" },
            { key: "Dimensions", value: "1590 x 363 x 540 mm" }
        ]
    },
    {
        slug: "mcintosh-mc462",
        name: "McIntosh MC462",
        brand: "McIntosh",
        price: 9000,
        category: "tube-amplifiers",
        shortDescription: "The most powerful stereo amplifier McIntosh has ever produced.",
        longDescription: "The MC462 Quad Balanced Power Amplifier replaces the highly regarded MC452 as our most powerful stereo amplifier. Like the MC452, it features a robust output of 450 Watts per channel. With a dedicated McIntosh Autoformer™ connected to each audio channel, you get the full 450 Watts available to any speaker.",
        images: [
            productAmpImg,
            "https://images.unsplash.com/photo-1558434446-c22cb1546872?auto=format&fit=crop&q=80&w=800"
        ],
        featured: true,
        specifications: [
            { key: "Power Output", value: "450 Watts per channel" },
            { key: "THD", value: "0.005%" },
            { key: "S/N Ratio", value: "122dB" },
            { key: "Weight", value: "52.3 kg" }
        ]
    },
    {
        slug: "bw-801-d4",
        name: "Bowers & Wilkins 801 D4",
        brand: "Bowers & Wilkins",
        price: 38000,
        category: "floorstanding-speakers",
        shortDescription: "The loudspeaker that sets the standard other high-end designs will be judged by.",
        longDescription: "The 801 D4 is our flagship loudspeaker. It features all the most advanced technologies in our pure engineering portfolio, including the Turbine Head and the solid-body Tweeter-on-Top.",
        images: [
            productSpeakersImg,
            "https://images.unsplash.com/photo-1543512214-318c77a072d8?auto=format&fit=crop&q=80&w=800"
        ],
        featured: true,
        specifications: [
            { key: "Frequency Response", value: "15Hz - 28kHz" },
            { key: "Sensitivity", value: "90dB" },
            { key: "Impedance", value: "8 Ohms" },
            { key: "Dimensions", value: "1221 x 451 x 600 mm" }
        ]
    },
    {
        slug: "sonus-faber-aida",
        name: "Sonus faber Aida",
        brand: "Sonus faber",
        price: 120000,
        category: "floorstanding-speakers",
        shortDescription: "The pinnacle of Italian craftsmanship and acoustic engineering.",
        longDescription: "Aida is the highest expression of the Sonus faber philosophy. A speaker that sounds as beautiful as it looks, crafted from the finest materials and utilizing the most advanced technologies.",
        images: [
            productSpeakersImg,
            "https://images.unsplash.com/photo-1543512214-318c77a072d8?auto=format&fit=crop&q=80&w=800"
        ],
        featured: false,
        specifications: [
            { key: "Frequency Response", value: "18Hz - 35kHz" },
            { key: "Sensitivity", value: "92dB" },
            { key: "Impedance", value: "4 Ohms" },
            { key: "Dimensions", value: "1725 x 482 x 780 mm" }
        ]
    },
    {
        slug: "audio-research-ref160s",
        name: "Audio Research REF160S",
        brand: "Audio Research",
        price: 22000,
        category: "tube-amplifiers",
        shortDescription: "A vacuum tube stereo power amplifier that redefines the category.",
        longDescription: "The Reference 160S stereo power amplifier distills the astonishing resolution, dynamic impact, musical purity and finesse of the 160M monaural amplifier into one chassis.",
        images: [
            productAmpImg,
            "https://images.unsplash.com/photo-1558434446-c22cb1546872?auto=format&fit=crop&q=80&w=800"
        ],
        featured: false,
        specifications: [
            { key: "Power Output", value: "140 Watts per channel" },
            { key: "Tubes", value: "KT150" },
            { key: "Impedance Taps", value: "16, 8, 4 Ohms" },
            { key: "Weight", value: "45 kg" }
        ]
    }
];

export const hero = {
    title: "Sound, unbound.",
    subtitle: "Experience music in its purest form with our curated collection of world-class audio systems.",
    ctaText: "Discover Collection",
    ctaLink: "/products",
    imageUrl: heroImg
};

export const trustBadges = [
    {
        icon: "Globe", // Lucide Icon Name
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

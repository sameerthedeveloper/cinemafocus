// Helper to get consistent image URL
const getImageUrl = (filename) => {
    // We prioritize local assets in the repository for initial data.
    // When seeded to Firestore, the seeder can replace these with cloud URLs if needed.
    return `/images/${filename}`;
};

// Map original local filenames to intended cloud filenames
// For simplicity, we assume the cloud filenames match these or we hardcode specific ones if known.
// Ideally, these files should exist in the bucket.
const heroImg = getImageUrl('hero-light.webp', { width: 1920 });
const speakersImg = getImageUrl('speakers.webp', { width: 800 });
const subwoofersImg = getImageUrl('speakers.webp', { width: 800 });
const amplifiersImg = getImageUrl('amplifiers.webp', { width: 800 });
const turntablesImg = getImageUrl('turntables.webp', { width: 800 });
const productSpeakersImg = getImageUrl('product-speakers.webp', { width: 800 });
const productAmpImg = getImageUrl('product-amp.webp', { width: 800 });
export const categories = [
    {
        name: "Floorstanding Speakers",
        slug: "floorstanding-speakers",
        imageUrl: speakersImg,
        description: "Experience the full depth of sound with our flagship floorstanding speakers.",
        productCount: 18
    },
    {
        name: "Studio Monitors",
        slug: "studio-monitors",
        imageUrl: productSpeakersImg,
        description: "Professional reference monitors for the world's leading recording studios.",
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
        productCount: 8
    },
    {
        name: "Home Theater",
        slug: "home-theater",
        imageUrl: heroImg,
        description: "Immersive cinematic sound for the most demanding home environments.",
        productCount: 4
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
    },
    {
        slug: "atc-scm-100a-sl-pro",
        name: "ATC SCM 100A SL Pro",
        brand: "ATC",
        price: 18500,
        category: "studio-monitors",
        catalogUrl: "/catalogs/atc/SCM 100A.pdf",
        shortDescription: "Three-way active studio monitor with 12\" bass driver.",
        longDescription: "The ATC SCM100A is a three-way active studio monitor known for its accurate sound reproduction and powerful performance. It features a tri-amplified design with dedicated power for each driver, incorporating the legendary 75mm 'Super Dome' midrange driver.",
        images: [productSpeakersImg],
        featured: true,
        specifications: [
            { key: "Drivers", value: "25mm HF, 75mm Mid, 314mm LF" },
            { key: "Frequency Response", value: "32Hz - 22kHz (-6dB)" },
            { key: "Max SPL", value: "115dB continuous" },
            { key: "Amplifier Output", value: "350W (Bass 200W, Mid 100W, HF 50W)" },
            { key: "Crossover Frequencies", value: "380Hz, 3.5kHz" },
            { key: "Weight", value: "65kg" }
        ]
    },
    {
        slug: "atc-scm-300a-sl-pro",
        name: "ATC SCM 300A SL Pro",
        brand: "ATC",
        price: 45000,
        category: "studio-monitors",
        catalogUrl: "/catalogs/atc/SCM 300A.pdf",
        shortDescription: "Flagship active 3-way reference monitor with twin 15\" bass drivers.",
        longDescription: "The ATC SCM300A SL Pro is ATC's flagship active 3-way reference monitor, designed for the largest and most demanding recording environments. It features twin 15\" SL spec bass drivers and a rack-mount P4 4-way grounded source amplifier.",
        images: [productSpeakersImg],
        featured: true,
        specifications: [
            { key: "Drivers", value: "34mm HF, 75mm Mid, 2 x 375mm LF" },
            { key: "Frequency Response", value: "25Hz - 20kHz (-6dB)" },
            { key: "Max SPL", value: "121dB continuous" },
            { key: "Amplifier Output", value: "850W (Bass 2x275W, Mid 200W, HF 100W)" },
            { key: "Weight", value: "140kg (per monitor)" }
        ]
    },
    {
        slug: "atc-scs-120-pro",
        name: "ATC SCS 120 Pro",
        brand: "ATC",
        price: 9500,
        category: "subwoofers",
        catalogUrl: "/catalogs/atc/SCS 120.pdf",
        shortDescription: "Professional 15\" active studio subwoofer.",
        longDescription: "The ATC SCS120 Pro is a high-performance 15-inch active studio subwoofer designed to complement ATC's range of professional monitoring systems. It delivers deep, articulate bass with exceptional clarity and power.",
        images: [subwoofersImg],
        featured: false,
        specifications: [
            { key: "Driver", value: "15\" ATC SS75-375SC" },
            { key: "Frequency Range", value: "20Hz - 320Hz (-6dB)" },
            { key: "Max SPL", value: "113dB continuous" },
            { key: "Amplifier Output", value: "300W Class AB MOSFET" },
            { key: "Weight", value: "44.5kg" }
        ]
    },
    {
        slug: "atc-hts-11",
        name: "ATC HTS 11",
        brand: "ATC",
        price: 2800,
        category: "home-theater",
        catalogUrl: "/catalogs/atc/HTS 11.pdf",
        shortDescription: "Compact 2-way on-wall loudspeaker.",
        longDescription: "The ATC HTS11 is a mid-size 2-way on-wall loudspeaker designed for main loudspeakers in medium-sized rooms or as surround speakers in larger rooms. It offers the legendary ATC performance in a discreet, wall-mounted form factor.",
        images: [productSpeakersImg],
        featured: false,
        specifications: [
            { key: "Drivers", value: "25mm HF, 150mm Mid/Bass" },
            { key: "Frequency Response", value: "55Hz - 25kHz (-6dB)" },
            { key: "Max SPL", value: "108dB continuous" },
            { key: "Recommended Power", value: "75W - 300W" },
            { key: "Weight", value: "16.9kg" }
        ]
    },
    {
        slug: "atc-scm-50asl",
        name: "ATC SCM 50ASL",
        brand: "ATC",
        price: 15500,
        category: "floorstanding-speakers",
        catalogUrl: "/catalogs/atc/SCM 50.pdf",
        shortDescription: "Active three-way reference monitor/loudspeaker.",
        longDescription: "The ATC SCM50ASL is a versatile three-way active system, equally at home in a professional studio or a high-end home audio system. It features the 75mm soft dome midrange and a 234mm Super Linear bass driver.",
        images: [productSpeakersImg],
        featured: false,
        specifications: [
            { key: "Drivers", value: "25mm HF, 75mm Mid, 234mm LF" },
            { key: "Frequency Response", value: "38Hz - 25kHz (-6dB)" },
            { key: "Max SPL", value: "112dB continuous" },
            { key: "Amplifier Output", value: "350W (Bass 200W, Mid 100W, HF 50W)" },
            { key: "Weight", value: "48.9kg" }
        ]
    },
    {
        slug: "atc-scm-25a-pro-mk2",
        name: "ATC SCM 25A Pro Mk2",
        brand: "ATC",
        price: 8200,
        category: "studio-monitors",
        catalogUrl: "/catalogs/atc/scm 25A.pdf",
        shortDescription: "Compact active 3-way studio monitor.",
        longDescription: "The SCM25A Pro Mk2 is a compact 3-way active studio monitor that delivers the transparency and detail of larger ATC systems in a smaller footprint. It features the SH25-76S dual-suspension tweeter for improved high-frequency performance.",
        images: [productSpeakersImg],
        featured: true,
        specifications: [
            { key: "Drivers", value: "25mm HF, 75mm Mid, 164mm LF" },
            { key: "Frequency Response", value: "47Hz - 22kHz (-6dB)" },
            { key: "Max SPL", value: "109dB continuous" },
            { key: "Amplifier Output", value: "242W Total" },
            { key: "Weight", value: "25.4kg" }
        ]
    },
    {
        slug: "atc-scm-12i-pro",
        name: "ATC SCM 12i Pro",
        brand: "ATC",
        price: 2400,
        category: "studio-monitors",
        catalogUrl: "/catalogs/atc/scm 12I.pdf",
        shortDescription: "Compact 2-way passive monitor for installation.",
        longDescription: "The SCM12i Pro is a compact, high-performance 2-way passive monitor designed for installations in smaller studios or for surround sound applications. It uses ATC's proprietary Constrained Layer Damping (CLD) bass/mid driver.",
        images: [productSpeakersImg],
        featured: false,
        specifications: [
            { key: "Drivers", value: "25mm HF, 150mm Mid/Bass" },
            { key: "Frequency Response", value: "56Hz - 22kHz (-6dB)" },
            { key: "Nominal Impedance", value: "8 Ohms" },
            { key: "Recommended Power", value: "75W - 300W" },
            { key: "Weight", value: "15kg" }
        ]
    },
    {
        slug: "atc-c4-sub-mk2",
        name: "ATC C4 Sub Mk2",
        brand: "ATC",
        price: 5500,
        category: "subwoofers",
        catalogUrl: "/catalogs/atc/scm C4.pdf",
        shortDescription: "High-performance 12\" active subwoofer.",
        longDescription: "The ATC C4 Sub Mk2 is a premium 12-inch active subwoofer designed for the most demanding home cinema and stereo applications. It features a 300W Class AB MOSFET amplifier and the SS75-314SC driver.",
        images: [subwoofersImg],
        featured: false,
        specifications: [
            { key: "Driver", value: "12\" ATC SS75-314SC" },
            { key: "Low Frequency Cut-off", value: "22Hz (-6dB)" },
            { key: "Max SPL", value: "110dB continuous" },
            { key: "Amplifier Output", value: "300W Class AB" },
            { key: "Weight", value: "42kg" }
        ]
    },
    {
        slug: "atc-scm-110a-pro",
        name: "ATC SCM 110A Pro",
        brand: "ATC",
        price: 22000,
        category: "studio-monitors",
        catalogUrl: "/catalogs/atc/SCM 110A.pdf",
        shortDescription: "Active 3-way reference monitor with twin 9\" bass drivers.",
        longDescription: "The ATC SCM110A Pro is a powerful active 3-way reference monitor designed for mid-to-large scale recording and mixing. It features twin 9\" SL spec bass drivers and the 75mm Super Dome midrange.",
        images: [productSpeakersImg],
        featured: false,
        specifications: [
            { key: "Drivers", value: "25mm HF, 75mm Mid, 2 x 234mm LF" },
            { key: "Frequency Response", value: "30Hz - 22kHz (-6dB)" },
            { key: "Max SPL", value: "115dB continuous" },
            { key: "Amplifier Output", value: "350W Tri-amp" },
            { key: "Weight", value: "73kg" }
        ]
    },
    {
        slug: "atc-scm-200a-sl-pro",
        name: "ATC SCM 200A SL Pro",
        brand: "ATC",
        price: 32000,
        category: "studio-monitors",
        catalogUrl: "/catalogs/atc/SCM 200A.pdf",
        shortDescription: "Large-format active 3-way studio monitor with twin 12\" bass drivers.",
        longDescription: "The ATC SCM200A SL Pro is a large-format 3-way active monitor that provides exceptional SPL and clarity. It features twin 12\" SL spec bass drivers and a rack-mounted P4 4-way amplifier.",
        images: [productSpeakersImg],
        featured: false,
        specifications: [
            { key: "Drivers", value: "34mm HF, 75mm Mid, 2 x 314mm LF" },
            { key: "Frequency Response", value: "32Hz - 20kHz (-6dB)" },
            { key: "Max SPL", value: "118dB continuous" },
            { key: "Amplifier Output", value: "850W P4 Rack-mount" },
            { key: "Weight", value: "116kg" }
        ]
    },
    {
        slug: "atc-hts-7",
        name: "ATC HTS 7",
        brand: "ATC",
        price: 1800,
        category: "home-theater",
        catalogUrl: "/catalogs/atc/HTC 7.pdf",
        shortDescription: "Compact 2-way on-wall loudspeaker.",
        longDescription: "The ATC HTS7 is a compact 2-way on-wall loudspeaker, perfect for small-to-medium rooms or as high-quality surround channels in a larger system.",
        images: [productSpeakersImg],
        featured: false,
        specifications: [
            { key: "Drivers", value: "25mm HF, 125mm Mid/Bass" },
            { key: "Frequency Response", value: "44Hz - 22kHz (-6dB)" },
            { key: "Max SPL", value: "103dB" },
            { key: "Recommended Power", value: "75W - 300W" },
            { key: "Weight", value: "8kg" }
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
        longDescription: "The Debut PRO brings an absolutely new design to Pro-Ject turntables. The audiophile turntable is convincing in all respects – not only visually, but also in terms of sound.",
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
        imageUrl: "/images/hero-light.webp" // Reusing hero for now
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

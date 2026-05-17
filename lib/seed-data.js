// Helper to get consistent image URL
const getImageUrl = (filename) => {
    return `/images/${filename}`;
};

const heroImg = getImageUrl('hero-light.webp');
const speakersImg = getImageUrl('speakers.webp');
const subwoofersImg = getImageUrl('speakers.webp');
const amplifiersImg = getImageUrl('amplifiers.webp');
const turntablesImg = getImageUrl('turntables.webp');
const productSpeakersImg = getImageUrl('product-speakers.webp');
const productAmpImg = getImageUrl('product-amp.webp');

export const categories = [
    {
        "name": "Floorstanding Speakers",
        "slug": "floorstanding-speakers",
        "imageUrl": "/images/speakers.webp",
        "description": "Experience the full depth of sound with flagship high-fidelity loudspeakers.",
        "productCount": 66
    },
    {
        "name": "Studio Monitors",
        "slug": "studio-monitors",
        "imageUrl": "/images/product-speakers.webp",
        "description": "Professional reference monitors for absolute accuracy and transparency.",
        "productCount": 24
    },
    {
        "name": "Tube Amplifiers",
        "slug": "tube-amplifiers",
        "imageUrl": "/images/amplifiers.webp",
        "description": "Warm, rich, and authentic. The harmonic heart of high-fidelity playback.",
        "productCount": 22
    },
    {
        "name": "Turntables",
        "slug": "turntables",
        "imageUrl": "/images/turntables.webp",
        "description": "Precision analog playback systems and audio turntables for the purist.",
        "productCount": 0
    },
    {
        "name": "Subwoofers",
        "slug": "subwoofers",
        "imageUrl": "/images/speakers.webp",
        "description": "Deep, articulate bass performance that anchors your overall soundstage.",
        "productCount": 10
    },
    {
        "name": "Home Theater",
        "slug": "home-theater",
        "imageUrl": "/images/hero-light.webp",
        "description": "Immersive multi-channel soundscapes designed for ultimate home cinemas.",
        "productCount": 4
    },
    {
        "name": "Music Streamers",
        "slug": "music-streamers",
        "imageUrl": "/images/amplifiers.webp",
        "description": "High-resolution digital audio streamers, network players, and audio servers.",
        "productCount": 42
    },
    {
        "name": "Accessories",
        "slug": "accessories",
        "imageUrl": "/images/turntables.webp",
        "description": "High-end audiophile interconnects, speaker cables, clocks, and power blocks.",
        "productCount": 4
    }
];

export const products = [
    {
        "id": "proac-centre-voice",
        "slug": "proac-centre-voice",
        "name": "ProAc Centre Voice",
        "brand": "ProAc",
        "price": 0,
        "category": "home-theater",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Centre Voice. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Centre Voice. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-centre-voice-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "home theater"
            },
            {
                "key": "SKU Code",
                "value": "sd-40"
            }
        ]
    },
    {
        "id": "proac-tablette-ten-signature",
        "slug": "proac-tablette-ten-signature",
        "name": "ProAc Tablette Ten Signature",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Tablette Ten Signature. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Tablette Ten Signature. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-tablette-ten-signature-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-39"
            }
        ]
    },
    {
        "id": "proac-tablette-ten",
        "slug": "proac-tablette-ten",
        "name": "ProAc Tablette Ten",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Tablette Ten. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Tablette Ten. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-tablette-ten-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-38"
            }
        ]
    },
    {
        "id": "kii-three-bxt-system",
        "slug": "kii-three-bxt-system",
        "name": "KII THREE BXT system",
        "brand": "Kii",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "A floor-standing DSP controlled High-End playback system that combines elegance and power in one sleek package. This system comprises two Kii THREE speakers and two BXT modules, offering a unique line source with horizontal directivity control.",
        "longDescription": ".",
        "featured": true,
        "images": [
            "/images/products/kii-three-bxt-system-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Kii"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-37"
            }
        ]
    },
    {
        "id": "kii-three-system",
        "slug": "kii-three-system",
        "name": "KII THREE system",
        "brand": "Kii",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "The Bluetooth earphone built-in 40 mm dynamic driver, providing clear stereo sound and strong bass. The latest Bluetooth 5.0 technology ensures low power consumption and more stable connectivity.",
        "longDescription": "The Bluetooth earphone built-in 40 mm dynamic driver, providing clear stereo sound and strong bass. The latest Bluetooth 5.0 technology ensures low power consumption and more stable connectivity.",
        "featured": true,
        "images": [
            "/images/products/kii-three-system-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Kii"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-36"
            }
        ]
    },
    {
        "id": "proac-response-db-three",
        "slug": "proac-response-db-three",
        "name": "ProAc Response DB THREE",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response DB THREE. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response DB THREE. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-response-db-three-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-35"
            }
        ]
    },
    {
        "id": "proac-response-two",
        "slug": "proac-response-two",
        "name": "ProAc Response TWO",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response TWO. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response TWO. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-response-two-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-34"
            }
        ]
    },
    {
        "id": "proac-response-dt8",
        "slug": "proac-response-dt8",
        "name": "ProAc Response DT8",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response DT8. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response DT8. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-response-dt8-0.png",
            "/images/products/proac-response-dt8-1.png",
            "/images/products/proac-response-dt8-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-33"
            }
        ]
    },
    {
        "id": "proac-response-d20",
        "slug": "proac-response-d20",
        "name": "ProAc Response D20",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response D20. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response D20. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-response-d20-0.png",
            "/images/products/proac-response-d20-1.png",
            "/images/products/proac-response-d20-2.png",
            "/images/products/proac-response-d20-3.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-32"
            }
        ]
    },
    {
        "id": "proac-response-d48",
        "slug": "proac-response-d48",
        "name": "ProAc Response D48",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response D48. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response D48. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-response-d48-0.png",
            "/images/products/proac-response-d48-1.png",
            "/images/products/proac-response-d48-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-31"
            }
        ]
    },
    {
        "id": "proac-response-k1",
        "slug": "proac-response-k1",
        "name": "ProAc Response K1",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response K1. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response K1. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-response-k1-0.png",
            "/images/products/proac-response-k1-1.png",
            "/images/products/proac-response-k1-2.png",
            "/images/products/proac-response-k1-3.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-30"
            }
        ]
    },
    {
        "id": "proac-response-k6-signature",
        "slug": "proac-response-k6-signature",
        "name": "ProAc Response K6 Signature",
        "brand": "ProAc",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response K6 Signature. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ProAc ProAc Response K6 Signature. Fully engineered for pristine sound staging.",
        "featured": true,
        "images": [
            "/images/products/proac-response-k6-signature-0.png",
            "/images/products/proac-response-k6-signature-1.png",
            "/images/products/proac-response-k6-signature-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ProAc"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-29"
            }
        ]
    },
    {
        "id": "audio-vector-qr-7",
        "slug": "audio-vector-qr-7",
        "name": "Audio Vector QR 7",
        "brand": "Audiovector",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR 7. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR 7. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/audio-vector-qr-7-0.png",
            "/images/products/audio-vector-qr-7-1.png",
            "/images/products/audio-vector-qr-7-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Audiovector"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-28"
            }
        ]
    },
    {
        "id": "audio-vector-qr-5",
        "slug": "audio-vector-qr-5",
        "name": "Audio Vector QR 5",
        "brand": "Audiovector",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR 5. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR 5. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/audio-vector-qr-5-0.png",
            "/images/products/audio-vector-qr-5-1.png",
            "/images/products/audio-vector-qr-5-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Audiovector"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-27"
            }
        ]
    },
    {
        "id": "audio-vector-qr-c",
        "slug": "audio-vector-qr-c",
        "name": "Audio Vector QR C",
        "brand": "Audiovector",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR C. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR C. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/audio-vector-qr-c-0.png",
            "/images/products/audio-vector-qr-c-1.png",
            "/images/products/audio-vector-qr-c-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Audiovector"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-26"
            }
        ]
    },
    {
        "id": "audio-vector-qr-5-copy",
        "slug": "audio-vector-qr-5-copy",
        "name": "Audio Vector QR Sub",
        "brand": "Audiovector",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR Sub. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR Sub. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/audio-vector-qr-5-copy-0.png",
            "/images/products/audio-vector-qr-5-copy-1.png",
            "/images/products/audio-vector-qr-5-copy-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Audiovector"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-25"
            }
        ]
    },
    {
        "id": "audio-vector-qr-wall",
        "slug": "audio-vector-qr-wall",
        "name": "Audio Vector QR Wall",
        "brand": "Audiovector",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR Wall. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector QR Wall. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/audio-vector-qr-wall-0.png",
            "/images/products/audio-vector-qr-wall-1.png",
            "/images/products/audio-vector-qr-wall-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Audiovector"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-24"
            }
        ]
    },
    {
        "id": "audio-vector-r-c-signature",
        "slug": "audio-vector-r-c-signature",
        "name": "Audio Vector R C Signature",
        "brand": "Audiovector",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector R C Signature. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector R C Signature. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/audio-vector-r-c-signature-0.png",
            "/images/products/audio-vector-r-c-signature-1.png",
            "/images/products/audio-vector-r-c-signature-2.png",
            "/images/products/audio-vector-r-c-signature-3.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Audiovector"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-23"
            }
        ]
    },
    {
        "id": "audio-vector-r-c-arrete",
        "slug": "audio-vector-r-c-arrete",
        "name": "Audio Vector R C Arrete",
        "brand": "Audiovector",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector R C Arrete. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Audiovector Audio Vector R C Arrete. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/audio-vector-r-c-arrete-0.png",
            "/images/products/audio-vector-r-c-arrete-1.png",
            "/images/products/audio-vector-r-c-arrete-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Audiovector"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-22"
            }
        ]
    },
    {
        "id": "system-audio-saxo-60",
        "slug": "system-audio-saxo-60",
        "name": "System Audio Saxo 60",
        "brand": "System Audio",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium System Audio System Audio Saxo 60. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium System Audio System Audio Saxo 60. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/system-audio-saxo-60-0.png",
            "/images/products/system-audio-saxo-60-1.png",
            "/images/products/system-audio-saxo-60-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "System Audio"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-21"
            }
        ]
    },
    {
        "id": "system-audio-saxo-10",
        "slug": "system-audio-saxo-10",
        "name": "System Audio Saxo 10",
        "brand": "System Audio",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium System Audio System Audio Saxo 10. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium System Audio System Audio Saxo 10. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/system-audio-saxo-10-0.png",
            "/images/products/system-audio-saxo-10-1.png",
            "/images/products/system-audio-saxo-10-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "System Audio"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-20"
            }
        ]
    },
    {
        "id": "system-audio-saxo-6",
        "slug": "system-audio-saxo-6",
        "name": "System Audio Saxo 6",
        "brand": "System Audio",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium System Audio System Audio Saxo 6. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium System Audio System Audio Saxo 6. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/system-audio-saxo-6-0.png",
            "/images/products/system-audio-saxo-6-1.png",
            "/images/products/system-audio-saxo-6-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "System Audio"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-19"
            }
        ]
    },
    {
        "id": "system-audio-legend-sub-12",
        "slug": "system-audio-legend-sub-12",
        "name": "System Audio Legend Sub 12",
        "brand": "System Audio",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium System Audio System Audio Legend Sub 12. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium System Audio System Audio Legend Sub 12. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/placeholder.svg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "System Audio"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            },
            {
                "key": "SKU Code",
                "value": "sd-18"
            }
        ]
    },
    {
        "id": "system-audio-legend-10",
        "slug": "system-audio-legend-10",
        "name": "System Audio Legend 10",
        "brand": "System Audio",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium System Audio System Audio Legend 10. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium System Audio System Audio Legend 10. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/system-audio-legend-10-0.png",
            "/images/products/system-audio-legend-10-1.png",
            "/images/products/system-audio-legend-10-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "System Audio"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            },
            {
                "key": "SKU Code",
                "value": "sd-16"
            }
        ]
    },
    {
        "id": "mj-acoustics-henley",
        "slug": "mj-acoustics-henley",
        "name": "MJ Acoustics HENLEY",
        "brand": "MJ Acoustics",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium MJ Acoustics MJ Acoustics HENLEY. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium MJ Acoustics MJ Acoustics HENLEY. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/mj-acoustics-henley-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "MJ Acoustics"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            },
            {
                "key": "SKU Code",
                "value": "sd-17"
            }
        ]
    },
    {
        "id": "mj-acoustics-ref-400-sr",
        "slug": "mj-acoustics-ref-400-sr",
        "name": "MJ Acoustics Ref 400-SR",
        "brand": "MJ Acoustics",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium MJ Acoustics MJ Acoustics Ref 400-SR. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium MJ Acoustics MJ Acoustics Ref 400-SR. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/mj-acoustics-ref-400-sr-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "MJ Acoustics"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            },
            {
                "key": "SKU Code",
                "value": "sd-15"
            }
        ]
    },
    {
        "id": "octave-hp300-se",
        "slug": "octave-hp300-se",
        "name": "Octave HP300 SE",
        "brand": "Octave",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Octave Octave HP300 SE. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Octave Octave HP300 SE. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/octave-hp300-se-0.png",
            "/images/products/octave-hp300-se-1.png",
            "/images/products/octave-hp300-se-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Octave"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            },
            {
                "key": "SKU Code",
                "value": "sd-14"
            }
        ]
    },
    {
        "id": "octave-hp700-se",
        "slug": "octave-hp700-se",
        "name": "Octave HP700 SE",
        "brand": "Octave",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Octave Octave HP700 SE. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Octave Octave HP700 SE. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/octave-hp700-se-0.png",
            "/images/products/octave-hp700-se-1.png",
            "/images/products/octave-hp700-se-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Octave"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            },
            {
                "key": "SKU Code",
                "value": "sd-13"
            }
        ]
    },
    {
        "id": "octave-v40-se",
        "slug": "octave-v40-se",
        "name": "Octave V40 SE",
        "brand": "Octave",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Octave Octave V40 SE. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Octave Octave V40 SE. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/octave-v40-se-0.png",
            "/images/products/octave-v40-se-1.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Octave"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            },
            {
                "key": "SKU Code",
                "value": "sd-12"
            }
        ]
    },
    {
        "id": "octave-v70-se",
        "slug": "octave-v70-se",
        "name": "Octave V70 SE",
        "brand": "Octave",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Octave Octave V70 SE. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Octave Octave V70 SE. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/octave-v70-se-0.png",
            "/images/products/octave-v70-se-1.png",
            "/images/products/octave-v70-se-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Octave"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            },
            {
                "key": "SKU Code",
                "value": "sd-11"
            }
        ]
    },
    {
        "id": "octave-mre-220-pair",
        "slug": "octave-mre-220-pair",
        "name": "Octave MRE 220 (Pair)",
        "brand": "Octave",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Octave Octave MRE 220 (Pair). Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Octave Octave MRE 220 (Pair). Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/octave-mre-220-pair-0.png",
            "/images/products/octave-mre-220-pair-1.png",
            "/images/products/octave-mre-220-pair-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Octave"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            },
            {
                "key": "SKU Code",
                "value": "sd-10"
            }
        ]
    },
    {
        "id": "lumin-x1",
        "slug": "lumin-x1",
        "name": "Lumin X1",
        "brand": "Lumin",
        "price": 1110000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Lumin Lumin X1. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Lumin Lumin X1. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/lumin-x1-0.png",
            "/images/products/lumin-x1-1.png",
            "/images/products/lumin-x1-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-9"
            }
        ]
    },
    {
        "id": "lumin-u2",
        "slug": "lumin-u2",
        "name": "Lumin U2",
        "brand": "Lumin",
        "price": 436000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Lumin Lumin U2. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Lumin Lumin U2. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/lumin-u2-0.png",
            "/images/products/lumin-u2-1.png",
            "/images/products/lumin-u2-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-7"
            }
        ]
    },
    {
        "id": "lumin-u2-mini",
        "slug": "lumin-u2-mini",
        "name": "Lumin U2 MINI",
        "brand": "Lumin",
        "price": 220000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Lumin Lumin U2 MINI. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Lumin Lumin U2 MINI. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/lumin-u2-mini-0.png",
            "/images/products/lumin-u2-mini-1.png",
            "/images/products/lumin-u2-mini-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-6"
            }
        ]
    },
    {
        "id": "hifi-rose-rs150b",
        "slug": "hifi-rose-rs150b",
        "name": "Hifi Rose RS150B",
        "brand": "Hifi Rose",
        "price": 560000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS150B. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS150B. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/hifi-rose-rs150b-0.png",
            "/images/products/hifi-rose-rs150b-1.png",
            "/images/products/hifi-rose-rs150b-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-5"
            }
        ]
    },
    {
        "id": "hifi-rose-rs250a",
        "slug": "hifi-rose-rs250a",
        "name": "Hifi Rose RS250A",
        "brand": "Hifi Rose",
        "price": 334000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS250A. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS250A. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/hifi-rose-rs250a-0.png",
            "/images/products/hifi-rose-rs250a-1.png",
            "/images/products/hifi-rose-rs250a-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-4"
            }
        ]
    },
    {
        "id": "hifi-rose-rs201e",
        "slug": "hifi-rose-rs201e",
        "name": "Hifi Rose RS201E",
        "brand": "Hifi Rose",
        "price": 276000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS201E. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS201E. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/hifi-rose-rs201e-0.png",
            "/images/products/hifi-rose-rs201e-1.png",
            "/images/products/hifi-rose-rs201e-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-3"
            }
        ]
    },
    {
        "id": "hifi-rose-rs520",
        "slug": "hifi-rose-rs520",
        "name": "Hifi Rose RS520",
        "brand": "Hifi Rose",
        "price": 445000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS520. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Hifi Rose Hifi Rose RS520. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/hifi-rose-rs520-0.png",
            "/images/products/hifi-rose-rs520-1.png",
            "/images/products/hifi-rose-rs520-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-2"
            }
        ]
    },
    {
        "id": "atc-scm200asl-pro",
        "slug": "atc-scm200asl-pro",
        "name": "ATC SCM200ASL PRO",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC ATC SCM200ASL PRO. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium ATC ATC SCM200ASL PRO. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/atc-scm200asl-pro-0.png",
            "/images/products/atc-scm200asl-pro-1.png",
            "/images/products/atc-scm200asl-pro-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            },
            {
                "key": "SKU Code",
                "value": "sd-45"
            }
        ]
    },
    {
        "id": "atc-hts40",
        "slug": "atc-hts40",
        "name": "SCM7",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM7. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• 125mm ATC mid-bass unit with integral soft dome.\n\n \t• In-house, hand-wound  ribbon wire mid-bass voicecoil.\n\n \t• Massive optimised mid-bass motor assembly.\n\n \t• Flat impedance curve allowing easy load for amplifiers.\n\n \t• Veneered Finish Options – Cherry, Black Ash.\n\n \t• Painted Finish Options – Satin Black, Satin White.\n\n \t• 6 year warranty.\n\n\n“…you will be amazed at its rhythmic and dynamic alacrity.”  Hi-Fi Choice, May 2014. Group test winner!",
        "featured": false,
        "images": [
            "/images/products/atc-hts40-0.png",
            "/images/products/atc-hts40-1.png",
            "/images/products/atc-hts40-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "lumin-d3",
        "slug": "lumin-d3",
        "name": "Lumin D3",
        "brand": "Lumin",
        "price": 199000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Lumin Lumin D3. Fully engineered for pristine sound staging.",
        "longDescription": "Phenomenal Accuracy\nThe SCM40 boasts a brand-new 25mm soft dome HF unit meticulously designed by ATC, The ATC SCM50ASL redefines precision. Its legendary performance is driven by the SM75-150S soft dome midrange driver, ensuring music and speech reproduction with astounding accuracy, transparency, and dynamics. The result is an immersive audio experience that captures every nuance and detail.\nEnhanced Tweeter & Port Profile\nRecent enhancements, including the new ATC SH25-76S tweeter and optimized port profile, elevate performance to new heights. These improvements amplify every facet of audio, providing richer soundscapes and more nuanced sound reproduction.\nIndependent Amplification\n\nEvery drive unit in the active model boasts a dedicated and matched MOS-FET amplifier. This precise amplification ensures optimal power delivery, resulting in crystal-clear audio across the frequency spectrum.\nSuper Linear Magnet Technology\n\nThe 234mm/9″ bass driver incorporates ATC's Super Linear Magnet technology, augmenting bass response with remarkable precision. This innovation delivers deep, controlled bass that resonates with impact and accuracy.",
        "featured": false,
        "images": [
            "/images/products/lumin-d3-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            },
            {
                "key": "SKU Code",
                "value": "sd-41"
            }
        ]
    },
    {
        "id": "signature-8khdmi-15m",
        "slug": "signature-8khdmi-15m",
        "name": "Signature 8KHDMI (15m)",
        "brand": "Signature",
        "price": 35000,
        "category": "accessories",
        "shortDescription": "Experience high-fidelity audio with the premium Signature Signature 8KHDMI (15m). Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Signature Signature 8KHDMI (15m). Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/signature-8khdmi-15m-0.jpg",
            "/images/products/signature-8khdmi-15m-1.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Signature"
            },
            {
                "key": "Category",
                "value": "accessories"
            }
        ]
    },
    {
        "id": "signature-8khdmi-3m",
        "slug": "signature-8khdmi-3m",
        "name": "Signature 8KHDMI (3m)",
        "brand": "Signature",
        "price": 12500,
        "category": "accessories",
        "shortDescription": "Experience high-fidelity audio with the premium Signature Signature 8KHDMI (3m). Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Signature Signature 8KHDMI (3m). Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/signature-8khdmi-3m-0.jpg",
            "/images/products/signature-8khdmi-3m-1.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Signature"
            },
            {
                "key": "Category",
                "value": "accessories"
            }
        ]
    },
    {
        "id": "velox-8k-hdmi-15m-cable",
        "slug": "velox-8k-hdmi-15m-cable",
        "name": "Velox 8K HDMI (15m) cable",
        "brand": "Velox",
        "price": 0,
        "category": "accessories",
        "shortDescription": "Experience high-fidelity audio with the premium Velox Velox 8K HDMI (15m) cable. Fully engineered for pristine sound staging.",
        "longDescription": "Experience high-fidelity audio with the premium Velox Velox 8K HDMI (15m) cable. Fully engineered for pristine sound staging.",
        "featured": false,
        "images": [
            "/images/products/velox-8k-hdmi-15m-cable-0.png",
            "/images/products/velox-8k-hdmi-15m-cable-1.png",
            "/images/products/velox-8k-hdmi-15m-cable-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Velox"
            },
            {
                "key": "Category",
                "value": "accessories"
            }
        ]
    },
    {
        "id": "velox-8khdmi-2m",
        "slug": "velox-8khdmi-2m",
        "name": "Velox 8KHDMI (2m)",
        "brand": "Velox",
        "price": 0,
        "category": "accessories",
        "shortDescription": "Experience high-fidelity audio with the premium Velox Velox 8KHDMI (2m). Fully engineered for pristine sound staging.",
        "longDescription": "Premium performance:\nThe Signature 8KHDMI (3m) cable delivers premium performance with resolutions up to 8K@60Hz and HDR10+. You'll experience stunning visuals and smooth, lag-free performance.\nStunning visuals:\nThis cable delivers stunning visuals with incredible detail and clarity. You'll be able to see every little detail in your favorite movies and TV shows.\nProtected content:\nThis cable is HDCP 2.2 compliant, so you can watch protected content without any problems.",
        "featured": false,
        "images": [
            "/images/products/velox-8khdmi-2m-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Velox"
            },
            {
                "key": "Category",
                "value": "accessories"
            }
        ]
    },
    {
        "id": "octave-v110-se",
        "slug": "octave-v110-se",
        "name": "Octave V110 SE",
        "brand": "Octave",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Octave Octave V110 SE. Fully engineered for pristine sound staging.",
        "longDescription": "Unparalleled Evolution\nThe Octave V 110 SE is a product of continuous development, infused with Octave Dynamic Technologies (ODT), this powerhouse combines high dynamic output power with precision engineering, creating an audio marvel that sets new standards in sound performance.\nDynamic Powerhouse\nEquipped with the latest KT 120 or KT 150 power tubes, the V 110 SE achieves a doubling of peak output power compared to conventional amplifiers. The updated driver stage and exceptional negative feedback provide extreme linearity and increased stability, ensuring consistent tonal balance even at extreme levels.\nAdjustable Damping Factor\nA unique feature of the V 110 SE is the capability to optimize the amplifier to any loudspeaker regardless of its design. The damping factor can be easily adjusted to three levels (LOW, MED, and HIGH) with specially developed input tubes, allowing precise matching to different speaker types for the ultimate sonic synergy.\nEco Mode and Power Management\nWith an innovative Eco Mode, the V 110 SE reduces power consumption and heat when idle, promoting tube longevity and enhanced safety. The power management and protection system ensure stress-free switch-on, prolonging component and tube life.",
        "featured": false,
        "images": [
            "/images/products/octave-v110-se-0.png",
            "/images/products/octave-v110-se-1.png",
            "/images/products/octave-v110-se-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Octave"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "octave-v70-class-a",
        "slug": "octave-v70-class-a",
        "name": "Octave V70 Class A",
        "brand": "Octave",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Octave Octave V70 Class A. Fully engineered for pristine sound staging.",
        "longDescription": "Dynamic Bias Control\nWith its revolutionary Dynamic Bias Control, the V 70 Class A seamlessly blends the tonal purity of Class A with the dynamics of push-pull A/B technology, offering twice the output power of 50W RMS, up to a peak power of 70W (with Super Black Box).\nClass-A Push-Pull Amplifier\nExperience the tonal advantages of Class-A amplification in a push-pull pentode circuit. This innovative combination guarantees Class-A virtues across the entire frequency range, delivering rich, natural sound with unmatched power.\nAuto-Bias Circuit \nSay goodbye to manual adjustments. The V 70 Class A features an auto-bias circuit that self-regulates, ensuring optimal performance and tube compatibility without the need for manual adjustments.\nUnparalleled Flexibility\nThe V 70 Class A allows seamless adaptability to different power tubes with Power High and Low options. Experience a powerful 70W peak power with KT120 or KT150 tubes (Power High) or opt for 15W Class-A and 25W music power with KT88 or 6550 tubes (Power Low).",
        "featured": false,
        "images": [
            "/images/products/octave-v70-class-a-0.png",
            "/images/products/octave-v70-class-a-1.png",
            "/images/products/octave-v70-class-a-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Octave"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "luminp1",
        "slug": "luminp1",
        "name": "LuminP1",
        "brand": "Lumin",
        "price": 885000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Lumin LuminP1. Fully engineered for pristine sound staging.",
        "longDescription": "Support for high-resolution audio playback\n\n The P1 supports high-resolution audio playback up to DSD512 and PCM768. This means that you can enjoy your music in the highest possible quality, with all the detail and nuance that the artist intended.\nBuilt-in phono stage\n\nThe P1 has a built-in phono stage that allows you to connect your turntable to the P1 and enjoy your vinyl records in high quality.\nHigh-quality components\n\n The P1 is built with high-quality components, including the ESS Sabre32 ES9038Pro DAC chip. This ensures that you get the best possible sound quality from your music.\nVersatile connectivity options \nThe P1 offers a variety of input and output options, so you can connect it to a wide range of audio devices. This makes it a great choice for anyone who wants a versatile DAC/AMP.",
        "featured": false,
        "images": [
            "/images/products/luminp1-0.png",
            "/images/products/luminp1-1.png",
            "/images/products/luminp1-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "ever-solo-dmp-a6",
        "slug": "ever-solo-dmp-a6",
        "name": "DMP-A6 Gen 2",
        "brand": "Eversolo",
        "price": 115000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Eversolo DMP-A6 Gen 2. Fully engineered for pristine sound staging.",
        "longDescription": "Cutting-edge Performance:\nExperience the power of a quad-core ARM Cortex-A55 processor and 4GB DDR + 32GB eMMC memory, delivering lightning-fast processing and ample storage for your applications and content.\nAudiophile-Grade Sound:\nImmerse yourself in unparalleled audio quality with dual ES9038Q2M DACs, supporting DSD512 Native, PCM768KHz@32Bit, and full MQA decoding, ensuring the most accurate and dynamic sound reproduction.\nSeamless Connectivity:\nConnectivity is seamless with M.2 NVME 3.0 SSD support, Qualcomm QCC5125 Bluetooth 5.0 with APTX HD, and various digital audio outputs like USB, Optical, Coaxial, and HDMI, enabling you to enjoy your music your way.\n\n&nbsp;",
        "featured": false,
        "images": [
            "/images/products/ever-solo-dmp-a6-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Eversolo"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "eversolo-dmp-a6-master-edition-digital-audio-music-streamer",
        "slug": "eversolo-dmp-a6-master-edition-digital-audio-music-streamer",
        "name": "DMP-A6 (Master Edition) Gen 2",
        "brand": "Eversolo",
        "price": 140000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Eversolo DMP-A6 (Master Edition) Gen 2. Fully engineered for pristine sound staging.",
        "longDescription": "• Solid aluminium alloy chassis, brushed panel.\n\n \t• Quad-core ARM Cortex-A55 professional processor.\n\n \t• 6\" large LCD colour touchscreen, easy control.\n\n \t• Based on Android 11, deeply tailored system.\n\n \t• 4GDDR+32GeMMC large memory for masses of applications.\n\n \t• Support M.2 NVME 3.0 SSD (not included), up to 4TB.\n\n \t• 2xES9038Q2M DAC for independent stereo decoding.\n\n \t• Support DSD512 Native, PCM768KHz@32Bit, MQA full decoding.\n\n \t• The 3rd generation XU316 for higher performance and processing speed.\n\n \t• Low-jitter dual clock synchronous processing with higher accuracy.\n\n \t• Fully balanced circuit, XLR balanced and RCA single-ended hi-fi pre-out.\n\n \t• 2x DOH chips, support HDMI DSD Native and D2P multi-channel output(Up to 5.1).\n\n \t• Qualcomm QCC5125 Bluetooth 5.0 module with APTX HD.\n\n \t• Low noise, high quality power supply, providing pure power source for audio circuits.Support mastering audio formats DSD (.dsf/.dff/.iso/.dst), APE, FLAC, WAV, MQA, etc.\n\n \t• Support 2-channel and Multi-channel Gapless playback(FLAC,WAV)\n\n \t• Personalised music management, lyric matching and music data matching.\n\n \t• EOS audio engine developed by Eversolo, globally bypassing SRC restrictions.\n\n \t• Support Direct audio in 3rd party APPs (Apple Music hi-res direct output).\n\n \t• Full decoding and rendering support for MQA on Optical, Coaxial and USB input etc.\n\n \t• Support USB, Optical, Coaxial, HDMI digital audio Bit-perfect output.\n\n \t• Support external USB optical drive for CD disc playback and CD ripping.\n\n \t• Music services Tidal, Qobuz, Highresaudio, Amazon etc.\n\n \t• Support Roon ready, Tidal Connect, etc.\n\n \t• Support music playback from DLNA.\n\n \t• Support NFS, SMB, Web DAV, UPnP protocols to access storage devices shared in the LAN.\n\n \t• Support built-in SMB network media sharing service for easy local media sharing.\n\n \t• Exclusive mobile APP for Android/IOS mobile phones and tablets.",
        "featured": false,
        "images": [
            "/images/products/eversolo-dmp-a6-master-edition-digital-audio-music-streamer-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Eversolo"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "eversolo-dmp-a8-music-streamer",
        "slug": "eversolo-dmp-a8-music-streamer",
        "name": "DMP-A8",
        "brand": "Eversolo",
        "price": 240000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Eversolo DMP-A8. Fully engineered for pristine sound staging.",
        "longDescription": "Utilizes the self-developed EOS (Eversolo Original sampling-rate audio engine), supporting output at all audio original sampling rates. In other words, any audio playback can entirely bypass the Android SRC limitation, supporting the Direct audio passthrough of third-party apps (Such as Apple Music hi-res Direct output).\n\nThe DMP-A8 is made from aviation aluminium and features a CNC machined body for a solid construction. The brushed panel and frosted anodized body are a great combination of classic and modern elements to suit the preferences of experts.\n\nEquipped with a large 6\" LCD high-definition touchscreen, the DMP-A8 features a professionally tailored streamer system, simple but exquisite user interface, as well as on-screen intuitive touch controls for system settings, local music library and third-party apps. It provides a seamless interactive experience.\n\nDMP-A8 can be used as a digital turntable to connect with various high-end DAC by HDMI IIS, USB, optical, and coaxial outputs. As a DAC, it supports a wide range of digital inputs: 2 coaxial, 2 optical, USB B input to connect PCs and mobile devices. As a high-performance preamplifier, it supports analog inputs XLR and RCA. It also supports APTX HD Bluetooth audio input, making it easy to connect with various dig- ital audio sources. The DMP-A8 can be directly paired with active speakers or power amplifier via analog preamp outputs RCA and XLR. The Trigger out port can achieve the linkage with power amplifier systems.\n\nAn M.2 NVMe SSD slot is built in at the bottom of the DMP-A8, allowing for convenient SSD installation without disassembling the device. The DMP-A8 supports SSD up to 4 TB, with faster speed and less noise, providing stable storage for high-quality local music. Additionally, storage devices can be connected externally through the USB OTG port of DMP-A8.\n\nIn order to eliminate interference and noise between the system circuit and the audio circuit, and to enhance sound purity, separate designs are employed for the power supply of the system and the audio circuit. The linear power supply is composed of a multi-winding toroidal transformer, specifically designed to match the characteristics of analog audio circuits. The high-quality switching power supply is tailored for the system circuit. It significantly reduces ripple and magnetic leakage interference, providing strong support for high-qual- ity audio processing. Furthermore, it incorporates a patented smart switching technology for the linear power supply voltage input, enabling compatibility with voltages worldwide without flipping switches.\n\nWith 3rd generation XMOS 316 audio processor, DMP-A8 has faster speed and higher USB bandwidth, ensuring the lossless transmission of high-definition audio data. USB ports supports up to DSD512 Native and PCM768@32bit. The optical and Coaxial ports support DSD64 DoP) PCM192@24Bit.\n\nVELVET SOUND is the brand that imparts \"sonic philosophy\" to the new generation of AKM audio products. The pinnacle flagship series, VELVET SOUND | VERITA, offers forward-thinking products with world-class performance. Rooted in the concept of \"perfect re-creation of the original sound,\" it is dedicated to providing continuous enhancement of audio technology, presenting the most authentic sound, and offering listeners an immersive acoustic experience.\n\nThere are 2 ultra-low phase noise femtosecond high-precision clocks for audio decoding circuit (45.1584MHz and 49.152MHz), which correspond to the decoding of 44.1KHz and 48KHz multiplied sampling rates respectively. This effectively suppresses Jitter, ensuring highly accurate conversion and decoding of digital-to-analog audio signals, providing ultra-high dynamic range and resolution\nfor analog audio output and reproduces the real sound details from music studio.\n\nThe DMP-A8 is equipped with a high-performance fully balanced preamplifier function, supporting XLR/R- CA analog inputs. It also features a +10dB analog gain and, when combined with the R2R analog volume control network, ensures ultra-low noise and distortion for the output.\n\nA fully balanced analog volume adjustment network composed of precision resistors and relays achieves accurate volume control, effectively suppressing distortion and noise in the analog signal. It also features volume protection, automatically reducing excessive volume to the designated safe level during startup or input interface switching. The incorporation of R2R analog volume control ensures that the DAC can operate at its optimal state continuously.\n\nDMP-A8 outfits IIS output, which can connect to DACs with IIS input. The mute levels of different DACs' IIS signals vary, MUTE PIN can be switched by settings. Supporting PCM 768K, DSD512 with the highest sampling rate.\n\nThe DMP-A8, equipped with HDMI ARC (Audio Return Chan- nel) input, can be connected to display devices such as TVs and projectors that have HDMI ARC capability. This allows the separation and transfer of audio signals from the HDMI signal to the DMP-A8, providing the TV with a higher quality sound\n\nSound quality of DMP-A8 analog output is monitor-level. The primary elements of the audio circuit are excellent, including WIMA capacitors from Germany, NICHCON dedicated audio capacitors, Murata chip capacitor and Omron relays from Japan, TI Audio Operational Amplifiers from the USA etc. The goal is to provide more authentic and pure sound performance.\n\nIn order to faithfully reproduce a rich and critical audio quality, we are constantly advancing our technology. Extremely low distortion and noise create a quieter background, making everything clearer.\n\nDMP-A8 incorporates a robust DSP processor that supports DSP volume control, PEQ, FIR Filter, HPF/LPF, Loudness enhancement, Compressor, and Delay.\n\n*Note: The DSP module supports up to PCM 192Khz. PCM and DSD formats with a sampling rate higher than this will be Bypass output. DSP is only for internal player, network streaming, optical input, coaxial input, USB input, Bluetooth input and ARC input, and takes effect when producing analog outputs.\n\nThe Qualcomm QCC5125 Bluetooth audio receiving module used by the DMP-A8\nsupports SBC/AAC/aptX/aptX LL/aptX HD/LDAC and is compatible with Bluetooth 5.0. Connecting with mobile phones, tablets, and laptops via Bluetooth allows for wonderful music playback experience and CD-quality sound.\n\nThe DMP-A8 incorporates popular music services like TIDAL, Qobuz, HIRESAUDIO, Deezer, Radio Paradise, Amazon Music etc. Taking advantage of numerous high-quality online music services and reveling in the allure of limitless streaming music. As a music streamer, DMP-A8 supports Tidal Connect and DLNA and other streaming service, which help streaming music from music streaming app on mobile devices to DMP-A8 in the LAN. So that we could enjoy massive online music in a more convenient way, with excellent lossless sound quality.\n\nEversolo Music Library not only provides excellent local music playback performance but also greatly improves user interest in music management. Music files can be added from a local hard drive or network storage and it automatically retrieves music metadata from the cloud to build a custom music library by matching artists, album covers, CUE file and so on (Due to the use of a third-party database, a 100% match cannot be guaran- teed.); songs are displayed in categories based on genres, albums, artists and sample rates; making a list of your favorite songs and searching for them by album, artist, or song initials.\n\nDMP-A8 not only has two high-speed USB 3.0 ports, an SSD slot for local storage expansion, but also supports NFS, SMB v1/v2/v3, and UPnP sharing protocols, allowing users to browse and play multimedia content saved on NAS or network drives connected in the same LAN with gigabit network. Even high data rate DSD512 master recordings can be played without stuttering.\n\nDMP-A8 offers a robust media management system that enables copying, pasting, cutting, delet- ing files from local hard drive and network storage. USB Type-C port can be configured as USB OTG mode, making it easy to connect PC to DMP-A8 via USB cable for local file copying and man- agement. SMB sharing function allows to share files from connected mobile device or internal SSD to other media playback devices, computers or mobile devices in the LAN. So that DMP-A6 can be used as a network storage device to share audio audio sources at any time.\n\nThe DMP-A8 allows for CD playback by connecting an external USB optical disc. The CD Rip app adopts data validation mechanism and error correction function to save audio data from CD losslessly. The algorithm intelligently matches CD album and track names (officially released CDs are required), rips tracks and generates album and artist info automatically.\n\nAndroid/iPhone/iPad compatible intelligent control apps have been developed for DMP-A8 especially. In addition to basic playback control and local system settings, the app interface can asynchronously view data from the music library, system applications, and menus. It can browse and play built-in streaming ser- vices through the control app, making it very convenient for both on-music playback and music data view- ing. A remote control with infrared and Bluetooth dual-mode support is also provided. The DMP-A8 also adds a Trigger output, DMP-A8 controls the power-on and standby of the power amplifier, eliminating the need to manually turn on the power supply, enabling multi-device linkage. WOL (Wake on LAN) is also supported to power on and off remotely, it is needed to connect DMP-A8 to wired network.\n\nThe DAC setting of the DMP-A8 provides six digital filters, with different modes corresponding to different sound characteristics, to meet manifold personal preferences.\n\nA wide range of personalised dynamic VU meters and spectrums are tailored for audiophiles. A wonderful interactive experience is offered with real-time full-format music display, including DSD.\n\nThe DMP-A8 is Hi-Res Audio certified, endorsed by JAS, with superior sound quality.",
        "featured": false,
        "images": [
            "/images/products/eversolo-dmp-a8-music-streamer-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Eversolo"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "oor",
        "slug": "oor",
        "name": "OOR - the headphone amplifier",
        "brand": "Ferrum",
        "price": 218000,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium Ferrum OOR - the headphone amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "As did HYPSOS, OOR is a ground-up design without precedent, created from a profound exploration of analogue audio in its purest form. Understated looks married with sophisticated power delivery and amplifier technologies, delivering ultra-low distortion, huge dynamics and unrivaled detail. For those who want to go even further in unleashing unheard musicality, OOR is, of course, designed to pair perfectly with the HYPSOS Hybrid Power System.\n\n\n\n\n\n\nOOR will redefine the category of headphone amplifiers. OOR will drive any headphones effortlessly to the max of their potential, while preserving the essence of the music it amplifies. Ultra low distortion, zero fatigue, huge dynamics and unrivaled detail result in ultimate enjoyment. OOR actually makes something that is very difficult to accomplish, seem like the most natural thing on earth. The most important features are:\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTruly Balanced\nThe signal path stays truly balanced using the XLR inputs and becomes truly balanced using the RCA inputs.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nEase of use\nonly three knobs on the front panel to control the most important settings.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nFerrum Power Link\nOOR performs very, very good right out of the box. But OOR is made to excel above and beyond when used together with HYPSOS. We use what we dubbed our Ferrum Power Link (FPL in short) to connect the two. HYPSOS then will perform to its maximum, unleashing unheard musicality from the combination with OOR.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nSuperior control\nperfected steering of output transistors protect them and never let them turn off, therefore reducing distortion to inaudible levels and keeping them in a state where they can instantly unleash all their power, crucial for high dynamics, superlative control and authority in sound.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nEnhanced transparency\nThe whole design is focussed on a balanced and very transparent sound signature, making listening fatigue something of the past.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDiscrete design\nThe discrete power amp technology is developed in-house to achieve the best possible analog quality.",
        "featured": false,
        "images": [
            "/images/products/oor-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Ferrum"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "erco",
        "slug": "erco",
        "name": "ERCO Gen2",
        "brand": "Ferrum",
        "price": 197000,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Ferrum ERCO Gen2. Fully engineered for pristine sound staging.",
        "longDescription": "With the full reprogramming of ERCO’s software in combination with crucial changes in the analog circuitry, we are introducing a newer and better ERCO. The ERCO Gen 2 will bring our entry-level DAC one step closer to the performance levels of WANDLA, our flagship converter. We even created a program for existing ERCO owners to upgrade their units to new ERCO Gen 2 specifications",
        "featured": false,
        "images": [
            "/images/products/erco-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Ferrum"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "hypsos",
        "slug": "hypsos",
        "name": "HYPSOS",
        "brand": "Ferrum",
        "price": 135000,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Ferrum HYPSOS. Fully engineered for pristine sound staging.",
        "longDescription": "HYPSOS defines a brand new category of a hifi products. It’s not a simple power supply but an audio component of its own – an equally (or even more) important part of a setup as any other. HYPSOS offers a selection of unique features and even accounts for future software improvements – the device is software controlled with as few hardware dependent elements as possible. The most important features are:\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nHybrid Power System\nLinear/switching hybrid design to get the advantages from both techniques - low ripple and noise as well as fast transient response and high efficiency.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDistinct user levels\nUsing pre-configured settings from the list of supported devices or setting custom parameters manually. Wide continuous ouput voltage range of 5-30V with up to 6A of current delivered to the load. HYPSOS is as universal a device as it gets.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nSweet Spot Tuning (SST)\nPossibility to fine tune the output voltage for the best sound. The voltage level can be safely adjusted on the fly to allow easy comparison testing.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n4T Sensing Design (4TSD)\nEnsuring the exact voltage level precisely at the point of the powered device DC input terminal - special cable design and feedback to ensure flat voltage at every moment. This technique eliminates the harmful effects of the cable's resistance effectively improving transient response.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAdvanced Automation\nCompatibility with Apple TV remote, Trigger in/out connector; possibility to automate power-up of the devices with standby mode even without dedicated trigger connection.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nExtremely safe to use\nAutomatic Transformer Voltage Adjust (ATVA), Electronic Output Voltage Polarity Switch and overvoltage, current limit and short protection.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDetailed and revealing yet unfatiguing sound\nMakes your current audio setup perform to its potential. Tweak the sound modifying the voltage level on the fly and use the preferred combination of the 4-Terminal Sensing and Spread Spectrum Mode settings.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nWorks with!\nCheck out which products are compatible with Hypsos. Compatibility list",
        "featured": false,
        "images": [
            "/images/products/hypsos-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Ferrum"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "hypsos-dual-hybrid-power-system",
        "slug": "hypsos-dual-hybrid-power-system",
        "name": "HYPSOS DUAL",
        "brand": "Ferrum",
        "price": 153000,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Ferrum HYPSOS DUAL. Fully engineered for pristine sound staging.",
        "longDescription": "It made sense for Ferrum to continue the journey up the hifi chain. It brought us OOR, our flagship headphone amplifier, ERCO, our entry level DAC and WANDLA, The Converter. What these products have in common is their power requirements. And one of HYPSOS’ features is its enormous power reserves… Do you see it coming?\n\nPower reserves are so abundantly available that HYPSOS could in fact easily power two devices at the same time, as long as they have the same supply voltage requirements. While we first started offering our Ferrum Power Splitter, we now offer HYPSOS with two power outputs. This means you can now connect two Ferrum devices, for instance OOR and WANDLA (or two other devices with the same power requirements) simultaneously, without the need for another external component and associated cable spaghetti. HYPSOS with double output brings you an extra level of upgradeability at an exciting price point, again proving Ferrum’s journey to change the landscape of high-end audio in relation to affordability is indeed a continuing saga.",
        "featured": false,
        "images": [
            "/images/products/hypsos-dual-hybrid-power-system-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Ferrum"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "wandla",
        "slug": "wandla",
        "name": "WANDLA",
        "brand": "Ferrum",
        "price": 305000,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Ferrum WANDLA. Fully engineered for pristine sound staging.",
        "longDescription": "With WANDLA, we are making a statement to the current and next generation of music lovers. WANDLA represents tomorrow’s standard of high end digital-to-analog conversion. Think of WANDLA like a Formula 1 racing car. Like the F1 constructor’s team building the best racing car, Ferrum created the best engine for The Converter.",
        "featured": false,
        "images": [
            "/images/products/wandla-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Ferrum"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "wandla-2",
        "slug": "wandla-2",
        "name": "WANDLA",
        "brand": "Ferrum",
        "price": 355000,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium Ferrum WANDLA. Fully engineered for pristine sound staging.",
        "longDescription": "Thinking about the potential of WANDLA’s computing power, our Ferrum team thought up of the ultimate experiment. Could we make Digital Signal Processing really work for us? Enter WANDLA GoldenSound Edition with Elevated digital headroom, Spatial Enhancement, Tube Mode and Impact+, all done in the DSP of our SERCE module. DSP done properly.",
        "featured": false,
        "images": [
            "/images/products/wandla-2-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Ferrum"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "dmp-a10",
        "slug": "dmp-a10",
        "name": "DMP-A10",
        "brand": "Eversolo",
        "price": 405000,
        "category": "music-streamers",
        "shortDescription": "The DMP-A10 features a built-in UI and mobile app control for iPhone, Android, and iPad devices. Beyond basic playback and system settings, the app offers direct access to your music library and streaming services.",
        "longDescription": "The DMP-A10 chassis blends modern aesthetics with romanticism, precision-engineered with CNC technology. At 430mm, it fits seamlessly into high-end audio systems, combining functionality and elegance.\n\nWith a high-speed electrical isolation system , the DMP-A10 separates noise and interference from different circuit boards. The complete physical isolation eliminates any possible interference to audio circuits in the transmission of system circuit signals, ensuring that the audio signal remains pure and undisturbed. The display panel features a shielding design as well, resulting in outstanding audio clarity and precision for an unrivaled listening experience.\n\nBy incorporating an advanced electrical isolation circuit, the DMP-A10 minimizes interference from high-noise power sources and grounding loop issues when connecting external DACs and USB devices. Utilizing iCoupler ® technology, it transmits both the clock signal and data to the isolated side in the correct time order and then resynchronizes them to maintain consistency. This ensures that USB signals are transmitted with high fidelity, reducing jitter and maintaining signal accuracy.\n\nFeatured two subwoofer output ports, the DMP-A10 allows you to connect single or dual subwoofers as needed, or even disable the subwoofer function. MIXER and STEREO modes can be switched with ease, independent adjustments of subwoofer gain, crossover frequency, and delay are available as well.\n\n(*Subwoofer function is only available for PCM signals below 192KHz.)\n\nThe Eversolo custom-developed temperature control technology for OCXO clock system ensures both audio crystal oscillators(45.1584MHz and 49.152MHz) operate at a constant optimal temperature point, thus eliminating frequency fluctuations caused by temperature changes, delivering extremely low phase noise. Each oscillator undergoes a strict testing process. Therefore, with jitter levels below 50fs, more accurate clock signals are provided to the audio system, adding more clarity, detail and air in sound.",
        "featured": false,
        "images": [
            "/images/products/dmp-a10-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Eversolo"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "scm11",
        "slug": "scm11",
        "name": "SCM11",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM11. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• Precision undercut bass pole.\n\n \t• “CLD” driver technology with 45mm integral soft dome.\n\n \t• In-house, hand-wound precision flat wire coil.\n\n \t• Massive optimised motor assembly.\n\n \t• Flat impedance curve allowing easy load for amplifiers.\n\n \t• Veneered Finish Options – Cherry, Black Ash.\n\n \t• Painted Finish Options – Satin Black, Satin White.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm11-0.png",
            "/images/products/scm11-1.png",
            "/images/products/scm11-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm19",
        "slug": "scm19",
        "name": "SCM19",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM19. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• “SL” spec bass driver with 75mm integral soft dome.\n\n \t• 9kg optimised short-coil/long gap motor assembly.\n\n \t• In-house, hand-wound precision flat wire coil.\n\n \t• Flat impedance curve allowing easy load for amplifiers.\n\n \t• Veneered Finish Options – Cherry, Black Ash.\n\n \t• Painted Finish Options – Satin Black, Satin White.\n\n \t• 6 year warranty.\n\n\n“Superlative clarity; excellent phase coherence; sublime bass.”  Hi-Fi Choice Magazine, September 2014",
        "featured": false,
        "images": [
            "/images/products/scm19-0.png",
            "/images/products/scm19-1.png",
            "/images/products/scm19-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm19a",
        "slug": "scm19a",
        "name": "SCM19A",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM19A. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built dual suspension 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• “SL” spec bass driver with 75mm integral Soft Dome.\n\n \t• 9kg optimised short-coil/long gap motor assembly.\n\n \t• On-board grounded source 182 watt Class A/B Bi-amplifier.\n\n \t• Active crossover filters and overload protection.\n\n \t• Veneered Finish Options – Cherry, Black Ash.\n\n \t• Painted Finish Options – Satin Black, Satin White.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm19a-0.png",
            "/images/products/scm19a-1.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm40",
        "slug": "scm40",
        "name": "SCM40",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM40. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• ATC 164mm bass driver.\n\n \t• Massive optimised motor assembly.\n\n \t• ATC Soft Dome mid-range driver.\n\n \t• Flat impedance curve allowing easy load for amplifiers.\n\n \t• Veneered Finish Options – Cherry, Black Ash.\n\n \t• Painted Finish Options – Satin Black, Satin White.\n\n \t• 6 year warranty.\n\n\n“Given a serious source and recording the new ATC SCM40 is superb – I know of no price rivals that give this level of accuracy, speed and insight…it’s capable of a level of transparency you normally only expect from loudspeakers at three or four times its price.”  Hi-Fi Choice, October 2014",
        "featured": false,
        "images": [
            "/images/products/scm40-0.png",
            "/images/products/scm40-1.png",
            "/images/products/scm40-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm40a",
        "slug": "scm40a",
        "name": "SCM40A",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM40A. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built dual suspension 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• ATC Soft Dome mid-range driver.\n\n \t• ATC 164mm short coil bass driver.\n\n \t• All drive units incorporate massive optimised motor assemblies.\n\n \t• On-board grounded source 242 watt Class A/B Tri-amplifier.\n\n \t• Active crossover filters and overload protection.\n\n \t• Veneered Finish Options – Cherry, Black Ash.\n\n \t• Painted Finish Options – Satin Black, Satin White.\n\n \t• 6 year warranty.\n\n\n“these ATCs… take all in their stride, revealing a lovely cohesion throughout the frequency range. Resolution, timing and dynamics are all spot-on… factor in the built-in amplification, exotically engineered in-house drive units and the resultant exceptional sound quality, and the SCM40As emerge as something of a high-end bargain. Consider us smitten.” What Hi-Fi, March 2015.",
        "featured": false,
        "images": [
            "/images/products/scm40a-0.png",
            "/images/products/scm40a-1.png",
            "/images/products/scm40a-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm50",
        "slug": "scm50",
        "name": "SCM50",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM50. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThe SCM50 ASL (active) and SCM50 SL (passive) are designed to perform at their best in the recording studio or at home with the finest quality hi-fi equipment.\n\nThe monitors’ ability to reproduce music and speech with phenomenal accuracy, transparency and dynamics lies mainly in the SM75-150S soft dome midrange driver. However, recent modifications that include the new ATC SH25-76S tweeter and enhanced port profile have brought about further improvements to all performance parameters.\n\nEach drive unit in the active model has its own dedicated and individually matched MOS-FET amplifier, while the 234mm/9″ bass driver incorporates ATC’s unique Super Linear Magnet technology. Our active crossover network consists of a wide band-width, electronically balanced input stage with high common mode rejection and very low distortion.\n\nLike the HF, mid and bass drivers, all electronics are designed and manufactured in-house to create a no-compromise active system. In passive form, the SCM50 SL provides broad and symmetrical dispersion, excellent amplitude and phase characteristics throughout the frequency range.\n\nSpeakers are supplied with stands and fabric wrapped grills.\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm50-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm100",
        "slug": "scm100",
        "name": "SCM100",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM100. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThe SCM100 ASL (active) and SCM100 SL (passive) are designed to perform at their best with the finest quality hi-fi equipment.\n\nLike their smaller brother, the SCM50 ASL, the monitors’ ability to reproduce music and speech with phenomenal accuracy, transparency and dynamics lies mainly in the SM75-150S soft dome midrange driver. However, recent modifications that include an upgraded tweeter and enhanced port profile have brought about further improvements in all performance parameters.\n\nBass performance is equally impressive, thanks to ATC’s 12″ professional level bass driver that incorporates the company’s unique Super Linear Magnet technology. Bass, mid and HF drive units in the active model have their own dedicated and individually matched MOSFET amplifiers.\n\nATC’s active crossover network consists of a wide band-width, electronically balanced input stage with high common mode rejection and very low distortion.\n\nIn passive form, the SCM100 SL provides broad and symmetrical dispersion, excellent amplitude and phase characteristics throughout the audio frequency range.\n\nSpeakers are supplied with stands and fabric wrapped grills.\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm100-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm150",
        "slug": "scm150",
        "name": "SCM150",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM150. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThe SCM150 ASL (active) and SCM150 SL (passive) are designed to perform at their best with the finest quality hi-fi equipment.\n\nLike their smaller brother, the SCM50 ASL & 100 the monitors’ ability to reproduce music and speech with phenomenal accuracy, transparency and dynamics lies mainly in the SM75-150s soft dome midrange driver. However, recent modifications that include an upgraded tweeter and enhanced port profile have brought about further improvements in all performance parameters.\n\nBass performance is equally impressive, thanks to ATC’s 15″ professional level bass driver that incorporates the company’s unique Super Linear Magnet technology. Bass, mid and HF drive units in the active model have their own dedicated and individually matched MOS-FET amplifiers.\n\nATC’s active crossover network consists of a wide band-width, electronically balanced input stage with high common mode rejection and very low distortion.\n\nIn passive form, the SCM150 SL provides broad and symmetrical dispersion, excellent amplitude and phase characteristics throughout the audio frequency range.\n\nSpeakers are supplied with stands and fabric wrapped grills.\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm150-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm20aslt",
        "slug": "scm20aslt",
        "name": "SCM20ASLT",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM20ASLT. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThe SCM20SL Tower is ATC’s flagship 2-way floor-standing loudspeaker and is the ideal choice in modestly sized rooms, but where performance cannot be compromised.  It is available in both passive and active bi-amplified versions, the SCM20PSLT and SCM20ASLT respectively.\n\nIts sealed cabinet design ensures excellent timing, useful low frequency output below the cut-off and that the speakers can be placed relatively close to walls without excessive low frequency ‘boom’.\n\nBoth the mid-bass driver and tweeter are handmade by ATC.  The bass driver is a 6”/150mm part with huge 3”/75mm voice coil and massive, long-gap (short-coil) motor assembly featuring ATC’s proprietary ‘SL’ motor technology.  The tweeter is a 1”/25mm soft-dome part featuring a dual-suspension and very high energy 2.1 tesla motor.  Together, they form the basis for an exceptional 2-way monitor loudspeaker capable of delivering outstanding resolution and musicality.\n\nDriver integration withing the passive model is handled 2nd order crossover featuring oversize air-core inductors which are would in-house by ATC.  Capacitors are all high voltage polypropylene film types and the input features heavy duty binding posts in a bi-wire configuration.\n\nThe active SCM20ASLT features an on-board ATC bi-amp pack featuring 2-way active crossovers and class A/B MOSFET power amps, delivering a total power output of 250W.  The active crossovers superior accuracy and phase coherence, plus the removal of the lossy passive components between power amp and drivers deliver a level of performance that simply can’t be matched by competing passive designs.\n\nThe SCM20 cabinet is constructed to be heavy and inert, with bitumastic damping panels deployed at critical positions to minimise cabinet colouration.  The cabinets are available in 10 different hand selected veneers; satin black/white painted finishes and also piano/white high gloss polyester.\n\nFeatured veneer above: Oak.\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm20aslt-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm50slt",
        "slug": "scm50slt",
        "name": "SCM50SLT",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM50SLT. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThe SCM50 ASLT (active) and SCM50 PSLT (passive) towers are designed to offer exceptional performance and enjoyment to the home hi-fi enthusiast and music lover.\n\nThe monitors’ ability to reproduce music and speech with phenomenal accuracy, transparency and dynamics lies mainly in the SM75-150S soft dome midrange driver. However, recent modifications that include the new ATC SH25-76S tweeter and enhanced port profile have brought about further improvements to all performance parameters.\n\nEach drive unit in the active model has its own dedicated and individually matched MOS-FET amplifier, while the 234mm/9″ bass driver incorporates ATC’s unique Super Linear Magnet technology. Our active crossover network consists of a wide band-width, electronically balanced input stage with high common mode rejection and very low distortion.\n\nLike the HF, mid and bass drivers, all electronics are designed and manufactured in-house to create a no-compromise active system. In passive form, the SCM50PSLT provides broad and symmetrical dispersion, excellent amplitude and phase characteristics throughout the frequency range.\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm50slt-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm100aslt",
        "slug": "scm100aslt",
        "name": "SCM100ASLT",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM100ASLT. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• Also available in passive version (SCM100PSLT)\n\n \t• ATC SM75-150 S Soft Dome Mid driver\n\n \t• Latest 314mm SL Spec Bass driver\n\n \t• Massive ATC motor assembly\n\n \t• Wide, even dispersion for pin-point imaging\n\n \t• 350 watt Class AB tri-amp pack (active version)\n\n \t• Active filters and overload protection (active version)\n\n \t• 6 year warranty\n\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm100aslt-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm150aslt",
        "slug": "scm150aslt",
        "name": "SCM150ASLT",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM150ASLT. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• ATC SM75-150 S Soft Dome Mid driver\n\n \t• Latest 375mm SL Spec Bass driver\n\n \t• Massive ATC motor assembly\n\n \t• Wide, even dispersion for pin-point imaging\n\n \t• 350 watt class AB tri-amp pack\n\n \t• Active filters and overload protection\n\n \t• 6 year warranty\n\n \t• Also available in passive version\n\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm150aslt-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm200aslt",
        "slug": "scm200aslt",
        "name": "SCM200ASLT",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM200ASLT. Fully engineered for pristine sound staging.",
        "longDescription": "• 25mm soft dome tweeter\n\n \t• Twin, full spec “SL” 12″/314mm bass drivers\n\n \t• ATC 75mm “Super Dome” mid driver\n\n \t• Rack-mount ATC 4-way grounded source 850W P4 amplifier\n\n \t• 6 year warranty\n\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm200aslt-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm300aslt",
        "slug": "scm300aslt",
        "name": "SCM300ASLT",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM300ASLT. Fully engineered for pristine sound staging.",
        "longDescription": "• 25mm soft dome tweeter\n\n \t• Twin full spec “SL” 15″/375mm bass drivers\n\n \t• ATC 75mm “Super Dome” mid driver\n\n \t• Rack-mount ATC 4 way grounded source 850W P4 amplifier\n\n \t• 6 year warranty\n\n\nAvailable Finishes\n\nStandard Veneers – Cherry, Walnut, Oak & Black Ash.\nStandard Paints – Satin Black, Satin White\nPremium Veneers (up-charge applies) – Rosewood, European Crown Cut Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White",
        "featured": false,
        "images": [
            "/images/products/scm300aslt-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm20asl-le-limited-edition",
        "slug": "scm20asl-le-limited-edition",
        "name": "SCM20ASL LE | LIMITED EDITION",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM20ASL LE | LIMITED EDITION. Fully engineered for pristine sound staging.",
        "longDescription": "The SCM20ASL Limited Edition is a 2-way active loudspeaker released to mark the beginning of ATC’s 50th Anniversary year. This exclusive new model, limited to just 150 pairs, packs ATC’s finest transducer engineering and active loudspeaker technology into a compact sealed cabinet, finished to exceptional standards in a stunning high-gloss blue lacquer. Complementing the cabinet, the front baffle is hand-upholstered in dark blue full-grain Napa leather.\n\nCOMPACT SEALED CABINET FINISHED IN HIGH-GLOSS BLUE WITH LEATHER\n\nUPHOLSTERED BAFFLE\n\nATC ON-BOARD ACTIVE 250W 'AMP PACK' MODULE\n\n2ND ORDER LINKWITZ-RILEY ACTIVE CROSSOVERS\n\n2 X CLASS A/B MOSFET AMPLIFIERS, 200W BASS/MID & 50W HIGH FREQUENCY\n\nUSER ADJUSTABLE INPUT SENSITIVITY & BASS CUT/LIFT CONTROLS\n\nMATCHING SUBWOOFER — C4 SUB MK2 LE — AVAILABLE FOR EXTEND BASS RESPONSE\n\nHAND-BUILT IN ENGLAND\n\n6 YEAR WARRANTY",
        "featured": false,
        "images": [
            "/images/products/scm20asl-le-limited-edition-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm50se",
        "slug": "scm50se",
        "name": "SCM50SE",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM50SE. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built 25mm Soft Dome tweeter model SH25-76S.\n\n \t• The unique ATC 75mm Soft Dome midrange model SM75-150S.\n\n \t• The latest 234mm short coil super linear magnet Bass Driver model SB75-234SL.\n\n \t• Fully discrete amplifier for each drive unit combined to create a Tri-amplifier of 350 watts with active crossover filters, phase correction and overload protection.\n\n \t• Accurate timbre, wide dispersion and perfect imaging.\n\n \t• Choice of top brow finish and colour detail.\n\n \t• 6 year warranty.\n\n\nAvailable Finishes\n\nVeneers – Cherry, Walnut, Oak & Black Ash, Rosewood, European Crown Cut Walnut, Burr Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nPaints – Satin Black, Satin White\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White\n\nCabinet ‘brow’ options (left-to-right below): black acrylic centre section with red acrylic ‘horns / veneered centre section with dull nickel ‘horns’ / black acrylic centre section with black acrylic ‘horns’.\n\nLoudspeaker in the photo is finished in Rosewood with a black acrylic ‘brow’ centre section and red ‘horns’.",
        "featured": false,
        "images": [
            "/images/products/scm50se-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm100se",
        "slug": "scm100se",
        "name": "SCM100SE",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM100SE. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built 25mm Soft Dome tweeter model SH25-76S.\n\n \t• The Unique ATC 75mm Soft Dome midrange model SM75-150S.\n\n \t• The latest 314mm short coil super linear magnet Bass Driver model SB75-314SL.\n\n \t• Fully discrete amplifier for each drive unit combined to create a Tri-amplifier of 350 watts with active crossover filters, phase correction and overload protection.\n\n \t• Accurate timbre, wide dispersion and perfect imaging.\n\n \t• Choice of top brow finish and colour detail.\n\n \t• 6 year warranty.\n\n\nAvailable Finishes\n\nVeneers – Cherry, Walnut, Oak & Black Ash, Rosewood, European Crown Cut Walnut, Burr Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nPaints – Satin Black, Satin White\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White.\n\nCabinet ‘brow’ options (left-to-right below): black acrylic centre section with red acrylic ‘horns / veneered centre section with dull nickel ‘horns’ / black acrylic centre section with black acrylic ‘horns’.\n\nLoudspeaker in the featured photo is finished in Burr Magnolia with a matching veneered ‘brow’ centre section and dull nickel ‘horns’.",
        "featured": false,
        "images": [
            "/images/products/scm100se-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "scm150se",
        "slug": "scm150se",
        "name": "SCM150SE",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM150SE. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• New ATC designed and built 25mm Soft Dome tweeter model SH25-76S.\n\n \t• The unique ATC 75mm Soft Dome midrange model SM75-150S.\n\n \t• The latest 375mm short coil super linear magnet Bass Driver model SB75-375SL.\n\n \t• Fully discrete amplifier for each drive unit combined to create a Tri-amplifier of 350 watts with active crossover filters, phase correction and overload protection.\n\n \t• Accurate timbre, wide dispersion and perfect imaging.\n\n \t• Choice of top brow finish and colour detail.\n\n \t• 6 year warranty.\n\n\nAvailable Finishes\n\nVeneers – Cherry, Walnut, Oak & Black Ash, Rosewood, European Crown Cut Walnut, Burr Walnut, Pippy Oak, Burr Magnolia, Burr Poplar.\nPaints – Satin Black, Satin White\nHigh Gloss (up-charge applies) – Clear High Glossed Veneer, Piano Black, Piano White\n\nCabinet ‘brow’ options (left-to-right below): black acrylic centre section with red acrylic ‘horns / veneered centre section with dull nickel ‘horns’ / black acrylic centre section with black acrylic ‘horns’.\n\nLoudspeaker in the featured photo is finished in cherry veneer with high gloss lacquer and a black ‘brow’ centre section and black ‘horns’.",
        "featured": false,
        "images": [
            "/images/products/scm150se-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "c1c",
        "slug": "c1c",
        "name": "C1C",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC C1C. Fully engineered for pristine sound staging.",
        "longDescription": "• Compatible ATC products for surround sound system: SCM 7, SCM 11.\n\n \t• New ATC designed and built 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• Twin 125mm ATC mid/bass unit with integral soft dome.\n\n \t• Massive FEA optimised motor assemblies.\n\n \t• In-house, hand wound precision flat wire coils.\n\n \t• Flat impedance curve allowing easy load for amplifiers.\n\n \t• 6 year warranty.\n\n\n&nbsp;\n\nRecommended Configuration\n\n\n\nFront Channels / Rear Surround\nSCM7\n\n\nCentre Channel\nCIC\n\n\nSub Bass\nC1 Sub\n\n\nUpgrade Path\nSCM11 (Front/Rear left/right) C4 Sub",
        "featured": false,
        "images": [
            "/images/products/c1c-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "c3c",
        "slug": "c3c",
        "name": "C3C",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC C3C. Fully engineered for pristine sound staging.",
        "longDescription": "• Compatible ATC products for surround sound system: SCM 11, SCM 19, SCM 40.\n\n \t• New ATC designed and built 25mm soft dome HF unit with precision alloy wave guide.\n\n \t• Twin ATC 150mm “CLD”mid/bass drivers.\n\n \t• Precision undercut bass pole.\n\n \t• Massive FEA optimised motor assemblies.\n\n \t• In-house, hand wound precision flat wire coils.\n\n \t• Flat impedance curve allowing easy load for amplifiers.\n\n \t• 6 year warranty.\n\n\n&nbsp;\n\nRecommended Configuration\n\n\n\nFront Channels / Rear Surround\nSCM11\n\n\nCentre Channel\nC3C\n\n\nSub Bass\nC1 Sub\n\n\nUpgrade Path\nFront/Rear SCM19, SCM40, C6 Sub",
        "featured": false,
        "images": [
            "/images/products/c3c-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "c4ca",
        "slug": "c4ca",
        "name": "C4CA",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC C4CA. Fully engineered for pristine sound staging.",
        "longDescription": "• Suitable substitution for C6CA centre channel in C6 systems where space is restricted.\n\n \t• Twin ATC 150mm SL mid/bass drivers.\n\n \t• Massive 9kg shielded motor assemblies.\n\n \t• In-house, hand wound precision flat wire coils.\n\n \t• ATC 250 Watt Class A (to 2/3 max power).\n\n \t• Active filters and overload.\n\n \t• 6 Year warranty.\n\n \t• Any veneer to order. Featured veneer: Rosewood.\n\n\n&nbsp;\n\nRecommended Configuration\n\n\n\nFront Channels / Rear Surround\nSCM20ASLT\n\n\nCentre Channel\nC4CA\n\n\nSub Bass\nC4 Sub\n\n\nUpgrade Path\nFront/Rear SCM50, C6 Sub",
        "featured": false,
        "images": [
            "/images/products/c4ca-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "c6c",
        "slug": "c6c",
        "name": "C6C",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC C6C. Fully engineered for pristine sound staging.",
        "longDescription": "• Compatible ATC products for surround sound system: SCM50, SCM100, SCM150.\n\n \t• Twin ATC 234mm SL bass drivers.\n\n \t• ATC SM-150s Dome mid driver.\n\n \t• Massive shielded motor assemblies.\n\n \t• In-house, hand wound precision flat wire coils.\n\n \t• ATC 350 Watt Class A/B Amp Pack\n\n \t• Active filters and overload.\n\n \t• 6 Year warranty.\n\n \t• Any veneer to order. Featured veneer: Cherry.\n\n\n&nbsp;\n\nRecommended Configuration\n\n\n\nFront Channels\nSM50ASLT\n\n\nRear Surround\nSM20ASLT\n\n\nCentre Channel\nC6 Active Centre\n\n\nSub Bass\nC6 Sub\n\n\nUpgrade Path\nSCM100 or 150 (Front left/right)\n\n\n\n1 x additional C6 Sub\n\n\n\nSCM50 or 100 (Rear Surround)",
        "featured": false,
        "images": [
            "/images/products/c6c-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "c1-sub-mk2",
        "slug": "c1-sub-mk2",
        "name": "C1 Sub Mk2",
        "brand": "ATC",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC C1 Sub Mk2. Fully engineered for pristine sound staging.",
        "longDescription": "• Compact 12″ Sub suitable for both music and cinema applications\n\n \t• Ideal partner to ATC loudspeakers: SCM7, SCM11, SCM19, SCM40, HTS7, HTS11, HTS40\n\n \t• Ideal partner to ATC Centre Channel Speakers: C1C & C3C\n\n \t• Handmade ATC 12″/314mm  driver with massive motor assembly and ribbon voice coil\n\n \t• ATC 200W class A/B amplifier\n\n \t• High Level and Line Level Inputs\n\n \t• Comprehensive user controls to ensure best possible integration with partnering loudspeakers\n\n \t• 6 Year warranty",
        "featured": false,
        "images": [
            "/images/products/c1-sub-mk2-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            }
        ]
    },
    {
        "id": "c4-sub-mk2-12-subwoofer",
        "slug": "c4-sub-mk2-12-subwoofer",
        "name": "C4 Sub Mk2 | 12\" SUBWOOFER",
        "brand": "ATC",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC C4 Sub Mk2 | 12\" SUBWOOFER. Fully engineered for pristine sound staging.",
        "longDescription": "Hand-built in England, the ATC C4 Sub Mk2 is a high-performance active subwoofer, engineered to deliver professional studio quality sound to the home environment. Designed to integrate seamlessly into an existing audio system, its features have been carefully considered and its proprietary drive unit and active amplifier are designed to work together to reproduce the lower octaves of the audio band without compromise.\n\nAt its core is the SS75-314SC 12” (314mm) drive unit, meticulously engineered in-house by ATC to accurately reproduce sound below 160Hz. Its short coil operates within a very long magnetic gap to ensure minimal distortion across the full dynamic range, guaranteeing the highest quality audio experience.\n\nThe C4 Sub Mk2's active design integrates the driver and a 300W Class A-B MOSFET based power amplifier into a single system, ensuring peak performance. User controls allow for optimised integration with existing loudspeakers, delivering the same exceptional sound quality found in the world's top music and film recording studios.",
        "featured": false,
        "images": [
            "/images/products/c4-sub-mk2-12-subwoofer-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            }
        ]
    },
    {
        "id": "c6-sub",
        "slug": "c6-sub",
        "name": "C6 Sub",
        "brand": "ATC",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC C6 Sub. Fully engineered for pristine sound staging.",
        "longDescription": "• Full “SL” spec 15˝/375mm bass driver.\n\n \t• 450W Class G amplifier.\n\n \t• Phase adjustment.\n\n \t• Variable cut off frequency.\n\n \t• Variable gain.\n\n \t• Stereo inputs.\n\n \t• 6 year warranty.\n\n \t• Any veneer to order. Featured veneer:Yew.",
        "featured": false,
        "images": [
            "/images/products/c6-sub-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            }
        ]
    },
    {
        "id": "hts7-on-wall-speaker",
        "slug": "hts7-on-wall-speaker",
        "name": "HTS7 On Wall Speaker",
        "brand": "ATC",
        "price": 0,
        "category": "home-theater",
        "shortDescription": "Experience high-fidelity audio with the premium ATC HTS7 On Wall Speaker. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThis compact 2-way design is suitable for main loudspeakers in small-to-medium sized rooms and may also be used as surround loudspeakers in any installation. Available in portrait and landscape versions, in either white or black satin finishes, the HTS7’s clean, simple visual design can be seamlessly integrated into a wide range of interiors and décors.\n\nFeatures\n\n \t• No compromise driver technology borrowed from ATC’s high-end studio monitoring products.\n\n \t• Extended low frequency output from a very compact enclosure.\n\n \t• Neutral voicing and very low distortion delivers audiophile performance from an install package.\n\n \t• Hidden wall mounting brackets and input terminals.\n\n \t• Wide, even sound dispersion ensures exceptional imaging with both music and immersive film soundtracks.\n\n \t• 6 year warranty.\n\n \t• Handmade in England.",
        "featured": false,
        "images": [
            "/images/products/hts7-on-wall-speaker-0.png",
            "/images/products/hts7-on-wall-speaker-1.png",
            "/images/products/hts7-on-wall-speaker-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "home theater"
            }
        ]
    },
    {
        "id": "hts11-on-wall-speaker",
        "slug": "hts11-on-wall-speaker",
        "name": "HTS11 On Wall Speaker",
        "brand": "ATC",
        "price": 0,
        "category": "home-theater",
        "shortDescription": "Experience high-fidelity audio with the premium ATC HTS11 On Wall Speaker. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThis mid-size 2-way design is suitable for main loudspeakers in medium sized rooms and may also be used as surround loudspeakers in larger rooms. Available in portrait and landscape versions, in either white or black satin finishes, the HTS11’s clean, simple visual design can be seamlessly integrated into a wide range of interiors and décors.\n\nFeatures\n\n \t• No compromise driver technology borrowed from ATC’s high-end studio monitoring products.\n\n \t• High dynamic range for accurate reproduction of musical transients and high-impact film soundtracks.\n\n \t• Neutral voicing and very low distortion delivers audiophile performance from an install package.\n\n \t• Hidden wall mounting brackets and input terminals.\n\n \t• Handmade bass/mid driver employing CLD cone technology for class-leading mid-range clarity and balance.\n\n \t• 6 year warranty.\n\n \t• Handmade in England.",
        "featured": false,
        "images": [
            "/images/products/hts11-on-wall-speaker-0.png",
            "/images/products/hts11-on-wall-speaker-1.png",
            "/images/products/hts11-on-wall-speaker-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "home theater"
            }
        ]
    },
    {
        "id": "hts40-on-wall-speaker",
        "slug": "hts40-on-wall-speaker",
        "name": "HTS40 On Wall Speaker",
        "brand": "ATC",
        "price": 0,
        "category": "home-theater",
        "shortDescription": "Experience high-fidelity audio with the premium ATC HTS40 On Wall Speaker. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThis large 3-way design features ATC’s 75mm soft dome for exceptional mid-range clarity and is suitable for main loudspeakers in larger rooms. The HTS40 may also be used as surround loudspeakers. The cabinet can be configured for either portrait or landscape orientations and is available in either white or black satin finishes. The clean, simple visual design can be seamlessly integrated into a wide range of interiors and décors.\n\nFeatures\n\n \t• No compromise driver technology borrowed from ATC’s high-end studio monitoring products.\n\n \t• High dynamic range for accurate reproduction of musical transients and high-impact film soundtracks.\n\n \t• Neutral voicing and very low distortion delivers audiophile performance from an install package.\n\n \t• Hidden wall mounting brackets and input terminals.\n\n \t• Proprietary long-throw bass driver produces exceptional low frequency output and linearity.\n\n \t• 6 year warranty.\n\n \t• Handmade in England.",
        "featured": false,
        "images": [
            "/images/products/hts40-on-wall-speaker-0.png",
            "/images/products/hts40-on-wall-speaker-1.png",
            "/images/products/hts40-on-wall-speaker-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "home theater"
            }
        ]
    },
    {
        "id": "scm50-anniversary",
        "slug": "scm50-anniversary",
        "name": "SCM50 Anniversary",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM50 Anniversary. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• ATC SM-150 S Soft Dome mid driver\n\n \t• Latest 234mm spec bass driver\n\n \t• Massive ATC motor assembly\n\n \t• Wide dispersion and perfect imaging\n\n \t• 350 watt fully discrete tri-amplifier\n\n \t• Class-A input stage & active filters\n\n \t• 6 year warranty\n\n \t• Exclusive baffle, plinth, spike assembly.\n\n \t• Piano finish with metal insert.\n\n \t• Authenticity pack signed by Billy Woodman.\n\n\nThis product is now discontinued.  Current equivalent product is the SCM50 SE",
        "featured": false,
        "images": [
            "/images/products/scm50-anniversary-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "cda2-mk2-cd-dac-pre-amplifier",
        "slug": "cda2-mk2-cd-dac-pre-amplifier",
        "name": "CDA2 Mk2 – CD DAC Pre-Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC CDA2 Mk2 – CD DAC Pre-Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "Overview \n\nCombining very high performance and versatility, the CDA2 combines a CD player, pre-amplifier and high-resolution DAC within a compact and elegant chassis.  Acting as the source or combined with a streamer and/or external phono stage, it can partner with active speakers to form an exceptional system with minimal ‘box-count’.  Alternatively, the CDA2 can combine with a power amplifier such as the ATC P2 to drive passive loudspeakers with stunning results. \n\nFeatures\n\n \t• All-discrete class-A pre-amplifier with balanced and unbalanced outputs.\n\n \t• Two analogue inputs via RCA/phono and one via 3.5mm mini-jack.\n\n \t• High performance CD Player.\n\n \t• Premium AKM 32-bit DAC.\n\n \t• USB digital input supporting up to 384kHz PCM data and native DSD256.*\n\n \t• Headphone amp featuring discrete output stage.\n\n \t• Roon Tested Certification\n\n \t• Handmade in England.\n\n \t• 6 year warranty.**\n\n\n*DSD256 support via PC only (up to DSD128 via Mac).\n** TWO years on CD mechanism.",
        "featured": false,
        "images": [
            "/images/products/cda2-mk2-cd-dac-pre-amplifier-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "cd2-cd-player",
        "slug": "cd2-cd-player",
        "name": "CD2 – CD Player",
        "brand": "ATC",
        "price": 0,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC CD2 – CD Player. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nThis compact high-performance CD digital audio source has been designed to offer exceptional performance and compatibility with a very wide range of partnering electronics both from ATC and other high-quality manufacturers. Styling compliments ATC’s full range of audio electronics, but its small form factor makes it the perfect partner to the equally compact SIA2-100 integrated amplifier. \n\nFeatures \n\n \t• High performance TEAC CD Transport\n\n \t• Premium AKM 32-bit DAC\n\n \t• Coaxial & TOSLINK Digital Outputs\n\n \t• Balanced XLR and Un-balanced RCA outputs\n\n \t• ATC Discrete class-A output buffers\n\n \t• Handmade in England\n\n \t• 6 year warranty*\n\n\n* TWO years on CD mechanism.",
        "featured": false,
        "images": [
            "/images/products/cd2-cd-player-0.png",
            "/images/products/cd2-cd-player-1.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "cda2-mk2-cd-dac-pre-amplifier-2",
        "slug": "cda2-mk2-cd-dac-pre-amplifier-2",
        "name": "CDA2 Mk2 – CD DAC Pre-Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC CDA2 Mk2 – CD DAC Pre-Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "Overview \n\nCombining very high performance and versatility, the CDA2 combines a CD player, pre-amplifier and high-resolution DAC within a compact and elegant chassis.  Acting as the source or combined with a streamer and/or external phono stage, it can partner with active speakers to form an exceptional system with minimal ‘box-count’.  Alternatively, the CDA2 can combine with a power amplifier such as the ATC P2 to drive passive loudspeakers with stunning results. \n\nFeatures\n\n \t• All-discrete class-A pre-amplifier with balanced and unbalanced outputs.\n\n \t• Two analogue inputs via RCA/phono and one via 3.5mm mini-jack.\n\n \t• High performance CD Player.\n\n \t• Premium AKM 32-bit DAC.\n\n \t• USB digital input supporting up to 384kHz PCM data and native DSD256.*\n\n \t• Headphone amp featuring discrete output stage.\n\n \t• Roon Tested Certification\n\n \t• Handmade in England.\n\n \t• 6 year warranty.**\n\n\n*DSD256 support via PC only (up to DSD128 via Mac).\n** TWO years on CD mechanism.",
        "featured": false,
        "images": [
            "/images/products/cda2-mk2-cd-dac-pre-amplifier-2-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "ca2-stereo-pre-amplifier",
        "slug": "ca2-stereo-pre-amplifier",
        "name": "CA2 – Stereo Pre-Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC CA2 – Stereo Pre-Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "Overview \n\nGiven ATC’s history manufacturing active loudspeakers, a partnering preamplifier was a logical step and our first preamp, the SCA2 was released in 1996.  The CA2 – a simpler design yet still offering exceptional performance – is derived from the ‘high-end’ SCA2 and maintains its exceptional performance, but with fewer features.  It is equally adept at driving active loudspeakers as paired with one of ATCs power amplifiers and a wide range of inputs and outputs ensure outstanding compatibility with a very wide range of partnering equipment. \n\nFeatures\n\n \t• Discrete class-A low-noise circuitry evolved from high-end SCA2 preamp. \n\n \t• MC/MM RIAA Phono Stage with adjustable gain/loading. \n\n \t• High-Performance Headphone Amplifier. \n\n \t• 5 x stereo RCA/Phono inputs. \n\n \t• IR Remote Control.\n\n \t• Hand built in the UK & covered by a 6–year warranty. \n\n\n“…if you want to hear the important musical detail presented in a coherent, clear-cut fashion this pairing has remarkably little competition in the two box arena. There are a few integrated amps which give them a run for their money in one respect or another but nothing comes to mind which seems like a better overall package.” Jason Kennedy Hi Fi+ No75.",
        "featured": false,
        "images": [
            "/images/products/ca2-stereo-pre-amplifier-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "sca2-discrete-stereo-pre-amplifier",
        "slug": "sca2-discrete-stereo-pre-amplifier",
        "name": "SCA2 – Discrete Stereo Pre-Amplifier",
        "brand": "ATC",
        "price": 1110000,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCA2 – Discrete Stereo Pre-Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "Overview \n\nThe SCA2 is ATC’s highest performance preamplifier and has been in continuous production since 1996, testament to its exceptional performance and timeless styling.  It is the ideal partner to ATC’s high-end active loudspeakers and also power amplifiers, such as the ATC P2.  Balanced and unbalanced inputs and outputs provide flexible connectivity to a very wide range of partnering equipment.  The optional phono stage is fully configurable for both gain, resistive and capacitive loading and its low-noise design makes it well suited to even the lowest output moving coil cartridges. \n\nFeatures \n\n \tDiscrete class-A low-noise circuitry throughout. \n\n \tHigh-current output stages ensure exceptionally low distortion into any load & when driving long cables. \n\n \t500kHz bandwidth eliminates phase shift and contributes to the outstanding reproduction of fine musical detail.  \n\n \tOptional SPH2 MC/MM RIAA precision phono stage with extensive gain/loading options. \n\n \t2 x stereo balanced XLR line inputs & 6 x stereo RCA/Phono line inputs. \n\n \t1 x stereo balanced XLR & 1 x stereo single-ended RCA/Phono preamp output. \n\n \tBillet Aluminium IR Remote Control. \n\n \tHand built in the UK & covered by a 6-year warranty.",
        "featured": false,
        "images": [
            "/images/products/sca2-discrete-stereo-pre-amplifier-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "p1-dual-mono-power-amplifier",
        "slug": "p1-dual-mono-power-amplifier",
        "name": "P1 – Dual-Mono Power Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC P1 – Dual-Mono Power Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "Overview \n\nUsing power amplifier circuits derived from ATCs revered active loudspeakers, the P1 dual-mono power amplifier makes this exceptional technology available to all Hi-Fi and music enthusiasts.  It is the ideal partner to a wide range of passive loudspeakers and can provide a significant upgrade for those wishing to upgrade from a system using an integrated amplifier.  Like the more powerful P2, the combination of exceptional resolution and neutral fidelity allows the quality of the original recording to shine through whilst also offering outstanding compatibility with a wide range of partnering equipment. \n\nFeatures \n\n \t150W per channel delivers high dynamic range from a wide range of loudspeakers. \n\n \tDual-mono design delivers full power simultaneously from both channels, with minimal crosstalk. \n\n \tBalanced and un-balanced inputs, plus un-balanced ‘link’ outputs. \n\n \tGrounded source class A/B output stage circuits as found in ATC’s renowned active loudspeakers. \n\n \tWide bandwidth, low distortion and high dynamic range ensure tonal accuracy and perfectly timed transients. \n\n \tGain matched to larger 300W P2 enabling bi-amp compatibility. \n\n \tNeutral fidelity ensures excellent system compatibility. \n\n \tHand built in the UK and supported by a 6-year warranty.\n\n\n“…if you want to hear the important musical detail presented in a coherent, clear-cut fashion this pairing has remarkably little competition in the two box arena. There are a few integrated amps which give them a run for their money in one respect or another but nothing comes to mind which seems like a better overall package.”\nJason Kennedy, Hi Fi Plus No.75",
        "featured": false,
        "images": [
            "/images/products/p1-dual-mono-power-amplifier-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "p2-dual-mono-power-amplifier",
        "slug": "p2-dual-mono-power-amplifier",
        "name": "P2 – Dual-Mono Power Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC P2 – Dual-Mono Power Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "Overview \n\nUpgrading from the P1 power amp, the P2 adds a much larger power supply and additional output MOSFETs to double power to 300W per channel.  It is the ideal solution to drive speakers in larger rooms and/or when a loudspeaker presents a difficult load and will provide an effortless, musical presentation under these demanding conditions.  Like the smaller P1, the combination of exceptional resolution and neutral fidelity allows the quality of the original recording to shine through whilst also offering outstanding compatibility with a wide range of partnering equipment. \n\nFeatures \n\n \t300W per channel – ideal for larger rooms and/or challenging loudspeaker loads. \n\n \tDual-mono design delivers full power simultaneously from both channels, with minimal crosstalk. \n\n \tBalanced and un-balanced inputs, plus un-balanced ‘link’ outputs. \n\n \tGrounded source class A/B output stage circuits as found in ATC’s renowned active loudspeakers. \n\n \tWide bandwidth, low distortion and high dynamic range ensure tonal accuracy and perfectly timed transients. \n\n \tGain matched to smaller 150W P1 enabling bi-amp compatibility. \n\n \tNeutral fidelity ensures excellent system compatibility. \n\n \tHand built in the UK and supported by a 6 year warranty. \n\n\n“In terms of detail, the P2 struck gold once again. Instruments were lifelike and beautifully atmospheric, no matter whether a recording featured a soft solo acoustic ensemble or a grand orchestral bombardment.”\nAdam Smith, Hi-Fi News, March 2017.\n\n\n&nbsp;",
        "featured": false,
        "images": [
            "/images/products/p2-dual-mono-power-amplifier-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "sia2-100-stereo-integrated-amplifier",
        "slug": "sia2-100-stereo-integrated-amplifier",
        "name": "SIA2-100 Stereo Integrated Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SIA2-100 Stereo Integrated Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\nCompact in size yet offering high power output and exceptional resolution, this integrated amplifier with on-board DAC is ideally suited to driving ATC’s small and mid-size passive loudspeakers and a very wide range of loudspeakers from other manufacturers. Understated styling makes it easy to integrate with partnering equipment whilst its small footprint occupies very little space in the home. An ideal partner for our CD2 CD Player. \n\nFeatures \n\n \t2 x line level analogue inputs. \n\n \t3 x digital inputs: USB, Coaxial, TOSLINK. \n\n \tPremium AKM 32-bit DAC. \n\n \tUSB digital input supports up to 384kHz PCM data and native DSD256.* \n\n \t2 x 100W Discrete MOSFET Output Stage \n\n \tHeadphone amp featuring discrete output stage. \n\n \tHandmade in England & covered by a 6 year warranty. \n\n\n*DSD256 support via PC only (up to DSD128 via Mac).",
        "featured": false,
        "images": [
            "/images/products/sia2-100-stereo-integrated-amplifier-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "p4",
        "slug": "p4",
        "name": "P4",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC P4. Fully engineered for pristine sound staging.",
        "longDescription": "• 4-way mono block design.\n\n \t• ATC “Grounded Source Topology”.\n\n \t• 850W Class AB total output.\n\n \t• 4th order active crossovers with phase correction.\n\n \t• Soft limiting driver protection.\n\n \t• Triple fan cooling.\n\n \t• 6 year warranty.\n\n \t• Only available as part of an ATC active loudspeaker system.",
        "featured": false,
        "images": [
            "/images/products/p4-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "scm12-pro",
        "slug": "scm12-pro",
        "name": "SCM12 Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM12 Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• Compact high performance 2-way studio monitor.\n\n \t• Ideally suited to:\n– critical near-field listening applications in all control rooms\n– LCR surround monitoring in small-to-medium control rooms.\n– surround channels for immersive audio (Auro 3D, Dolby Atmos, DTS-X)\n\n \t• Proprietary ATC 150mm/6˝ CLD Mid/Bass Driver.\n\n \t• Proprietary ATC 25mm/1˝ Dual Suspension Tweeter.\n\n \t• Wide dispersion.\n\n \t• 6 year warranty.\n\n\nInstallation version also available SCM12i.",
        "featured": false,
        "images": [
            "/images/products/scm12-pro-0.png",
            "/images/products/scm12-pro-1.jpg",
            "/images/products/scm12-pro-2.jpg",
            "/images/products/scm12-pro-3.jpg",
            "/images/products/scm12-pro-4.jpg",
            "/images/products/scm12-pro-5.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm12i-pro-install",
        "slug": "scm12i-pro-install",
        "name": "SCM12i Pro (Install)",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM12i Pro (Install). Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• The SCM12i Pro is a compact 2-way passive monitor designed for installation into recording, post production, broadcast and film studios.\n\n \t• It’s compact size and exceptional performance make it an ideal loudspeaker for use in surround/multi-channel recording/mixing and immersive audio applications such as Dolby Atmos, DTS:X and Auro 3D.\n\n \t• To facilitate simple install, the cabinet features mounting points compatible with popular wall/ceiling brackets.\n\n \t• The SCM12i is designed around the same philosophy as ATC’s 2 and 3-way active monitor loudspeakers and also employs driver components & technology found in these larger models resulting in exceptional consistency across the product range.\n\n\nFeatures\n\n \t• Wide bandwidth & high SPL capability\n\n \t• Neutral timbre & low distortion for low listener fatigue\n\n \t• 150mm / 6” ATC CLD Bass Driver\n\n \t• 25mm / 1” ATC Dual-Suspension HF Driver\n\n \t• Cabinet mounting points for wall/ceiling mount\n\n \t• 6 year warranty",
        "featured": false,
        "images": [
            "/images/products/scm12i-pro-install-0.png",
            "/images/products/scm12i-pro-install-1.jpg",
            "/images/products/scm12i-pro-install-2.jpg",
            "/images/products/scm12i-pro-install-3.jpg",
            "/images/products/scm12i-pro-install-4.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm20psl-pro",
        "slug": "scm20psl-pro",
        "name": "SCM20PSL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM20PSL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• Compact very high performance passive 2-way studio monitor\n\n \t• Ideally suited to:\n\n\n– critical near-field listening applications in all control rooms\n– LCR surround monitoring in small-to-medium control rooms\n– surround channels in medium-to-large control rooms\n\n \t• Proprietary ATC 150mm/6” Super Linear Mid/Bass Driver\n\n \t• Proprietary ATC 25mm/1” Dual Suspension ‘S-Spec’ Tweeter\n\n \t• Wide, even dispersion",
        "featured": false,
        "images": [
            "/images/products/scm20psl-pro-0.png",
            "/images/products/scm20psl-pro-1.jpg",
            "/images/products/scm20psl-pro-2.jpg",
            "/images/products/scm20psl-pro-3.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm20asl-pro",
        "slug": "scm20asl-pro",
        "name": "SCM20ASL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM20ASL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• Compact very high performance 2-way studio monitor ideally suited to:\n– critical near-field listening applications in all control rooms\n– LCR surround monitoring in small-to-medium control rooms\n– surround channels in medium-to-large control rooms\n\n \t• Proprietary ATC 150mm/6” Super Linear Mid/Bass Driver\n\n \t• Proprietary ATC 25mm/1” S-Spec Tweeter\n\n \t• Discrete MOSFET class A/B bi-amp pack with 200W/50W\ncontinuous power output",
        "featured": false,
        "images": [
            "/images/products/scm20asl-pro-0.jpg",
            "/images/products/scm20asl-pro-1.jpg",
            "/images/products/scm20asl-pro-2.jpg",
            "/images/products/scm20asl-pro-3.jpg",
            "/images/products/scm20asl-pro-4.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm25a-pro-mk2",
        "slug": "scm25a-pro-mk2",
        "name": "SCM25A Pro Mk2",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM25A Pro Mk2. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\nThe SCM25A Pro Mk2 is a compact 3-way high-performance active studio monitor loudspeaker, based around a 6.5”/164mm bass driver.  The monitors combination of exceptional mid-range clarity, high output, extended bass response and modest size makes it ideal for nearfield monitoring in a wide range of critical applications.\n\nThe latest Mk2 version is updated with ATC’s latest SH25-76S ‘Dual Suspension’ tweeter, extending the high-frequency response along with a reduction in distortion.  These improvements ensure faster decision making and outstanding translation outside the studio.\nKey Features\n\n \t• 3-way design featuring ATC SM75-150 Soft Dome mid-range driver.\n\n \t• Wide dispersion vs frequency for excellent stereo imaging over a large listening area.\n\n \t• ATC discrete MOSFET class A/B amp-pack delivers high dynamic range in combination with very low distortion and an extended HF bandwidth.\n\n \t• 4th order active crossovers with all-pass phase compensation ensure outstanding driver integration.\n\n \t• Input sensitivity and bass ‘lift’ user controls.\n\n \t• Hand-built in England and covered by a 6-year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm25a-pro-mk2-0.jpg",
            "/images/products/scm25a-pro-mk2-1.jpg",
            "/images/products/scm25a-pro-mk2-2.jpg",
            "/images/products/scm25a-pro-mk2-3.jpg",
            "/images/products/scm25a-pro-mk2-4.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm45a-pro",
        "slug": "scm45a-pro",
        "name": "SCM45A Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM45A Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• Mid-size very high performance  active 3-way studio monitor\n\n \t• Ideally suited to:\n– critical near-field listening applications in all control rooms\n– LCR surround monitoring in medium control rooms\n– surround channels in medium-to-large contol rooms\n\n \t• ATC hand built 6.5˝/164mm carbon-paper cone bass driver.\n\n \t• ATC 25mm/1” Dual-Suspension ‘S-Spec’ Tweeter\n\n \t• Discrete MOSFET class A/B tri-amp pack with 150W/60W/25W\ncontinuous power output",
        "featured": false,
        "images": [
            "/images/products/scm45a-pro-0.png",
            "/images/products/scm45a-pro-1.jpg",
            "/images/products/scm45a-pro-2.jpg",
            "/images/products/scm45a-pro-3.jpg",
            "/images/products/scm45a-pro-4.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm50asl-pro",
        "slug": "scm50asl-pro",
        "name": "SCM50ASL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM50ASL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• ATC 25mm/1” Dual Suspension ‘S-Spec’ Tweeter.\n\n \t• Full “SL” spec 9˝/234mm bass driver.\n\n \t• ATC 75mm “Super Dome” mid driver.\n\n \t• On board grounded source 350W Tri-amp pack.\n\n \t• LF contour control.\n\n \t• Clip indication.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm50asl-pro-0.png",
            "/images/products/scm50asl-pro-1.jpg",
            "/images/products/scm50asl-pro-2.jpg",
            "/images/products/scm50asl-pro-3.jpg",
            "/images/products/scm50asl-pro-4.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm100asl-pro",
        "slug": "scm100asl-pro",
        "name": "SCM100ASL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM100ASL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• ATC 25mm/1” Dual Suspension ‘S-Spec’ Tweeter.\n\n \t• Full “SL” spec 12˝/314mm bass driver.\n\n \t• ATC 3″/75mm “Super Dome” mid driver.\n\n \t• On board grounded source 350W Tri-amp pack.\n\n \t• LF contour control.\n\n \t• Clip indication.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm100asl-pro-0.png",
            "/images/products/scm100asl-pro-1.jpg",
            "/images/products/scm100asl-pro-2.jpg",
            "/images/products/scm100asl-pro-3.jpg",
            "/images/products/scm100asl-pro-4.jpg",
            "/images/products/scm100asl-pro-5.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm110asl-pro",
        "slug": "scm110asl-pro",
        "name": "SCM110ASL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM110ASL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• ATC 25mm/1” Dual Suspension ‘S-Spec’ Tweeter.\n\n \t• Twin full “SL” spec 9˝/234mm bass driver.\n\n \t• ATC 75mm “Super Dome” mid driver.\n\n \t• On board ATC grounded source 350W Tri-amp pack.\n\n \t• LF contour control.\n\n \t• Clip indication.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm110asl-pro-0.png",
            "/images/products/scm110asl-pro-1.jpg",
            "/images/products/scm110asl-pro-2.jpg",
            "/images/products/scm110asl-pro-3.jpg",
            "/images/products/scm110asl-pro-4.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm150asl-pro",
        "slug": "scm150asl-pro",
        "name": "SCM150ASL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM150ASL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• ATC 25mm/1” Dual Suspension ‘S-Spec’ Tweeter.\n\n \t• Full “SL” spec 15˝/375mm bass driver.\n\n \t• ATC 75mm “Super Dome” mid driver.\n\n \t• On board ATC grounded source 350W Tri-Amp Pack.\n\n \t• LF contour control.\n\n \t• Clip indication.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm150asl-pro-0.png",
            "/images/products/scm150asl-pro-1.jpg",
            "/images/products/scm150asl-pro-2.jpg",
            "/images/products/scm150asl-pro-3.jpg",
            "/images/products/scm150asl-pro-4.jpg",
            "/images/products/scm150asl-pro-5.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm200asl-pro",
        "slug": "scm200asl-pro",
        "name": "SCM200ASL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM200ASL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• Large format main monitor.\n\n \t• 34mm soft dome tweeter.\n\n \t• Twin full spec “SL” 12″/314mm bass drivers.\n\n \t• ATC 75mm “Super Dome” mid driver.\n\n \t• P4 rack-mount grounded source 850W class A/B amplifier.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm200asl-pro-0.png",
            "/images/products/scm200asl-pro-1.png",
            "/images/products/scm200asl-pro-2.jpg",
            "/images/products/scm200asl-pro-3.jpg",
            "/images/products/scm200asl-pro-4.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scm300asl-pro",
        "slug": "scm300asl-pro",
        "name": "SCM300ASL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM300ASL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "Overview\n\n \t• Large format main monitor.\n\n \t• 34mm soft dome tweeter.\n\n \t• Twin full spec “SL” 15˝/375mm bass drivers.\n\n \t• ATC 75mm “Super Dome” mid driver.\n\n \t• P4 rack-mount grounded source 850W class A/B amplifier.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm300asl-pro-0.png",
            "/images/products/scm300asl-pro-1.png",
            "/images/products/scm300asl-pro-2.jpg",
            "/images/products/scm300asl-pro-3.jpg",
            "/images/products/scm300asl-pro-4.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "scs70-pro",
        "slug": "scs70-pro",
        "name": "SCS70 Pro",
        "brand": "ATC",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCS70 Pro. Fully engineered for pristine sound staging.",
        "longDescription": "SCS70 Pro\n12”/300MM PROFESSIONAL ACTIVE SUBWOOFER\nThe ATC SCS70 Pro is a 12”/300mm active subwoofer, designed to deliver the exceptional levels of performance required by audio and music professionals and integral to partnering with ATCs range of active monitors. It’s performance and features make it ideally suited to stereo, multi-channel surround and immersive audio formats such as Dolby Atmos.\n\nATC HAND-BUILT HIGH-EXCURSION 12”/300MM SS75-314SC SUBWOOFER DRIVER\n\nEXCEPTIONAL BALANCE OF HIGH SPL CAPABILITY, LOW CUT-OFF AND LOW DISTORTION\n\nATC DISCRETE MOSFET CLASS AB POWER AMPLIFIER\n\nSTEREO BALANCED INPUTS & STEREO 'LINK' BALANCED OUTPUTS\n\nLEVEL, LOW-PASS FREQUENCY & PHASE USER CONTROLS\n\nREMOTE MUTING VIA FOOTSWITCH*\n\nHAND-BUILT IN ENGLAND AND COVERED BY A 6 YEAR WARRANTY\n\n*FOOTSWITCH SUPPLIED SEPARATELY, LATCHING TYPE, 1/4”/6.35MM JACK CONNECTION\nSCS70iW Pro\n12”/300MM IN-WALL ACTIVE SUBWOOFER\nThe ATC SCS70iW Pro is a 12”/300mm active subwoofer, designed to be mounted flush in-wall (soffit mount). It is the ideal partner to in-wall mounted mid-size ATC monitors in stereo, multichannel, and immersive audio applications.\n\nIN-WALL (FLUSH MOUNT) CABINET DESIGN WITH REDUCED DEPTH AND REMOTE MOUNTED AMPLIFIER.\n\nATC HAND-BUILT HIGH-EXCURSION 12”/300MM SS75-314SC SUBWOOFER DRIVER.\n\nR1-300 7U/19” REMOTE RACK MOUNT AMPLIFIER.\n\nAMP - SUB CONNECTION VIA NL4 SPEAKER & 5-PIN XLR LED CABLE*\n\nSTEREO BALANCED INPUTS & STEREO 'LINK' BALANCED OUTPUTS.\n\nLEVEL, LOW-PASS FREQUENCY & PHASE USER CONTROLS.\n\nREMOTE MUTING VIA FOOTSWITCH**.\n\nHAND-BUILT IN ENGLAND AND COVERED BY A 6 YEAR WARRANTY.\n\n*CABLES SUPPLIED SEPARATELY PRICES ACCORDING TO LENGTH.\n\n**FOOTSWITCH SUPPLIED SEPARATELY, LATCHING TYPE, 1/4”/6.35MM JACK CONNECTION.",
        "featured": false,
        "images": [
            "/images/products/scs70-pro-0.jpg",
            "/images/products/scs70-pro-1.jpg",
            "/images/products/scs70-pro-2.jpg",
            "/images/products/scs70-pro-3.jpg",
            "/images/products/scs70-pro-4.jpg",
            "/images/products/scs70-pro-5.jpg",
            "/images/products/scs70-pro-6.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            }
        ]
    },
    {
        "id": "scm0-1-15sl-pro",
        "slug": "scm0-1-15sl-pro",
        "name": "SCM0.1/15SL Pro",
        "brand": "ATC",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC SCM0.1/15SL Pro. Fully engineered for pristine sound staging.",
        "longDescription": "• Full “SL” spec 15˝/375mm bass driver.\n\n \t• 450W Class G amplifier.\n\n \t• Phase adjustment.\n\n \t• Variable cut off frequency.\n\n \t• Variable gain.\n\n \t• Stereo inputs.\n\n \t• 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/scm0-1-15sl-pro-0.png",
            "/images/products/scm0-1-15sl-pro-1.jpg",
            "/images/products/scm0-1-15sl-pro-2.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            }
        ]
    },
    {
        "id": "p4-2",
        "slug": "p4-2",
        "name": "P4",
        "brand": "ATC",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC P4. Fully engineered for pristine sound staging.",
        "longDescription": "• 4 channel 3-way mono-block design.\n\n \t• ATC class A/B “Grounded Source Topology”.\n\n \t• 850W  total output.\n\n \t• 4th order active crossovers with phase correction.\n\n \t• Fast FET soft limiting driver protection.\n\n \t• Triple fan cooling.\n\n \t• 6 year warranty.\n\n \t• Only available as part of an ATC active loudspeaker system.",
        "featured": false,
        "images": [
            "/images/products/p4-2-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "p1-pro-dual-mono-power-amplifier",
        "slug": "p1-pro-dual-mono-power-amplifier",
        "name": "P1 Pro – Dual-Mono Power Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC P1 Pro – Dual-Mono Power Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "P1 Pro – Dual-Mono Power Amplifier\n\n \t• True dual-mono design delivers full power simultaneously from both channels, with minimal crosstalk\n\n \t• Grounded source class A/B circuit topology as found in ATC’s renowned active loudspeakers.\n\n \t• Ultra wide bandwidth, low distortion and high dynamic range ensure tonal accuracy and perfectly timed transients.\n\n \t• No compromise, high performance power supply and large heatsinks guarantee outstanding stability and long term reliability.\n\n \t• A perfect match for any passive studio reference monitor.\n\n \t• 19” Rack mountable convection cooled chassis\n\n \t• Hand built in the UK and supported by a 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/p1-pro-dual-mono-power-amplifier-0.png",
            "/images/products/p1-pro-dual-mono-power-amplifier-1.jpg",
            "/images/products/p1-pro-dual-mono-power-amplifier-2.jpg",
            "/images/products/p1-pro-dual-mono-power-amplifier-3.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "p2-pro-dual-mono-power-amplifier",
        "slug": "p2-pro-dual-mono-power-amplifier",
        "name": "P2 Pro – Dual-Mono Power Amplifier",
        "brand": "ATC",
        "price": 0,
        "category": "tube-amplifiers",
        "shortDescription": "Experience high-fidelity audio with the premium ATC P2 Pro – Dual-Mono Power Amplifier. Fully engineered for pristine sound staging.",
        "longDescription": "P2 Pro – Dual-Mono Power Amplifier\n\n \t• 300W per channel.\n\n \t• True dual-mono design delivers full power simultaneously from both channels, with minimal crosstalk\n\n \t• Grounded source class A/B circuit topology as found in ATC’s renowned active loudspeakers.\n\n \t• Ultra wide bandwidth, low distortion and high dynamic range ensure tonal accuracy and perfectly timed transients.\n\n \t• No compromise, high performance power supply and large heatsinks guarantee outstanding stability and long term reliability.\n\n \t• A perfect match for any passive studio reference monitor.\n\n \t• 19” Rack mountable convection cooled chassis\n\n \t• Hand built in the UK and supported by a 6 year warranty.",
        "featured": false,
        "images": [
            "/images/products/p2-pro-dual-mono-power-amplifier-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ATC"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "ap20",
        "slug": "ap20",
        "name": "AP20",
        "brand": "Aurender",
        "price": 2499000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Aurender AP20. Fully engineered for pristine sound staging.",
        "longDescription": "Elegance. Finesse. Resolution. Grace.\n\n\n\n\n\nIf ever Aristotle’s adage: “the whole is greater than the sum of its parts” is applicable in audio, it applies to AP20. And, given the quality and quantity of parts in this equation, that’s saying a lot.\n\nAP20 delivers unprecedented audio performance from an integrated amplifier. It includes the world’s best Class D amp modules in a dual-mono configuration, an analog R2R relay-based volume control and preamp section, Aurender’s best DAC, a master clock input, a headphone output, a suite of digital and analog inputs and outputs, and the most sophisticated linear power supply block Aurender has ever deployed.\n\nThe result? An audio component that paints every musical timbre with full-bodied realism. With a delicate touch that’s backed up by enormous headroom for transients and dynamic swings, AP20 drives even the most demanding speaker loads and casts a soundstage that is both expansive and laser-focused.\n\nAll of this performance, with the heart of an Aurender.\n\nOther integrated amplifier solutions on the market may offer support for app-controlled streaming, but in nearly every case, the user experience, library management, and software playback engine are an afterthought requiring third-party software and hardware to get the job done. In AP20’s case, more than 10 years of industry-leading experience has made Aurender the digital source component of choice in the world’s finest audio systems. Now, that same holistic digital playback engine and user experience is available from an integrated amplifier that completely removes the need for more components and cables.\n\nJust add speakers, and enjoy a premium HiFi experience, without all the HiFi boxes.\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n16.93″W x 14.2″D x 5.9″H\n\n\nWeight\n57.3 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n8.8″ 1920 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\nFull Linear, 2x 400VA Toroidy Transformers (L&R Power Amp), 2x 50W (L&R Audio Boards), 1x50W (CPU), 1x25W (FPGA)\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n2X 2.5″ Compartments (User-Installable Storage)\n\n\nSSD for System & Cache\n480GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor, A30 Manager\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (47W), Peak (80W), Standby (6W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nVolume Control\nRelay-Based R2R Stereo Attenuator -64dB ~ 0dB., Velocity Sensitive Operation\n\n\nAnalog Outputs\nXLR (Balanced)\n\n\nDAC Chipset\nAKM 4497 – Dual-Mono\n\n\nAudio Word Clock\nOCXO\n\n\nAnalog Outputs Supported Format\nPCM: Up to 32-bit / 768 kHz; DSD: Up to DSD512\n\n\nDigital Outputs\nN/A\n\n\nSPDIF & AES/EBU Output Supported Format\nN/A\n\n\nDigital Inputs\n1X Coax RCA, 1X Coax BNC, 2X Optical/Toslink\n\n\nHeadphone Section\n1 x 1/4″ (6.5mm) Unbalanced\n\n\nMQA Support\nMQA Full-Decoder On Board\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAmplifier Specifications\n\n\n\n\n\n\n\n\nAmplifier Module\n2x Purifi 1ET400A Class D Amplifier Module in Dual-Mono Configuration\n\n\nRated Power Output\n200 W into 8 ohms / 350 W into 4 ohms\n\n\nTHD (20Hz-20kHz)\n0.003 % (1W to 200 W, 8 ohms and 4 ohms)\n\n\nDamping Factor\n800 (ref. 8Ω 20 Hz to 6.5 kHz)\n\n\nOutput Impedance\n&lt;65μΩ @ 1kHz\n\n\nPower Configuration\nFull linear & Dual-Mono – 2 x 400VA Audio grade Toroidy toroidal transformers\n\n\nPower Supply Filter Capacitors\nTotal 80,000uF ( 40,000 uF / channel)\n\n\nBinding Posts\nWBT nextgen™ pole terminal – Signal conductor made of pure copper",
        "featured": false,
        "images": [
            "/images/products/ap20-0.webp",
            "/images/products/ap20-1.webp",
            "/images/products/ap20-2.webp",
            "/images/products/ap20-3.webp",
            "/images/products/ap20-4.webp",
            "/images/products/ap20-5.webp",
            "/images/products/ap20-6.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "n30sa",
        "slug": "n30sa",
        "name": "N30SA",
        "brand": "Aurender",
        "price": 2800000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Aurender N30SA. Fully engineered for pristine sound staging.",
        "longDescription": "N30SA\n\n\n\n\n\n\nThe Statement Source for the finest HiFi systems.\n\nState-Of-The-Art Dual-Chassis Digital Output Network Transport with USB, AES/EBU, Coaxial, BNC, Optical Outputs, and Word/Master Clock Input. 1 x 8TB SSD + User-Installable Expansion Port.\n\n\n\n\n\n\n\n\nSeparation of Music and Noise\n\n\n\n\n\nThe culmination of more than 10 years of research and product development has led Aurender to N30SA: the ultimate Digital Output Network Transport with the utmost in transparency, resolution, pace, rhythm, dynamics and revealing musical expression.\n\nIn digital audio rendering, there are two predominant forces which must be mitigated in order to provide a pristine musical presentation: Noise and Jitter. N30SA’s dual-chassis design physically and electrically isolates the sensitive audio outputs from the noise-generating components of the machine to deliver an uncanny kind of coherence and quiet. The kind of quiet that results in the listener’s ability to hear deep into the music and identify each individual instrument with unbridled dynamics, true-to-life timbre, deep bass extension and slam – even from the most complex musical passages.\n\nAs with N20 and W20SE, N30SA’s SPDIF and AES/EBU outputs are controlled by an ultra precise OCXO clock to minimize jitter and its harmful artifacts, therefore alleviating the harshness and incoherence that plagues some digital audio presentations. Add an external Master Clock connection like Aurender’s MC20 for the ultimate in atomic clock timing accuracy.\n\n\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n2x 16.9″W x 14″D x 4.2″H (3.7″H w/o Feet)\n\n\nWeight\n48.5 lb\n\n\nMaterial\nDual Machined Aluminum Chassis\n\n\nFront Panel Display\n8.8″ 1920 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\n1x50W (CPU), 2x35W (4 cores) for Digital Output Board\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n8TB, 1X 2.5″ Compartment (User-Installable Storage)\n\n\nSSD for System & Cache\n480GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (40W), Peak (70W), Standby (3.5W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nN/A\n\n\nDAC Chipset\nN/A\n\n\nAudio Word Clock\nOCXO Rev2\n\n\nAnalog Outputs Supported Format\nN/A\n\n\nDigital Outputs\nUSB Audio (Dedicated), AES/EBU (OCXO Controlled), BNC Coax SPDIF (OCXO Controlled), RCA Coax SPDIF (OCXO Controlled), Optical/TosLink SPDIF (OCXO Controlled)\n\n\nUSB Output Supported Format\nPCM up to 768kHz, DoP up to DSD256, up to DSD 512 Native for USB output\n\n\nSPDIF & AES/EBU Output Supported Format\nPCM: Up to 32-bit / 192 kHz; DSD: Up to DSD64 via DoP\n\n\nDigital Inputs\nN/A\n\n\nHeadphone Section\nN/A\n\n\nMaster Clock Input\nCoaxial BNC 75Ω – 10MHz, 12.8MHz, 44.1-48kHz (multiples from 1-512x)\n\n\nMQA Support\nMQA Core-Decoder Upgrade Available\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A",
        "featured": false,
        "images": [
            "/images/products/n30sa-0.webp",
            "/images/products/n30sa-1.webp",
            "/images/products/n30sa-2.webp",
            "/images/products/n30sa-3.webp",
            "/images/products/n30sa-4.webp",
            "/images/products/n30sa-5.webp",
            "/images/products/n30sa-6.webp",
            "/images/products/n30sa-7.webp",
            "/images/products/n30sa-8.webp",
            "/images/products/n30sa-9.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "n20",
        "slug": "n20",
        "name": "N20",
        "brand": "Aurender",
        "price": 1400000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Aurender N20. Fully engineered for pristine sound staging.",
        "longDescription": "N20\n\n\n\n\n\n\nFlagship pedigree – make no compromise.\n\nUltra High-Performance Digital Output Network Transport with USB, AES/EBU, Coaxial, BNC, Optical Outputs and Word Clock Input, 2X User-Installable storage slots.\n\n\n\n\n\n\n\n\nThe New Aspiration\n\n\n\n\n\n“The Aurender N20 hits the bullseye with simplicity, stability, speed, and sound quality. The product is as simple as possible, but no simpler”, said AudiophileStyle.com and we couldn’t agree more.\n\nN20 sits in the enviable “sweet spot” of cost vs. performance in the middle of Aurender’s range of digital source components. Equally at home in a cost-no-object system or as the cornerstone of a more modest system, N20 is designed to be connected to the world’s best high-quality DACs. the N20 features ultra high-end SPDIF (Coaxial, BNC, Optical) and AES/EBU outputs in addition to an isolated USB Audio output. The SPDIF digital output suite is controlled by a precise OCXO clock for long-term jitter reduction, achieving the perfect marriage of low noise and low jitter. A word clock or master clock input is also provided for users who wish to sync with an external clock. High-resolution file support for all major codecs goes to the extreme limits, and on-the-fly DSD-to-PCM conversion by FPGA is available for SPDIF outputs. N20 is equipped with two user-installable storage bays, allowing the user to select the drive type and capacity to meet their own needs. The handsome machined aluminum front panel features a large 8.8” full-color IPS LCD display that reproduces the album art, artist name and song title.\n\nA true overachiever, the N20 fully embodies the virtues of high-end audio performance and user-friendliness expected from Aurender.\n\n\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n16.9″W x 14″W x 4.4″H (3.9″H)\n\n\nWeight\n29.8 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n8.8″ 1920 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\n1x50W (CPU), 2x35W (4 cores) for Digital Output Board\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n2X 2.5″ Compartments (User-Installable Storage)\n\n\nSSD for System & Cache\n480GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (40W), Peak (70W), Standby (3.5W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nN/A\n\n\nDAC Chipset\nN/A\n\n\nAudio Word Clock\nOCXO\n\n\nAnalog Outputs Supported Format\nN/A\n\n\nDigital Outputs\nUSB Audio (Dedicated), AES/EBU (OCXO Controlled), BNC Coax SPDIF (OCXO Controlled), RCA Coax SPDIF (OCXO Controlled), Optical/TosLink SPDIF (OCXO Controlled)\n\n\nUSB Output Supported Format\nPCM up to 768kHz, DoP up to DSD256, up to DSD 512 Native for USB output\n\n\nSPDIF & AES/EBU Output Supported Format\nPCM: Up to 32-bit / 192 kHz; DSD: Up to DSD64 via DoP\n\n\nDigital Inputs\nN/A\n\n\nHeadphone Section\nN/A\n\n\nMaster Clock Input\nCoaxial BNC 75Ω – 10MHz, 12.8MHz, 44.1-48kHz (multiples from 1-512x)\n\n\nMQA Support\nMQA Core-Decoder Upgrade Available\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nDSD64/128/256/512 to 88.2/176.4kHz",
        "featured": false,
        "images": [
            "/images/products/n20-0.webp",
            "/images/products/n20-1.webp",
            "/images/products/n20-2.webp",
            "/images/products/n20-3.webp",
            "/images/products/n20-4.webp",
            "/images/products/n20-5.webp",
            "/images/products/n20-6.webp",
            "/images/products/n20-7.webp",
            "/images/products/n20-8.webp",
            "/images/products/n20-9.webp",
            "/images/products/n20-10.webp",
            "/images/products/n20-11.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "n200",
        "slug": "n200",
        "name": "N200",
        "brand": "Aurender",
        "price": 735000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Aurender N200. Fully engineered for pristine sound staging.",
        "longDescription": "N200\n\n\n\n\n\n\nRack Appeal. Step up your streaming game.\n\nHigh-Performance Digital Output Network Transport with USB and Coaxial digital outputs, handsome color screen, and 2 x 2.5″ Slots for user-installable library storage\n\n\n\n\n\n\n\n\nThe Art of Music Making\n\n\n\n\n\nN200 represents a milestone in terms of exceptional sound quality, unique feature set, and high value. In order to make N200 accessible to as many music lovers as possible, we have omitted the expensive OCXO-controlled digital audio board in favor of a simple, dedicated USB audio output.\n\nN200 sports all the recent Aurender technological innovations including cache-based playback, a low power Intel quad-core processor, our latest generation modular USB Audio output, double isolated gigabit ethernet port, and super-capacitor based uninterruptible power supply (UPS) for safe shut downs. N200 is capable of handling PCM up to 384kHz and DSD content up to an amazing DSD512!\n\nA 6.9” full-color IPS LCD display renders album artwork and track information in gorgeous detail. We’ve also expanded the internal music library storage capacity by providing two user-installable SSD/HDD trays to suit your needs. And, if you’re 100% streaming, no storage drives need to be installed.\n\nN200 delivers audio performance very close to the pinnacle Aurender experience, with only compromises that are irrelevant except in the context of the most extreme high-end systems.\n\n\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n13″W x 14″D x 3.8″H (3.3″H w/o Feet)\n\n\nWeight\n19.4 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n6.9″ 1280 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\n2x35W\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n2X 2.5″ Compartments (User-Installable Storage)\n\n\nSSD for System & Cache\n240GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (15W), Peak (35W), Standby (5.1W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nN/A\n\n\nDAC Chipset\nN/A\n\n\nAudio Word Clock\nTCXO\n\n\nAnalog Outputs Supported Format\nN/A\n\n\nDigital Outputs\nUSB Audio (Dedicated), RCA Coax SPDIF (basic)\n\n\nUSB Output Supported Format\nPCM up to 768kHz, DoP up to DSD256, up to DSD 512 Native for USB output\n\n\nSPDIF & AES/EBU Output Supported Format\nPCM: Up to 32-bit / 192 kHz; DSD: Up to DSD64 via DoP\n\n\nDigital Inputs\nN/A\n\n\nHeadphone Section\nN/A\n\n\nMaster Clock Input\nN/A\n\n\nMQA Support\nMQA Core-Decoder Upgrade Available\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nNot Supported",
        "featured": false,
        "images": [
            "/images/products/n200-0.webp",
            "/images/products/n200-1.webp",
            "/images/products/n200-2.webp",
            "/images/products/n200-3.webp",
            "/images/products/n200-4.webp",
            "/images/products/n200-5.webp",
            "/images/products/n200-6.webp",
            "/images/products/n200-7.webp",
            "/images/products/n200-8.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "n150",
        "slug": "n150",
        "name": "N150",
        "brand": "Aurender",
        "price": 395000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Aurender N150. Fully engineered for pristine sound staging.",
        "longDescription": "N150\n\n\n\n\n\n\nSimply Elegant. Bona Fide Aurender sound at a real-world price.\n\nMinimalist High-Performance Digital Output Network Transport with dedicated USB Audio Output\n\n\n\n\n\n\n\n\nSmart Decision for the Sound Obsessed\n\n\n\n\n\nN150 is the most accessible and economical entry point to the “Aurender Way” of enjoying music with a stable, reliable, great sounding digital source component. Although it was designed with affordability in mind, in true Aurender fashion, its audio performance decidedly belies its cost. The N150 is the source to choose when upgrading from a cd player, computer, or budget brand streamer to discover the world of true high end, high resolution playback.\n\nDesigned to be used exclusively with a USB DAC, the N150 incorporates our latest dedicated USB Audio Class 2.0 output and double isolated gigabit LAN port to lower both noise and jitter for the pristine reproduction of high-resolution files and streams. A high contrast 3″ AMOLED screen mounted on a compact and handsome machined aluminum chassis indicates “Now Playing” track info.\n\nPerformance and usability enhancing features include a linear power supply, low power/high-efficiency Intel CPU board, super capacitor-based UPS, and a user-installable storage tray for the SSD or HDD that suits your library storage needs.\n\nN150 is the perfect choice for music lovers who care not for the large, full-color screen and SPDIF or AES/EBU outputs of models higher up in Aurender’s range. There is nothing “entry level” about N150, except for the price.\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n8.5″W x 13.9″W x 2.5″H (2.2 w/o Feet)\n\n\nWeight\n11.7 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n3″ AMOLED\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\n1x50W (CPU)\n\n\nCPU\nIntel Low Power Dual Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n2X 2.5″ Compartments (User-Installable Storage)\n\n\nSSD for System & Cache\n240GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (12W), Peak (32W), Standby (4.2W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nN/A\n\n\nDAC Chipset\nN/A\n\n\nAudio Word Clock\nTCXO\n\n\nAnalog Outputs Supported Format\nN/A\n\n\nDigital Outputs\nUSB Audio (Dedicated)\n\n\nUSB Output Supported Format\nPCM up to 768kHz, DoP up to DSD256, up to DSD 512 Native for USB output\n\n\nSPDIF & AES/EBU Output Supported Format\nN/A\n\n\nDigital Inputs\nN/A\n\n\nHeadphone Section\nN/A\n\n\nMaster Clock Input\nN/A\n\n\nMQA Support\nMQA Core-Decoder Upgrade Available\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A",
        "featured": false,
        "images": [
            "/images/products/n150-0.webp",
            "/images/products/n150-1.webp",
            "/images/products/n150-2.webp",
            "/images/products/n150-3.webp",
            "/images/products/n150-4.webp",
            "/images/products/n150-5.webp",
            "/images/products/n150-6.webp",
            "/images/products/n150-7.webp",
            "/images/products/n150-8.webp",
            "/images/products/n150-9.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "a30",
        "slug": "a30",
        "name": "A30",
        "brand": "Aurender",
        "price": 2199000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Aurender A30. Fully engineered for pristine sound staging.",
        "longDescription": "A30\n\n\n\n\n\n\nAurender’s best DAC, plus the convenience of built-in CD Ripping\n\nReference Analog Output Network Player with Aurender’s best built-in DAC, CD Ripping, Library Management functionality, 10TB storage, and Dedicated Headphone Section\n\n\n\n\n\n\n\n\nA Marriage of Performance and Convenience\n\n\n\n\n\nA30 is the flagship model from Aurender’s range of analog output network players. Like A200, A15, and A20, A30 is, at its essence, a caching music server/streamer with a built-in DAC and analog outputs.\n\nA30 is built around Aurender’s best internal DAC architecture: a dual-mono pair of AKM4497 DACs for the ultimate performance in channel separation, resolution, and control.\n\nThe Aurender A30 also includes full MQA Decoder technology which enables you to play back full-resolution MQA audio files and streams, delivering the highest possible sound quality of the original master recording. Beyond delivering exceptional audio quality, A30 includes functions like CD ripping, 10TB of internal storage, ultra-wide color LCD display, a high-quality dedicated headphone section, and an integrated software suite of metadata editing and library management tools.\n\nAll this, and much more, makes the A30 the new performance standard in all-in-one digital source components.\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n16.9″W x 14″D x 5.6″H (4.7″ w/o Feet)\n\n\nWeight\n37.5 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n8.8″ 1920 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\nFull Linear, 1x50W (CPU), 2x25W (DAC L&R), 1x25W (Headphone), 1x25W (FPGA)\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n10TB (3.5″ HDD)\n\n\nSSD for System & Cache\n480GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor, A30 Manager\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (47W), Peak (80W), Standby (6W)\n\n\nCD Ripping Capability\nYes, Slot-Loading Optical Drive, Compatible with Nimbie Autoloader\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nXLR (Balanced), RCA (Unbalanced)\n\n\nDAC Chipset\nAKM 4497 – Dual-Mono\n\n\nAudio Word Clock\nOCXO\n\n\nAnalog Outputs Supported Format\nPCM: Up to 32-bit / 768 kHz; DSD: Up to DSD512\n\n\nDigital Outputs\nUSB Audio (Dedicated)\n\n\nUSB Output Supported Format\nPCM up to 768kHz, DoP up to DSD256, up to DSD 512 Native for USB output\n\n\nSPDIF & AES/EBU Output Supported Format\nN/A\n\n\nDigital Inputs\n1X Coax RCA, 1X Coax BNC, 2X Optical/Toslink\n\n\nHeadphone Section\n1 x 1/4″ (6.5mm) Unbalanced, 1 x 4-pin XLR Balanced, 1 x 4.4 mm Balanced\n\n\nMaster Clock Input\nN/A\n\n\nMQA Support\nMQA Full-Decoder On Board\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A",
        "featured": false,
        "images": [
            "/images/products/a30-0.webp",
            "/images/products/a30-1.webp",
            "/images/products/a30-2.webp",
            "/images/products/a30-3.webp",
            "/images/products/a30-4.webp",
            "/images/products/a30-5.webp",
            "/images/products/a30-6.webp",
            "/images/products/a30-7.webp",
            "/images/products/a30-8.webp",
            "/images/products/a30-9.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "a20",
        "slug": "a20",
        "name": "A20",
        "brand": "Aurender",
        "price": 1700000,
        "category": "music-streamers",
        "shortDescription": "Reference Analog Output Network Player MQA Full-Decoder DAC / Headphone Amplifier 2 x Slot for 2.5″ HDD or SSD Drive (user-installable) Variable-Output Balanced XLR and Single-Ended RCA Analog Outputs USB Digital Output / Coaxial and Optical Digital Inputs",
        "longDescription": "A20\n\n\n\n\n\n\nFlagship sound with Aurender’s best DAC built-in.\n\nReference Analog Output Network Player with Aurender’s best built-in DAC, dedicated Headphone Section, User-Installable Storage Options, XLR and RCA Analog Outputs\n\n\n\n\n\n\n\n\nRedefining the relationship between Digital Audio and Music\n\n\n\n\n\nA20 is derived from A30 and delivers the very same reference-level audio performance, but without the CD ripping and library management functionality. A20 also replaces A30’s factory-fitted 10TB HDD with two user accessible bays to install one or two 2.5” HDDs or SSDs for the music storage capacity needed or desired.\n\nEmploying the same renowned dual-mono AKM 4497 chipset as that found in model A30, you can expect nothing but the best in sound quality. A20 is ideal for the user seeking exceptional audio performance from files and streams without the fuss or complexity of separate components.\n\nA20’s scaled back design makes no compromise where audio performance is concerned. Music lovers who have no need for CD ripping functionality and want a high-end DAC without adding more boxes will find A20 to be a stellar foundation to any system.\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n16.9″W x 14″D x 4.4″H (3.9 w/o feet)\n\n\nWeight\n31.3 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n8.8″ 1920 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\nFull Linear, 1x50W (CPU), 2x25W (DAC L&R), 1x35W (FPGA & Headphone)\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n2X 2.5″ Compartments (User-Installable Storage)\n\n\nSSD for System & Cache\n480GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (47W), Peak (80W), Standby (6W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nXLR (Balanced), RCA (Unbalanced)\n\n\nDAC Chipset\nAKM 4497 – Dual-Mono\n\n\nAudio Word Clock\nOCXO\n\n\nAnalog Outputs Supported Format\nPCM: Up to 32-bit / 768 kHz; DSD: Up to DSD512\n\n\nDigital Outputs\nUSB Audio (Dedicated)\n\n\nUSB Output Supported Format\nPCM up to 768kHz, DoP up to DSD256, up to DSD 512 Native for USB output\n\n\nSPDIF & AES/EBU Output Supported Format\nN/A\n\n\nDigital Inputs\n1X Coax RCA, 1X Coax BNC, 2X Optical/Toslink\n\n\nHeadphone Section\n1 x 1/4″ (6.5mm) Unbalanced\n\n\nMaster Clock Input\nN/A\n\n\nMQA Support\nMQA Full-Decoder On Board\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A",
        "featured": false,
        "images": [
            "/images/products/a20-0.webp",
            "/images/products/a20-1.webp",
            "/images/products/a20-2.webp",
            "/images/products/a20-3.webp",
            "/images/products/a20-4.webp",
            "/images/products/a20-5.webp",
            "/images/products/a20-6.webp",
            "/images/products/a20-7.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "a15",
        "slug": "a15",
        "name": "A15",
        "brand": "Aurender",
        "price": 950000,
        "category": "music-streamers",
        "shortDescription": "Ultra High-Performance Analog Output Network Player\nMQA Full-Decoder DAC\n2 x Slot for 2.5″ HDD or SSD Drive (user-installable)\nVariable-Output Balanced XLR and Single-Ended RCA Analog Outputs\nUSB Digital Output / Coaxial and Optical Digital Input",
        "longDescription": "A15\n\n\n\n\n\n\nHigh-End sound, lifestyle convenience\n\nUltra High-Performance Analog Output Network Player with Dual-Mono MQA Full-Decoder DAC, RCA + Balanced XLR Analog Outputs\n\n\n\n\n\n\n\n\nElegant Simplicity\n\n\n\n\n\nThe revolutionary A10 changed the paradigm for Aurender by introducing our first music server/streamer with a built-in DAC. A15 is the upgraded replacement of A10, featuring many new features and audible improvements.\n\nAnd, while it’s a true high performance all-in-one Digital Source Component, it is priced to be highly competitive with comparable separate DAC & Transport setups. A15 is performance-packed with balanced analog outputs and a resolving dual-mono AKM4490 digital-to-analog convertor with MQA full-decoder technology. As with all of Aurender’s “A” series, A15 is designed to take full advantage of the vast selection of MQA encoded music available today. It also has two rear panel bays which can accommodate user-installable 2.5″ HDDs or SSDs of up to 8TB each to store the largest of music libraries. An elegant front panel display shows album cover art along with artist name and song title in living color.\n\nA15 is a great choice for the devoted audiophile replacing an aging CD player, laptop or just for wanting the inherent simplicity of a great sounding one-box source component.\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\nW16.9″ x D14″ x H3.8″ (3.3″ w/o feet)\n\n\nWeight\n26.2 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n6.9″ 1280 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\nFull Linear, 1x50W (CPU), 2x25W (DAC L&R), 1x25W (FPGA)\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n2X 2.5″ Compartments (User-Installable Storage)\n\n\nSSD for System & Cache\n240GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (29W), Peak (42W), Standby (7W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nRCA (Unbalanced), XLR (Balanced)\n\n\nDAC Chipset\nAKM 4490 – Dual-Mono\n\n\nAudio Word Clock\nTCXO\n\n\nAnalog Outputs Supported Format\nPCM: Up to 32-bit / 768 kHz; DSD: Up to DSD256, + DSD512 (Converted to PCM)\n\n\nDigital Outputs\nUSB Audio (Dedicated)\n\n\nUSB Output Supported Format\nPCM up to 768kHz, DoP up to DSD256, up to DSD 512 Native for USB output\n\n\nSPDIF & AES/EBU Output Supported Format\nN/A\n\n\nDigital Inputs\n1X Optical/Toslink, 2X Coax RCA\n\n\nHeadphone Section\nN/A\n\n\nMaster Clock Input\nN/A\n\n\nMQA Support\nMQA Full-Decoder On Board\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A",
        "featured": false,
        "images": [
            "/images/products/a15-0.webp",
            "/images/products/a15-1.webp",
            "/images/products/a15-2.webp",
            "/images/products/a15-3.webp",
            "/images/products/a15-4.webp",
            "/images/products/a15-5.webp",
            "/images/products/a15-6.webp",
            "/images/products/a15-7.webp",
            "/images/products/a15-8.webp",
            "/images/products/a15-9.webp",
            "/images/products/a15-10.webp",
            "/images/products/a15-11.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "a200",
        "slug": "a200",
        "name": "A200",
        "brand": "Aurender",
        "price": 735000,
        "category": "music-streamers",
        "shortDescription": "High Performance Analog Output Network Player\nMQA Full-Decoder DAC\n2 x Slot for 2.5″ HDD or SSD Drive (user-installable)\nVariable-Output Single-Ended RCA Analog Outputs\nUSB Digital Output / Coaxial and Optical Digital Inputs",
        "longDescription": "Functional Finesse\n\n\n\n\n\nA200 replaces model A100 as Aurender’s most compact and economical Analog Output Network Player. Offering superlative audio performance and the renowned Aurender user experience, A200 is an ideal choice for the music lover building a high-performance yet economical digital audio system. By virtue of its all-new low power Intel quad-core processor, low noise linear power supply, MQA Full-Decoder DAC, and adaptive storage system, A200 brings a higher fidelity to your hi-res digital files and streams. The handsome machined aluminum chassis sports a 6.9” color LCD display that oozes elegance and simplicity.\n\nA200 incorporates all the latest generation Aurender innovations, including a single-stereo implementation of the remarkable AKM4490 MQA Full-Decoder DAC, coaxial and Toslink digital inputs, 2X isolated gigabit ethernet port and a Super-Capacitor based uninterruptible power supply (UPS). Two compartments for user-installable storage drives afford the user with massive internal library capacity.\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n13.8″W x 14″D x 3.8″H (3.3″ w/o Feet)\n\n\nWeight\n21.2 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n6.9″ 1280 x 480 Wide IPS Color LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\nFull Linear, 1x50W (CPU), 1x25W (DAC), 1x25W (FPGA)\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB\n\n\nLibrary Storage Capacity\n2X 2.5″ Compartments (User-Installable Storage)\n\n\nSSD for System & Cache\n240GB NVME\n\n\nData USB Ports\n2X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\nDouble-Isolated Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (26W), Peak (30W), Standby (6.5W)\n\n\nCD Ripping Capability\nN/A\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nRCA (Unbalanced)\n\n\nDAC Chipset\nAKM 4490 Single-Stereo\n\n\nAudio Word Clock\nTCXO\n\n\nAnalog Outputs Supported Format\nPCM: Up to 32-bit / 768 kHz; DSD: Up to DSD256, + DSD512 (Converted to PCM)\n\n\nDigital Outputs\nUSB Audio (Dedicated)\n\n\nUSB Output Supported Format\nUp To 32-bit / 384 kHz, DSD128 (DoP), DSD256 (Native)\n\n\nSPDIF & AES/EBU Output Supported Format\nN/A\n\n\nDigital Inputs\n1X Coax RCA, 1X Optical/Toslink\n\n\nHeadphone Section\nN/A\n\n\nMaster Clock Input\nN/A\n\n\nMQA Support\nMQA Full-Decoder On Board\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A",
        "featured": false,
        "images": [
            "/images/products/a200-0.webp",
            "/images/products/a200-1.jpg",
            "/images/products/a200-2.webp",
            "/images/products/a200-3.webp",
            "/images/products/a200-4.webp",
            "/images/products/a200-5.webp",
            "/images/products/a200-6.webp",
            "/images/products/a200-7.webp",
            "/images/products/a200-8.webp",
            "/images/products/a200-9.webp",
            "/images/products/a200-10.webp",
            "/images/products/a200-11.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "a1000",
        "slug": "a1000",
        "name": "A1000",
        "brand": "Aurender",
        "price": 395000,
        "category": "music-streamers",
        "shortDescription": "High Performance Analog Output Network Player\nVariable-Output AKM4490REQ Dual Mono RCA Analog Outputs\nHDMI ARC input\nUSB Digital and Coaxial Inputs and Outputs\nConvenient BT AptX-HD and Google Cast Audio\n1 x Slot for 2.5″ HDD or SSD Drive (user-installable)",
        "longDescription": "Features Galore\n\n\n\n\n\nOffering outstanding audio performance and a plethora of new features, the A1000 is the perfect choice for music enthusiasts seeking an immersive and versatile digital input/output system. Say goodbye to complex connections and software limitations. The A1000’s all new assortment of connectivity options make it a breeze for anyone to pickup and enjoy. Whether you prefer Tidal Connect, Qobuz Connect (via Google Cast audio), Bluetooth Aptx-HD or Aurender Conductor, you are now in complete control of your music.\n\n\n\n\n\n\nOn the hardware side, you’ll find an exceptional AKM 4490REQ Dual-Mono DAC chip and Quad-core 2.0GHz CPU (ARM Cortex-A55), each powered by their own low-noise linear power supply. Upholding Aurender tradition, 1 SSD storage slot is provided for your personal digital file collection. The rear panel now features HDMI ARC, offering greater compatibility for televisions while maintaining superior audio quality. All of this comes wrapped in a beautiful and robust aluminum chassis with a full featured remote and a 6.9” full color display. Combining remarkable audio prowess with entry level pricing, the compact A1000 stands ready to elevate your audio system to the next level.\n\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nUnit Dimensions\n13. 8″W x 14″D x 3.8″H\n\n\nUnit Weight\n18.3lb (8.3kg)\n\n\nShipping Dimensions\n19.6″W x 18.8″D x 10.2″H\n\n\nShipping Weight\n26.5lb (12kg)\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n6.9″ 1280 x 480 Wide IPS Color LCD\n\n\nFront Control Panel\nPower, Input, Output, Mode, Play/Pause, Next Track, Previous Track, Volume Jog\n\n\nRemote Control\nBluetooth LE Remote control for full-featured control\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\nFull Linear Toroidal\n\n\nCPU\nQuad-core 2.0Ghz CPU (ARM Coretex-A55)\n\n\nRAM\n4GB DRAM\n\n\nLibrary Storage Capacity\n1x 2.5”\n\n\nSSD for System & Cache\n32G eMMC for System, 120GB NVMe for Cache\n\n\nData USB Ports\n1x for external storage\n\n\nSoftware Suite\nAurender Conductor\n\n\nEthernet Port\n100/1000 (Gigabit)\n\n\nPower Consumption\nPlay (15W), Peak (20W), Standby (1.4W)\n\n\nARC\n1x ARC-in for TV ARC port\n\n\n12V Trigger\n1x for external equipment\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nRCA (Unbalanced)\n\n\nDAC Chipset\nAKM4490REQ Dual Mono\n\n\nAnalog Outputs Supported Format\nUp To 32-bit / 768 KHz, DSD512(Native)\n\n\nDigital Outputs\nCOAX RCA, USB external DAC Support\n\n\nUSB Output Supported Format\nUp To 32-bit / 768 KHz, DSD512(Native)\n\n\nDigital Inputs\nCOAX RCA, Optical/Toslink, USB Type B, ARC\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, and others\n\n\nStreaming Protocol Support\nTidal Connect, Spotify Connect, Airplay\n\n\nGoogle Cast Audio\nAllows casting from: Qobuz, Youtube, Deezer, Bugs, Melon & others (up to 96khz/24 bit)\n\n\nBluetooth\nup to AptX-HD",
        "featured": false,
        "images": [
            "/images/products/a1000-0.jpg",
            "/images/products/a1000-1.jpg",
            "/images/products/a1000-2.jpg",
            "/images/products/a1000-3.jpg",
            "/images/products/a1000-4.jpg",
            "/images/products/a1000-5.jpg",
            "/images/products/a1000-6.jpg",
            "/images/products/a1000-7.jpg",
            "/images/products/a1000-8.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "acs10",
        "slug": "acs10",
        "name": "ACS10",
        "brand": "Aurender",
        "price": 735000,
        "category": "music-streamers",
        "shortDescription": "High Performance Digital Output Network Transport\nAutomatic CD Ripping / Library Management / Metadata Editing\nMassive Dual-HDD Storage\nCentral Server Hub for Large Libraries",
        "longDescription": "“Aurender is trying to kill your computer.” – AudioStream\n\n\n\n\n\nDesigned and developed to eliminate the reliance upon computers and other IT products in your digital audio\nsystem, the Aurender Content Server (ACS10) unifies the activities of CD ripping, Network Attached Storage (with RAID mirroring), and advanced library management/metadata editing with exceptional USB audio output.\n\nNot only does ACS10 excel as a stand-alone Digital Transport with the same filtered & isolated USB\naudio output found on the most high-end Aurender models, the included ACS Manager companion app incorporates advanced library management utilities right from your iPad or Android tablet.\n\nA CD-ROM drive and ACS’s reference quality CD Ripping engine authors the best sounding files from your CDs in your choice of FLAC, WAV or AIFF codecs. Metadata is automatically retrieved and fully editable if desired.\n\nMusic collectors with massive libraries or more than one high-end system in the home will appreciate ACS10 as a Central Server Hub for other Aurender players. Connectivity is accomplished over the network, allowing the ACS10 to be conveniently located in your main audio system or in a separate location.\n\n\n\n\n\n\n\n\nPhysical Specifications\n\n\n\n\n\n\n\n\nDimensions\n16.9″W x 14″D x 3.8″H (3.3″ w/o Feet)\n\n\nWeight\n27 lb\n\n\nMaterial\nMachined Aluminum Chassis\n\n\nFront Panel Display\n4.0″ IPC LCD\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTechnical Specifications\n\n\n\n\n\n\n\n\nPower Supply\nFull Linear\n\n\nCPU\nIntel Low Power Quad Core\n\n\nRAM\n8GB/16GB for 24 and 28 TB models\n\n\nLibrary Storage Capacity\n28TB\n\n\nSSD for System & Cache\n240GB NVME/480GB NVME for 24 & 28 TB Models\n\n\nData USB Ports\n1X USB 3.0 (Front), 1X USB 3.0 (Rear)\n\n\nSoftware Suite\nAurender Conductor, ACS Manager\n\n\nEthernet Port\n1 Double-Isolated + 2 Standard Gigabit LAN\n\n\nUninterruptible Power Supply (UPS)\nYes (Super Capacitors)\n\n\nPower Consumption\nPlay (16.5W), Peak (23.5W), Standby (6.5W)\n\n\nCD Ripping Capability\nYes, Drawer-Loading Optical Drive, Compatible with Nimbie Autoloader\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nAudio Specifications\n\n\n\n\n\n\n\n\nAnalog Outputs\nN/A\n\n\nDAC Chipset\nN/A\n\n\nAudio Word Clock\nTCXO\n\n\nAnalog Outputs Supported Format\nN/A\n\n\nDigital Outputs\nUSB Audio (Dedicated)\n\n\nUSB Output Supported Format\nUp To 32-bit / 384kHz, DSD128 (DoP), DSD512 (Native)\n\n\nSPDIF & AES/EBU Output Supported Format\nN/A\n\n\nDigital Inputs\nN/A\n\n\nHeadphone Section\nN/A\n\n\nMaster Clock Input\nN/A\n\n\nMQA Support\nMQA Core-Decoder Upgrade Available\n\n\nCompatible Formats\nDSD (DSF, DFF), WAV, FLAC, AIFF, ALAC, M4A, APE and others\n\n\nDSD-to-PCM Conversion\nN/A",
        "featured": false,
        "images": [
            "/images/products/acs10-0.webp",
            "/images/products/acs10-1.webp",
            "/images/products/acs10-2.webp",
            "/images/products/acs10-3.webp",
            "/images/products/acs10-4.webp",
            "/images/products/acs10-5.webp",
            "/images/products/acs10-6.webp",
            "/images/products/acs10-7.webp",
            "/images/products/acs10-8.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "mc20",
        "slug": "mc20",
        "name": "MC20",
        "brand": "Aurender",
        "price": 3399000,
        "category": "music-streamers",
        "shortDescription": "Reference Grade Master Clock & Word Clock Generator\nRubidium Module 10 MHz Master Clock\nDiscrete OCXO Word Clock Outputs for Universal Connectivity",
        "longDescription": "A New Standard of Accuracy and Stability\n\n\n\n\n\nIn any digital audio system, the rate at which digital data is transmitted and received is of the utmost importance. Specifically, all devices in the digital signal path must be synchronized in order to provide a coherent presentation. Therefore, for the ultimate experience in clarity, transparency, focused imaging, and natural realism, your system’s digital source, DAC, and any other upsamplers or converters should all receive the same synchronized clock signal from an ultra precise and stable source.\n\nThe Aurender MC20 is both a Master Clock and Word Clock generator that is inspired, developed, and designed to deliver an exceptionally high level of digital audio realism from a connected music server and/or D/A converter. Thanks to the MC20’s superior timekeeping, jitter is reduced to infinitesimal levels resulting in the ultimate timbral purity and rock-steady placement of instruments within your system’s soundstage.\n\nAt the heart of the MC20 is a rubidium module that generates a 10MHz master clock reference signal. A rubidium clock is employed for its superior accuracy and stability in both the long and short term for ultra-low jitter. Additionally, MC20 contains two discrete OCXO word clock modules for generating the frequencies 44.1 kHz and 48 kHz. MC20 will independently and simultaneously supply the four 10MHz master clock outputs and four Word Clock outputs (2 at 44.1 kHz and 2 at 48 kHz) for unprecedented versatility with a wide variety of Aurender and third party equipment.\n\n\n\nSpecifications\n\n\n\n\n\n\n\n\nSPDIF Sync Input\nCoaxial BNC, 75Ω (BNC 75Ω)\n\n\nClock Output\nRubidium Master Clock: 10MHz 2ea. (75Ω), 2ea. (50Ω), 0.7Vrms (±10%)\nWord Clock: CH. A 2ea (75Ω), CH. B 2ea (75Ω)\n\n\nConnectivity\nUSB (Reserved for future use)\n\n\nLED Indicators / Button\nLED Indicators: Clock LED, Sync LED, Multiplier LED 10ea (Ch)\nSelect Button: Clock Select, Multiple Select,\nPower Button\n\n\nPhase Noise(Rubidium)\n&lt; -130dBc / Hz (10 Hz)\n&lt; -140dBc / Hz (100 Hz)\n\n\nFreq. Short-term Stability (Rubidium)\n&lt;2×10⁻¹¹ (1 s)\n&lt;1×10⁻¹¹ (10 s)\n&lt;2×10⁻¹² (100 s)\n\n\nPhase Noise (OCXO)\n&lt; -90dB/Hz (1Hz)\n&lt; -115dB/Hz (10Hz)\n&lt; -127dB/Hz (100Hz)\n&lt; -143dB/Hz (1kHz)\n\n\nFreq. Stability(OCXO)\n&lt;5 x 10⁻¹⁰\n\n\nSize (WxHxD)\n430 x 106 x 370 mm (unit only), (127 mm height with foot)\n16.9 x 4.2 x 14.6 inch (unit only), (5.0 in height with foot)\n\n\nWeight\n20.3kg, 44.7lbs\n\n\nInput Voltage\n110V / 220V\n\n\nPower Consumption\nStandby: 5.7W / Power On: Start Warm-up (160W), State Lock (58W)",
        "featured": false,
        "images": [
            "/images/products/mc20-0.webp",
            "/images/products/mc20-1.webp",
            "/images/products/mc20-2.webp",
            "/images/products/mc20-3.webp",
            "/images/products/mc20-4.webp",
            "/images/products/mc20-5.webp",
            "/images/products/mc20-6.webp",
            "/images/products/mc20-7.webp",
            "/images/products/mc20-8.webp",
            "/images/products/mc20-9.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "mc10",
        "slug": "mc10",
        "name": "MC10",
        "brand": "Aurender",
        "price": 1799000,
        "category": "music-streamers",
        "shortDescription": "Reference Grade Rubidium-Based 10MHz Master Clock Generator",
        "longDescription": "Precision Time-Keeping, Without Complication\n\n\n\n\nWith MC10, Aurender is proud to introduce a master clock solution that retains the primary performance benefit of MC20, and brings exceptional value to the market. In fact, MC10 delivers exactly the same essential performance and benefits as its predecessor but at a much more accessible price point. Aurender has achieved this by removing the dual OCXO word clock modules and associated interface technology, which only work effectively with an extremely limited number of DACs (dCS). In retaining the rubidium-module-based 10MHz master clock generator, power supply structure, and vibration mitigation, MC10 retains 100% of the applicable performance benefits of MC20 in the vast majority of product-pairing scenarios.\n\nMC10 features 4 x 10 MHz master clock outputs, including 2 x 75Ω and 2 x 50Ω. This configuration of outputs pairs well with select DACs, word clocks, and Aurender models with a clock input (N20, N30SA, W20/SE, and AP20). Connecting a clock signal output from MC10 to your Aurender alone can significantly improve the performance of the already ultra-low-jitter digital audio output. Experience the soundstage snap into focus, creating a clear and distinct image of a piano-shaped object, instead of hearing stray notes leaping out from discrete speaker drivers.\n\nElevate your digital audio experience to the pinnacle of performance by simultaneously connecting one of MC10’s outputs to a compatible DAC (Esoteric, CH Precision), or word clock (dCS Vivaldi) that accepts 10MHz master clock input.\n\n\n\n\nSpecifications\n\n\n\n\n\n\n\n\n10MHz Master Clock Output\nRubidium Master Clock: 10MHz 2ea. (75Ω), 2ea. (50Ω), 0.7Vrms (±10%)\n\n\nPhase Noise(Rubidium)\n&lt; -130dBc / Hz (10 Hz)\n&lt; -140dBc / Hz (100 Hz)\n\n\nFreq. Short-term Stability (Rubidium)\n&lt;2×10⁻¹¹ (1 s)\n&lt;1×10⁻¹¹ (10 s)\n&lt;2×10⁻¹² (100 s)\n\n\nPhase Noise\n&lt; -130dB/Hz (10Hz)\n&lt; -140dB/Hz (100Hz)\n\n\nSize (WxHxD)\n430 x 87 x 370 mm\n16.9 x 3.4 x 14.6 inch\n\n\nWeight\n12.9kg, 28.4lbs\n\n\nInput Voltage\n110V / 220V\n\n\nPower Consumption\nStandby: 5.7W / Power On: Start Warm-up (95W Max), State Lock (30W Max)",
        "featured": false,
        "images": [
            "/images/products/mc10-0.jpg",
            "/images/products/mc10-1.webp",
            "/images/products/mc10-2.jpg",
            "/images/products/mc10-3.jpg",
            "/images/products/mc10-4.jpg",
            "/images/products/mc10-5.jpg",
            "/images/products/mc10-6.jpg",
            "/images/products/mc10-7.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "td100",
        "slug": "td100",
        "name": "TD100",
        "brand": "Aurender",
        "price": 40000,
        "category": "music-streamers",
        "shortDescription": "12V Trigger Dongle to turn other components On/Off with your Aurender",
        "longDescription": "Coordinated Liftoff & Landing\n\n\n\n\n\nTD100 provides an interface to send 12V trigger signal to compatible components with 12V trigger inputs for On/Off commands. Now you can turn your amps, preamp, DAC, or other components on and off with your Aurender.\n\nUSB data cable and 2 trigger cables are included. Any Aurender will automatically detect a connection with TD100, and settings can be configured in the Aurender Conductor app.\n\nAn Aurender source component is required for operation. TD100 does not work with Windows, Mac, or Linux PCs.\n\n\n\nSpecifications\n\n\n\n\n\n\n\n\nOutput\nDC12V (Max 100 mA / Port, +-10%)\n\n\nNumber of Ports\nTwo\n\n\nInput\nUSB 5V (Max 700 mA)\n\n\nDimension\n38 x 40 x 22 mm\n\n\nWeight\n60 g\n\n\nSupplied Cables\n1 – 16 in. USB Cable 2 – 80 in. Trigger Cables",
        "featured": false,
        "images": [
            "/images/products/td100-0.webp",
            "/images/products/td100-1.webp",
            "/images/products/td100-2.webp",
            "/images/products/td100-3.webp",
            "/images/products/td100-4.webp",
            "/images/products/td100-5.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "ut100",
        "slug": "ut100",
        "name": "UT100",
        "brand": "Aurender",
        "price": 40000,
        "category": "music-streamers",
        "shortDescription": "Premium USB-to-Optical (Toslink) converter",
        "longDescription": "USB-to-Optical Conversion\n\n\n\n\n\nUT100 is a high-quality USB to Optical (Toslink) conversion interface. Connect a USB cable from your Aurender’s USB Audio output, and UT00 will convert the signal to Optical/Toslink output.\n\nThe maximum input/output signal type is 24-bit/192kHz. UT00 is compatible with Aurender models N150, N200, ACS10, ACS100, A200, A15, A20 and A30. It is for use with Aurender only and not compatible with other USB devices.\n\n\n\n\n\n\nSpecifications\n\n\n\n\n\n\n\n\nDimension\n55 x 45 x 25 mm / 2.16 x 1.77 x 0.98 in\n\n\nWeight\n​​100g / 0.22lbs\n\n\nInput\nHigh-Speed USB 2.0 / USB Audio Class 2.0\n\n\nOutput\nSPDIF (OPTICAL)\n\n\nSupported Word Lengths\nup to 24-bit\n\n\nSupported Sampling Rates\nup to 192 kHz\n\n\nSupported DSD\nDSD64 supported with DoP\n\n\nPower\nUSB VBUS 5V/150mA",
        "featured": false,
        "images": [
            "/images/products/ut100-0.webp",
            "/images/products/ut100-1.webp",
            "/images/products/ut100-2.webp",
            "/images/products/ut100-3.webp",
            "/images/products/ut100-4.webp",
            "/images/products/ut100-5.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "uc100",
        "slug": "uc100",
        "name": "UC100",
        "brand": "Aurender",
        "price": 79000,
        "category": "music-streamers",
        "shortDescription": "Premium USB-to-SPDIF (RCA Coax) Converter",
        "longDescription": "USB-to-SPDIF Conversion\n\n\n\n\n\nUC100 is a high-quality USB to SPDIF conversion interface. Connect a USB cable from your Aurender’s USB Audio output, and UC100 will convert the signal to SPDIF with a coaxial RCA output.\n\nThe maximum input/output signal type is 24-bit/192kHz. UC100 is compatible with Aurender models N150, ACS10, ACS100, A200, A15, A20 and A30. It is for use with Aurender only and not compatible with other USB devices.\n\n\n\nSpecifications\n\n\n\n\n\n\n\n\nDimension\n145 x 30 x 54 mm / 5.7 x 1.18 x 2.12 in\n\n\nWeight\n​280 g / 0.62 lb\n\n\nInput\n​High-Speed USB 2.0, USB Audio Class 2.0\n\n\nOutput\nSPDIF (Coaxial RCA 75 Ohms)\n\n\nSupported Word Lengths\nup to 24-bit\n\n\nSupported Sampling Rates\nup to 192 kHz\n\n\nSupported DSD\n​DSD64 supported with DoP\n\n\nPower\nUSB VBUS 5 V/200 mA",
        "featured": false,
        "images": [
            "/images/products/uc100-0.jpg",
            "/images/products/uc100-1.jpg",
            "/images/products/uc100-2.jpg",
            "/images/products/uc100-3.webp",
            "/images/products/uc100-4.webp",
            "/images/products/uc100-5.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Aurender"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "lumin-t3",
        "slug": "lumin-t3",
        "name": "LUMIN T3",
        "brand": "Lumin",
        "price": 426000,
        "category": "music-streamers",
        "shortDescription": "LUMIN T3 combines X1 technology, solid CNC-panel construction and the latest processing system to sit squarely in the performance sweet spot.",
        "longDescription": "Main features\n\n \t• Features our all-new processing system\n\n \t• Increased capacity for future updates\n\n \t• Faster processor provides greater resampling flexibility\n\n \t• New surface finish taken from the high-end P1\n\n \t• Dual ES9028Pro SABRE DAC featuring dual-mono operation\n\n \t• Upsampling and downsampling to every supported format up to DSD256/PCM384\n\n \t• USB digital audio output\n\n \t• Leedh Processing Volume control\n\n \t• Roon Ready, Spotify Connect, MQA, TIDAL, TIDAL Connect, Qobuz, TuneIn and AirPlay-compatible\n\n \t• Precision analogue output stage\n\n \t• Analogue buffer includes LUMIN X1 technology\n\n \t• Dual-mono circuitry throughout\n\n \t• Ultra-low-noise and high dynamic range\nAll-new processing system\n\n \t• Completely new hardware and software provide a new foundation for LUMIN\n\n \t• Increased processing power and storage capacity provide greater resampling flexibility and future-proofing.\n\n \t• \nSpecification\n\n\nT3 Specification\n\n\n\n \t• \nDSD Support:\n\n \t• Up to DSD512 22.6MHz, 1-bit\n\n\n\n\n \t• \nPCM Support:\n\n \t• Up to 384kHz, 16–32-bit, Stereo\n\n\n\n\n \t• \nAnalog Output Stage:\n\n \t• Dual ESS SABRE32 ES9028Pro DAC chips\n\n \t• Fully balanced layout with high-quality components\n\n \t• Completely redesigned analogue buffer includes audiograde output capacitor and ultra-low-noise and high dynamic range\n\n \t• Discreet clock system for precision timing\n\n \t• Precision 32-bit internal digital volume\n\n\n\n\n \t• \nUpsampling rates & bit depths:\n\n \t• DSD256 upsampling option for all files\n\n \t• PCM 384kHz upsampling option for all files\n\n\n\n\n \t• \nDigital Output Stage:\n\n \t• \nUSB:\n\n \t• Native DSD512 support\n\n \t• PCM 44.1–384kHz, 16–32-bit, Stereo\n\n\n\n\n \t• \nBNC SPDIF:\n\n \t• PCM 44.1kHz–192kHz, 16–24-bit\n\n \t• DSD (DoP, DSD over PCM) 2.8MHz, 1-bit\n\n\n\n\n\n\n\n \t• \nPower Supply:\n\n \t• Internal 100–240V AC auto-ranging\n\n \t• Low-noise\n\n \t• Shielded power supply compartment for reduced interference with delicate electronics\n\n\n\n\n \t• \nPhysical:\n\n \t• \nFinish:\n\n \t• Black anodised aluminium\n\n \t• Raw anodised aluminium\n\n\nDimensions\n\n \t• 350mm (W), 350mm (D), 60.5mm (H), 6kg\n\n\n\n\n\n\n\n\n\n\nSpecification for all LUMIN music streamers\n\n\n\n \t• \nStreaming Protocol:\n\n \t• UPnP AV protocol with audio streaming extension (OpenHome)\n\n \t• Roon Ready\n\n \t• TIDAL Connect\n\n \t• Spotify Connect\n\n \t• Plāys with Audirvāna\n\n \t• AirPlay-compatible\n\n \t• QPlay-compatible for QQMusic\n\n \t• Gapless Playback\n\n \t• On-Device Playlist\n\n\n\n\n \t• \nApp Features:\n\n \t• Native support for TIDAL, MQA, Qobuz, KKBox and TuneIn Radio.\n\n \t• Tidal MAX and MQA icons to identify high-res music\n\n \t• Qobuz high-res icons to identify high-res music\n\n \t• Volume control\n\n \t• High-resolution artwork\n\n \t• Artwork caching\n\n \t• Search\n\n \t• Multiple tag handling\n\n \t• Composer tag support\n\n \t• Album-grouping in playlist\n\n \t• Automatic internet links to artists/album/songs\n\n \t• Saving and restoring of playlists (including Tidal and Qobuz)\n\n\n\n\n \t• \nSupported Audio File Formats:\n\n \t• DSD Lossless: DSF (DSD), DIFF (DSD), DoP (DSD)\n\n \t• PCM Lossless: FLAC, Apple Lossless (ALAC), WAV, AIFF\n\n \t• Compressed (lossy) Audio: MP3\n\n \t• MQA\n\n\n\n\n\n\n \t• \nInput:\n\n \t• Ethernet RJ45 network 1000Base-T\n\n \t• USB storage, flash drive, USB hard disk (Single-partition FAT32, exFAT and NTFS only)\n\n\n\n\n \t• \nAnalogue Audio Outputs:\n\n \t• XLR balanced, 6Vrms, pin 2 Hot\n\n \t• RCA unbalanced, 3Vrms\n\n\n\n\n \t• \nSupported Control Devices:\n\n \t• Apple devices. iOS 11.0 or later (List of supported devices)\n\n \t• Android devices. Android 4.0 (Ice Cream Sandwich) or later required\n\n \t• Apple Silicon. macOS 11 or later. (Download the iOS App from the iOS App Store)\n\n \t• Chromebook. Google Play Store required.\n\n\n\n\n \t• \nOther:\n\n \t• Leedh Processing lossless digital volume control\n\n \t• Programme of Continuous Development – Firmware-upgradable for further",
        "featured": false,
        "images": [
            "/images/products/lumin-t3-0.jpg",
            "/images/products/lumin-t3-1.jpg",
            "/images/products/lumin-t3-2.jpg",
            "/images/products/lumin-t3-3.jpg",
            "/images/products/lumin-t3-4.jpg",
            "/images/products/lumin-t3-5.jpg",
            "/images/products/lumin-t3-6.jpg",
            "/images/products/lumin-t3-7.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "lumin-d2",
        "slug": "lumin-d2",
        "name": "LUMIN D2",
        "brand": "Lumin",
        "price": 199000,
        "category": "music-streamers",
        "shortDescription": "Compact\ncase\nDSD128\n5.6MHz\nWolfson\nWM8741 DAC\nFully\nbalanced\nXLR\nOutputs\nInternal\nPower Supply",
        "longDescription": "Specification\n\n\nD2 Specification\n\n\n\n \t• \nDSD Support:\n\n \t• Up to DSD128 5.6MHz, 1-bit\n\n\n\n\n \t• \nPCM Support:\n\n \t• Up to 384kHz, 16–32bit, Stereo\n\n\n\n\n \t• \nUpsampling rates & bit depths:\n\n \t• DSD upsampling option for all files up to 96kHz\n\n \t• PCM 192kHz upsampling option for all files up to 96kHz\n\n\n\n\n \t• \nAnalog Output Stage:\n\n \t• Wolfson WM8741 DAC chips, 1 chip per channel\n\n \t• Fully balanced layout with high-quality components\n\n\n\n\n \t• \nDigital Output Stage:\n\n \t• \nBNC SPDIF:\n\n \t• PCM 44.1kHz–192kHz, 16–24-bit\n\n \t• DSD (DoP, DSD over PCM) 2.8MHz, 1-bit\n\n\n\n\n\n\n\n \t• \nPower Supply:\n\n \t• Internal 100–240V AC auto-ranging\n\n\n\n\n \t• \nPhysical:\n\n \t• \nFinish:\n\n \t• Raw brushed aluminium or black anodised brushed aluminium\n\n\nD2 unit:\n\n \t• 300mm (W), 244mm (D), 60mm (H), 2.5kg\n\n\n\n\n \t• \nPackaging:\n\n \t• 470mm (W), 340mm (D), 170mm (H), 4.5kg\n\n\n\n\n\n\n\n\n\n\nSpecification for all LUMIN music streamers\n\n\n\n \t• \nStreaming Protocol:\n\n \t• UPnP AV protocol with audio streaming extension (OpenHome)\n\n \t• Roon Ready\n\n \t• Spotify Connect\n\n \t• Plāys with Audirvāna\n\n \t• AirPlay-compatible\n\n \t• QPlay-compatible for QQMusic\n\n \t• Gapless Playback\n\n \t• On-Device Playlist\n\n\n\n\n \t• \nApp Features:\n\n \t• Native support for TIDAL, MQA, Qobuz and TuneIn Radio.\n\n \t• Tidal MAX and MQA icons to identify high-res music\n\n \t• Qobuz high-res icons to identify high-res music\n\n \t• Volume control\n\n \t• High-resolution artwork\n\n \t• Artwork caching\n\n \t• Search\n\n \t• Multiple tag handling\n\n \t• Composer tag support\n\n \t• Album-grouping in playlist\n\n \t• Automatic internet links to artists/album/songs\n\n \t• Saving and restoring of playlists (including Tidal and Qobuz)\n\n\n\n\n \t• \nSupported Audio File Formats:\n\n \t• DSD Lossless: DSF (DSD), DIFF (DSD), DoP (DSD)\n\n \t• PCM Lossless: FLAC, Apple Lossless (ALAC), WAV, AIFF\n\n \t• Compressed (lossy) Audio: MP3\n\n \t• MQA\n\n\n\n\n\n\n \t• \nInput:\n\n \t• Ethernet RJ45 network 1000Base-T\n\n \t• USB storage, flash drive, USB hard disk (Single-partition FAT32, exFAT and NTFS only)\n\n\n\n\n \t• \nAnalogue Audio Outputs:\n\n \t• XLR balanced, 4Vrms, pin 2 Hot\n\n \t• RCA unbalanced, 2Vrms\n\n\n\n\n \t• \nSupported Control Devices:\n\n \t• Apple devices. iOS 11.0 or later (List of supported devices)\n\n \t• Android devices. Android 4.0 (Ice Cream Sandwich) or later required\n\n \t• Apple Silicon. macOS 11 or later. (Download the iOS App from the iOS App Store)\n\n \t• Chromebook. Google Play Store required.\n\n\n\n\n \t• \nOther:\n\n \t• Leedh Processing lossless digital volume control\n\n \t• Programme of Continuous Development – Firmware-upgradable for further features and enhancements",
        "featured": false,
        "images": [
            "/images/products/lumin-d2-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "upgraded-power-supply",
        "slug": "upgraded-power-supply",
        "name": "Upgraded Power Supply",
        "brand": "Lumin",
        "price": 226000,
        "category": "music-streamers",
        "shortDescription": "The X1 power supply is now available separately as an upgrade for S1 / A1 / T1 / U1 owners",
        "longDescription": "Why upgrade\n\n\n\nOur flagship PSU is now available to a wider audience. Whether you partner it with S1, A1, T1 or U1, not only will you benefit from its sleeker finish and heavyweight solid-billet construction, owners are reporting improvements to every aspect of their favourite music.\n\n\n\n\n\n\n\nThe perfect upgrade for your LUMIN\n\n \t• Solid billet construction using all the same techniques as your main chassis\n\n \t• Thick aluminium walls provide even more shielding\n\n \t• Available in anodised black and raw silver\n\n \t• Supplied with a custom cable for S1 / A1 / T1 / U1 compatibility\n\n \t• Separate digital and analogue circuitry\n\n \t• Low-noise Linear Regulator\n\n \t• The highest quality components used throughout\n\n \t• \nSpecification\n\n\nLUMIN X1 PSU Upgrade Specification\n\n\n\n \t• \nPhysical:\n\n \t• \nFinish:\n\n \t• Raw brushed aluminium or black anodised brushed aluminium\n\n\n\n\n \t• \nDimensions:\n\n \t• 106mm (W), 334mm (D), 60mm (H), 4kg\n\n\n\n\n \t• \nCable length:\n\n \t• PSU to LUMIN DC Umbilical Cord: 1.5m\n\n\n\n\n\n\n\n\n\n \t• \nCompatibility:\n\n \t• LUMIN S1 / A1 / T1 / U1\n\n\n\n\n \t• \nPower:\n\n \t• 110V - 120V AC 50/60HZ 0.2A\n\n \t• or\n\n \t• 220V - 240V AC 50/60HZ 0.2A",
        "featured": false,
        "images": [
            "/images/products/upgraded-power-supply-0.jpg",
            "/images/products/upgraded-power-supply-1.jpg",
            "/images/products/upgraded-power-supply-2.jpg",
            "/images/products/upgraded-power-supply-3.jpg",
            "/images/products/upgraded-power-supply-4.jpg",
            "/images/products/upgraded-power-supply-5.jpg",
            "/images/products/upgraded-power-supply-6.jpg",
            "/images/products/upgraded-power-supply-7.jpg",
            "/images/products/upgraded-power-supply-8.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "lumin-remote",
        "slug": "lumin-remote",
        "name": "LUMIN REMOTE",
        "brand": "Lumin",
        "price": 29000,
        "category": "music-streamers",
        "shortDescription": "After launching Leedh Processing for all LUMIN models, we were inundated with requests for a physical volume control from customers who were removing the preamplifier from their systems.\n\nThe result of our development is an Infrared Control Package compatible with all LUMIN models regardless of whether Leedh Processing is being used or not.",
        "longDescription": "Precise tactile volume control and more...\n\n \t• Exceptional quality remote and IR sensor\n\n \t• Compatible with all LUMIN models*\n\n \t• No need to use the App for volume up / volume down / mute / play / pause / next / previous / shuffle / repeat or standby\n\n \t• Roon compatible\n\n \t• Particularly useful in systems without a preamplifier\n\n\n* A spare rear panel USB port is required\n\n\n\n\n\n\n\n\n\nExceptional engineering\n\n \t• Made in Austria\n\n \t• Heavyweight solid zinc metal body\n\n \t• Crisp acrylic top, bottom and buttons\n\n\nSpecification\n\n\nLUMIN Infrared Control Package\n\n\n\n \t• \nPackage contents:\n\n \t• LUMIN Infrared Remote Control\n\n \t• USB Infrared Receiver\n\n \t• 2x CR2032 batteries\n\n \t• Instruction leaflet\n\n\nPhysical:\n\n \t• \nFinish:\n\n \t• Piano black acrylic with silver zinc frame\n\n\n\n\n \t• \nRemote Dimensions:\n\n \t• 230mm (L), 33mm (W), 10mm(D)\n\n\n\n\n \t• \nCable length:\n\n \t• IR receiver cable length: Approx 900mm\n\n\n\n\n\n\n\n \t• \nCompatibility:\n\n \t• LUMIN X1 / S1 / T3 / T2 / A1 / T1 / D3/ D2 / D1 / U2 / U1 / U1X / U2 MINI / U1 MINI / M1\n\n \t• One spare USB port required\n\n \t• Note that LUMIN P1 includes a built-in infra red receiver and remote control, so this package is not required.\n\n\n\n\n\n* Please see future LUMIN firmware and App update notes to see if these buttons change",
        "featured": false,
        "images": [
            "/images/products/lumin-remote-0.jpg",
            "/images/products/lumin-remote-1.jpg",
            "/images/products/lumin-remote-2.jpg",
            "/images/products/lumin-remote-3.jpg",
            "/images/products/lumin-remote-4.jpg",
            "/images/products/lumin-remote-5.jpg",
            "/images/products/lumin-remote-6.jpg",
            "/images/products/lumin-remote-7.jpg",
            "/images/products/lumin-remote-8.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "lumin-l2",
        "slug": "lumin-l2",
        "name": "LUMIN L2",
        "brand": "Lumin",
        "price": 285000,
        "category": "music-streamers",
        "shortDescription": "An advanced dual-drive music server requiring zero setup configuration and containing a 4-port audiophile-grade network switch.",
        "longDescription": "Why LUMIN L2\n\n\n\nThe perfect partner for LUMIN owners who wish to store their own music collection!\n\nThe effortless operation of LUMIN L2 belies its advanced features and unrivalled flexibility.\n\nWith a 4-port audiophile-grade network switch on board, its two optical fibre SFP ports and two RJ45 copper ports L2 can streamline and enhance your network!\n\n\n\n\n\n\n\nThe ideal partner\n\n \t• Available without drives or with 4TB or 8TB capacity\n\n \t• Zero configuration required\n\n \t• Automatically serves all added music\n\n \t• Fibre Network provides complete isolation from network noise\n\n \t• 4-port network switch simplifies cabling and makes fibre easy\n\n \t• UPnP (Openhome) compatible\n\n \t• USB 3.0 Micro type B for connection to computer\n\n \t• SMB support for transferring over the network\n\n \t• Gigabit Ethernet\n\n \t• Thick-panelled CNC Aluminium construction\n\n\n\n\n\n\n\n\n\n\n\n\nUPnP Openhome music server\nZero configuration\nSimply add music to LUMIN L2 via USB or over the network and it all gets served automatically. No complex installation or setup steps.\nLUMIN server software\nOur bespoke server software is specifically designed for the demands of LUMIN owners - featuring rock-solid stability, rich tag support and, of course, high resolution PCM/DSD support.\nBuild quality\nSilent, vibration-free design offers the same thick shielded CNC chassis construction as our high-end P1 music player. Available in the same black and silver finishes, LUMIN L2 is the perfect accompaniment.\n\n\n\n\n\n\n\n\n\nAudiophile-grade network switch\n4 ports\nWith 4 network ports LUMIN L2 can simplify your wiring and remove the need for cheap (and electrically noisy) switches around your hi-fi.\nFibre networking\n2x SFP ports allow optical fibre networking input and output, completely electrically isolating your hi-fi from the rest of your network.\nLow-noise design\nShielded, low-noise power supply, thick and rigid CNC aluminium chassis, and spacious layout all help provide untouched data to your network player.\nSpecification\n\n\nLUMIN L2 Specification\n\n\n\n \t• \nInternal Storage:\n\n \t• No drives, 4TB (2x 2TB) or 8TB (2x 4TB) 2.5\" SSD\n\n\n\n\n \t• \nSupported Audio File Formats:\n\n \t• \nDSD Lossless:\n\n \t• DSF (DSD), DIFF (DSD), DoP (DSD)\n\n\n\n\n \t• \nPCM Lossless:\n\n \t• FLAC, Apple Lossless (ALAC), WAV, AIFF\n\n\n\n\n \t• \nCompressed (lossy) Audio:\n\n \t• MP3\n\n\n\n\n\n\n\n\n\n \t• \nConnections:\n\n \t• USB 3.0 Micro Type B Slave for connection to computer*\n\n \t• 2x Gigabit Ethernet Network (1000BASE-T) RJ45\n\n \t• 2x Industry-standard Gigabit SFP\n\n \t• 2x USB 3.0 Type A reserved for future use\n\n\n\n\n \t• \nPower Supply:\n\n \t• Internal 100–240V AC auto-ranging\n\n \t• Low-noise\n\n \t• Shielded power supply compartment for reduced interference with delicate electronics\n\n\n\n\n \t• \nPhysical:\n\n \t• \nFinish:\n\n \t• Black anodised aluminium\n\n \t• Raw anodised aluminium\n\n\nDimensions\n\n \t• 350mm (W), 350mm (D), 60.5mm (H), 6kg\n\n\n\n\n\n\n\n\n\n \t• *USB connection requires a computer with a USB 3.0 port\n\n \t• Note: The 8TB HDD version uses NTFS format for the internal HDD. On a Mac computer, additional software may be needed to access NTFS formatted HDD.",
        "featured": false,
        "images": [
            "/images/products/lumin-l2-0.jpg",
            "/images/products/lumin-l2-1.jpg",
            "/images/products/lumin-l2-2.jpg",
            "/images/products/lumin-l2-3.jpg",
            "/images/products/lumin-l2-4.jpg",
            "/images/products/lumin-l2-5.jpg",
            "/images/products/lumin-l2-6.jpg",
            "/images/products/lumin-l2-7.jpg",
            "/images/products/lumin-l2-8.jpg",
            "/images/products/lumin-l2-9.jpg",
            "/images/products/lumin-l2-10.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "ra280-integrated-amplifier",
        "slug": "ra280-integrated-amplifier",
        "name": "RA280 Integrated Amplifier",
        "brand": "Hifi Rose",
        "price": 391000,
        "category": "tube-amplifiers",
        "shortDescription": "The HiFi Rose RA280 is a more streamlined version of its flagship sibling, the RA180, yet it retains the high performance and advanced technology that HiFi Rose is known for. With GaN FETs for superior sound quality and a simplified but elegant design, the RA280 is an outstanding choice for audiophiles looking for premium sound without unnecessary complexity",
        "longDescription": "RA280 At A Glance\n\n \tStereo integrated amp with balanced and phono inputs.\n\n \tAdvanced Class D amplification with GaN FETs for smooth, accurate sound.\n\n \t250 watts x 2 into 8 ohms; 250 watts x 2 into 4 ohms.\n\n \tTreble and bass controls.\n\n \tTone control bypass switch.\n\n \tIlluminated analog level meters (3-level dimmer for front-panel illumination).\n\n \tAnalog stereo RCA phono input for moving magnet cartridges.\n\n \t3 line-level analog stereo RCA inputs.\n\n \tMono RCA output for connecting a powered subwoofer.\n\n\n\n\n\n\n\n\nProduct Description\n\n\n\nThe HiFi Rose RA280 Integrated Amplifier exemplifies the seamless blend of advanced technology and elegant design, crafted to deliver an unparalleled audio experience. Building on the legacy of its predecessor, the RA180, this new model integrates the revolutionary Advanced Class D amplification technology to offer both high efficiency and superior sound quality.\n\nInnovative Advanced Class D Technology\n\nHiFi Rose redefines digital amplification with the RA280’s Advanced Class D technology, featuring next-generation GaN (gallium nitride) FETs. This breakthrough innovation surpasses traditional Class D amplifiers, delivering sound quality comparable to analog while maintaining superior efficiency and power. The RA280 achieves near-perfect linear output with minimal distortion, ensuring smooth, natural sound reproduction. Covering a wide frequency range from 20 Hz to 100 kHz, the RA280 faithfully renders every audio detail, creating a truly immersive and realistic listening experience.\n\n&nbsp;\n\n&nbsp;\n\nSuperior Mono Amplifier Design with Advanced Filtering\n\nThe RA280 stands out with its two completely separated mono amplifier modules, each delivering 250 W (4 Ω and 8 Ω) to the left and right channels, for a total of 500 W in stereo mode. HiFi Rose’s advanced two-stage analog filter technology ensures top-tier sound quality. The LC filter provides exceptional frequency response, with -1 dB attenuation up to 65 kHz and -3 dB up to 85 kHz, effectively reducing carrier noise from Class D amplifiers. This results in pristine, detailed sound, enhanced spatial resolution, and a natural analog feel.\n\n&nbsp;\n\n&nbsp;\n\nPrecision Phono Amplifier for Moving Magnet Cartridges\n\nElevate your vinyl listening experience with the RA280’s precision phono amplifier, designed for moving magnet cartridges. This high-performance amplifier, activated via a simple switch, amplifies delicate audio signals without distortion. HiFi Rose’s high-precision compensation circuitry delivers sound that is remarkably close to the original recording. This ensures rich, vivid detail and superior sound quality, providing an immersive and high-fidelity music playback experience that brings your records to life.\n\n&nbsp;\n\nCutting-Edge Power Supply for Unmatched Performance\n\nHiFi Rose’s RA280 features a state-of-the-art power supply, utilizing silicon carbide FETs for superior efficiency and reduced heat compared to traditional silicon FETs. This innovative design ensures optimal power delivery and stability. The inclusion of a 2.5 power factor correction circuit and a high-capacity condenser maintains excellent performance even under rapid load changes, ensuring consistent and high-quality sound. The fourth-generation Silicon Carbide (SiC) FET technology enhances power output while minimizing heat, supporting deep bass and precise treble tones for powerful and accurate audio reproduction.\n\nSpecifications\n\n\n\n\n\n\nDesign\n\n\n\nSize:\n16.9” W x 13.98” D x 4.06” H\n\n\nWeight:\n20.94 lbs\n\n\nBody:\nSolid Aluminum, Rust-proof Steel\n\n\nAmplifier Output\n\n\n\nFTC Power Output Rating (RMS):\n250W x 2ch (8Ω, 20Hz-20kHz, THD 0.07%)\n\n\nFrequency Range:\n10Hz~80kHz (8Ω, 1W)\n\n\nLoad Impedance:\n8Ω\n\n\nSub Woofer Output\n\n\n\nMono:\n1Wrms (2.218 dBu)\n\n\nBalance Input:\n600mV (≈ 250W x 2ch)\n\n\nInput Sensitivity\n\n\n\nUnbalance(Line1,2,3) Input:\n600mV (≈ 250W x 2ch)\n\n\nPhono(MM) Input:\n5mV (≈ 250W x 2ch)\n\n\nInput Impedance\n\n\n\nUnbalance(Line1,2,3) Input:\n47kΩ\n\n\nPhono(MM) Input:\n\n\n\nBandwidth\n\n\n\n20Hz ~ 20kHz:\n+0, 0dB (≈ 250W x 2ch, 8Ω Speaker Output)\n\n\n10Hz ~ 66kHz:\n+0, -1dB (≈ 250W x 2ch, 8Ω Speaker Output)\n\n\n10Hz ~ 85kHz:\n+0, -3dB (≈ 250W x 2ch, 8Ω Speaker Output)\n\n\n20Hz ~ 20kHz:\n+0, 0dB (≈ 1W x 2ch, 8Ω Speaker Output)\n\n\n10Hz ~ 66kHz:\n+0, -1dB (≈ 1W x 2ch, 8Ω Speaker Output)\n\n\n10Hz ~ 85kHz:\n+0, -3dB (≈ 1W x 2ch, 8Ω Speaker Output)\n\n\nTHD (Total Harmonic Distortion)\n\n\n\nBalance & Unbalance(Line1,2,3) Input:\n0.05% (8Ω, 1W to 250W, 1kHz)\n\n\nDamping Factor\n\n\n\nSpeaker Output:\n&gt;250 (≈ 250W x 2ch)\n\n\nS/N (Signal to Noise Ratio)\n\n\n\nBalanced / Unbalanced / Phono(MM):\n109dB / 109dB / 85dB (≈ 250W x 2ch)\n\n\n\n\n\n\nOutput Impedance\n\n\n\nSpeaker Output:\n30mΩ (≈ 250W x 2ch)\n\n\nTone Control\n\n\n\nBass(100Hz) / Treble(10kHz):\n±15dB (≈ 1W x 2ch, Speaker Output)\n\n\nTurnover:\n500Hz (+13dB@100Hz) (≈ RIAA)\n\n\nPhono(MM)\n\n\n\nRoll-off:\n2.1kHz (-13.74dB@10kHz) (≈ RIAA)\n\n\nPower\n\n\n\nOutput Power:\n500W (SMPS) (+ Maximum Output: 600W)\n\n\nInput Voltage:\nAC100-240V, 50/60Hz (Standby Mode Power Consumption &lt; 0.5W)\n\n\nAudio In/Out on Rear\n\n\n\nTrigger In:\nVoltage can be turned on 3.3V~ 12V\n\n\nTrigger Out:\nVoltage can be turned on 12V\n\n\nRemote Control\n\n\n\nIR Input:\n38kHz Infrared Ray (Within 10m of Operating Distance)",
        "featured": false,
        "images": [
            "/images/products/ra280-integrated-amplifier-0.webp",
            "/images/products/ra280-integrated-amplifier-1.webp",
            "/images/products/ra280-integrated-amplifier-2.webp",
            "/images/products/ra280-integrated-amplifier-3.webp",
            "/images/products/ra280-integrated-amplifier-4.webp",
            "/images/products/ra280-integrated-amplifier-5.webp",
            "/images/products/ra280-integrated-amplifier-6.webp",
            "/images/products/ra280-integrated-amplifier-7.webp",
            "/images/products/ra280-integrated-amplifier-8.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "rs130-network-transport",
        "slug": "rs130-network-transport",
        "name": "RS130 Network Transport",
        "brand": "Hifi Rose",
        "price": 616000,
        "category": "music-streamers",
        "shortDescription": "• Vibrant 15.4\" TFT LCD & Capacitive Touch Screen Display (eDP).\n\n \t• Supports Airplay, DLNA, Roon Ready, Spotify Connect, TIDAL, Qobuz, Apple Music, Bugs, ROSE Tube, and Internet Radio.\n\n \t• Digital noise blocking with Fiber Optic Ethernet & USB.\n\n \t• High-precision OCXO clock for accurate timing.\n\n \t• Premium aluminum case with minimal vibration design.\n\n \t• Intuitive app control with ROSE Connect (Android, iOS, PC)\n\n \t• External master clock input for perfect device synchronization.\n\n \t• SSD music caching for stable playback & reduced delay errors.",
        "longDescription": "Product Description\n\n\nUncompromised Audio Purity\n\nWith a focus on delivering pristine sound, the RS130 is engineered to eliminate digital noise and ensure stable output. Its support for Fiber Optic Ethernet and Fiber Optic USB effectively blocks unwanted noise sources, allowing you to indulge in pure audio bliss. The built-in high-precision OCXO clock guarantees precise timing, maintaining a constant temperature for stable and accurate clock signals.\n\n&nbsp;\n\nSophisticated Aesthetics and Engineered for Perfection\n\nDesigned to captivate audiophiles both audibly and visually, the RS130 boasts exquisite crystal buttons that exude class and elegance. Complemented by a novel symbol logo-inspired ventilation hole, the RS130 ensures efficient heat dissipation while adding a touch of sophistication to your space.\n\n&nbsp;\n\nPure Power, Pure Sound\n\nFor the cleanest and most stable power supply, the RS130 employs a linear power stage powered by a high-capacity supercapacitor. This innovative approach reduces power supply noise to near battery levels, resulting in cleaner and more natural sound quality.\n\n&nbsp;\n\nUnleashing Precision\n\nxperience unrivaled precision with the high-precision OCXO. This cutting-edge clock source delivers an accurate and stable clock signal unaffected by temperature changes. Say goodbye to jitter in the audio signal, and embrace a more stable and precise audio performance.\n\n&nbsp;\n\nUnrivaled Noise Suppression\n\nThe RS130 leverages Fiber Optic Ethernet to completely isolate network digital noise. It effectively blocks physical noise sources, including various network equipment. Similarly, the Fiber Optic USB employs optical conversion to separate pure data from driving noise, ensuring only flawless sound reaches your DAC.\n\n&nbsp;\n\nSeamless Synchronization\n\nEmbrace perfect synchronization with the RS130's external master clock input. This intelligent feature ensures that audio data is output in sync with the master clock, eliminating jitter in connections between the audio source and the DAC for a harmonious performance..\n\n&nbsp;\n\nMusic, Cached for Perfection\n\nWith an applied SSD for music caching, the RS130 ensures stable playback by eliminating the effects of vibration and noise from traditional HDDs. Delight in seamless network streaming with minimized delay errors.\n\n&nbsp;\n\nOperate with Your Mobile Device or Remote Control\n\nThe Rose Connect remote control app completes the ultimate user experience letting allows users to conveniently control and manage HiFi Rose devices. The remote control app works on various platforms, including iPhone, iPad, Android phones, and PC. Additionally, you can control the device simply and easily using the provided Bluetooth remote control.\n\nSpecifications\n\n\n\n\n\n\nOperating System:\nCustomized Android 7.1\n\n\nDimensions:\n430(W) x 317(D) x 125(H) mm\n\n\nWeight:\n12kg\n\n\nDisplay:\n15.4\" TFT LCD & Capacitive Touch Screen (eDP)\n\n\nCPU:\nDual-Core Cortex-A72 and Quad-Core Cortex-A53 with separate NEON coprocessor\n\n\nGPU:\nARM Mali-T860 MP4 Quad-Core GPU\n\n\nMemory:\nLPDDR4 4GB\n\n\nCache Storage:\nNVMe SSD 256GB\n\n\nNetwork Connection\n\n\n\nNetwork:\nSFP Ethernet 10/100/1000 BASE-T(SFP COPPER Type)\n\n\nWiFi:\n802.11ac Dualband USB Wireless LAN Card (Dongle)\n\n\nBluetooth:\nV4.2 (USB Dongle)\n\n\nStreaming Playback\n\n\n\nSupported Streaming Platforms:\nAirplay, DLNA, Roon Ready, Spotify Connect, Bluetooth\n\n\nSupported Streaming Services:\nTIDAL, Qobuz, Apple Music, Bugs, ROSE Tube, Internet Radio, ROSE Podcast\n\n\nInput/Outputs\n\n\n\nAudio Output:\nOptical x 1, Coaxial x 1, AES/EBU OUT x1, HDMI 12S OUT x 1\n\n\nVideo Output:\nHDMI 2.0 x 1 (up to 3840 x 2160/60Hz)\n\n\nMedia Connections\n\n\n\nFile System:\nNTFS / exFAT/FAT32\n\n\nNetwork Protocol:\nSMBv2/FTP/WebDav\n\n\nStorage Interface:\nUSB3.0 x 2, SATA X 1, USB 3.0 Fiber\n\n\nClock Sync Input:\n5002 BNC x 1, 7502 BNC x 1 Inputable Frequency: 10MHz\n\n\nSupported Codec\n\n\n\nAudio:\nMQA, WAV, FLAC, AIFF, WMA, MP3, OGG, APE, DFF, DSF, AAC, CDA, AMR, APE, EC3, E-EC3, MID, MPL, MP2, MPC, MPGA, M4A, ALAC, PCM : 8kHz~768kHz(8/16/24/32bit per Sample), Native DSD: DSD64(2.8MHz)/ DSD128(5.6MHz)/DSD256(11.2MHz)/ DSD512(22.4MHz)\n\n\nVideo:\nASF, AVI, MKV, MP4, WMV, H.264/AVC, Base/Main/High/High10 profile @ level 5.1; up to 4Kx2K @ 30fps H.265/HEVC, Main/Main 10 profile @ level 5.1 High-tier; up to 4Kx2K @ 60fps VP9, profile 0, up to 4Kx2K @ 60fps MPEG-1, ISO/IEC 11172-2, up to 1080P @ 60fps MPEG-2, ISO/IEC 13818-2, SP@ML, MP@HL, up to 1080P @ 60fps MPEG-4, ISO/IEC 14496-2, SP@LO-3, ASP@LO-5, up to 1080P @ 60fps VC-1, SP@ML, MP@HL, AP@LO-3, up to 1080P @ 60fps\n\n\nPower\n\n\n\nInput Voltage:\nAC100-240V 50/60Hz\n\n\nCircuit Breaker:\n6A Thermal Circuit Breaker\n\n\nSoftware Update\n\n\n\nSW Update:\nSW update via internet, USB OTA, ROSE Store\n\n\nRemote Control\n\n\n\nApp:\nROSE Connect (Android, iOS, PC)\n\n\nPhysical:\nIR Remote Control, Bluetooth Remote Control\n\n\nAccessories\n\n\n\nIncluded Accessories:\nPower Cord x 1, Remote Controller x 1 (AAA Battery x 2), Manual x 1, SSD Screw x 4 SFP RJ45 COPPER TRANSCEIVER MODULE x 1, WiFi/BT Dongle x 1",
        "featured": false,
        "images": [
            "/images/products/rs130-network-transport-0.webp",
            "/images/products/rs130-network-transport-1.webp",
            "/images/products/rs130-network-transport-2.webp",
            "/images/products/rs130-network-transport-3.webp",
            "/images/products/rs130-network-transport-4.webp",
            "/images/products/rs130-network-transport-5.webp",
            "/images/products/rs130-network-transport-6.webp",
            "/images/products/rs130-network-transport-7.webp",
            "/images/products/rs130-network-transport-8.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "rd160",
        "slug": "rd160",
        "name": "RD160",
        "brand": "Hifi Rose",
        "price": 626000,
        "category": "music-streamers",
        "shortDescription": "Rose HiFi's RD160 is an aesthetically pleasing balanced DAC, based on a duo of AK4191 and AK4499EX chips per channel, capable of upsampling signals up to PCM 32bit 768kHz and DSD512. The brand's expertise ensures a design quality that leaves no detail to chance, having identified every source of noise and potential distortion to provide a suitable solution.",
        "longDescription": "HiFi's RD160 is an aesthetically pleasing balanced DAC, based on a duo of AK4191 and AK4499EX chips per channel, capable of upsampling signals up to PCM 32bit 768kHz and DSD512. The brand's expertise ensures a design quality that leaves no detail to chance, having identified every source of noise and potential distortion to provide a suitable solution.\n\n\n\nRose HiFi RD160: Refined aesthetics\nThe RD160's appearance perfectly blends cutting-edge technology with the most refined aesthetics. Its aluminum case is machined from a single block, and benefits from a design that reduces the number of joints to an absolute minimum, so as to minimize potential vibrations. Heat sinks have been placed on both sides, ensuring that the RD160 maintains a regulated temperature, even during prolonged use. Last but not least, the hidden display, harmoniously integrated into the front panel, offers a rendering of rare elegance.\n\n\n\nRose HiFi RD160: DPC module (Digital Processing Core)\nThe RD160's digital stage incorporates the Rose DPC™ module, designed to ensure that all processing blocks maintain the highest level of signal accuracy to deliver faithful, detailed sound reproduction. This module precisely synchronizes input digital signals in various ways to a high-precision OCXO clock, and aligns them to I2S signals. This process applies clock synchronization and locking to minimize jitter, particularly when processing high-resolution audio signals, for precise signal processing and therefore natural, transparent sound. The user interface and GUI configuration circuits, as well as the digital audio signal circuitry, are completely separated to effectively block distortion and interference. This design enables the RD160 to deliver high-fidelity sound with a high-quality digital signal and compatibility with a wide range of digital formats.\nRose HiFi RD160: 3 separate linear power supplies\nDeveloped specifically by HiFi ROSE, the RD160's linear power supply is designed to deliver the best sound quality. Based on an ultra-low-noise chipset, the power supply is designed to independently power digital input ports and analog output ports. This power supply effectively suppresses the noise that can occur in each circuit, such as digital processing, clock and analog output, minimizing mutual interference and crosstalk between the various stages. By providing a stable power supply tailored to the needs of each stage, it maintains signal integrity and increases the dynamic range and resolution of the DAC. It also reduces jitter and optimizes spatialization, delivering a wider, more accurate soundstage and clearer images.\n\nRose HiFi RD160: Adjustable output level\nThe maximum permissible input voltage for amplifiers varies according to manufacturer and model. If the output voltage of the source device exceeds this limit, clipping may occur, resulting in sound distortion. The RD160 offers a wide range of output level options, from 1V to 9V, guaranteeing clean, clipping-free sound and perfect compatibility with all amplifiers. By activating this function, you can adjust the level via the rotary knob, enabling you to connect the RD160 directly to a power amplifier without the need for a separate preamplifier.\n\n\n\nRose HiFi RD160: Upsampling and digital filter\nThe RD160 offers the possibility of increasing the sampling rate of your signal via several options (bypass, upscale to PCM, and upscale to DSD) and supports signals up to 32bit 768 kHz PCM and DSD512. In addition, six digital filters with different responses are available, allowing you to choose according to your listening preferences. Both functions can be easily adjusted using the buttons on the left-hand side of the front panel, and are displayed on the live screen.\n\n\n\nRose HiFi RD160: USB Optical & External clock inputs\nThe USB SFP with optical conversion function completely blocks the digital noise generated by the source device. The Rose RS130 (sold separately), ideally suited for use with the RD160, also supports the USB SFP connection and can transmit data to the RD160 perfectly cleanly and noise-free.\n\nThe RD160 also features inputs for 75Ω and 50Ω external clocks. By using the master clock, jitter caused by optical, coaxial, AES/EBU and USB connections from the source to the DAC is eliminated, while ensuring perfect synchronization of the devices.\n\n\n\nSpecifications\n\n\nProduct type\nVolume DAC\n\n\nDAC chips\n2x AK4499EXEQ\n2x AK4191EQ\n\n\nPower supply\n3x Independant toroidal transformer\n\n\nCPU\nRK3128 Quad Core Cortex-A7MP\n\n\nRAM mamory\n1GB 1866Mhz DDR3\n\n\nFlash memory\n8GB eMMc\n\n\nInternal clock\nOCXO clock\n\n\nInputs\n1x USB SFP\n1x USB-B 2.0\n1x HDMI I2S\n1x Coaxial RCA\n1x Coaxial BNC\n1x Optical Toslink\n1x AES/EBU\n\n\nOutputs\n1x Steroe XLR\n1x Stereo RCA\n\n\nSupported sampling rates\nUSB SFR / USB-B / HDMI I2S : PCM 32bit 768kHz / DSD512\nCoaxial RCA / Coaxial BNC / AES/EBU : PCM 32bit 384kHz / DSD128\nOptical Toslink : PCM 32bit 192kHz / DSD64\n\n\nExternal clock inputs\n1x BNC 75Ω (10MHz)\n1x SMA 50Ω (10MHz)\n\n\nOutput levels\n1V ~ 9V\n\n\nDigital filters\nSharp\nSharp Slow\nShort Sharp (default)\nShort Slow\nSuper Slow\nLow Short\n\n\nInput sensitivity\n0dBF 1kHz\n\n\nOutput impedance\n300Ω\n\n\nOutput voltage\nRCA : 4.5Vrms\nXLR : 9Vrms\n\n\nTHD\n0.005%\n\n\nSNR\n124dB\n\n\nResidual noise\nRCA : 0.3mV\nXLR : 0.4mV\n\n\nCrosstalk\n-124dB\n\n\nFrequency response\n10Hz - 20kHz (-0.3dB)\n10Hz - 50kHz (-1.5dB)\n10Hz - 73kHz (-3.0dB)\n\n\nOperating temperature\n0 ~ 40°C\n\n\nStorage temperature\n-10 ~ 50°C",
        "featured": false,
        "images": [
            "/images/products/rd160-0.jpg",
            "/images/products/rd160-1.jpg",
            "/images/products/rd160-2.jpg",
            "/images/products/rd160-3.jpg",
            "/images/products/rd160-4.jpg",
            "/images/products/rd160-5.jpg",
            "/images/products/rd160-6.jpg",
            "/images/products/rd160-7.jpg",
            "/images/products/rd160-8.jpg",
            "/images/products/rd160-9.jpg",
            "/images/products/rd160-10.jpg",
            "/images/products/rd160-11.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "amp-f10",
        "slug": "amp-f10",
        "name": "AMP-F10",
        "brand": "Eversolo",
        "price": 256000,
        "category": "tube-amplifiers",
        "shortDescription": "The Eversolo AMP-F10 delivers up to 950W in bridged mode and 320W per channel at 4 ohms, ensuring powerful performance across all volume levels. Whether you're enjoying stereo sound at home or experiencing the electrifying atmosphere of live music in a large space, the AMP-F10 delivers impressive power that draws you into an unparalleled soundstage.",
        "longDescription": "Dynamic and Detailed Representation\nThe AMP-F10 boasts an excellent signal-to-noise ratio of 113dB, ensuring that musical details are preserved from the quietest passages to the most dynamic peaks. From the elegance of classical to the intensity of rock, you’ll capture every nuance with impressive clarity and depth, making every genre come alive.\n\n\n\nAdvanced DC Filtering Circuit\nThe AMP-F10 employs an innovative DC filtering circuit between the main AC supply and audio circuit, effectively removing low-frequency DC interference. This design ensures that only clean AC power is delivered to the audio circuits, effectively enhancing the performance of the audio circuit while reducing the hum from the toroidal transformer.\n\n\n\nClear Sound Free of Interference\nBy eliminating DC interference from the AC supply, the AMP-F10’s overall performance is dramatically enhanced, delivering a pure audio experience.\n\n\n\n\nHigh-Fidelity Audio Processing\nThe AMP-F10 is equipped with advanced dual differential amplifiers, which are tailored for low-level audio signals. Its symmetrical circuit design and negative feedback technology minimize distortion, ensuring high-fidelity and high linear audio output. This design not only expands dynamic range but also effectively suppresses common-mode noise(such as power and environmental interference), keeping the output sound broad and natural at any volume levels.\n\n\n\n\n\n\nPowerful and Refined Bass\nWith a damping factor exceeding 600, the AMP-F10 ensures powerful, clear low-frequency performance. Whether delivering the intense impact of deep bass or capturing subtle low frequency details, it handles all effortlessly. From the punch of electronic music to the gentle whispers of jazz, it caters to a wide range of listening scenarios, empowering every note with emotion and passion.\n\n\n\nSuperior Sound Enduring Reliability\nDesigned with durability and stability in mind, the AMP-F10 features premium components and fine craftsmanship for long-term performance. Whether delivering intense volume or supporting extended playback, the AMP-F10 operates reliably, letting you enjoy the pleasures of music worry-free.",
        "featured": false,
        "images": [
            "/images/products/amp-f10-0.jpg",
            "/images/products/amp-f10-1.png",
            "/images/products/amp-f10-2.png",
            "/images/products/amp-f10-3.png",
            "/images/products/amp-f10-4.png",
            "/images/products/amp-f10-5.png",
            "/images/products/amp-f10-6.png",
            "/images/products/amp-f10-7.png",
            "/images/products/amp-f10-8.png",
            "/images/products/amp-f10-9.png",
            "/images/products/amp-f10-10.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Eversolo"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "amp-f2",
        "slug": "amp-f2",
        "name": "AMP-F2",
        "brand": "Eversolo",
        "price": 99000,
        "category": "tube-amplifiers",
        "shortDescription": "The AMP-F2, developed in collaboration between the Starke Sound team and the Eversolo team, is based on the innovative NS600 module created by the Starke Sound team. It boasts a high sampling rate of up to 600KHz. Simultaneously, it significantly reduces noise and enhances dynamic performance through the newly designed SAPS audio-specific switch power supply. It employs an efficient Class D amplification structure, cou- pled with optimized circuits to maximize audio quality. The AMP-F2 is bridgeable, allowing flexible configura- tion for 2-channel or mono-channel setups when needed.",
        "longDescription": "Eversolo AMP-F2 – 2 Channel Audio Power Amplifier\nDynamic Power\n\nDetailed Presentation\n\nThe AMP-F2, developed in collaboration between the Starke Sound team and the Eversolo team, is based on the innovative NS600 module created by the Starke Sound team. It boasts a high sampling rate of up to 600KHz. Simultaneously, it significantly reduces noise and enhances dynamic performance through the newly designed SAPS audio-specific switch power supply. It employs an efficient Class D amplification structure, cou- pled with optimized circuits to maximize audio quality. The AMP-F2 is bridgeable, allowing flexible configura- tion for 2-channel or mono-channel setups when needed.\n\nVigorous Output\n\nBridged Support\n\nThe AMP-F2 is equipped with Starke Sound’s NS600 amplifier module, each channel can output a con- stant 250W RMS (42) @ 1% THD+N. When bridged, it can support up to 450W RMS (29) with THD+N still below 1%. This ability to handle extremely low-impedance loads ensures ample energy even in large and challenging speaker setups, particularly during high-dynamic low-frequency outputs.\n\nAccurate Sound\n\nPerfect Experience\n\nThe NS600 module employs PurePathTM Ultra-HD technology and advanced integrated feedback design, fea- turing high-speed gate driver error correction functions. This technology achieves ultra-low distortion across the entire audio frequency range, delivering perfect high-end audio quality.\n\nPowerful Power Drive\n\nUtilizing a 600W high-efficiency, low-ripple, low-EMI switch power supply, it delivers consistent and powerful output, extremely low noise, enhancing the overall dy- namic performance of the system.\n\n\n\n\n\nAdditional Information\n\n\n\n\n\n&nbsp;\nSpecifications\n\n\n\n\nOutput Power\n250W RMS at 4Ω（1%THD，per channel）145W RMS at 8Ω（1%THD，per channel）\n\n\n\nBridge Mode Output Power\n450W RMS at 2Ω（Bridge Mode）\n\n\n\nChannel quantity\n2 Channels\n\n\n\nAmplifier type\nClass D\n\n\n\nFrequency Response\n10Hz-20kHz -1.2dB\n\n\n\nMaximum output current\n16.5A（per channel）/ 33A（Bridge）\n\n\n\nSignal-To-Noise Ratio（SNR）\n&gt;110dB,”A” weighted 4Ω 260W\n\n\n\nInput terminals\n2-Channel RCA Input ；2-ChannelXLR Input\n\n\n\nInput Impedance\nRCA 10.5K ohm /XLR 21.7K ohm\n\n\n\nOutput terminals\n2 pairs beryllium copper binding post，custom made by Starke Sound\n\n\n\nOutput Impedance\n0.09 ohm 1kHz\n\n\n\nDamping coefficient\n100\n\n\n\nFull size\nW 270 mm x D 228 mm x H 90 mm (w/ foot))\n\n\n\nWeight\n3.65Kg",
        "featured": false,
        "images": [
            "/images/products/amp-f2-0.webp",
            "/images/products/amp-f2-1.webp",
            "/images/products/amp-f2-2.webp",
            "/images/products/amp-f2-3.webp",
            "/images/products/amp-f2-4.webp"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Eversolo"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "wandla-hp",
        "slug": "wandla-hp",
        "name": "WANDLA HP",
        "brand": "Ferrum",
        "price": 355000,
        "category": "floorstanding-speakers",
        "shortDescription": "Fully Balanced HP amplifier\nWANDLA HP offers a fully balanced, composite IC headphone amplifier design, fine tuned for WANDLA HP.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nPowerful\nWANDLA HP’s headphone amplifier can output a hefty 3.5 Watts at 50 Ω (balanced).",
        "longDescription": "Ferrum introduces the latest family member of WANDLA, WANDLA HP. Ferrum’s journey up the hifi chain brought them HYPSOS, their revolutionary hybrid power system, OOR, their flagship headphone amplifier, ERCO, their entry level DAC and WANDLA, their flagship DAC. What these products have in common is their upgradeability with HYPSOS. WANDLA HP resides comfortably in the space between entry and super flagship level for headphone enthusiasts.\n\nWANDLA HP essentially is WANDLA with a great sounding headphone amplifier. It will satisfy those who are seeking more than ERCO has to offer but are not ready for WANDLA in combination with OOR, being the super flagship option. Incorporating all great options and specifications from WANDLA, Ferrum’s engineers integrated a powerful, and fully balanced composite IC headphone amplifier at the quality levels that come very close to those of OOR. As with all of Ferrum’s gear, you can reach for the stars by combining WANDLA HP with HYPSOS. It has the looks, it’s all about the music, and it’s a guaranteed head-turner.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nFully Balanced HP amplifier\nWANDLA HP offers a fully balanced, composite IC headphone amplifier design, fine tuned for WANDLA HP.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nPowerful\nWANDLA HP’s headphone amplifier can output a hefty 3.5 Watts at 50 Ω (balanced).\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDynamic\nWANDLA HP’s headphone amplifier has an impressive dynamic range of 122 dB.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTomorrow's High-End Audio Today\nWANDLA HP leads the way for tomorrow's high-end, offering flagship audio quality at an unprecedented price level.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nFinely tuned DA conversion\nWANDLA HP is the latest exemple of Ferrum's digital know-how and our in-house-developed analogue audio and electrical technology. The ESS Sabre ES9038PRO combined with Ferrum's advanced new current-to-voltage (I/V) converter compares to units many times its price.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nSERCE\nDigital audio system module - Our optimized ARM chip offers the shortest signal path possible, making 5 chips redundant. Includes MQA decoder/renderer and digital filter selection.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDynamic Digital Filtering\nWANDLA HP has a selection of digital filters specially prepared for Ferrum by renowned filter-maker HQ Player. More will follow with future updates after interaction with WANDLA users\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nOptimized Digital inputs\nSpecially programmed USB, and tuned coaxial and optical S/PDIF, AES, ARC (TV) and I2S ports, optimized for audio.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nProprietary amplification\nFully balanced modified IC pre-amplifier, fine-tuned for WANDLA HP.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nTruly Balanced\nWhole signal path is truly balanced inside WANDLA HP. Even when using RCA inputs, the signal is converted to balanced on the input first active stage.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nEase of use\nNewly developed hi-res touch screen with intuitive UX that is a dream to operate, including remote control.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nEnhanced transparency\nThe whole design is focused on a balanced and very transparent sound signature, making listening fatigue a thing of the past.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nMade for HYPSOS\nWANDLA HP performs beautifully right out of the box, but you can take its performance above and beyond when pairing it with HYPSOS. Using the proprietary Ferrum Power Link (FPL) connection with 4T voltage sensing, both components will perform to their absolute maximum, unleashing unheard-of musicality.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nSpecifications Ferrum WANDLA HP \nHeadphone Section\nTHD balanced:\n\n \t• 0.00016 % / -116 dB, 10 mW into 50 Ω;\n\n \t• 0.00020 % / -114 dB, 100 mW into 50 Ω\n\n\nTHD unbalanced:\n\n \t• 0.00022 % / -113 dB, 10 mW into 50 Ω;\n\n \t• 0.00022 % / -113 dB, 100 mW into 50 Ω\n\n\nOutput Power Single Ended: 1 W into 50 Ω\nOutput Power Balanced: 3.5 W into 50 Ω\n\nDynamic Range: 122 dB\n\nHP Output impedance: 0.5 Ω unbalanced\nHP Output impedance: 1 Ω balanced\n\nOther\nOperation: Fully balanced, proprietary IC power amp\nDAC chip: ESS Sabre ES9038PRO\nDAC resolution:  768 kHz / 32 bit, DSD 512\nDigital inputs:\n\n \t• AES/EBU (up to 192 kHz / 24 bit, DoP 64)\n\n \t• Optical S/PDIF (up to 96 kHz / 24 bit)\n\n \t• Coaxial S/PDIF (up to 192 kHz / 24 bit, DoP 64)\n\n \t• USB-C (up to 768 kHz / 32 bit, DSD 512, DoP 256)\n\n \t• ARC (up to 192 kHz / 24 bit), TV input with CEC\n\n \t• I2S (up to 768 kHz / 32bit, DSD 512, DoP 256), PS Audio® compatible\n\n\nMQA: decoder and renderer (on all digital inputs)\nAnalog inputs: RCA\nAnalog input Vmax: 9.5 V RMS (2 – 3.5 V RMS recommended)\nAnalogue input imp: 47 kΩ\nLine outputs: balanced XLR; unbalanced RCA\nVolume control: analogue with bypass option / digital for DAC operation only\nLine Output level: @0 dBFS, 1 kHz sine 10 V RMS balanced, 5 V RMS unbalanced\nLine Output level (RED): @0 dBFS, 1 kHz sine 4 V RMS balanced, 2 V RMS unbalanced\nFrequency response  on analog inputs: 10 Hz – 200 kHz +/- 0.1 dB\nDAC THD: -121 dB (0,00009 %); THD+N: -115 dB (unweighted)\nAnalog input THD: -123 dB @ 2 V RMS output level\nDyn. range analog: 127 dB (A-weighted)\nDyn. range digital: 122 dB (A-weighted)\nDAC Output Crosstalk: -120 dB for 1 kHz, better than -100 dB for 20 Hz – 20 kHz\nLine Output impedance: 22 Ω unbalanced\nLine Output impedance: 44 Ω balanced\n\nPower consumption:\n\n \t• 13 W idle (with amp powered off)\n\n \t• 18 W idle (with amp powered on)\n\n \t• 35 W max\n\n\nPower inputs: 5.5/2.5 mm DC connector center positive proprietary FPL 4-pin DC connector (FPL) 22-30 VDC\nPower adapter: 100-240 VAC to 24 VDC\nDimensions: 21.7 x 20.6 x 5 cm / 8.6″ x 8.1″ x 2.0″\n(WxDxH)\nRemote control: included\nWeight: 1.90 kg / 4.19 lb",
        "featured": false,
        "images": [
            "/images/products/wandla-hp-0.jpg",
            "/images/products/wandla-hp-1.jpg",
            "/images/products/wandla-hp-2.jpg",
            "/images/products/wandla-hp-3.jpg",
            "/images/products/wandla-hp-4.jpg",
            "/images/products/wandla-hp-5.jpg",
            "/images/products/wandla-hp-6.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Ferrum"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "lumin-l2-4tb",
        "slug": "lumin-l2-4tb",
        "name": "LUMIN L2 4TB",
        "brand": "Lumin",
        "price": 382000,
        "category": "music-streamers",
        "shortDescription": "An advanced dual-drive music server requiring zero setup configuration and containing a 4-port audiophile-grade network switch.",
        "longDescription": "Why LUMIN L2\n\n\n\nThe perfect partner for LUMIN owners who wish to store their own music collection!\n\nThe effortless operation of LUMIN L2 belies its advanced features and unrivalled flexibility.\n\nWith a 4-port audiophile-grade network switch on board, its two optical fibre SFP ports and two RJ45 copper ports L2 can streamline and enhance your network!\n\n\n\n\n\n\n\nThe ideal partner\n\n \t• Available without drives or with 4TB or 8TB capacity\n\n \t• Zero configuration required\n\n \t• Automatically serves all added music\n\n \t• Fibre Network provides complete isolation from network noise\n\n \t• 4-port network switch simplifies cabling and makes fibre easy\n\n \t• UPnP (Openhome) compatible\n\n \t• USB 3.0 Micro type B for connection to computer\n\n \t• SMB support for transferring over the network\n\n \t• Gigabit Ethernet\n\n \t• Thick-panelled CNC Aluminium construction\n\n\n\n\n\n\n\n\n\n\n\n\nUPnP Openhome music server\nZero configuration\nSimply add music to LUMIN L2 via USB or over the network and it all gets served automatically. No complex installation or setup steps.\nLUMIN server software\nOur bespoke server software is specifically designed for the demands of LUMIN owners - featuring rock-solid stability, rich tag support and, of course, high resolution PCM/DSD support.\nBuild quality\nSilent, vibration-free design offers the same thick shielded CNC chassis construction as our high-end P1 music player. Available in the same black and silver finishes, LUMIN L2 is the perfect accompaniment.\n\n\n\n\n\n\n\n\n\nAudiophile-grade network switch\n4 ports\nWith 4 network ports LUMIN L2 can simplify your wiring and remove the need for cheap (and electrically noisy) switches around your hi-fi.\nFibre networking\n2x SFP ports allow optical fibre networking input and output, completely electrically isolating your hi-fi from the rest of your network.\nLow-noise design\nShielded, low-noise power supply, thick and rigid CNC aluminium chassis, and spacious layout all help provide untouched data to your network player.\nSpecification\n\n\nLUMIN L2 Specification\n\n\n\n \t• \nInternal Storage:\n\n \t• No drives, 4TB (2x 2TB) or 8TB (2x 4TB) 2.5\" SSD\n\n\n\n\n \t• \nSupported Audio File Formats:\n\n \t• \nDSD Lossless:\n\n \t• DSF (DSD), DIFF (DSD), DoP (DSD)\n\n\n\n\n \t• \nPCM Lossless:\n\n \t• FLAC, Apple Lossless (ALAC), WAV, AIFF\n\n\n\n\n \t• \nCompressed (lossy) Audio:\n\n \t• MP3\n\n\n\n\n\n\n\n\n\n \t• \nConnections:\n\n \t• USB 3.0 Micro Type B Slave for connection to computer*\n\n \t• 2x Gigabit Ethernet Network (1000BASE-T) RJ45\n\n \t• 2x Industry-standard Gigabit SFP\n\n \t• 2x USB 3.0 Type A reserved for future use\n\n\n\n\n \t• \nPower Supply:\n\n \t• Internal 100–240V AC auto-ranging\n\n \t• Low-noise\n\n \t• Shielded power supply compartment for reduced interference with delicate electronics\n\n\n\n\n \t• \nPhysical:\n\n \t• \nFinish:\n\n \t• Black anodised aluminium\n\n \t• Raw anodised aluminium\n\n\nDimensions\n\n \t• 350mm (W), 350mm (D), 60.5mm (H), 6kg\n\n\n\n\n\n\n\n\n\n \t• *USB connection requires a computer with a USB 3.0 port\n\n \t• Note: The 8TB HDD version uses NTFS format for the internal HDD. On a Mac computer, additional software may be needed to access NTFS formatted HDD.",
        "featured": false,
        "images": [
            "/images/products/lumin-l2-4tb-0.jpg",
            "/images/products/lumin-l2-4tb-1.jpg",
            "/images/products/lumin-l2-4tb-2.jpg",
            "/images/products/lumin-l2-4tb-3.jpg",
            "/images/products/lumin-l2-4tb-4.jpg",
            "/images/products/lumin-l2-4tb-5.jpg",
            "/images/products/lumin-l2-4tb-6.jpg",
            "/images/products/lumin-l2-4tb-7.jpg",
            "/images/products/lumin-l2-4tb-8.jpg",
            "/images/products/lumin-l2-4tb-9.jpg",
            "/images/products/lumin-l2-4tb-10.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "lumin-l2-8tb",
        "slug": "lumin-l2-8tb",
        "name": "LUMIN L2 8TB",
        "brand": "Lumin",
        "price": 476000,
        "category": "music-streamers",
        "shortDescription": "An advanced dual-drive music server requiring zero setup configuration and containing a 4-port audiophile-grade network switch.",
        "longDescription": "Why LUMIN L2\n\n\n\nThe perfect partner for LUMIN owners who wish to store their own music collection!\n\nThe effortless operation of LUMIN L2 belies its advanced features and unrivalled flexibility.\n\nWith a 4-port audiophile-grade network switch on board, its two optical fibre SFP ports and two RJ45 copper ports L2 can streamline and enhance your network!\n\n\n\n\n\n\n\nThe ideal partner\n\n \t• Available without drives or with 4TB or 8TB capacity\n\n \t• Zero configuration required\n\n \t• Automatically serves all added music\n\n \t• Fibre Network provides complete isolation from network noise\n\n \t• 4-port network switch simplifies cabling and makes fibre easy\n\n \t• UPnP (Openhome) compatible\n\n \t• USB 3.0 Micro type B for connection to computer\n\n \t• SMB support for transferring over the network\n\n \t• Gigabit Ethernet\n\n \t• Thick-panelled CNC Aluminium construction\n\n\n\n\n\n\n\n\n\n\n\n\nUPnP Openhome music server\nZero configuration\nSimply add music to LUMIN L2 via USB or over the network and it all gets served automatically. No complex installation or setup steps.\nLUMIN server software\nOur bespoke server software is specifically designed for the demands of LUMIN owners - featuring rock-solid stability, rich tag support and, of course, high resolution PCM/DSD support.\nBuild quality\nSilent, vibration-free design offers the same thick shielded CNC chassis construction as our high-end P1 music player. Available in the same black and silver finishes, LUMIN L2 is the perfect accompaniment.\n\n\n\n\n\n\n\n\n\nAudiophile-grade network switch\n4 ports\nWith 4 network ports LUMIN L2 can simplify your wiring and remove the need for cheap (and electrically noisy) switches around your hi-fi.\nFibre networking\n2x SFP ports allow optical fibre networking input and output, completely electrically isolating your hi-fi from the rest of your network.\nLow-noise design\nShielded, low-noise power supply, thick and rigid CNC aluminium chassis, and spacious layout all help provide untouched data to your network player.\nSpecification\n\n\nLUMIN L2 Specification\n\n\n\n \t• \nInternal Storage:\n\n \t• No drives, 4TB (2x 2TB) or 8TB (2x 4TB) 2.5\" SSD\n\n\n\n\n \t• \nSupported Audio File Formats:\n\n \t• \nDSD Lossless:\n\n \t• DSF (DSD), DIFF (DSD), DoP (DSD)\n\n\n\n\n \t• \nPCM Lossless:\n\n \t• FLAC, Apple Lossless (ALAC), WAV, AIFF\n\n\n\n\n \t• \nCompressed (lossy) Audio:\n\n \t• MP3\n\n\n\n\n\n\n\n\n\n \t• \nConnections:\n\n \t• USB 3.0 Micro Type B Slave for connection to computer*\n\n \t• 2x Gigabit Ethernet Network (1000BASE-T) RJ45\n\n \t• 2x Industry-standard Gigabit SFP\n\n \t• 2x USB 3.0 Type A reserved for future use\n\n\n\n\n \t• \nPower Supply:\n\n \t• Internal 100–240V AC auto-ranging\n\n \t• Low-noise\n\n \t• Shielded power supply compartment for reduced interference with delicate electronics\n\n\n\n\n \t• \nPhysical:\n\n \t• \nFinish:\n\n \t• Black anodised aluminium\n\n \t• Raw anodised aluminium\n\n\nDimensions\n\n \t• 350mm (W), 350mm (D), 60.5mm (H), 6kg\n\n\n\n\n\n\n\n\n\n \t• *USB connection requires a computer with a USB 3.0 port\n\n \t• Note: The 8TB HDD version uses NTFS format for the internal HDD. On a Mac computer, additional software may be needed to access NTFS formatted HDD.",
        "featured": false,
        "images": [
            "/images/products/lumin-l2-8tb-0.jpg",
            "/images/products/lumin-l2-8tb-1.jpg",
            "/images/products/lumin-l2-8tb-2.jpg",
            "/images/products/lumin-l2-8tb-3.jpg",
            "/images/products/lumin-l2-8tb-4.jpg",
            "/images/products/lumin-l2-8tb-5.jpg",
            "/images/products/lumin-l2-8tb-6.jpg",
            "/images/products/lumin-l2-8tb-7.jpg",
            "/images/products/lumin-l2-8tb-8.jpg",
            "/images/products/lumin-l2-8tb-9.jpg",
            "/images/products/lumin-l2-8tb-10.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "lumin-amp",
        "slug": "lumin-amp",
        "name": "LUMIN AMP",
        "brand": "Lumin",
        "price": 1110000,
        "category": "tube-amplifiers",
        "shortDescription": "• Multi-Stage transistors amplifier\n\n \t• Dual Mono power supply and amplifier design\n\n \t• Fully discrete voltage and current gain stages\n\n \t• DC-coupled signal path\n\n \t• Class AB operation",
        "longDescription": "Matched styling.\nUnmatched performance.\n\n \t• Multi-Stage transistors amplifier\n\n \t• Dual Mono power supply and amplifier design\n\n \t• Fully discrete voltage and current gain stages\n\n \t• DC-coupled signal path\n\n \t• Class AB operation\n\n \t• High input impedence and sensitivty for direct DAC drive\n\n \t• Intelligent bias and thermal management\n\n \t• Stereo / Dual Mono / Bridged operation\n\n \t• CNC single billet aluminium construction\n\n \t• 600VA custom toroidal transformer\n\n \t• Built-in overload, overheat and DC protection\n\n\n\n\n\n\n\n\n\n\n\n\nTrue Dual Mono design throughout\nKeeping the design Dual Mono all the way from the power supply delivers full power simultaneously from both channels and keeps crosstalk to an absolute minumum.\n\nIn LUMIN Amp, each channel is a mirror image of the other.\n\n\n\n\n\n\n\n\n\nDiscrete Transistors\nFully discrete voltage and current gain operating in class AB to deliver the finest details with the lowest distortion from your music.\n\n\n\n\n\n\n\n\n\n\n\nCustom low-noise toroidal power supply\nLUMIN Amp features a unique completely separate dual mono power supply design.\n\nThe ultra low noise design features advanced voltage regulation circuitry.\n\n\n\n\n\n\nSpecification\n\n\nLUMIN Amp Specification\n\n\n\n \t• \nOperating Mode: (selectable)\n\n \t• Stereo, Dual Mono or Bridged mode\n\n\n\n\n \t• \nInput: (selectable)\n\n \t• 1 x XLR pair (pin 2 hot), 1 x RCA pair\n\n\n\n\n \t• \nPower:\n\n \t• 160W per channel into 8Ω\n\n \t• 320W per channel into 4Ω\n\n \t• 640W into 8Ω (Bridged)\n\n\n\n\n \t• \nPower Supply:\n\n \t• Available in 220–240V AC and 110–120V AC versions ~ 50/60Hz\n\n\n\n\n \t• \nPower Consumption:\n\n \t• Standby &lt;0.5W\n\n \t• Idle 40W\n\n \t• Max 700W\n\n\n\n\n\n\n \t• \nFrequency Response:\n\n \t• 20hz - 40000hz ± 0.1db\n\n\n\n\n \t• \nSignal to Noise Ratio:\n\n \t• 103db, unweighted\n\n\n\n\n \t• \nInput Impedance:\n\n \t• 200kΩ Balanced (XLR)\n\n \t• 100kΩ Unbalanced (RCA)\n\n\n\n\n \t• \nOutput Impedance:\n\n \t• 0.1Ω\n\n\n\n\n \t• \nInput Sensitivity:\n\n \t• 1.16Vrms\n\n\n\n\n \t• \nGain:\n\n \t• +26dB (Stereo, Dual Mono)\n\n \t• +32dB (Bridged)\n\n\n\n\n\n\n \t• \nProtection:\n\n \t• DC, overload and overheating protection\n\n\n\n\n \t• \nFinishes:\n\n \t• New black and silver anodised finish to match the latest LUMIN players\n\n\n\n\n \t• \nConstruction:\n\n \t• CNC-machined from a single billet for front, top and sides. Thick 8mm walls, rear panel and base plate\n\n\n\n\n \t• \nDimensions:\n\n \t• 350mm (W), 374mm (D), 104mm (H)\n\n\n\n\n \t• \nWeight:\n\n \t• 19kg",
        "featured": false,
        "images": [
            "/images/products/lumin-amp-0.jpg",
            "/images/products/lumin-amp-1.jpg",
            "/images/products/lumin-amp-2.jpg",
            "/images/products/lumin-amp-3.jpg",
            "/images/products/lumin-amp-4.jpg",
            "/images/products/lumin-amp-5.jpg",
            "/images/products/lumin-amp-6.jpg",
            "/images/products/lumin-amp-7.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Lumin"
            },
            {
                "key": "Category",
                "value": "tube amplifiers"
            }
        ]
    },
    {
        "id": "rs520new",
        "slug": "rs520new",
        "name": "RS520(NEW)",
        "brand": "Hifi Rose",
        "price": 455000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Hifi Rose RS520(NEW). Fully engineered for pristine sound staging.",
        "longDescription": "Key Features\n\n \t• Poweredby the latest 2nd Gen Intel Xeon Scalable processors withIndustry-leading 2TB memory capability\n\n \t• 205W CPU with 16 DIMMs support\n\n \t• 8 x 3.5” Hot-Swap HDD Bays (4x NVMe Supported)\n\n \t• Comprehensive IT infrastructure management solution - ASMB9-iKVM and ASUS Control Center (ACC)\n\n \t• Thermal Radar and Auto Fan Control\n\n \t• Rack-optimized Design\n\n \t• 6 PCIe + 1 OCP Expansion Slots in 2U\n\n \t• Dual M.2 Support\n\n \t• OCP 2.0 Mezzanine\n\n\nSPECIFIACTIONS\n\nProcessor / System Bus\n\n\n2 x Socket P (LGA 3647)\n1st and 2nd Gen Xeon® Scalable Processor Family (205W)\n*Refer to support page for more information\nUPI (10.4 GT/s)\n\n\n \t• \n\nCore Logic\n\n\n\n\n\nIntel® C621 Chipset\n\n\n \t• \n\nMemory\n\n\n\n\n\nTotal Slots : 16 (6-channel per CPU, 8 DIMM per CPU)\nCapacity :\nMaximum up to 512GB RDIMM\nMaximum up to 1024GB LRDIMM\nMaximum up to 2048GB LR-DIMM 3DS\nMemory Type :\nDDR4 2933/2666\nMemory Size :\n* Refer to support page for more information\n* Actual memory frequency differs from Intel CPU types and memory module.\nPlease check Intel official site for more detail about the memory types supported by each CPU.\n\n\n\n \t• \n\nExpansion Slots\n\n\n\n\n\n2 x PCI-E x16 (Gen3 x16 link), LP, HL(CPU1: Slot 6;CPU2:Slot 1) 4 x PCI-E x8 (Gen3 x8 link), LP, HL(CPU2: slot 2-5) 1 x OCP 2.0 Mezzanine (Gen3 x16 link)(CPU1: MezzPCIE1-2)\n\n\n\n \t• \n\nDrive Bays\n\n\n\n\n\n8 x 2.5\" or 3.5\" Hot-swap Storage Device Bays (4 x NVMe Supported for CPU*2)\n2 x 2.5\" Hot-Swap Storage Device Bays (Rear) (SATA HDD/SSD Only)\n2 x M.2 (2280, 2260, 2242) (Support SATA/PCIe M.2,SATA/PCIe RAID)\n\n\n\n \t• \n\nNetworking\n\n\n\n\n1 x Dual Port Intel Ethernet Controller i350-AM2 + 1 x Mgmt LAN\n\n \t• \n\nGraphic\n\n\n\n\nAspeed AST2500 with 64MB VRAM\n\n \t• \n\nFront I/O Ports\n\n\n\n\n\n2 x USB 3.0 ports\n1 x VGA port\n\n\n\n \t• \n\nRear I/O Ports\n\n\n\n\n\n2 x USB 3.0 ports 1 x VGA port 2 x RJ-45 GbE LAN ports 1 x RJ-45 Mgmt LAN port\n\n\n \t• \n\nSwitch/LED\n\n\n\n\n\nRear Switch/LED:\n1 x Q-Code/Port 80 LED\n1 x Power switch\n\nFront Switch/LED:\n1 x Power switch/LED\n1 x Location switch/LED\n1 x Reset switch\n1 x HDD Access LED\n1 x Message LED\nLAN 1-4 LED\n* LAN3-4 for Mezzazine card use\n\n\n \t• \n\nOS Support\n\n\n&nbsp;\n\n\n\n \t• \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n&nbsp;\n\n&nbsp;\n\n\n\n\n\n&nbsp;",
        "featured": false,
        "images": [
            "/images/products/rs520new-0.jpg",
            "/images/products/rs520new-1.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "neso-bookshelf-speakers",
        "slug": "neso-bookshelf-speakers",
        "name": "NESO bookshelf speakers",
        "brand": "NESO",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "2-way system\n\n\n\n\n \t• Compact bookshelf speaker for amazingly clear music experiences\n\n \t• Can be used on a sideboard, a shelf or on a suitable stand\n\n \t• Level-stable due to high efficiency",
        "longDescription": "NESO bookshelf speakers\n2-way system\n\n\n\n\n \t• Compact bookshelf speaker for amazingly clear music experiences\n\n \t• Can be used on a sideboard, a shelf or on a suitable stand\n\n \t• Level-stable due to high efficiency\n\n \t• Speakers with incredible spatiality and great fun factor\n\n \t• Flexible application possibilities in stereo and surround mode (and in the catering industry)\n\n \t• In a 2.1 setup, it can be perfectly combined with our subwoofers\n\n \t• Available in textured varnish or satin finish\n\n \t• In white or black or individually in any RAL color (for an additional charge)\n\n \t• Optionally there is a matching cover in 5 different colors\n\n \t• Handcrafted aluminum decorative ring available as an option\n\n \t• Prepared for our effective vibration dampers\n\n \t• Handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 3 weeks\n\n\nWith its deep and narrow cabinet, the NESO 2-way system is a classic compact speaker yet suitable for universal use. Whether on a stand, on a sideboard, or on a bookshelf, the NESO bookshelf speaker  always cuts a fine figure, but above all, it will surprise its listeners from the very first note.\nThis is what the technical features of the NESO bookshelf speaker look like\nA 1\" silk dome tweeter is used for the high-frequency range. Its funnel-shaped attachment (wave guide) ensures that the higher frequencies are evenly distributed throughout the room. This creates a natural vibrancy and a large soundstage, allowing the NESO bookshelf speaker to play with incredible ease, which is certainly considered exceptional in this price range.\n\nThe high-quality 6.5\" bass-midrange driver delivers powerful dynamics in the lower registers and is also responsible for the clear reproduction of the midrange in this 2-way system. Our specially developed ORBID SOUND® crossover technology, featuring the highest-quality components, ensures perfect tuning and precision.\n\nThe NESO is a refreshingly dynamic and lively speaker for those who simply enjoy listening to music and like to immerse themselves in the music.\nThe eye listens – you determine the look of your NESO bookshelf speaker\nAs is typical with ORBID SOUND ® , you have the opportunity to help design your dream speaker. In addition to choosing a color (according to the RAL chart), you also have the option of selecting a handcrafted aluminum decorative ring for the bass speaker, giving your NESO bookshelf speaker a custom look tailored to your needs and preferences.\n\nThis model also comes with an optional fabric cover, which we can customize in five different colors. This allows you to customize your speakers to your interior.\n\nWith the NESO , you have a compact speaker solution with numerous customization options and a great sound experience. All handcrafted and at an excellent price/performance ratio.\nTop sound – versatile in use\nThe NESO compact loudspeaker is versatile and can easily be expanded into a 2.1 system with a suitable subwoofer  , e.g. the  TERRRA I.\n\nWith our perfectly matched  surround components,  this model can also be integrated as  a front speaker  in a  5.1 surround system  .\nhistory\nSince the early 1970s, 2-way systems have been an integral part of the ORBID SOUND ® product range . The NEPTUN model was born with the Orbid Sound Optimal series from the mid/late 1970s and immediately launched into a successful future.\n\nHowever, this two-way wonder wasn't just used in homes. Due to its sound quality and high level stability, these speakers were also installed in restaurants, creating a great atmosphere for many guests and countless parties.\n\nCommitted to this legacy, we launched NESO as a worthy successor. It was time for a name change, which naturally has its origins in the tradition of ORBID SOUND ® in our solar system. NESO is the moon that orbits the planet Neptune. A name that is a tribute, and not without reason.\n\n\n\n\n\n\nTYPE / VERSION\n2-way floorstanding loudspeaker, bass reflex X\n\n\nEQUIPMENT\n1 x 1″ silk dome tweeter with waveguide\n1 x 6.5″ bass-midrange speaker\n\n\nFREQUENCY RESPONSE\n35 Hz to 20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n80 W / 50 W RMS\n\n\nEFFICIENCY\n90 dB / 1 W, 1 M\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\napprox. 8\n\n\nDIMENSIONS (H/W/D) IN C\n33 / 22 / 32\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/neso-bookshelf-speakers-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "NESO"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "sabero-floorstanding-speakers",
        "slug": "sabero-floorstanding-speakers",
        "name": "SABERO floorstanding speakers",
        "brand": "SABERO",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 2-way SABERO floorstanding speakers for amazing music experiences\n\n \t• Slim format with great sound potential\n\n \t• Box with versatile uses and great fun factor\n\n \t• Available in textured varnish or satin finish",
        "longDescription": "SABERO floorstanding speakers\n2-way system\n\n\n\n\n \t• 2-way SABERO floorstanding speakers for amazing music experiences\n\n \t• Slim format with great sound potential\n\n \t• Box with versatile uses and great fun factor\n\n \t• Available in textured varnish or satin finish\n\n \t• In white or black or individually in any RAL color (extra charge)\n\n \t• Under accessories there is an optional matching cover in 5 different colors\n\n \t• A high-quality aluminum decorative ring can be selected as an option\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Germany\n\n \t• Customized design according to your wishes\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 2-3 weeks\n\n\nOur 'small' 2-way system, the SABERO floorstanding speaker, is the entry point into the world of floorstanding speakers. Despite its slim format and low height, this speaker should not be underestimated; it delivers a surprisingly impressive performance. In addition to impressive spatiality and soundstage, the SABERO floorstanding speaker displays the liveliness and dynamics typical of ORBID SOUND ® speakers. This small sonic wonder is ideal for music lovers who have limited space or who generally don't want large speakers in their room. Another advantage: thanks to its low height of just 72 cm, this speaker can also be easily placed under a window. This can be opened without any space conflicts.\nThis is the technical equipment of the SABERO floorstanding loudspeaker\nThis model's configuration is identical to the NESO model. A 1\" silk dome tweeter is used for the high frequency range. Its funnel-shaped attachment (wave guide) ensures that the higher frequencies are evenly distributed throughout the room. This creates a lively, crisp soundstage and allows the SABERO to play with a fascinating ease, which is certainly exceptional in this price range.\n\nThe high-quality 6.5\" bass-midrange driver delivers powerful dynamics in the lower registers and is also responsible for the precise and clear reproduction of the midrange in this 2-way system. Our specially developed ORBID SOUND® crossover technology with the highest-quality components ensures perfect tuning and precision.\n\nThe SABERO floorstanding speaker is a sleek, fun-loving speaker that packs more punch than you'd expect from its dimensions. With its understated exterior, it doesn't visually intrude on the foreground. Acoustically, however, it leaves nothing to be desired in this class.\nThe eye listens – you determine the look of the SABERO floorstanding speaker\nAs is usual with ORBID SOUND ® , you have the opportunity to help design your desired speaker. In addition to choosing a color (according to RAL), you also have the option of selecting a handcrafted aluminum decorative ring for the bass-midrange speaker.\n\nThis model also comes with an optional fabric cover, which we can customize in five different colors. This allows you to customize your speakers to your interior.\n\nWith the SABERO floorstanding speaker, you have a visually compact speaker solution with numerous customization options and a fantastic sound experience. All handcrafted and at an excellent price/performance ratio.\nHistory of the SABERO floorstanding loudspeaker\nThe SABERO 's lineage has a long tradition, as the slim 2-way model was already part of the ORBID range in the late 1970s. Together with the NEPTUN model, the 2-way loudspeaker, then known as the SATURN, represented the entry point into the hi-fi world and the gateway to the ORBID SOUND ® universe.\n\n\n\n\n\nTYPE / VERSION\n2-way floorstanding speakers\n\n\nEQUIPMENT\n1 x 1″ tweeter with waveguide\n1 x 6.5″ bass-midrange chassis\n\n\nFREQUENCY RESPONSE\n35 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n80 W / 50 W RMS\n\n\nEFFICIENCY\n90 dB / 1 W, 1 m\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\n11\n\n\nDIMENSIONS (H/W/D) IN C\n72 / 22 / 22\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/sabero-floorstanding-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "SABERO"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "prospero-floorstanding-speakers",
        "slug": "prospero-floorstanding-speakers",
        "name": "PROSPERO floorstanding speakers",
        "brand": "PROSPERO",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "• Speakers with compact dimensions and great sound potential\n\n \t• Great potential for use in stereo and surround sound\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Available in textured varnish or satin finish",
        "longDescription": "PROSPERO floorstanding speakers\n3-way system\n\n\n\n\n \t• Speakers with compact dimensions and great sound potential\n\n \t• Great potential for use in stereo and surround sound\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Available in textured varnish or satin finish\n\n \t• In white or black or individually in any RAL color (extra charge)\n\n \t• Optionally there is a cover  in 5 different colors\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 2-3 weeks\n\n\nThe ORBID SOUND ® PROSPERO floorstanding loudspeaker is perhaps a little unusual in terms of its dimensions, as it is a small but somewhat wider 3-way system, but its sound is convincing across the board.\nThis is the equipment of the Prospero floorstanding speaker:\nThe  PROSPERO floorstanding loudspeaker is a compact model with the highest quality components. A compression tweeter with a 1\" voice coil ensures direct response in the high frequencies. The 6\" midrange driver is responsible for transparency and clarity in the vocal range, reproducing instruments realistically and with a wide soundstage. In the bass range, a 10\" woofer with a high-quality cast aluminum basket delivers a warm bass foundation with its soft rubber surround.\nThis is what the PROSPERO floorstanding speaker sounds like\nAt just 77 cm tall, this speaker blends into the background, allowing you to focus on its acoustic strengths. The crisp yet warm bass is complemented by a precise and detailed midrange. The highs are handled by a compression driver that delivers direct yet spacious performance.\n\nThe PROSPERO floorstanding loudspeaker impresses with its direct approach and astonishingly large soundstage. It handles every musical genre well and knows how to emotionally engage the listener rather than leaving them unmoved. The PROSPERO floorstanding loudspeaker reveals its full potential with jazz, blues, and classical music.\n\nThe PROSPERO is also an excellent alternative in the surround area when combined with our surround components.\nHistory:\nBack in the early 1970s, the SUPER STAR II model was introduced with our first product line – at the time, with a 25cm bass, it was the largest model in the range. Continuing this tradition, we developed and added the PROSPERO to our lineup. As for its name, the PROSPERO is in good company, specifically in our solar system, and thus fits perfectly into the Orbid Sound universe, as the name was inspired by a moon orbiting the planet Uranus.\n\n\n\n\n\nTYPE / VERSION\n3-way floorstanding speakers\n\n\nEQUIPMENT\n1 x 1″ tweeter\n1 x 6″ midrange speaker\n1 x 10″ bass chassis\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n200 W / 100 W RMS\n\n\nEFFICIENCY\n93 dB / 1 W, 1 m\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\n21\n\n\nDIMENSIONS (H/W/D) IN C\n77 / 29 / 33 – plus connection terminals on the back 3cm\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/prospero-floorstanding-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "PROSPERO"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "telesto-floorstanding-speakers",
        "slug": "telesto-floorstanding-speakers",
        "name": "TELESTO floorstanding speakers",
        "brand": "TELESTO",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• TELESTO floorstanding speakers – 3-way system for ultimate music enjoyment\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Ideal for any style of music (depending on individual listening habits)\n\n \t• Box with great potential in stereo and surround\n\n \t• Available in textured varnish or satin finish",
        "longDescription": "TELESTO floorstanding speakers\n3-way system\n\n\n\n\n \t• TELESTO floorstanding speakers – 3-way system for ultimate music enjoyment\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Ideal for any style of music (depending on individual listening habits)\n\n \t• Box with great potential in stereo and surround\n\n \t• Available in textured varnish or satin finish\n\n \t• In white or black or individually in any RAL color (for an additional charge)\n\n \t• Optionally there is a matching cover in 5 different colors\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• Custom-made production according to your wishes\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 3 weeks\n\n\nOur  TELESTO floorstanding speaker is a true winner. This has been confirmed by numerous positive test results from renowned test editors, including the 2018 Fairaudio Favorite's Award.\nTop sound – versatile in use – the TELESTO floorstanding loudspeaker:\nAs a 3-way system, the ORBID SOUND ® TELSTO floorstanding speaker boasts a perfectly balanced sound and a harmonious cabinet design. Equally wide and deep, at 93 cm tall, it fits perfectly into any living room without being overly bulky. It could be described as a symbol of good musical taste, and its optional grille, available in five different colors, makes it a real eye-catcher.\n\nWith a crisp and dynamic but always realistic bass reproduction, a precise reproduction of the midrange and a very clear representation of the treble spectrum, the TELESTO loudspeaker box impresses across the board.\n\nIn addition to its use in a stereo setup, the TELESTO floorstanding speaker is equally suitable for high-fidelity movie enjoyment in a surround or home theater installation. Our specially developed surround components ( see Cinema Line ) are available either as individually combinable products or as a perfectly coordinated complete set (our three different HALO sets ).\n\nThe TELESTO floorstanding speaker is a pure joy for listening to music, whether quiet or loud. Volume isn't the deciding factor when it comes to sound, but what matters is that you can remain relaxed while listening because the music comes to you. See for yourself and discover a whole new world of your favorite music and movies.\nThis is what the TELESTO floorstanding speaker features:\nWith its high-quality components, consisting of a silk dome tweeter with waveguide for a grand entrance, a 5″ midrange chassis for the necessary transparency and two 8″ bass drivers that work with power and precision, this speaker is perfect for any style of music.\n\nOf course, the crossover technology developed by ORBID SOUND ® in combination with the selected components also ensures the typical air and transparency in the sound image in the TELESTO floorstanding loudspeaker .\nHistory:\nThe TELESTO 's lineage goes back to the URANUS model , which first enriched the ORBID SOUND® product range in the mid-1990s as a 3-way system and later as a 4-way system . Committed to the sound characteristics of its predecessors, we have consistently developed this model further. For even more musical enjoyment and unadulterated pleasure while listening to music.\n\n\n\n\n\nTYPE / VERSION\n3-way floorstanding speaker, bass reflex\n\n\nEQUIPMENT\n1 x 1″ silk dome tweeter with waveguide\n1 x 5″ midrange speaker\n2 x 8″ bass drivers\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n200 W / 140 W RMS\n\n\nEFFICIENCY\n94 dB / 1 W, 1 M\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\napprox. 20\n\n\nDIMENSIONS (H/W/D) IN C\n93 / 25 / 25 – plus 3cm for the connection terminals on the back\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/telesto-floorstanding-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "TELESTO"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "jupiter-floorstanding-speakers",
        "slug": "jupiter-floorstanding-speakers",
        "name": "JUPITER floorstanding speakers",
        "brand": "JUPITER",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 3-way JUPITER floorstanding speakers – powerful music enjoyment\n\n \t• Speakers with statement character for all music enthusiasts\n\n \t• Extremely level-stable due to very high efficiency\n\n \t• Great potential for use in stereo and home cinema applications\n\n \t• Available in textured varnish or satin finish",
        "longDescription": "JUPITER floorstanding speakers\n3-way system\n\n\n\n\n \t• 3-way JUPITER floorstanding speakers – powerful music enjoyment\n\n \t• Speakers with statement character for all music enthusiasts\n\n \t• Extremely level-stable due to very high efficiency\n\n \t• Great potential for use in stereo and home cinema applications\n\n \t• Available in textured varnish or satin finish\n\n \t• In white or black or individually in any RAL color (extra charge)\n\n \t• Optionally there is a cover in 5 different colors\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Germany\n\n \t• 5-year warranty\n\n \t• Good things take time – production time approx. 3 weeks\n\n\nThe flagship of the ORBID SOUND ® collection is our  JUPITER floorstanding loudspeaker. A speaker steeped in tradition, now in its 6th generation, it's better than ever. Honored with the Favourite Award by fairaudio, it has not only impressed the editors of the renowned online magazine, but has also captivated countless music lovers since the late 1980s.\nFeatures of the Jupiter floorstanding speaker:\nCommitted to tradition and following our philosophy, we have completely redesigned our JUPITER floorstanding loudspeaker with Model 6. The goal: to achieve the highest level of precision and sonic enjoyment in music reproduction. The idea: less travel – more musical experience. With a new, attractively dimensioned design, a fine selection of drivers, and a carefully selected crossover configuration, we have more than achieved this goal.\n\nThe elimination of a path greatly benefits the appearance due to the smaller dimensions, but does not detract from the sound. Quite the opposite: more crispness in the treble, finer resolution in the midrange, and more control in the bass, along with a larger soundstage, ensure a harmonious and clear frequency spectrum for every musical style, leaving nothing to be desired for the listener.\nSound characteristics of the Jupiter floorstanding speaker:\n'Listen to music like live – that's our philosophy'\n\nOur goal is to draw the listener into the musical experience, to engage them musically. Only a loudspeaker that takes the listener on a musical journey can also captivate them emotionally.\n\nOur JUPITER perfectly reproduces the finest high-frequency sounds without ever seeming exaggerated. This is ensured by the highly efficient compression tweeter, which always plays with a light, airy quality and never feels strained – or even reaches its limits – even at higher volumes.\n\nIn combination with mids that don't dominate but still exhibit a high degree of presence, the result is the open and transparent sound so typical of ORBID SOUND ® . We call this the 'live character.' And our customers have known for decades that this makes listening to music seem alive and therefore truly enjoyable.\n\nIn the bass range, the two 10-inch speakers deliver precise, dry, and completely controlled bass. They provide the right foundation, but are never overpowering.\n\nOur customers describe the JUPITER floorstanding speaker as significantly improved in sound and noticeably slimmed down in appearance compared to its predecessors. Do you hear and see the same? Just try it out for yourself – the JUPITER is available for you to listen to in all of our studios.\nHistory:\nSince the late 1980s, a large floorstanding speaker with initially one and then two 25cm woofers has been an integral part of the ORBID SOUND ® product range. The JUPITER  model was launched in 1988/89 and impressed customers not only with its impressive size but also with its high-quality 4-way configuration.\n\n\n\n\n\nTYPE / VERSION\n3-way floorstanding speaker, bass reflex\n\n\nEQUIPMENT\n1 x 1.5″ tweeter (compression tweeter)\n1 x 6″ midrange driver\n2 x 10″ bass drivers\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n400 W / 200 W RMS\n\n\nEFFICIENCY\n95 dB / 1 W, 1 M\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\napprox. 30\n\n\nDIMENSIONS (H/W/D) IN CM\n110 / 29 / 33 plus 3cm for the speaker connections on the rear\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/jupiter-floorstanding-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "JUPITER"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "mini-galaxsis-v-horn-speaker",
        "slug": "mini-galaxsis-v-horn-speaker",
        "name": "MINI GALAXSIS V horn speaker",
        "brand": "MINI",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• Uncompromising horn loudspeaker for dynamic music enjoyment\n\n \t• Versatile applications in stereo and home cinema\n\n \t• Extremely level-stable due to very high efficiency\n\n \t• Available in textured paint\n\n \t• In white or black or individually in any RAL color (extra charge)",
        "longDescription": "MINI GALAXSIS V horn speaker\n4-way system\n\n\n\n\n \t• Uncompromising horn loudspeaker for dynamic music enjoyment\n\n \t• Versatile applications in stereo and home cinema\n\n \t• Extremely level-stable due to very high efficiency\n\n \t• Available in textured paint\n\n \t• In white or black or individually in any RAL color (extra charge)\n\n \t• Optionally there is a cover  in 5 different colors\n\n \t• Our effective vibration dampers are integrated into the base\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 3-4 weeks\n\n\nThe MINI GALAXIS V horn loudspeaker is an exceptional loudspeaker system. A horn system that has always polarized opinions since its first series. In its fifth generation, it's as uncompromising as ever—yet completely different from its predecessors.\nThis is what the MINI GALAXIS V horn speaker features:\nWith the MINI GALAXIS V horn loudspeaker, we at ORBID SOUND ® continue our decades-long tradition of building speakers with a midrange horn for the home. The high-quality components and extensive features of this speaker define its own class.\n\nThe compression tweeter with its aluminum diaphragm and solid aluminum cabinet delivers a wide soundstage with its 140° dispersion pattern. This perfectly complements the impressive midrange horn, which delivers a broad but, above all, direct midrange sound into the room.\n\nFour 6.5\" bass drivers provide the necessary punch, giving the MINI GALAXIS its legendary character in the bass range. The bass drivers are framed by hand-crafted decorative rings made of sandblasted aluminum. Stainless steel screws ensure a perfect interplay of materials and form the connection to the tweeter horn, which is also made of sandblasted aluminum.\n\nParticular attention is paid to the connection area. This features our ORBID SOUND® terminal made of brushed stainless steel with high-quality pole terminals from Mundorf. These always ensure the perfect connection, whether screwing together speaker cables or using banana terminals, and once again demonstrate the quality of the MINI GALAXIS V horn speaker .\n\nA matching base ensures the speaker is placed at the ideal angle for the listener. Naturally, our effective vibration dampers are already  incorporated into this base.\n\nBut the best thing about the MINI GALAXIS V horn loudspeaker is that it brings a completely new kind of musical enjoyment to your home. Direct yet balanced midrange reproduction without overemphasizing the horn character. Crisply fast and extremely dynamic in the bass range, this model has captivated listeners with its musical enchantment for 45 years.\nThis is the history of the horn loudspeaker:\nIn the late 1970s, our brand founder was working on a concept with small bass speakers.\n\nThe idea: to use a combination of closely spaced small woofers to achieve the advantage of a large overall membrane surface while avoiding the disadvantage of the inertia of a large bass driver. In other words: greater dynamics, more punch.\n\nThis is how the first model of the  Mini Galaxy was created in 1978  with 8 small bass speakers and a triple, adjustable horn system – a loudspeaker that was as extraordinary as it was fascinating.\n\nFrom that moment on, the model's triumphant success was unstoppable. This speaker was as popular among music enthusiasts and musicians as it was with bar, club, and pub owners. The MINI GALAXIS represented a new concept – a high-power 4-way system – perfect for parties  as well as moderate home use. The fact that the MINI GALAXIS was not without controversy never hurt its success. To this day, there are  countless owners  and  enthusiasts of the loudspeakers, which were built in four different versions until 2015.\n\nWith the fifth version we continue the story of this extraordinary loudspeaker.\n\n\n\n\n\nTYPE / VERSION\n4-way floorstanding speakers\n\n\nEQUIPMENT\n1 x compression tweeter with 1.5″ aluminum membrane\n1 x midrange horn with compression driver with 2.5″ PM membrane\n4 x 6.5″ bass speakers (modified) with polypropylene membrane\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n400 Watt / 200 Watt RMS\nfor listening impression and sound behavior insignificant information\n\n\nEFFICIENCY\n96 dB / 1 W, 1 m\n\n\nIMPEDANCE\n3 ohms\n\n\nWEIGHT IN KG\n37.5 kg without base\n\n\nDIMENSIONS (H/W/D) IN C\n75 / 38 / 38 plus 3.5cm for the terminals on the back\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/mini-galaxsis-v-horn-speaker-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "MINI"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "monitoreins-horn-loudspeaker",
        "slug": "monitoreins-horn-loudspeaker",
        "name": "Monitor#Eins horn loudspeaker",
        "brand": "Monitor#Eins",
        "price": 0,
        "category": "studio-monitors",
        "shortDescription": "• Exceptional horn speaker Monitor#Eins\n\n \t• Developed by Spiecker & Martin\n\n \t• Consistently implemented monitor sound concept\n\n \t• Level-stable with high efficiency",
        "longDescription": "Monitor#Eins horn loudspeaker\n2-way system\n\n\n\n\n \t• Exceptional horn speaker Monitor#Eins\n\n \t• Developed by Spiecker & Martin\n\n \t• Consistently implemented monitor sound concept\n\n \t• Level-stable with high efficiency\n\n \t• Available in lacquer or wood finish\n\n \t• In white or black or individually in any RAL color (extra charge)\n\n \t• Optionally, matching stands are available in wood or metal\n\n \t• Developed in Germany, handmade in Austria and Baden-Württemberg\n\n \t• 2-year warranty\n\n \t• Delivery time: currently according to waiting list\n\n\nThe Monitor#Eins  horn loudspeaker is an exceptional speaker in every respect. A two-way horn system with a monitor character. Developed by the duo Spiecker & Martin, who have earned a solid reputation in the DIY scene as in-depth developers over many years. Originally intended as a kit, this speaker has also piqued the interest of music enthusiasts who are less familiar with soldering irons and circular saws.\n\nSo, the idea of ​​a finished model was added to the kit concept. This, in turn, led to a collaboration, resulting in the Monitor#Eins now being available to order as a finished speaker in various versions with various options.\n\nThe Monitor#Eins horn loudspeaker complements the Orbid Sound program in an interesting way, but more on that below.\nThis is what the MONITOR#Eins horn speaker features:\nWith the Monitor#Eins horn loudspeaker, our MINI GALAXIS V gets a very different sibling. Anyone familiar with ORBID SOUND ® knows that our loudspeakers deliver room-filling sound with high dynamics. Therefore, the Monitor#Eins is an interesting addition in a completely different direction. Designed and developed as a monitor loudspeaker, it combines the characteristics of a 'sweet spot' loudspeaker and delights the listener in its own unique way.\n\nIt is equipped with a high-quality horn driver from Celestion. Some readers may recall that Orbid Sound used Celestion back in the 1980s. Back then, the GALAXIS series was equipped with these horns. Starting with the MINI GALAXIS, a 4-way system with three horn drivers, through the legendary 6-way GALAXIS system, to the SUPER GALAXIS, the Celestion was an integral part of the system.\n\nThe horn itself is a handcrafted wooden horn that can be combined in four different ways. Veneers are available, from Indian Rosewood to Makassar and Wenge, as well as black. Naturally, the two bass reflex tubes installed on the front panel are also made of this veneer.\n\nA 12″ PA chassis is used as the bass driver – this ensures sufficient pressure and even high volumes are no problem.\n\nRegarding the crossover, we discussed a deviation from the specifications, as we are completely convinced by the components from Mundorf. And in comparison, the Mundorf-equipped Monitor#Eins is more open in terms of the soundstage and somewhat more dynamic or \"airy\" in terms of the overall sound.\nThese are the options for MONITOR#Eins\nIn addition to the horn equipment mentioned above , there are other options for the horn loudspeaker.\n\nThe color can be freely chosen from the RAL spectrum (extra charge), with black and white being the standard colors.\n\nIf you want a suitable stand , you can also choose from various options here.\n\nAnd if you want a Monitor#Eins in wood, you can choose between two versions or have your wishes realized entirely individually.\n\nHow can all this be possible? It's when people who enjoy loudspeakers work together.\n\nThe cabinets and horns are manufactured by perfect-wood in Austria, and the wooden version is manufactured by Christoph Tschaar Holzhanbdwerk . We take care of the crossover assembly and the final fittings of the speakers.\n\nYou can find an overview of all variants and options here. Simply click the button above and request the order list.\n\n\n\n\n\nTYPE / VERSION\n2-way floorstanding speakers\n\n\nEQUIPMENT\n1 x Celestion horn driver\n1 x 12″ PA bass speaker\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\ninsignificant information for listening impression and sound behavior\n\n\nEFFICIENCY\n93 dB / 1 W, 1 m\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\n30 kg\n\n\nDIMENSIONS (H/W/D) IN CM\n77 / 44 / 38 plus 3cm for the terminals on the back\n\n\nCOLOR\nBlack (RAL 9005), White (RAL 9016) or customized according to RAL",
        "featured": false,
        "images": [
            "/images/products/monitoreins-horn-loudspeaker-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Monitor#Eins"
            },
            {
                "key": "Category",
                "value": "studio monitors"
            }
        ]
    },
    {
        "id": "arion-floorstanding-speakers",
        "slug": "arion-floorstanding-speakers",
        "name": "ARION floorstanding speakers",
        "brand": "ARION",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 3-way speakers with statement character\n\n \t• Limited and numbered edition\n\n \t• Customer-specific color design\n\n \t• Effective vibration damper integrated in base plate",
        "longDescription": "ARION floorstanding speakers\n3-way system\n\n\n\n\n \t• 3-way speakers with statement character\n\n \t• Limited and numbered edition\n\n \t• Customer-specific color design\n\n \t• Effective vibration damper integrated in base plate\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 4 weeks\n\n\nThe ARION floorstanding speaker from ORBID SOUND ®  is a special speaker in many ways. Timeless design meets top-of-the-line features. Together, they result in more than just a beautiful speaker.\nThis is the equipment of the ARION floorstanding loudspeaker\nAt a substantial 1.32 meters, the ARION floorstanding speaker is a real eye-catcher. The color-contrasting spacers that connect the three cabinets make this speaker a unique design object. A piece of furniture that sets a tone in a modern living environment, as well as being a visual treat in a classic setting. No matter where it's placed, the ARION is always an eye-catcher. And best of all: the ARION floorstanding speaker comes in the colors of your choice. What other high-end speakers offer that?\n\nBut it's not just the technical side, with a powerful AMT tweeter combined with three bass-midrange drivers and select crossover components, that's special. The sandblasted aluminum trim rings and cover plates also give this speaker a particularly exclusive touch. The brushed stainless steel connection terminal is serialized and equipped with the finest Mundorf terminal blocks.\n\nDecoupling was also considered right from the start, with our effective vibration dampers integrated into the floor panel. They provide the necessary sound absorption in a virtually invisible manner.\nThis is what the ARION floorstanding speaker sounds like\nWith the expertise gained from many decades of loudspeaker construction, Daniel Beyersdorffer offers genuine high-end sound in the ORBID SOUND ®  portfolio. The loudspeaker is characterized by a rich spatial effect. The AMT tweeter ensures fine resolution without effort. The sound image exhibits precision and differentiation, completely detaching itself from the loudspeaker. A loudspeaker that performs just as well with classical music as it does with rock, pop, jazz, or blues.\n\nThe naming also corresponds entirely to the tradition of ORBID SOUND ® , so the planet ARION appropriately orbits a sun called Musica.\n\n\n\n\n\nTYPE / VERSION\n3-way floorstanding speakers\n\n\nEQUIPMENT\n1 x AMT (Air Motion Transformer)\n3 x 6.5″ bass-midrange speakers\n\n\nFREQUENCY RESPONSE\n35 Hz to &gt;23 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n200 W / 100 W RMS\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\n32\n\n\nDIMENSIONS (H/W/D) IN C\n132/21/36 plus 3cm for the speaker terminals on the rear\n3/25.5/40.4 (base plate)\n\n\nCOLOR\nSilk matt customized according to RAL",
        "featured": false,
        "images": [
            "/images/products/arion-floorstanding-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "ARION"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "hi-line-column-speakers",
        "slug": "hi-line-column-speakers",
        "name": "HI-LINE column speakers",
        "brand": "HI-LINE",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• Slim 2-way column speakers\n\n \t• Slim design with amazingly large soundstage\n\n \t• level-stable due to high efficiency\n\n \t• Speakers with great sound potential that are simply fun",
        "longDescription": "HI-LINE column speakers\n2-way system\n\n\n\n\n \t• Slim 2-way column speakers\n\n \t• Slim design with amazingly large soundstage\n\n \t• level-stable due to high efficiency\n\n \t• Speakers with great sound potential that are simply fun\n\n \t• Available in satin finish (black or white) or in your desired color (surcharge)\n\n \t• Aluminum cover available in various colors\n\n \t• 5-year warranty\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• Delivery time approx. 3 weeks\n\n\nThe ORBID SOUND ® HI-LINE floorstanding speakers are a speaker system that, for the first time, combines the renowned 'Orbid sound' with an elegantly slim design. \"They're really fun to use and sound incredibly beautiful and balanced!\"\n\nFor a complete sound experience, including bass, we recommend the subwoofer specially developed for the HI-LINE series\nThis is how the sound of the HI-LINE can be described\nThe ORBID SOUND ®  HI-LINE column speaker is a solution that prioritizes sound over technology. Despite their extremely slim cabinet dimensions, these speakers are characterized by an unexpectedly large soundstage and fine resolution. The sound of the HI-LINE floorstanding speakers is astonishingly lively and present, with astonishing dynamics.\n\nThe HI-LINE column speakers from ORBID SOUND ® are a design-oriented solution that doesn't compromise on sound quality. They are designed for people who value good sound but prefer a sleek, understated design. The HI-Line columns are truly fun and always look great in both modern living spaces and classic settings.\nThese expansion options are available\nThe visually matching subwoofer from the HI-LINE range provides a deeper bass foundation . With its 200-watt digital amplifier and 20cm bass cone, it delivers sufficient punch where needed and a pleasantly warm bass foundation.\n\nTip : With our  matching surround components ( center speaker and   effect speakers in HI-LINE design),  the HI-LINE stereo set can easily be expanded to a 5.1 cinema sound system.\n\n\n\n\n\nTYPE / VERSION\n2-way column speakers\n\n\nEQUIPMENT\n1 x 1″ silk dome with horn attachment (waveguide)\n2 x 4″ bass-midrange drivers\n\n\nFREQUENCY RESPONSE\n&gt; 50Hz – &gt; 20kHz\n\n\nRESILIENCE\n120 watts / 60 watts (RMS)\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\nColumn speakers: 4 ohms\n\n\nWEIGHT IN KG\n9 kg\n\n\nDIMENSIONS (H/W/D) IN C\nColumn speaker total height: 92.5 / 13 / 13\nBase plate: 2.5 / 25 /25\n\n\nCOLOR\nSilk matt customized according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/hi-line-column-speakers-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "HI-LINE"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "hi-line-2-1-stereo-set",
        "slug": "hi-line-2-1-stereo-set",
        "name": "HI-LINE 2.1 Stereo Set",
        "brand": "HI-LINE",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• HI-LINE 2.1 stereo set consisting of 2 2-way column speakers and matching subwoofer\n\n \t• Subwoofer equipped with powerful adjustable digital power amplifier\n\n \t• High-quality connection cable for subwoofers with a length of 2.5 meters from our own production\n\n \t• Super slim design with amazingly large soundstage",
        "longDescription": "HI-LINE 2.1 Stereo Set\n2-way system with active subwoofer\n\n\n\n\n \t• HI-LINE 2.1 stereo set consisting of 2 2-way column speakers and matching subwoofer\n\n \t• Subwoofer equipped with powerful adjustable digital power amplifier\n\n \t• High-quality connection cable for subwoofers with a length of 2.5 meters from our own production\n\n \t• Super slim design with amazingly large soundstage\n\n \t• Level-stable due to high efficiency\n\n \t• Set with great potential and high fun factor\n\n \t• Available in satin finish (black or white) or in your desired color (surcharge)\n\n \t• Aluminum cover available in various colors\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty / 2-year warranty on the subwoofer electronics\n\n \t• Production time approx. 3 weeks\n\n\nThree-tone dimensions with the HI-LINE 2.1 Stereo Set\n\"They're really fun and sound incredibly beautiful and balanced!\" The ORBID SOUND ® HI-LINE floorstanding speakers are a speaker system that, for the first time, combines the renowned 'Orbid sound' with an elegant and slim design.\n\nFor moments of musical bliss, our HI-LINE column speakers are available together with the matching subwoofer as a HI-LINE 2.1 stereo set . Included is a 2.5-meter RCA connection cable for connecting the active subwoofer to your amplifier.\nThis is how the sound of the HI-LINE can be described\nDespite their slim cabinet dimensions, the HI-LINE column speakers boast an unexpectedly large soundstage. They are characterized by fine resolution, yet astonishingly vivid and present. The matching subwoofer perfectly rounds out the sound image.\n\nIn principle, you get a sound experience like with large floorstanding speakers – only in a slim format and with an external subwoofer that controls the bass and places it precisely in the room.\n\nThe ORBID SOUND ® HI-LINE are sleek works of art that are simply incredible fun. Perfect for people who value good music but prefer a sleek, understated design. These speakers cut a fine figure in both modern living spaces and classic ambiances.\n\n\n\n\n\nTYPE / VERSION\n2.1 set consisting of\n2 x 2-way column speakers / 1 x active subwoofer\n\n\nEQUIPMENT\nColumn speaker:\n1 x 1″ silk dome with horn attachment (waveguide)\n2 x 4″ bass-midrange drivers\nSubwoofer:\n1 x 8″ bass chassis\n\n\nFREQUENCY RESPONSE\nColumn speakers:\n&gt; 50Hz – &gt; 20kHz\nSubwoofer:\nup to 20 Hz / variable low-pass filter 40-200Hz (integrated bass boost by 3db at 40Hz\nIn both cases depending on setup and room acoustics\n\n\nRESILIENCE\n120 watts / 60 watts (RMS)\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\nColumn speakers: 4 ohmsSubwoofer: 8 ohms\n\n\nWEIGHT IN KG\nColumn speaker: 9 kg\nSubwoofer: 16 kg\n\n\nDIMENSIONS (H/W/D) IN C\nColumn speaker total height: 92.5 / 13 / 13\nBase plate: 2.5 / 25 / 25\nSubwoofer total height: 42 / 25 / 35\nBase plate: 2.5 / 28 / 39\n\n\nCOLOR\nSilk matt customized according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/hi-line-2-1-stereo-set-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "HI-LINE"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "hi-line-center-speaker",
        "slug": "hi-line-center-speaker",
        "name": "HI-LINE center speaker",
        "brand": "HI-LINE",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 2-way center speaker of the HI-LINE series\n\n \t• Designed for precise voice reproduction and perfect movie enjoyment\n\n \t• Low height (13cm) and compact, space-saving format (ideal for modern low boards)",
        "longDescription": "HI-LINE center speaker\n2-way system\n\n\n\n\n \t• 2-way center speaker of the HI-LINE series\n\n \t• Designed for precise voice reproduction and perfect movie enjoyment\n\n \t• Low height (13cm) and compact, space-saving format (ideal for modern low boards)\n\n \t• Perfectly combinable with the column speakers of the HI-LINE series\n\n \t• Available in satin matt in white, black and silver and individually in any RAL colour (for an additional charge)\n\n \t• Protective cover made of aluminum, available in 3 different colors or customized according to RAL\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• directly from the manufacturer\n\n \t• 5-year warranty\n\n \t• Production time approx. 2-3 weeks\n\n\nThe HI-LINE center speaker was specially developed for clear vocal reproduction and is a perfect match, both in terms of sound and appearance, for the slim column speakers of the ORBID SOUND ®  HI-LINE series.\n\nOnly the optimal reproduction of voices makes watching a movie a pleasure and ensures optimal performance from your surround system. Unintelligible dialogue scenes in surround sound often spoil the enjoyment of the movie. Especially in films with dialogue scenes and high ambient noise, only precise and clean reproduction of all soundtracks makes the film a true cinematic experience.\nThese are the features of the HI-LINE center speaker\nLike all ORBID SOUND ® products, this 'small' center speaker is characterized by its power handling and high efficiency, making it ideal for integration into a surround sound system. With its two bass-midrange drivers and silk dome tweeter with waveguide, it boasts high-quality features and always cuts a fine figure thanks to its compact dimensions. The stylishly integrated front grille is unobtrusive and visually complements the column speakers of the HI-LINE series.\n\nWith the HI-LINE center speaker, you can count on optimal dialogue reproduction. Enjoy the signature 'Orbidsound' in a sleek design – experience the models of the HI-LINE series now. You'll be more than surprised.\n\n\n\n\n\nTYPE / VERSION\n2-way center speaker HI-LINE series\n\n\nEQUIPMENT\n1 x 1″ dome tweeter with waveguide\n2 x 4″ bass-midrange drivers\n\n\nFREQUENCY RESPONSE\n&gt; 50 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n120 W / 60 W RMS\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\n6.0\n\n\nDIMENSIONS (H/W/D) IN C\n13 / 36 / 26\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/hi-line-center-speaker-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "HI-LINE"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "hi-line-surround-expansion-set",
        "slug": "hi-line-surround-expansion-set",
        "name": "HI-LINE Surround Expansion Set",
        "brand": "HI-LINE",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 1 x 2-way HI-LINE center speaker\n\n \t• 2 x 2-way HI-LINE rear speakers\n\n \t• For perfect voice reproduction and amazingly realistic effects\n\n \t• Designed for beautiful movie enjoyment\n\n \t• Optimal extension for the HI-LINE series",
        "longDescription": "HI-LINE Surround Expansion Set\n2-way system\n\n\n\n\nThe HI-LINE Surround expansion set consists of:\n\n \t• 1 x 2-way HI-LINE center speaker\n\n \t• 2 x 2-way HI-LINE rear speakers\n\n \t• For perfect voice reproduction and amazingly realistic effects\n\n \t• Designed for beautiful movie enjoyment\n\n \t• Optimal extension for the HI-LINE series\n\n \t• A sonically effective and visually compact stylish set\n\n \t• Available in satin matt in white, black and silver or individually in any RAL colour (extra charge)\n\n \t• Cover grille made of aluminum in various colors available\n\n \t• 5-year warranty\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• Production according to customer order (delivery time approx. 3 weeks)\n\n\nThe flexible expansion\nThe 'small' HI-LINE surround expansion set from ORBID SOUND ® includes a center speaker and two effect speakers (rear speakers) for expanding your stereo speakers into a 5.0 surround system (connection is only possible to an AV receiver, not a stereo amplifier!). Perfectly matched visually and sonically to the HI-LINE column speaker system, the components of this set ensure a beautiful and fascinating movie experience.\nThese are the features of the HI-LINE Surround Expansion Set\nWe designed the center speaker and effect speakers to visually match the HI-LINE column speakers. Of course, it's not just the compact look that's perfect, but also the sound quality. With the same bass-midrange drivers and tweeters, these speakers are a perfect match. Of course, the matching HI-LINE subwoofer is also recommended for watching movies, as it provides the right amount of bass.\n\nWith the center speaker, you can avoid unintelligible dialogue scenes in movie playback, and enjoy your surround sound more thanks to the realistic reproduction of ambient noise from the effect speakers. Especially in films with dialogue scenes and loud ambient noise, the precise and clean reproduction of all soundtracks makes watching a film a true pleasure. This makes watching films even more fascinating and puts you, the viewer, right in the center of the action.\n\n\n\n\n\nTYPE / VERSION\n1 x center speaker / 2 x effect speakers (surround speakers)\n\n\nEQUIPMENT\nCenter speaker:\n1 x 1″ dome tweeter with waveguide\n2 x 4″ bass-midrange speakers\nEffect speaker:\n1 x 1″ dome tweeter with waveguide\n1 x 4″ bass-midrange speaker\n\n\nFREQUENCY RESPONSE\nCenter speaker: 50 Hz to &gt;20 kHz\nEffect speaker: 50 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\nCenter speaker: 120 W / 60 W RMS\nEffect speaker: 60 W / 30 W RMS\n\n\nEFFICIENCY\nCenter speaker: 92 dB / 1 W, 1 m\nEffect speaker: 92 dB / 1 W, 1 m\n\n\nIMPEDANCE\nCenter speaker: 4 ohms\nEffects speaker: 8 ohms\n\n\nWEIGHT IN KG\nCenter speaker: 6\nEffect speakers: 4.1\n\n\nDIMENSIONS (H/W/D) IN C\nCenter speaker: 13/36/26\nEffect speaker: 40/13/13\n\n\nCOLOR\nSilk matt customized according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/hi-line-surround-expansion-set-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "HI-LINE"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "terius-high-end-speakers",
        "slug": "terius-high-end-speakers",
        "name": "TERIUS high-end speakers",
        "brand": "TERIUS",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 2-way system for sophisticated music enjoyment\n\n \t• Slim design with great listening pleasure\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)",
        "longDescription": "TERIUS high-end speakers\n2-way system\n\n\n\n\n \t• 2-way system for sophisticated music enjoyment\n\n \t• Slim design with great listening pleasure\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)\n\n \t• High-gloss finish on request\n\n \t• Developed and  handmade in Baden-Württemberg\n\n \t• customizable according to customer requirements\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 3 weeks\n\n\nFascination Clarity\nYou always experience the products in our  ORBID SOUND ® BEYOND series with multiple senses. The TERIUS   high-end loudspeaker lets you experience music in a whole new way. It impresses with its clarity and deep soundstage. It brings the music to the listener in a pleasantly unobtrusive way without sacrificing dynamics.\n\nSlim and delicate, yet powerful, the TERIUS   high-end speaker captivates listeners with pleasing clarity and a finely layered sound. It's a stylish entry into the high-end class.\nThis is the equipment of the TERIUS High End loudspeaker\nThe TERIUS floorstanding speaker from ORBID SOUND ®  is equipped with a 6.5-inch bass/midrange driver, which is flush-mounted in the cabinet with a handcrafted aluminum trim ring. A specially coated polypropylene cone ensures a correspondingly powerful bass reproduction. The 1-inch silk dome tweeter is housed in a separate enclosure, separate from the main cabinet. The handcrafted 8 mm thick cover plate made of solid aluminum ensures clean dispersion and a harmonious visual impression in conjunction with the square tweeter cube.\n\nFor the body and tweeter cabinet of the TERIUS high-end speaker, we use 25mm thick MDF material to minimize natural vibration. The base plate, made of 30mm thick MDF, includes four highly effective vibration dampers made of artificial coral, which ensure effective decoupling from the floor.\n\nThe two housing parts and the base plate are firmly connected either by screwed balls made of brushed stainless steel or solid blocks of wood.\n\nThe custom-made ORBID SOUND® terminal , made of 8mm thick aluminum, is equipped with gold-plated binding posts from Mundorf. These ensure secure cable connection or optimal connection of your banana terminals.\nThese customer-specific options are available\nWhether these speakers are equipped with stainless steel spheres or with solid blocks of painted wood is up to you as the customer – depending on your individual taste and the design of your home.\n\nYou also have a choice when it comes to the finish: whether you prefer these speakers in a satin finish or in a sophisticated high gloss finish – the TERIUS high-end speaker always looks graceful and special.\n\n\n\n\n\nTYPE / VERSION\n2-way floorstanding speakers\n\n\nEQUIPMENT\n1 x 1″ silk dome\n1 x 6.5″ bass-midrange speaker with polypropylene membrane\n\n\nFREQUENCY RESPONSE\n35 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n50 W / 120 W RMS\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\napprox. 16\n\n\nDIMENSIONS (H/W/D) IN C\nTotal height: 87.5 / 20 / 24.5\nBase plate: 3 / 21.8 / 26.3\n\n\nCOLOR\nSilk matt customized according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/terius-high-end-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "TERIUS"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "khidur-high-end-speakers",
        "slug": "khidur-high-end-speakers",
        "name": "KHIDUR high-end speakers",
        "brand": "KHIDUR",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 2-way system for the finest music enjoyment\n\n \t• Elegant and very slim design\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)\n\n \t• High-gloss finish on request",
        "longDescription": "KHIDUR high-end speakers\n2-way system\n\n\n\n\n \t• 2-way system for the finest music enjoyment\n\n \t• Elegant and very slim design\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)\n\n \t• High-gloss finish on request\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Can be customized according to customer requirements\n\n \t• Delivery time approx. 3-4 weeks\n\n\nFascinating detail\nYou always experience the products in our  ORBID SOUND ® BEYOND series with multiple senses.\n\nThe KHIDUR high-end speaker impresses with its lightness and richness of detail, offering a particularly pleasant experience for the listener.\n\nSlim, beautifully designed, and with a surprising sense of spaciousness and fascinating depth, the KHIDUR sounds significantly larger than one would expect from its rather delicate appearance. A true sonic surprise awaits the listener.\n\nThe stylish entry into the high-end class.\nThis is the equipment of the KHIDUR High End loudspeaker\nThe handcrafted ORBID SOUND ® KHIDUR high-end loudspeaker is equipped with two heavy-duty 5-inch bass-midrange drivers. The 1-inch silk dome tweeter is housed in a separate enclosure, separated from the main body. The 8 mm thick cover plate made of hand-polished aluminum ensures acoustically clean dispersion and visually creates a high-quality, clean line.\n\nFor the body and tweeter enclosure of the KHIDUR , we use 25mm thick MDF material to minimize natural vibration. The base plate, made of 30mm thick MDF, includes four highly effective vibration dampers made of artificial coral, which ensure effective decoupling from the floor.\n\nThe two housing parts and the base plate are firmly connected either by screwed balls made of brushed stainless steel or solid blocks of varnished wood.\n\nThe custom-made ORBID SOUND® terminal , made of 8mm thick aluminum, is equipped with gold-plated binding posts from Mundorf. These ensure secure cable connection or optimal connection of your banana terminals.\nThese customer-specific options are available\nWhether these speakers are equipped with stainless steel spheres or with solid blocks of lacquered wood is up to you as the customer – depending on your individual taste and the design of your living space.\n\nYou also have a choice when it comes to the finish: whether you prefer the speakers in a subtle satin finish or a sophisticated high gloss, the KHIDUR always looks graceful and sophisticated. Please understand that we have to request a high-gloss finish from the paint shop first.\n\n\n\n\n\nTYPE / VERSION\n2-way floorstanding speakers\n\n\nEQUIPMENT\n1 x 1″ silk dome tweeter\n2 x 5″ bass-midrange speakers with polypropylene membrane\n\n\nFREQUENCY RESPONSE\n35 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n200 W / 100 W RMS\n\n\nEFFICIENCY\n93 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\napprox. 17\n\n\nDIMENSIONS (H/W/D) IN C\nTotal height: 95 / 18 / 24\nBase plate: 3 / 29.8 / 25.8\n\n\nCOLOR\nSilk matt customized according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016)\n\n&nbsp;",
        "featured": false,
        "images": [
            "/images/products/khidur-high-end-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "KHIDUR"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "nandur-high-end-speakers",
        "slug": "nandur-high-end-speakers",
        "name": "NANDUR High End Speakers",
        "brand": "NANDUR",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "NANDUR High End Speakers\n2-way system\n\n\n\n\n \t• 2-way high-end speaker system for dynamic music enjoyment\n\n \t• Design-oriented yet timeless speaker\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)\n\n \t• Matt finish on request\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• Can be customized according to customer requirements\n\n \t• 5-year warranty\n\n \t• Production time approx. 3-4 weeks",
        "longDescription": "NANDUR High End Speakers\n2-way system\n\n\n\n\n \t• 2-way high-end speaker system for dynamic music enjoyment\n\n \t• Design-oriented yet timeless speaker\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)\n\n \t• Matt finish on request\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• Can be customized according to customer requirements\n\n \t• 5-year warranty\n\n \t• Production time approx. 3-4 weeks\n\n\nFascinating dynamics\nYou always experience the products in our  ORBID SOUND ® BEYOND series with multiple senses. The NANDUR high-end loudspeaker impresses with its dynamics, richness of detail, and large soundstage. It literally immerses the listener in the music.\n\nBeautifully designed and powerful, this high-end speaker delivers a full range of sound, surprising listeners with its outstanding precision and exceptional clarity. The music fills the room and captivates with fascinating clarity. The NANDUR from ORBID SOUND ®  represents high-end with design flair.\n\nThese 2-way systems set new standards and give you a whole new experience listening to music.\nThis is the equipment of the NANDUR High End loudspeaker\nThe handcrafted ORBID SOUND ®  NANDUR floorstanding speaker is equipped with an 8-inch bass-midrange driver. A specially coated polypropylene membrane ensures correspondingly powerful bass. The 1-inch aluminum dome tweeter is housed in a separate enclosure, separated from the main body. The 8 mm thick cover plate made of hand-polished aluminum ensures acoustically clean dispersion while also creating an exciting visual impact within the square enclosure.\n\nFor the body and tweeter enclosure, we use 25mm thick MDF material to minimize natural vibration. The NANDUR 's base plate , made of 30mm thick MDF, includes four highly effective vibration dampers made of artificial coral, which ensure effective decoupling from the floor.\n\nThe two housing parts and the base plate are firmly connected either by screwed balls made of brushed stainless steel or solid blocks of varnished wood.\n\nThe custom-made ORBID SOUND® terminal , made of 8mm thick aluminum, is equipped with gold-plated binding posts from Mundorf. These ensure secure cable connections or optimal connection of your banana plugs, underscoring the high-quality features of the NANDUR high-end speaker.\nThese customer-specific options are available\nWhether these speakers are equipped with stainless steel spheres or with solid blocks of lacquered wood is up to you as the customer – depending on your individual taste and the design of your living space.\n\nYou also have a choice when it comes to the finish: whether you prefer the speakers in a subtle satin finish or a sophisticated high gloss, the NANDUR always looks charming and unique. Please understand that we have to request a high-gloss finish from the paint shop first.\n\n\n\n\n\nTYPE / VERSION\n2-way floorstanding speakers\n\n\nEQUIPMENT\n1 x 1″ aluminum dome\n1 x 8″ bass-midrange speaker with polypropylene membrane\n\n\nFREQUENCY RESPONSE\n35 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n50 W / 100 W RMS\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\napprox. 26\n\n\nDIMENSIONS (H/W/D) IN C\nTotal height: 975 / 24.5 / 33\nBase plate: 3 / 27.5 / 36\n\n\nCOLOR\nSilk matt customized according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/nandur-high-end-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "NANDUR"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "palum-high-end-speakers",
        "slug": "palum-high-end-speakers",
        "name": "PALUM high-end speakers",
        "brand": "PALUM",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 3.5-way system for the ultimate music experience\n\n \t• Statement speakers for music enthusiasts\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)\n\n \t• High-gloss finish on request",
        "longDescription": "PALUM high-end speakers\n3.5-way system\n\n\n\n\n \t• 3.5-way system for the ultimate music experience\n\n \t• Statement speakers for music enthusiasts\n\n \t• Available in satin finish (black or white) or individually in any RAL color (for an additional charge)\n\n \t• High-gloss finish on request\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• customizable according to customer requirements\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 3-4 weeks\n\n\nFascinating sound experience\nYou always experience the products in our  ORBID SOUND ® BEYOND series with multiple senses.\n\nThe PALUM floorstanding speaker is the top model in this unique series. Thanks to its impressive size, this speaker demonstrates what you can expect from it, even without music.\n\nPowerful in the bass range, detailed and accentuated in the midrange, and very refined in the higher registers, this ORBID SOUND ® floorstanding speaker always plays with ease, even at high volumes. The music envelops the listener and immerses them deeply – ensuring a particularly intense experience. Its unobtrusive nature characterizes this speaker as a good friend who always knows the right path and is always ready to take you on an interesting and varied musical journey.\n\nThe PALUM floorstanding loudspeaker is an exclamation mark for music lovers – with it you don't just hear music, you can feel it.\nThis is the equipment of the PALUM floorstanding loudspeaker\nThe handcrafted ORBID SOUND ®  PALUM floorstanding speaker is equipped with three 8-inch bass-midrange drivers. A specially coated polypropylene membrane ensures powerful bass. The large Air Motion Transformer is housed in a separate enclosure, separate from the main body. The excellent transient response ensures very clear highs and a wide dispersion pattern. The distance from the main cabinet was deliberately chosen and not only creates an exciting visual impression, but also enhances the spatial effect.\n\nFor the body and tweeter enclosure of the PALUM , we use 25mm thick MDF material to minimize natural vibration. The base plate, made of 30mm thick MDF, includes four highly effective vibration dampers made of artificial coral, which ensure effective decoupling from the floor.\n\nThe two housing parts and the base plate are firmly connected either by screwed balls made of brushed stainless steel or solid blocks of varnished wood.\n\nThe custom-made ORBID SOUND® terminal , made of 8mm thick aluminum, is equipped with gold-plated binding posts from Mundorf. These ensure secure cable connection or optimal connection of your banana terminals.\nThese customer-specific options are available\nWhether these speakers are equipped with stainless steel spheres or with solid blocks of lacquered wood is up to you as the customer – depending on your individual taste and the design of your living space.\n\nYou also have a choice when it comes to the finish: whether you prefer the speaker in a subtle satin finish or a sophisticated high-gloss finish, the PALUM is both design-oriented and elegant. Please understand that we have to request the price for a high-gloss finish from the paint shop first.\n\n\n\n\n\nTYPE / VERSION\n3.5-way floorstanding speakers\n\n\nEQUIPMENT\n1 x Air Motion Transformer (AMT) with neodymium magnet\n3 x 8″ bass-midrange chassis with polypropylene membrane\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n150 W / 300 W RMS\n\n\nEFFICIENCY\n94 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\napprox. 38\n\n\nDIMENSIONS (H/W/D) IN C\nTotal height: 975 / 24.5 / 33\nBase plate: 3 / 27.5 / 36\n\n\nCOLOR\nSilk matt customized according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/palum-high-end-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "PALUM"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "maridur-high-end-speakers",
        "slug": "maridur-high-end-speakers",
        "name": "MARIDUR high-end speakers",
        "brand": "MARIDUR",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 2.5-way high-end speakers\n\n \t• For the ultimate audiophile music experience\n\n \t• Statement speakers for true music enthusiasts\n\n \t• extremely powerful and dynamic sound\n\n \t• Available in all RAL colors",
        "longDescription": "MARIDUR high-end speakers\n2.5-way system\n\n\n\n\n \t• 2.5-way high-end speakers\n\n \t• For the ultimate audiophile music experience\n\n \t• Statement speakers for true music enthusiasts\n\n \t• extremely powerful and dynamic sound\n\n \t• Available in all RAL colors\n\n \t• Particularly elegant matt finish\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 4-6 weeks\n\n\nDesign meets sound – high-end in a new form\nYou always experience the products in our  ORBID SOUND ® BEYOND series with multiple senses. The new top model in the series, our MARIDUR high-end loudspeaker, impresses not only with its equally interesting and modern appearance. The matte finish, available in any RAL color according to customer specifications, presents a timelessly elegant appearance, contrasting excitingly with the octagonal bass drivers with carbon cones. A completely new look that expresses contemporary simplicity and uncompromising quality.\n\nBut this speaker also has a lot to offer in terms of its inner qualities. A completely newly developed crossover network with high-quality components from Mundorf brings the equally newly developed Beyma drivers to a truly exceptional sound. A harmonious tuning in which the powerful bass is noticeably powerful even at low volumes without overpowering the accents and details in the midrange. In the high-frequency range, the newly developed dome tweeter demonstrates that even in this area, the sound can be much more refined than we ever imagined.\n\nWhat's special about our MARIDUR high-end loudspeaker: its power and dynamics astonish the listener in a positive way without being intrusive. The enjoyment of the music always remains relaxed.\n\nA purebred ORBID SOUND ®  loudspeaker and yet completely different from anything you have heard from us before.\n\nWhile we described the PALUM as a good friend who always knows the right path and is always ready to take you on an interesting and varied musical journey, the MARIDUR is the friend you impatiently want to ask when the next musical adventure will finally begin.\nThis is the equipment – ​​High End means uncompromising quality\nLike all ORBID SOUND® speakers,  the MARIDUR is handcrafted . This statement speaker is equipped with two state-of-the-art 8-inch woofers. The bass is delivered by carbon cones in an octagonal aluminum basket. The embossed rubber surround ensures stability and controlled excursion.\n\nAs is typical with the BEYOND series, the tweeter is located in a separate enclosure from the main body. The newly developed tweeter, with a specially coated silk dome, delivers excellent highs and a wide soundstage. The distance from the main enclosure was deliberately chosen, ensuring a fine dispersion pattern and, incidentally, an exciting visual impression.\n\nFor the body and the tweeter cabinet of the MARIDUR high-end loudspeaker we use 25mm thick MDF material. Of course the cabinet is braced internally to further minimize the natural vibration. The base plate made of 30mm thick MDF contains 4 highly effective vibration dampers made of artificial coral, which ensure effective decoupling from the floor.\n\nThe housing parts and the base plate are firmly connected with solid wooden discs, which are painted black to match the look of the bass.\n\nThe MARIDUR 's massive terminal , specially developed by ORBID SOUND® , consists of a 6mm-thick aluminum plate and houses the crossover on the inside. The proven Mundorf binding posts are located on the outside. These allow the speaker cables to be securely connected either with screws or with banana terminals.\n\n\n\n\n\nTYPE / VERSION\n2.5-way floorstanding speakers\n\n\nEQUIPMENT\n1 x polymer impregnated silk dome\n2 x 8″ bass-midrange chassis with carbon membrane\n\n\nFREQUENCY RESPONSE\n&lt; 30 Hz to &gt; 25 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n800 W pulse / 400 W RMS\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\napprox. 42\n\n\nDIMENSIONS (H/W/D) IN C\nTotal height: 124 / 23.5 / 38\nBase plate: 3 / 25 / 39.5\n\n\nCOLOR\navailable in all RAL colors",
        "featured": false,
        "images": [
            "/images/products/maridur-high-end-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "MARIDUR"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "halo-i-cinema-set",
        "slug": "halo-i-cinema-set",
        "name": "HALO I – Cinema Set",
        "brand": "HALO",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 2 x 3-way speakers TELESTO (optional with aluminum trim ring set)\n\n \t• 1 x 2-way center speaker NOVA for perfect vocal reproduction\n\n \t• 2 x 2-way rear speakers TRITON for amazingly realistic ambient sounds\n\n \t• 1 x subwoofer TERRA II (optional with aluminum trim ring)",
        "longDescription": "HALO I – Cinema Set\n\n\n\n\n \t• Surround complete set consists of:\n\n \t• 2 x 3-way speakers TELESTO (optional with aluminum trim ring set)\n\n \t• 1 x 2-way center speaker NOVA for perfect vocal reproduction\n\n \t• 2 x 2-way rear speakers TRITON for amazingly realistic ambient sounds\n\n \t• 1 x subwoofer TERRA II (optional with aluminum trim ring)\n\n \t• 2 x 3.5 meter speaker cable from SommerCable (2×2.5mm²) for connecting the TELESTOs\n\n \t• 1 x 2 meter speaker cable from SommerCable (2×2.5mm²) for connecting the Center Speaker NOVA\n\n \t• 2 x 10 meters speaker cable from SommerCable (2×2.5mm²) for connecting the rear speakers TRITON\n\n \t• 1 x 3 meter RCA cable from SommerCable for connecting the TERRA II subwoofer\n\n\n\n\n \t• Breathtaking cinema sound for your home\n\n \t• Homogeneous surround experience due to identical components in the high and mid-range\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Available in textured paint (satin matt on request)\n\n \t• In white or black (individual RAL colors on request (surcharge))\n\n \t• Optionally there is a cover  in 5 different colors\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• Delivery time approx. 3-4 weeks\n\n \t• 5-year warranty / 2-year warranty on the subwoofer electronics\n\n\nHome cinema ready to listen: the HALO I – Cinema Set\nEnjoy your favorite movies in stunningly clear sound quality at home with the HALO I – Cinema Set. The editors of Lite Magazine reviewed the HALO I – Cinema Set in the same way we did when we developed the system, giving it a top-notch rating!\n\nAll HALO sets are 'ready to listen', meaning they come with all the necessary cables to connect them directly to your AV receiver and, after calibration, you can immediately enjoy excellent, first-class sound.\nThe HALO I – Cinema Set consists of these components\nWith the TELESTO floorstanding loudspeaker as front equipment, you can expect crystal-clear reproduction of the film action even at high sound pressure levels.\n\nThe tuned NOVA center speaker, which is equally equipped in the high and mid-range, puts an end to incomprehensible dialogue scenes and ensures brilliant speech reproduction so that you don't miss anything.\n\nThe TRITON rear speakers add even more enjoyment to the surround sound experience. They impress with their realistic reproduction of ambient sounds. Three dispersion directions create a new, richly detailed spatiality that makes playback in your home theater even more immersive and fascinating, ensuring that you, the viewer, are right in the center of the action.\n\nThe TERRA II subwoofer (upgrade to TERRA III available for an additional charge) delivers ample bass punch, maintaining control in every situation and always delivering precise performance. It makes the difference between crisp bass reproduction and rumbling bass soup. So, the set is ready.\n\n\n\n\n\nTYPE / VERSION\n3-way floorstanding loudspeaker TELESTO2-way center NOVA\n\n2-way rear speaker TRITON\n\nActive subwoofer TERRA II\n\n\nEQUIPMENT\nTELESTO floorstanding speakers:1 x 1″ tweeter with waveguide\n1 x 5″ midrange speaker\n2 x 8″ bass drivers\n\nCenter NOVA:\n\n1 x 1″ tweeter with waveguide\n2 x 5″ midrange speakers\n\nRear Speaker TRITON\n\n1 x 1″ tweeter with waveguide\n2 x 4″ midrange speakers\n\nSubwoofers:\n\n1 x 10″ bass chassis\n\n1 x Class D power amplifier 150W/8Ohm 300W/4Ohm\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n\n\n\nEFFICIENCY\nTELESTO: 94dB 1W, 1m / NOVA: 94dB 1W, 1m / TRITON: 92dB 1W, 1m\n\n\nIMPEDANCE\nTELESTO + NOVA + TRITON: 4 ohms / Subwoofer TERRA II: 8 ohms\n\n\nWEIGHT IN KG\nTELESTO: approx. 20 kg / NOVA: approx. 9 kg / TRITON: approx. 4 kg / TERRA II: approx. 16 kg / Weight set: approx. 73 kg\n\n\nDIMENSIONS (H/W/D) IN C\nTELESTO: 93 / 25 / 25NOVA: 17 / 44 / 26\n\nTRITON: 25 / 15 / 15\n\nTERRA II: 42 / 30 / 40\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/halo-i-cinema-set-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "HALO"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "halo-iii-cinema-set",
        "slug": "halo-iii-cinema-set",
        "name": "HALO III – Cinema Set",
        "brand": "HALO",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 4 x 3-way speakers TELESTO (optional with aluminum trim ring set)\n\n \t• 1 x 2-way center speaker NOVA for perfect vocal reproduction\n\n \t• 1 x subwoofer TERRA II (optional with decorative ring)\n\n \t• 2 x 3.5 meter speaker cable from SommerCable (2×2.5mm²) for connecting the TELESTOs",
        "longDescription": "HALO III – Cinema Set\n\n\n\n\n \t• Surround complete set consisting of:\n\n \t• 4 x 3-way speakers TELESTO (optional with aluminum trim ring set)\n\n \t• 1 x 2-way center speaker NOVA for perfect vocal reproduction\n\n \t• 1 x subwoofer TERRA II (optional with decorative ring)\n\n \t• 2 x 3.5 meter speaker cable from SommerCable (2×2.5mm²) for connecting the TELESTOs\n\n \t• 1 x 2 meter speaker cable from SommerCable (2×2.5mm²) for connecting the Center Speaker NOVA\n\n \t• 2 x 10 meters speaker cable from SommerCable (2×2.5mm²) for connecting the rear speakers\n\n \t• 1 x 3 meter RCA cable from SommerCable for connecting the TERRA II subwoofer\n\n\n\n\n \t•  Breathtaking cinema sound for your home\n\n \t• Homogeneous surround experience due to identical components in the high and mid-range\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Available in textured paint (satin matt on request)\n\n \t• In white or black (custom RAL color on request (extra charge))\n\n \t• Optionally there is a cover  in 5 different colors\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• Delivery time approx. 3-4 weeks\n\n \t• 5-year warranty / 2-year warranty on the subwoofer electronics\n\n\nThe HALO III – Cinema Set: Ready to listen\nFor everyone who likes a little more!\n\nEnjoy your favorite movies in brilliantly clear sound quality at home with the HALO III – Cinema Set.\n\nThe main difference between this HALO II Cinema Set and the HALO I or HALO II Cinema Sets lies in the rear speakers. This configuration uses four speakers of the same size for the front and rear speakers. This ensures consistent sound throughout.\n\nThe systems are 'ready to listen', meaning they are equipped with all the necessary cables to connect them directly to your AV receiver and, after calibration, you can immediately enjoy excellent, first-class sound.\n\nWith the TELESTO floorstanding speakers as front and rear speakers, you can expect a completely homogenous and crystal-clear reproduction of the film's action, even at high sound pressure levels. This immerses you directly and deeply in the film's action, practically putting you right in the middle of it. Just like a movie theater should be.\n\nThe tuned NOVA center speaker, which is equally equipped in the high and mid-range, puts an end to incomprehensible dialogue scenes and ensures brilliant speech reproduction so that you don't miss anything.\n\nThe TERRA II subwoofer (upgrade to TERRA III available for an additional charge) delivers ample bass punch, maintaining control in every situation and always delivering precise performance. It makes the difference between crisp bass reproduction and rumbling bass soup. So, the set is ready.\n\n\n\n\n\nTYPE / VERSION\n3-way floorstanding speakers2-way center NOVA\n\nActive subwoofer TERRA II\n\n\nEQUIPMENT\nTELESTO floorstanding speakers:1 x 1″ tweeter with waveguide\n1 x 5″ midrange speaker\n2 x 8″ bass drivers\n\nCenter NOVA:\n\n1 x 1″ tweeter with waveguide\n2 x 5″ midrange speakers\n\nSubwoofers:\n\n1 x 10″ bass chassis\n\n1 x Class D power amplifier 150W/8Ohm 300W/4Ohm\n\n\nFREQUENCY RESPONSE\n30 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nResilience\n\n\n\nEFFICIENCY\nTELESTO: 94dB / 1W, 1m / NOVA: 94dB / 1W / 1m\n\n\nIMPEDANCE\nTELESTO + NOVA: 4 ohms / Subwoofer TERRA II: 8 ohms\n\n\nWEIGHT IN KG\nTELESTO: approx. 20 kg / NOVA: approx. 9 kg / TERRA II: approx. 16 kg / Weight set: approx. 105 kg\n\n\nDIMENSIONS (H/W/D) IN C\nTELESTO: 93 / 25 / 25NOVA: 17 / 44 / 26\n\nTERRA II: 42 / 30 / 40\n\n\nCOLOR\nTextured paint customized according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/halo-iii-cinema-set-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "HALO"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "nova-center-speaker",
        "slug": "nova-center-speaker",
        "name": "NOVA Center Speaker",
        "brand": "NOVA",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• -way center speaker NOVA – for absolutely clear vocal reproduction\n\n \t• Designed for perfect movie enjoyment\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Can be combined with all Orbid Sound speakers of the new or old generation\n\n \t• Together with the TRITON effect speakers , a coordinated upgrade to the surround system",
        "longDescription": "NOVA Center Speaker\n2-way system\n\n\n\n\n \t• 2-way center speaker NOVA – for absolutely clear vocal reproduction\n\n \t• Designed for perfect movie enjoyment\n\n \t• Extremely level-stable due to high efficiency\n\n \t• Can be combined with all Orbid Sound speakers of the new or old generation\n\n \t• Together with the TRITON effect speakers , a coordinated upgrade to the surround system\n\n \t• Breathtakingly realistic sound\n\n \t• Available in textured varnish or satin finish\n\n \t• Individual colors according to RAL table possible (extra charge)\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 3 weeks\n\n\nIt's the voice that makes watching a movie a pleasure. With the NOVA center speaker, specially designed for clear voice reproduction, you'll never miss a thing. Unintelligible dialogue during movie playback often spoils the fun. Especially in films with lots of dialogue and high ambient noise, only precise and clean reproduction of all soundtracks makes the film a true cinematic experience.\nFeatures and characteristics of the NOVA Center Speaker\nThe two bass-midrange speakers are characterized by high power handling and high efficiency. Combined with the open and clear-sounding tweeter with waveguide, the NOVA Center Speaker is ideal for integration into (and beyond) your ORBID SOUND® surround  system.\n\nAnother advantage is the high flexibility of this speaker. Regardless of whether you use speakers from the old or new Orbid generation, the NOVA center speaker always fits perfectly into your setup. This makes upgrading existing ORBID SOUND ® stereo systems to a surround set a breeze. Many customers have already confirmed this.\nNaming of the NOVA Center Speaker\nWe put some thought into the name, as the name 'Nova' has actually been used since the late 1970s by the ORBID SOUND ® 4-way system with a 30cm bass driver. However, due to the excellent sound characteristics and the fact that the center speaker is the heart of vocal reproduction in a surround system, we decided on this 'explosive' name.\n\n\n\n\n\nTYPE / VERSION\n2-way center speaker\n\n\nEQUIPMENT\n1 x 1″ dome tweeter with waveguide\n2 x 5″ bass-midrange drivers\n\n\nFREQUENCY RESPONSE\n35 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n200 W / 100 W RMS\n\n\nEFFICIENCY\n94 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\n9.0\n\n\nDIMENSIONS (H/W/D) IN C\n17 / 44 / 26\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/nova-center-speaker-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "NOVA"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "center-cinema-center-speaker",
        "slug": "center-cinema-center-speaker",
        "name": "CENTER CINEMA – Center Speaker",
        "brand": "CENTER",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• 2-way Center Cinema for extremely powerful and clear vocal reproduction\n\n \t• Breathtakingly realistic sound\n\n \t• Extremely level-stable due to very high efficiency\n\n \t• For uncompromising cinema sound and the perfect home cinema film enjoyment\n\n \t• 140 degree tweeter dispersion angle – so nothing gets lost on any seat",
        "longDescription": "CENTER CINEMA – Center Speaker\n2-way system\n\n\n\n\n \t• 2-way Center Cinema for extremely powerful and clear vocal reproduction\n\n \t• Breathtakingly realistic sound\n\n \t• Extremely level-stable due to very high efficiency\n\n \t• For uncompromising cinema sound and the perfect home cinema film enjoyment\n\n \t• 140 degree tweeter dispersion angle – so nothing gets lost on any seat\n\n \t• Can be combined with all 'big' Orbid Sound speakers of the new or old generation\n\n \t• Available in textured varnish or satin finish\n\n \t• Individual colors according to RAL table possible (extra charge)\n\n \t• Prepared for our effective vibration dampers\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 2-3 weeks\n\n\nWith the CENTER CINEMA center speaker,  ORBID SOUND ®  opens a new chapter for all home cinema enthusiasts. True home cinema enthusiasts know how important perfect vocal reproduction is for a true movie experience. Unintelligible dialogue or unclear sounds often spoil the fun. Especially in scenes with high ambient noise, only precise and clean reproduction of all soundtracks makes the film a true cinematic experience.\n\nWith the CENTER CINEMA, we offer a product that leaves nothing to be desired. This center speaker is equally at home in quieter tones as it is in the midst of infernal battle, and is designed for those who have very high demands on their home theater equipment.\nThis is the equipment of the CENTER CINEMA\nWith its four 6.5\" bass-midrange drivers, this center speaker powerfully showcases the voices and sounds of any film. The differently tuned drivers are optimally adapted to the mid- and low-frequency frequencies of the speech channel.\n\nIn the high-frequency range, the high-quality compression driver with its aluminum voice coil and a horizontal dispersion angle of 140 degrees delivers clean, razor-sharp highs into the listening room. This means that no home theater viewer needs to fear any loss of sound, because regardless of whether they are seated exactly in the center of the screen or not, no acoustic detail is lost, and even in the most intense battle, the sound of a needle falling onto the cool stone floor is perfectly audible.\nThese are the features of the CENTER CINEMA\nWith its impressive dimensions of 84.4 cm wide, 35.3 cm deep, and 20 cm high, this speaker demonstrates that it's made for the big screen. With its high power handling of 200 watts (RMS) and above-average efficiency of 95 dB, this center speaker is ideal for large home theater installations. High sound pressure levels leave it unfazed. Its motto: always stay clean and clear.\n\nThe tweeter can be supplied in black on request to avoid annoying reflections.\n\nOn request, you can also get the loudspeaker with a compression tweeter to match the JUPITER , so that all tweeters in the front area are the same (at no extra charge).\n\nAnother advantage is the high flexibility of this speaker. Regardless of whether you're using large speakers from the new or older ORBID SOUND ® generation, the CENTER CINEMA always fits.\n\n\n\n\n\n\n\n\n\n\n\n\n\nTYPE / VERSION\n2-way center speaker\n\n\nEQUIPMENT\n1 x 1.5″ compression tweeter with aluminum membrane\n4 x 6.5″ bass-midrange speakers\n\n\nFREQUENCY RESPONSE\n35 Hz to &gt;20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n400 W / 200 W RMS\n\n\nEFFICIENCY\n95 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\n19.5\n\n\nDIMENSIONS (H/W/D) IN C\n20 / 84.6 / 32.1 plus 3cm for the screw terminals on the back\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)\n\n\n\n\n\n\n\n\n\n&nbsp;\n\n\n\n\n\n\n\n&nbsp;\n\n&nbsp;\n\n&nbsp;\n\n\n\n\n\n\n\n&nbsp;\n\n&nbsp;\n\n&nbsp;",
        "featured": false,
        "images": [
            "/images/products/center-cinema-center-speaker-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "CENTER"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "triton-effect-speakers",
        "slug": "triton-effect-speakers",
        "name": "TRITON effect speakers",
        "brand": "TRITON",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• For vivid effects and a truly immersive experience\n\n \t• Ideal for 5.1 and 7.1 surround systems\n\n \t• Can be used as a height speaker\n\n \t• in white or black or individually in any RAL color (extra charge)",
        "longDescription": "TRITON effect speakers\n2-way system\n\n\n\n\n \t• For vivid effects and a truly immersive experience\n\n \t• Ideal for 5.1 and 7.1 surround systems\n\n \t• Can be used as a height speaker\n\n \t• in white or black or individually in any RAL color (extra charge)\n\n \t• Grille and horn attachment can be selected in color\n\n \t• Handmade in Baden-Württemberg\n\n \t• Top quality directly from the manufacturer\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 2-3 weeks\n\n\nThe TRITON effect speaker ensures precise effects in surround mode\nOnly precise reproduction and a generous spatial effect ensure the immersive enjoyment of what's happening behind and beside the viewer. ORBID SOUND ® TRITON effect speakers deliver the magnificent surround sound for your surround experience  . Small and unassuming on the outside, but big on the sound and overall performance of your surround system.\nTRITON effect speakers: three directions, one goal\nThe TRITON effect speaker , with its two side-mounted bass-midrange drivers and front-facing tweeter, radiates sound in three directions simultaneously. This reproduces ambient sound in movies with surprising vibrancy and incredible spatiality. The TRITON effect speakers are specially designed for use in 5.1 or 7.1 systems to get the most out of your surround system.\n\nWith the TRITON effect speaker, we have developed the first 'pure' rear speaker at ORBID SOUND ® . The rear speakers, like the matching NOVA center speaker, can be perfectly combined with old and new generation ORBID SOUND ® loudspeakers. Of course, they also work with other brands. They are characterized by high level stability and work seamlessly with high-efficiency models (like the Mini Galaxy or Jupiter).\nThe name of the TRITON effect speaker – completely ORBID SOUND\nWhen naming the rear speakers,  we deliberately stayed true to our solar system and the ORBID SOUND® universe . Since this 'small' effect speaker, with its three dispersion directions and outstanding sound characteristics, creates quite a stir in any surround system, we chose the name of a moon orbiting the planet Neptune. However, it rotates in the opposite direction to its trajectory...\n\n\n\n\n\nTYPE / VERSION\n2-way effect speaker / rear speaker\n\n\nEQUIPMENT\n1 x 1″ silk dome tweeter with waveguide\n2 x 4″ bass-midrange speakers\n\n\nFREQUENCY RESPONSE\n50 Hz to 20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n120 W / 60 W RMS\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\n4.1\n\n\nDIMENSIONS (H/W/D) IN CM\n25 / 15 / 15\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/triton-effect-speakers-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "TRITON"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "triton-cinema-effect-speakers",
        "slug": "triton-cinema-effect-speakers",
        "name": "TRITON CINEMA effect speakers",
        "brand": "TRITON",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• The TRITON effect speaker as a column version\n\n \t• For an absolutely immersive experience\n\n \t• Ideal for 5.1 and 7.1 surround systems\n\n \t• in white or black or individually in any RAL color (extra charge)\n\n \t• Grille and horn attachment can be selected in color",
        "longDescription": "TRITON CINEMA effect speakers\n2-way system\n\n\n\n\n \t• The TRITON effect speaker as a column version\n\n \t• For an absolutely immersive experience\n\n \t• Ideal for 5.1 and 7.1 surround systems\n\n \t• in white or black or individually in any RAL color (extra charge)\n\n \t• Grille and horn attachment can be selected in color\n\n \t• Handmade in Baden-Württemberg\n\n \t• Top quality directly from the manufacturer\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 2-3 weeks\n\n\nOur TRITON effect speaker as a floor-standing version in the form of a column.\nThe TRITON CINEMA effect speaker ensures precise effects in surround mode\nOnly precise reproduction and a generous spatial effect ensure the immersive enjoyment of what's happening behind and to the side of the viewer. Our TRITON CINEMA effect speaker delivers the magnificent surround sound for your surround experience . As a floorstanding speaker, it's slim and narrow in size but outstanding when it comes to the sonic qualities and overall performance of your surround system. With its high power handling and three dispersion directions, this speaker leaves nothing to be desired.\nTRITON Cinema effect speakers: three directions, one goal\nThe TRITON CINEMA effect speaker, with its two side-mounted bass-midrange drivers and a front-facing tweeter, brings effects into the room in three directions simultaneously. This makes ambient sound in movies seem surprisingly vivid and incredibly spacious. The Triton Cinema effect speaker is specially designed for use as a rear speaker in a 5.1 or 7.1 setup to get the most out of your surround system.\n\nWith the TRITON effect speaker, we have developed the first 'pure' rear speaker at ORBID SOUND ® . The column design is practical for all customers who don't have the option of mounting the TRITON effect speaker directly to the wall.\n\nThe TRITON CINEMA columns, like the matching NOVA center speaker, can be perfectly combined with old and new generation ORBID SOUND ® loudspeakers, including those from other manufacturers. They are characterized by high level stability and work seamlessly with high-efficiency models (such as the Mini Galaxy or Jupiter).\nThe naming – entirely ORBID SOUND\nWhen naming the TRITON Cinema effect speakers,  we deliberately stayed true to our solar system and the ORBID SOUND ® universe. Since this effect speaker, with its three dispersion directions and outstanding sound characteristics, creates a real buzz in any surround system, we chose the name of a moon orbiting the planet Neptune. However, it rotates in the opposite direction to its trajectory...\n\n\n\n\n\nTYPE / VERSION\n2-way effect speaker (column shape) / rear speaker\n\n\nEQUIPMENT\n1 x 1″ silk dome tweeter with waveguide\n2 x 4″ bass-midrange speakers\n\n\nFREQUENCY RESPONSE\n50 Hz to 20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n120 W / 60 W RMS\n\n\nEFFICIENCY\n92 dB / 1 W, 1 m\n\n\nIMPEDANCE\n4 ohms\n\n\nWEIGHT IN KG\n12\n\n\nDIMENSIONS (H/W/D) IN CM\n110 / 15 / 15\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/triton-cinema-effect-speakers-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "TRITON"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "komet-height-speakers",
        "slug": "komet-height-speakers",
        "name": "KOMET height speakers",
        "brand": "KOMET",
        "price": 0,
        "category": "floorstanding-speakers",
        "shortDescription": "• Height speakers for special audio formats (e.g. Auro 3D* / Dolby Atmos* – * the formats are registered trademarks!)\n\n \t• Suitable for ceiling mounting but also wall mounting\n\n \t• Amazing effects and an extremely immersive listening experience for music and film\n\n \t• Extremely stable due to high efficiency",
        "longDescription": "KOMET height speakers\n2-way system for special sound formats\n\n\n\n\n \t• Height speakers for special audio formats (e.g. Auro 3D* / Dolby Atmos* – * the formats are registered trademarks!)\n\n \t• Suitable for ceiling mounting but also wall mounting\n\n \t• Amazing effects and an extremely immersive listening experience for music and film\n\n \t• Extremely stable due to high efficiency\n\n \t• Available in textured paint\n\n \t• In white or black or individually in any RAL color (extra charge)\n\n \t• Developed and handmade in Baden-Württemberg\n\n \t• 5-year warranty\n\n \t• Delivery time approx. 3 weeks\n\n\nOur KOMET height speaker is specially designed for sound formats used in ceiling areas, but can also be used on the wall as a height speaker.\nThis is the equipment of the KOMET height speaker\nThe KOMET effect loudspeaker, specially developed for use on the ceiling, impresses with its low height of only 8 cm.\n\nIt features a 5\" bass-midrange speaker and two 1\" dome tweeters. The two silk domes with waveguides are positioned to the right and left of the bass-midrange speaker. Thanks to the slight inclination in conjunction with the horn attachment (waveguide), the KOMET tweeter impresses not only with its clarity but also with its extreme spatiality.\n\nFor special audio formats such as Auro 3D and Atmos (both registered trademarks of the respective manufacturers), which extend the sound stage upwards in both film and music, the KOMET height speaker (or ceiling speaker) is the perfect addition to an existing ORBID SOUND ® surround system.\n\n\n\n\n\nTYPE / VERSION\n2-way ceiling speaker\n\n\nEQUIPMENT\n2 x 1″ tweeter with waveguide\n1 x 5″ bass-midrange speaker\n\n\nFREQUENCY RESPONSE\n60 Hz to 20 kHz\ndepending on setup and room acoustics\n\n\nRESILIENCE\n120 W / 60 W RMS\n\n\nEFFICIENCY\n90 dB / 1 W, 1 m\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\n3.6\n\n\nDIMENSIONS (H/W/D) IN C\n8 / 37.7 / 17.7\n\n\nCOLOR\nTextured paint customized according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/komet-height-speakers-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "KOMET"
            },
            {
                "key": "Category",
                "value": "floorstanding speakers"
            }
        ]
    },
    {
        "id": "terra-i-subwoofer",
        "slug": "terra-i-subwoofer",
        "name": "TERRA I Subwoofer",
        "brand": "TERRA",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "• TERRA I subwoofer, the compact solution for a beautiful bass foundation\n\n \t• Precise bass reproduction with control\n\n \t• Class D power amplifier with 100 watts at 8 ohms\n\n \t• Ideal as a complement to our 2-way systems",
        "longDescription": "TERRA I Subwoofer\n\n\n\n\n \t• TERRA I subwoofer, the compact solution for a beautiful bass foundation\n\n \t• Precise bass reproduction with control\n\n \t• Class D power amplifier with 100 watts at 8 ohms\n\n \t• Ideal as a complement to our 2-way systems\n\n \t• 5-year warranty / 2-year warranty on electronics\n\n \t• Handmade in Baden-Württemberg\n\n \t• 2-3 weeks delivery time\n\n\nThe smallest in the ORBID SOUND ® subwoofer family is the TERRA I subwoofer .\n\nSmall and elegant, it's ideal as a complement to our 2-way speaker systems or as general bass support.\n\nThe Terra I subwoofer is not suitable for high-level surround operation.\nThe TERRA I subwoofer features:\nThe TERRA I is equipped with a very high-quality 8″ bass chassis with a magnetic core bore and a cast aluminum basket.\n\nThe rear-mounted Class D power amplifier with high power reserves and a sine power of 100 W at 8 ohms (200 W at 4 ohms) guarantees precise and powerful bass.\n\nThe crossover frequency (from 200 to 40 Hz) can be easily adjusted using a rotary control (variable low-pass). An integrated bass boost provides a 3 dB boost at 40 Hz.\n\nA continuously adjustable phase shifter (0-180 degrees) allows optimal adjustment to the main speakers, depending on the location of the TERRA I subwoofer.\n\n\n\n\n\nTYPE / VERSION\nActive subwoofer\n\n\nEQUIPMENT\n1 x 8″ bass chassis\n\n\nFREQUENCY RESPONSE\nvariable low pass &lt; 200-40 Hz\n\n\nPower consumption standby\n&lt; 0.5W\n\n\nPerformance\n100W / 8 ohms (200W / 4 ohms); Total music power (Pmax): 280W\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\napprox. 14\n\n\nDIMENSIONS (H/W/D) IN cm\n39 x 25 x 35\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/terra-i-subwoofer-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "TERRA"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            }
        ]
    },
    {
        "id": "terra-iii-subwoofer",
        "slug": "terra-iii-subwoofer",
        "name": "TERRA III subwoofer",
        "brand": "TERRA",
        "price": 0,
        "category": "subwoofers",
        "shortDescription": "• Precise and controlled bass storm\n\n \t• Powerful Class D power amplifier\n\n \t• Ideal as a complement to a stereo setup\n\n \t• Perfect for home cinema use\n\n \t• Handmade in Baden-Württemberg",
        "longDescription": "TERRA III subwoofer\n\n\n\n\n \t• Precise and controlled bass storm\n\n \t• Powerful Class D power amplifier\n\n \t• Ideal as a complement to a stereo setup\n\n \t• Perfect for home cinema use\n\n \t• Handmade in Baden-Württemberg\n\n \t• 5-year warranty / 2-year warranty on electronics\n\n \t• Production time approx. 2-3 weeks\n\n\nThe TERRA III subwoofer from ORBID SOUND ® is a top-class active subwoofer that precisely reproduces even the lowest frequencies. This is ensured by a heavy-duty 12\" chassis combined with a powerful Class D amplifier.\n\nWhether to support stereo speakers or for use in a home cinema – the TERRA III always provides enough foundation.\n\nThe TERRA III subwoofer can be combined with all  ORBID SOUND ® loudspeakers of the old and new generation and, of course, also with third-party brands.\n\nOf course, all our HALO sets can be combined with the TERRA III subwoofer if the TERRA II does not seem sufficient for the room size and personal taste.\nThis is the equipment of the TERRA III subwoofer\nThe TERRA III subwoofer is the largest member of the subwoofer family from ORBID SOUND ®\n\nEquipped with a high-quality 12″ bass chassis with magnetic core drilling and cast aluminum basket, this subwoofer provides the desired bass storm.\n\nThe rear-mounted Class D power amplifier delivers powerful yet controlled bass. With a sine wave output of 250 W at 8 ohms (500 W at 4 ohms) and ample power reserves, it easily handles this task.\n\nThe crossover frequency (from 200 to 40 Hz) can be easily adjusted using a rotary control (variable low-pass). An integrated bass boost provides a 3 dB boost at 40 Hz.\n\nDepending on the location of the subwoofer, the TERRA III subwoofer can be optimally adjusted to the main speakers using a continuously adjustable phase shifter (0-180 degrees).\n\n\n\n\n\nTYPE / VERSION\nActive subwoofer\n\n\nEQUIPMENT\n1 x 12″ bass chassis\n\n\nFREQUENCY RESPONSE\nvariable low pass &lt; 200-40 Hz\n\n\nPower consumption standby\n&lt; 0.5W\n\n\nPerformance\n250W/8 ohms (500W/4 ohms); Total music power (Pmax): 700W\n\n\nIMPEDANCE\n8 ohms\n\n\nWEIGHT IN KG\napprox. 19\n\n\nDIMENSIONS (H/W/D) IN C\n480 / 35.5 / 45.5\n\n\nCOLOR\nCustom-made silk matt according to RAL, silk matt black (RAL 9005), silk matt white (RAL 9016), custom-made textured paint according to RAL, textured paint black (RAL 9005), textured paint white (RAL 9016)",
        "featured": false,
        "images": [
            "/images/products/terra-iii-subwoofer-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "TERRA"
            },
            {
                "key": "Category",
                "value": "subwoofers"
            }
        ]
    },
    {
        "id": "rs451",
        "slug": "rs451",
        "name": "RS451",
        "brand": "Hifi Rose",
        "price": 392000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Hifi Rose RS451. Fully engineered for pristine sound staging.",
        "longDescription": "The HiFi Rose RS451 is a premium, all-in-one network streamer and DAC featuring an 8.8\" touchscreen, powerful 8-core CPU, and built-in high-performance headphone amp with balanced/unbalanced outputs, using an ES9027PRO DAC for high-res audio (up to DSD512). It offers extensive streaming (Spotify Connect, Roon Ready, AirPlay, Bluetooth 5.4), eARC for TV audio, and versatile connectivity (USB, Coax, Optical) for a desktop or hi-fi setup, blending audiophile sound with user-friendly design. \n\nKey Features:\n\n \tDisplay & Interface: 8.8\" high-resolution touchscreen, Android OS, intuitive Rose OS for easy navigation.\n\n \tAudio Quality: ES9027PRO DAC, ROSE DPC™/NRA™ tech, supports up to PCM 32bit/768kHz & DSD512.\n\n \tHeadphone Amp: Built-in powerful amp with 4.4mm Balanced, XLR4 Balanced, and 1/4\" Unbalanced outputs, driving demanding headphones.\n\n \tStreaming & Connectivity: Roon Ready, Spotify Connect, AirPlay, Bluetooth 5.4 (aptX), DLNA/UPnP, Ethernet, Wi-Fi.\n\n \tTV Integration: HDMI eARC for lossless TV audio (up to 24bit/192kHz) and HDMI 2.0 for 4K video.\n\n \tStorage & Playback: Internal SSD bay (up to 4TB), USB 3.0 ports for drives/CD drive, network file access.\n\n \tPerformance: Upgraded 8-Core CPU (RK3588) with 8GB RAM for smooth operation\n\n\nIdeal For:\n\n \tListeners wanting a compact, high-performance unit for desktop setups.\n\n \tUsers seeking an all-in-one solution for streaming, DAC, and headphone amplification.\n\n \tThose integrating music and TV audio with lossless quality. \n\n\n\nSound Profile:\n\n \tDelivers natural, detailed sound with excellent micro-detail retrieval.\n\n \tOffers a slightly sweeter top-end than some neutral amps, non-fatiguing.\n\n \tHandles complex music well, providing good dynamics and imaging.",
        "featured": false,
        "images": [
            "/images/products/rs451-0.png"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Hifi Rose"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    },
    {
        "id": "t8",
        "slug": "t8",
        "name": "T8",
        "brand": "Eversolo",
        "price": 150000,
        "category": "music-streamers",
        "shortDescription": "Experience high-fidelity audio with the premium Eversolo T8. Fully engineered for pristine sound staging.",
        "longDescription": "T8\nLeading the Art of Sound\nProfessional-grade Streaming Transport\n\n\n\nThe Heart of Pure Sound in the Digital Age\nDelivering Impeccable Detail and Depth to Audiophiles Worldwide\nSuper-Silent Linear Power Supply\nThe custom 4N oxygen-free copper toroidal transformer delivers steady and enduring energy to the audio system. All internal wiring is shielded with Teflon insulation, isolating noise and ensuring untainted current flow. With noise levels as low as 30μV, high-frequency interference and ground noise are thoroughly suppressed through precision voltage regulation and high-grade filtering components.\n\n\n\nUltra-High Precision Femtosecond Clock\nThe Ultra-High Precision Clock System anchors every digital pulse with extraordinary accuracy. This precision in timing translates to pure sound, allowing the T8 to flow with grace and faithfully reproduce every detail for a clear, immersive listening experience.\n\n\nRecommended to use a pair of single-mode 1310 nm SFP modules of the same brand and type,such as:\n\n\nStarTech SFPGLCLHSMST   |   10Gtek ASF13-24-10   |   TP-LinkTL-SM311LSA-2KM   |   TP-LinkTL-SM312LS-40KM   |   HUAWEI 1.25G-1310nm-40KM-SM-ESFP\n\n\n*SFP modules need to be purchased separately, supporting single-mode single-fiber, single-mode dual-fiber optical modules, and SFP network communication module\n\n\n*The SFP modules must be compatible with the selected SFP switch and do not support SFP+\n\n\n\n\n\n\nWi-Fi 6High-Speed Transmission\nFeaturing high bandwidth, low latency, and excellent interference immunity, it guarantees stable and efficient wireless audio transmission, delivering a smooth playback experience.\n\n\n*T8 can completely power off the Wi-Fi module. When turned off, the remote control will switch to infrared mode.\n\n\n\n\n\n\n\nSupport for external USB CD-ROM\nBring new life to your CD collection with playback and ripping functions, making it easy to digitize and preserve your treasured CDs.\n\n\n\n\n\n\n\nHigh-PerformanceQuad-Core ARM Processor\nDelivers powerful multitasking capabilities, paired with high-speed, large-capacity memory for fast caching and processing of massive data.\n\n\n\n\n\n\n\n4GB DDR RAM64GB eMMC Storage\nLarge RAM ensures stable multitasking, while 64GB of built-in storage holds high-quality audio files and system resources.\n\n\n\nEOS Preserves Every Detail\nEversolo’s Original Sampling Rate Audio Engine (EOS) ensures your music apps output the native sample rate by bypassing SRC (sample rate conversion). It delivers precise, lossless audio to your system. Whether streaming from third-party apps like Apple Music or other sources, EOS enables high-resolution, lossless playback, preserving every detail and note for the most authentic and pure music experience.\n\n\n\n\n\n\n\n\n\nModel\n\nT8\n\n\n\n\n\n\nChassis Material\n\nAluminium alloy\n\n\n\n\n\n\nDisplay\n\n6” LCD Touchscreen\n\n\n\n\n\n\nInternal Memory\n\n4G DDR4 +64G eMMC\n\n\n\n\n\n\nUSB Ports\n\nUSB3.0*2\n\n\n\n\n\n\nEthernet\n\nRJ-45(10/100/1000Mbps)\n\n\n\n\n\n\nWi-Fi\n\nWi-Fi 6 (2.4G+5G dual band)\n\n\n\n\n\n\nSFP Fiber Network\n\nSFP modules are not included. Supports single-mode single-fiber, single-mode dual-fiber optical modules, and SFP network communication modules.\n\n\n\n\n\n\nPlayback & Decoding\n\nSupports up to stereo DSD512 and PCM 768kHz 32-bit.\n\n\n\n\n\n\nSupported Music Formats\n\nDSD(DSF,DFF,SACD ISO Support DST up to DSD512), MP3,APE,WAV,FLAC,AIF,AIFF,AAC,NRG,CUE\n\n\n\n\n\n\nMusic Services\n\nTIDAL, Qobuz, HIGHRESAUDIO, Amazon Music etc.\n\n\n\n\n\n\nMusic Streaming\n\nRoon Ready, TIDAL Connect,Qobuz connect, DLNA etc,.\n\n\n\n\n\n\nControl Methods\n\nOn-screen touch control, Android/iPhone/iPad APP control/Android TV\n\n\n\n\n\n\nSupported Protocols\n\nUPnP, NAS, SMB\n\n\n\n\n\n\n\n\n\n\n\n\nUSB Audio Output\n\nSupports up to stereo DSD512 Native and PCM 768kHz 32-bit (only compatible with DACs that support the UAC standard).\n\n\n\n\n\n\nIIS Audio Output\n\nSupports 8 output mode options. Supports up to stereo DSD512 Native and PCM 768kHz 32-bit.\n\n\n\n\n\n\nCoaxial Output\n\nSupports up to stereo PCM 192kHz 24-bit and DoP64.\n\n\n\n\n\n\nOptical Output\n\nSupports up to stereo PCM 192kHz 24-bit and DoP64.\n\n\n\n\n\n\nAES/EBU Output\n\nSupports up to stereo PCM 192kHz 24-bit and DoP64.\n\n\n\n\n\n\n\n\n\n\n\n\nPower Supply & Rated Power\n\nAC 110–240V, 50/60Hz Power consumption: 20W\n\n\n\n\n\n\nIncluded Accessories\n\nPower cable ×1,TRIGGER cable ×1, Remote control ×1, User manual ×1, Polishing cloth ×1\n\n\n\n\n\n\nDimensions\n\nL 315mm * W 230mm * H 88mm\n\n\n\n\n\n\nWeight\n\nNet Weight 4.5Kg",
        "featured": false,
        "images": [
            "/images/products/t8-0.jpg"
        ],
        "specifications": [
            {
                "key": "Brand",
                "value": "Eversolo"
            },
            {
                "key": "Category",
                "value": "music streamers"
            }
        ]
    }
];

export const hero = {
    title: "Sound, unbound.",
    subtitle: "Experience music in its purest form with our curated collection of world-class audio systems.",
    ctaText: "Discover Collection",
    ctaLink: "/products",
    imageUrl: heroImg,
    slides: [
      {
        title: "Sound, unbound.",
        subtitle: "Experience music in its purest form with our curated collection of world-class audio systems.",
        ctaText: "Discover Collection",
        ctaLink: "/products",
        imageUrl: heroImg,
        layout: "full-bg",
        textAlignment: "center",
        verticalAlignment: "center",
        imageOpacity: 60,
        imageBlur: 0,
        imageBrightness: 100,
        imagePosition: "center",
        overlayColor: "black",
        overlayOpacity: 40,
        ctaVariant: "primary",
        ctaSize: "lg",
        ctaShape: "rounded-full"
      },
      {
        title: "Crafted Acoustics",
        subtitle: "Uncompromising engineering meets breathtaking, artisan craftsmanship.",
        ctaText: "Explore Speakers",
        ctaLink: "/products?category=floorstanding-speakers",
        imageUrl: speakersImg,
        layout: "split-left",
        textAlignment: "left",
        verticalAlignment: "center",
        imageOpacity: 100,
        imageBlur: 0,
        imageBrightness: 100,
        imagePosition: "center",
        overlayColor: "black",
        overlayOpacity: 30,
        ctaVariant: "gradient",
        ctaSize: "lg",
        ctaShape: "rounded-full"
      },
      {
        title: "Analog Perfection",
        subtitle: "Immerse yourself in high-fidelity vinyl playback and legendary tube amplification.",
        ctaText: "Discover Turntables",
        ctaLink: "/products?category=turntables",
        imageUrl: turntablesImg,
        layout: "full-bg",
        textAlignment: "center",
        verticalAlignment: "bottom",
        imageOpacity: 50,
        imageBlur: 2,
        imageBrightness: 90,
        imagePosition: "center",
        overlayColor: "slate",
        overlayOpacity: 50,
        ctaVariant: "outline",
        ctaSize: "lg",
        ctaShape: "rounded-lg"
      }
    ]
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

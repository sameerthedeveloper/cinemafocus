const fs = require('fs');
const path = require('path');

const jsonPath = '/Users/sameer/Developer/cinemafocus/Cat/products.json';
const baseDir = '/Users/sameer/Developer/cinemafocus/Cat';
const publicDir = '/Users/sameer/Developer/cinemafocus/public';
const productsDir = path.join(publicDir, 'images', 'products');

// Ensure public/images/products directory exists
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

console.log("Reading products.json...");
const rawProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Helper to clean HTML entities and clean titles/descriptions
function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\u00a0/g, ' ')
    .replace(/\r/g, '')
    .trim();
}

// Helper to clean HTML tags from description and formatting lists
function cleanDescription(html) {
  if (!html) return '';
  let text = html
    .replace(/\[.*?\]/g, '') // remove wordpress shortcodes
    .replace(/<li>/g, '• ') // replace li with bullet
    .replace(/<\/li>/g, '\n') // add newline after list item
    .replace(/<br\s*\/?>/g, '\n') // replace br with newline
    .replace(/<\/p>/g, '\n\n') // double newline after paragraphs
    .replace(/<[^>]*>/g, '') // strip all other HTML tags
    .trim();
  
  // Clean up excessive newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  return cleanString(text);
}

// Unique brand set and category set for reference
const processedProducts = [];
let imageCopyCount = 0;

rawProducts.forEach((p, idx) => {
  const title = cleanString(p.title);
  if (!title) return;

  // 1. Generate clean slug and ID
  let slug = p.slug ? p.slug.toLowerCase().trim() : '';
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  // Ensure slug doesn't have multiple consecutive dashes
  slug = slug.replace(/-+/g, '-');

  // 2. Extract brand
  let brand = 'Other';
  const lowerTitle = title.toLowerCase();
  const catLower = (p.categories || []).map(c => c.toLowerCase());

  if (catLower.includes('proac') || lowerTitle.includes('proac')) brand = 'ProAc';
  else if (catLower.includes('kii') || lowerTitle.includes('kii')) brand = 'Kii';
  else if (catLower.includes('audiovector') || catLower.includes('audio vector') || lowerTitle.includes('audio vector') || lowerTitle.includes('audiovector')) brand = 'Audiovector';
  else if (catLower.includes('system audio') || lowerTitle.includes('system audio')) brand = 'System Audio';
  else if (catLower.includes('mj acoustic') || catLower.includes('mj acoustics') || lowerTitle.includes('mj acoustic') || lowerTitle.includes('mj acoustics')) brand = 'MJ Acoustics';
  else if (catLower.includes('octave') || lowerTitle.includes('octave')) brand = 'Octave';
  else if (catLower.includes('lumin') || lowerTitle.includes('lumin')) brand = 'Lumin';
  else if (catLower.includes('hifirose') || catLower.includes('hifi rose') || lowerTitle.includes('hifi rose') || lowerTitle.includes('hifirose')) brand = 'Hifi Rose';
  else if (catLower.includes('atc pro') || catLower.includes('atc') || catLower.includes('act pro') || lowerTitle.includes('atc')) brand = 'ATC';
  else if (catLower.includes('signature') || lowerTitle.includes('signature')) brand = 'Signature';
  else if (catLower.includes('aurender') || lowerTitle.includes('aurender')) brand = 'Aurender';
  else if (catLower.includes('ever solo') || catLower.includes('eversolo') || lowerTitle.includes('eversolo')) brand = 'Eversolo';
  else if (catLower.includes('ferrum') || lowerTitle.includes('ferrum')) brand = 'Ferrum';
  else if (catLower.includes('velox') || lowerTitle.includes('velox')) brand = 'Velox';
  else {
    const firstWord = title.split(' ')[0];
    brand = firstWord && firstWord.length > 2 ? firstWord : 'Other';
  }

  // 3. Parse price
  let price = 0;
  if (p.price) {
    price = parseFloat(p.price.toString().replace(/[^0-9.]/g, ''));
  }
  if (isNaN(price)) price = 0;

  // 4. Map categories
  let category = 'floorstanding-speakers';
  
  if (catLower.includes('subwoofer') || catLower.includes('sub woofers') || lowerTitle.includes('subwoofer') || lowerTitle.includes('sub-woofer') || lowerTitle.includes('sub ')) {
    category = 'subwoofers';
  } else if (catLower.includes('tube amplifier') || catLower.includes('amplifiers') || catLower.includes('pre') || catLower.includes('power') || catLower.includes('integrated') || lowerTitle.includes('amplifier') || lowerTitle.includes('amp') || lowerTitle.includes('octave v') || lowerTitle.includes('octave hp')) {
    category = 'tube-amplifiers';
  } else if (catLower.includes('music streamer') || catLower.includes('aurender') || catLower.includes('source') || catLower.includes('ever solo') || catLower.includes('digital output series') || catLower.includes('analog output series') || brand === 'Lumin' || brand === 'Hifi Rose' || brand === 'Aurender' || brand === 'Eversolo' || lowerTitle.includes('streamer') || lowerTitle.includes('network player')) {
    category = 'music-streamers';
  } else if (catLower.includes('signature') || catLower.includes('velox') || catLower.includes('audiophile accessories') || lowerTitle.includes('cable') || lowerTitle.includes('hdmi') || lowerTitle.includes('interconnect')) {
    category = 'accessories';
  } else if (catLower.includes('turntables') || lowerTitle.includes('turntable') || lowerTitle.includes('debut pro')) {
    category = 'turntables';
  } else if (catLower.includes('home theater') || catLower.includes('hts on wall') || lowerTitle.includes('on wall') || lowerTitle.includes('centre voice') || lowerTitle.includes('htc') || lowerTitle.includes('hts')) {
    category = 'home-theater';
  } else if (catLower.includes('studio monitors') || catLower.includes('atc pro') || lowerTitle.includes('pro') || lowerTitle.includes('active') || lowerTitle.includes('monitor')) {
    category = 'studio-monitors';
  } else if (catLower.includes('speakers') || catLower.includes('loudspeakers') || catLower.includes('entry series') || catLower.includes('classic series') || catLower.includes('tower series') || catLower.includes('centers')) {
    category = 'floorstanding-speakers';
  }

  // 5. Clean descriptions
  const longDescription = cleanDescription(p.description);
  let shortDescription = cleanDescription(p.excerpt);
  if (!shortDescription) {
    if (longDescription && longDescription.length < 150) {
      shortDescription = longDescription;
    } else {
      shortDescription = `Experience high-fidelity audio with the premium ${brand} ${title}. Fully engineered for pristine sound staging.`;
    }
  }

  // 6. Handle specifications parsing
  const specifications = [];
  if (longDescription) {
    const lines = longDescription.split('\n');
    lines.forEach(line => {
      if (line.includes(':') && line.startsWith('•')) {
        const parts = line.split(':');
        const key = parts[0].replace('•', '').trim();
        const value = parts[1].trim();
        if (key.length > 2 && key.length < 30 && value.length > 1 && value.length < 60) {
          specifications.push({ key, value });
        }
      }
    });
  }

  // If no specs extracted, add a few defaults based on category
  if (specifications.length === 0) {
    specifications.push({ key: 'Brand', value: brand });
    specifications.push({ key: 'Category', value: category.replace('-', ' ') });
    if (p.sku) specifications.push({ key: 'SKU Code', value: p.sku });
  }

  // 7. Copy and rename images
  const images = [];
  const allImagePaths = [];

  // Main Image
  if (p.image) {
    allImagePaths.push(p.image);
  }
  // Gallery Images
  if (p.gallery && Array.isArray(p.gallery)) {
    p.gallery.forEach(img => {
      if (img && !allImagePaths.includes(img)) {
        allImagePaths.push(img);
      }
    });
  }

  // Process all unique image files for this product
  let imgIdx = 0;
  allImagePaths.forEach(relPath => {
    const fullSourcePath = path.join(baseDir, relPath);
    if (fs.existsSync(fullSourcePath)) {
      const ext = path.extname(relPath) || '.png';
      const cleanExt = ext.toLowerCase() === '.webp' ? '.webp' : (ext.toLowerCase() === '.jpg' || ext.toLowerCase() === '.jpeg' ? '.jpg' : '.png');
      const targetFilename = `${slug}-${imgIdx}${cleanExt}`;
      const targetPath = path.join(productsDir, targetFilename);

      try {
        fs.copyFileSync(fullSourcePath, targetPath);
        images.push(`/images/products/${targetFilename}`);
        imageCopyCount++;
        imgIdx++;
      } catch (err) {
        console.warn(`Failed to copy image for ${slug}:`, err.message);
      }
    }
  });

  // Fallback to default if no image copied
  if (images.length === 0) {
    images.push('/images/placeholder.svg');
  }

  // 8. Construct final product
  processedProducts.push({
    id: slug,
    slug: slug,
    name: title,
    brand: brand,
    price: price,
    category: category,
    shortDescription: shortDescription,
    longDescription: longDescription || shortDescription,
    featured: idx < 12, // Mark first 12 as featured for active display
    images: images,
    specifications: specifications
  });
});

console.log(`Processed ${processedProducts.length} products.`);
console.log(`Successfully copied ${imageCopyCount} images into public/images/products/.`);

// Save to public/supabase_products.json
const outputJsonPath = path.join(publicDir, 'supabase_products.json');
fs.writeFileSync(outputJsonPath, JSON.stringify(processedProducts, null, 2), 'utf8');
console.log(`Saved output JSON to ${outputJsonPath}`);

// Also save categories data for bulk upload convenience
const customCategories = [
  {
    id: 'floorstanding-speakers',
    name: 'Floorstanding Speakers',
    slug: 'floorstanding-speakers',
    description: 'Experience the full depth of sound with flagship high-fidelity loudspeakers.',
    imageUrl: '/images/speakers.webp',
    featured: true
  },
  {
    id: 'studio-monitors',
    name: 'Studio Monitors',
    slug: 'studio-monitors',
    description: 'Professional reference monitors for absolute accuracy and transparency.',
    imageUrl: '/images/product-speakers.webp',
    featured: true
  },
  {
    id: 'tube-amplifiers',
    name: 'Tube Amplifiers',
    slug: 'tube-amplifiers',
    description: 'Warm, rich, and authentic. The harmonic heart of high-fidelity playback.',
    imageUrl: '/images/amplifiers.webp',
    featured: true
  },
  {
    id: 'turntables',
    name: 'Turntables',
    slug: 'turntables',
    description: 'Precision analog playback systems and audio turntables for the purist.',
    imageUrl: '/images/turntables.webp',
    featured: false
  },
  {
    id: 'subwoofers',
    name: 'Subwoofers',
    slug: 'subwoofers',
    description: 'Deep, articulate bass performance that anchors your overall soundstage.',
    imageUrl: '/images/speakers.webp',
    featured: false
  },
  {
    id: 'home-theater',
    name: 'Home Theater',
    slug: 'home-theater',
    description: 'Immersive multi-channel soundscapes designed for ultimate home cinemas.',
    imageUrl: '/images/hero-light.webp',
    featured: false
  },
  {
    id: 'music-streamers',
    name: 'Music Streamers',
    slug: 'music-streamers',
    description: 'High-resolution digital audio streamers, network players, and audio servers.',
    imageUrl: '/images/amplifiers.webp',
    featured: true
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'High-end audiophile interconnects, speaker cables, clocks, and power blocks.',
    imageUrl: '/images/turntables.webp',
    featured: false
  }
];

const categoriesJsonPath = path.join(publicDir, 'supabase_categories.json');
fs.writeFileSync(categoriesJsonPath, JSON.stringify(customCategories, null, 2), 'utf8');
console.log(`Saved output categories JSON to ${categoriesJsonPath}`);

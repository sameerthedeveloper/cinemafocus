const fs = require('fs');
const path = require('path');

const jsonPath = '/Users/sameer/Developer/cinemafocus/Cat/products.json';
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const uniqueCategories = new Set();
const uniqueBrands = new Set();

products.forEach(p => {
  if (p.categories) {
    p.categories.forEach(c => uniqueCategories.add(c));
  }
});

// Let's guess brand from title or categories
products.forEach(p => {
  // Let's check which brand is in categories or title
  const title = p.title.toLowerCase();
  let brand = 'Other';
  
  if (title.includes('proac')) brand = 'ProAc';
  else if (title.includes('kii')) brand = 'Kii';
  else if (title.includes('audio vector') || title.includes('audiovector')) brand = 'Audiovector';
  else if (title.includes('system audio')) brand = 'System Audio';
  else if (title.includes('mj acoustic') || title.includes('mj acoustics')) brand = 'MJ Acoustics';
  else if (title.includes('octave')) brand = 'Octave';
  else if (title.includes('lumin')) brand = 'Lumin';
  else if (title.includes('hifi rose') || title.includes('hifirose')) brand = 'Hifi Rose';
  else if (title.includes('atc')) brand = 'ATC';
  else if (title.includes('signature')) brand = 'Signature';
  
  uniqueBrands.add(brand);
});

console.log("Unique Categories in WordPress JSON:", Array.from(uniqueCategories));
console.log("Guessed Brands from WordPress JSON:", Array.from(uniqueBrands));
console.log("Total products count in file:", products.length);

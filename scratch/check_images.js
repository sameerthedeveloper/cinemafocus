const fs = require('fs');
const path = require('path');

const jsonPath = '/Users/sameer/Developer/cinemafocus/Cat/products.json';
const baseDir = '/Users/sameer/Developer/cinemafocus/Cat';
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let foundCount = 0;
let missingCount = 0;
const missingPaths = [];

products.forEach(p => {
  if (p.image) {
    const fullPath = path.join(baseDir, p.image);
    if (fs.existsSync(fullPath)) {
      foundCount++;
    } else {
      missingCount++;
      if (missingPaths.length < 5) {
        missingPaths.push(fullPath);
      }
    }
  } else {
    missingCount++;
  }
});

console.log(`Image check results:`);
console.log(`- Found locally: ${foundCount}`);
console.log(`- Missing locally: ${missingCount}`);
if (missingPaths.length > 0) {
  console.log("Sample missing paths:", missingPaths);
}

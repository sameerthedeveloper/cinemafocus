import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../public/logo.svg');
const outputPath = path.resolve(__dirname, '../public/favi.png');

async function generateFavicon() {
    try {
        console.log(`Generating favicon from ${inputPath}...`);

        // Check if input exists
        if (!fs.existsSync(inputPath)) {
            console.error('Error: public/logo.svg not found!');
            process.exit(1);
        }

        await sharp(inputPath)
            .resize(192, 192) // 192x192 is a good standard for PNG favicons
            .png()
            .toFile(outputPath);

        console.log(`Successfully created ${outputPath}`);
    } catch (err) {
        console.error('Error generating favicon:', err);
        process.exit(1);
    }
}

generateFavicon();

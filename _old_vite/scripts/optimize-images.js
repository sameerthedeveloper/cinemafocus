
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.resolve(__dirname, '../public/images');

const processImages = async () => {
    try {
        const files = fs.readdirSync(imagesDir);

        for (const file of files) {
            if (path.extname(file).toLowerCase() === '.png') {
                const inputPath = path.join(imagesDir, file);
                const outputPath = path.join(imagesDir, path.basename(file, '.png') + '.webp');

                console.log(`Converting ${file} to WebP...`);

                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                console.log(`Saved: ${outputPath}`);
            }
        }
        console.log('Image optimization complete.');
    } catch (error) {
        console.error('Error processing images:', error);
    }
};

processImages();

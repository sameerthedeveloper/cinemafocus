import sharp from 'sharp';

/**
 * Optimizes an image to WebP format, resizes it according to target width, 
 * and strips metadata to minimize file size.
 * 
 * @param {File | Buffer | ArrayBuffer} input - The image file, buffer, or array buffer to optimize.
 * @param {Object} [options={}] - Configuration options.
 * @param {'thumbnail' | 'product' | 'hero'} [options.type] - The target image type to automatically set max width.
 * @param {number} [options.maxWidth] - Explicit maximum width to resize to.
 * @param {number} [options.quality=80] - WebP quality option (0-100).
 * @returns {Promise<{ buffer: Buffer, contentType: string, size: number }>} Optimized image buffer and metadata.
 */
export async function optimizeImage(input, options = {}) {
  try {
    let inputBuffer;
    
    // 1. Convert input type to Node.js Buffer
    if (Buffer.isBuffer(input)) {
      inputBuffer = input;
    } else if (input instanceof ArrayBuffer) {
      inputBuffer = Buffer.from(input);
    } else if (typeof input === 'object' && input !== null) {
      // Handle Web File or Blob objects
      if (typeof input.arrayBuffer === 'function') {
        const ab = await input.arrayBuffer();
        inputBuffer = Buffer.from(ab);
      } else if (input.buffer) {
        inputBuffer = Buffer.from(input.buffer);
      } else {
        throw new Error('Unsupported object input. Expected File or Blob with arrayBuffer function.');
      }
    } else {
      throw new Error('Invalid input format. Expected File, Buffer, or ArrayBuffer.');
    }

    // 2. Resolve maximum width based on optimization classification or options
    let targetWidth = options.maxWidth;
    if (!targetWidth && options.type) {
      switch (options.type) {
        case 'thumbnail':
          targetWidth = 400; // Deliverable 3: Thumbnails 400px max width
          break;
        case 'product':
          targetWidth = 800; // Deliverable 3: Product cards 800px max width
          break;
        case 'hero':
          targetWidth = 1600; // Deliverable 3: Hero banners 1600px max width
          break;
        default:
          console.warn(`[imageOptimizer] Unknown type '${options.type}'. Resizing skipped.`);
      }
    }

    // 3. Initialize Sharp pipeline
    let pipeline = sharp(inputBuffer);
    
    // 4. Resize if required and only if original image is wider than target
    if (targetWidth) {
      const metadata = await pipeline.metadata();
      if (metadata.width && metadata.width > targetWidth) {
        pipeline = pipeline.resize({
          width: targetWidth,
          withoutEnlargement: true,
          fit: 'inside' // Preserve original aspect ratio
        });
      }
    }

    // 5. Convert to WebP, strip EXIF metadata, and extract buffer
    const buffer = await pipeline
      .webp({ 
        quality: options.quality || 82, // High-fidelity but extremely compressed quality setting
        lossless: false,
        effort: 4 // Tradeoff between speed and compression optimization (0-6)
      })
      .toBuffer();

    return {
      buffer,
      contentType: 'image/webp',
      size: buffer.length
    };
  } catch (error) {
    console.error('[imageOptimizer] Error optimizing image with Sharp:', error);
    throw error;
  }
}

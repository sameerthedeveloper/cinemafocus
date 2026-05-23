import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { optimizeImage } from '@/lib/imageOptimizer';

export const dynamic = 'force-dynamic';

/**
 * Upload-Time Image Optimization POST Endpoint.
 * Workflow:
 * 1. Receive file and configuration metadata (type, folder)
 * 2. Validate MIME type (must be image) and file size (max 10MB)
 * 3. Process image through Sharp optimizer pipeline (resizing and WebP conversion)
 * 4. Upload optimized WebP buffer to Supabase Storage with CDN Cache-Control headers
 * 5. Return JSON containing the optimized public URL
 */
export async function POST(request) {
  try {
    // 1. Authenticate / get Server-side Supabase client
    const supabase = await createClient();

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'product'; // 'thumbnail' | 'product' | 'hero'
    const folder = formData.get('folder') || 'uploads'; // target directory inside storage bucket

    // 3. Validation Checks
    if (!file) {
      return NextResponse.json(
        { error: 'No file was provided in the request payload' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file format. Only image uploads are allowed' },
        { status: 400 }
      );
    }

    // Max upload size constraint: 10MB (10 * 1024 * 1024 bytes)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 10MB limit (size: ${(file.size / 1024 / 1024).toFixed(2)}MB)` },
        { status: 400 }
      );
    }

    // 4. Run through high-performance Sharp pipeline
    console.log(`[Upload API] Optimizing file: ${file.name} (type: ${type})`);
    const { buffer, contentType, size } = await optimizeImage(file, { type });
    console.log(`[Upload API] Optimization complete. Initial size: ${(file.size / 1024).toFixed(1)}KB -> WebP size: ${(size / 1024).toFixed(1)}KB`);

    // 5. Generate sanitized WebP filename
    const baseName = file.name
      .replace(/\s+/g, '_') // Replace whitespace with underscore
      .replace(/\.[^/.]+$/, ""); // Strip original extension
    const fileName = `${folder}/${Date.now()}_${baseName}.webp`;

    // 6. Upload WebP buffer to Supabase Storage
    const BUCKET = 'images';
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: contentType, // 'image/webp'
        // Deliverable 4 CDN / Supabase bucket Cache header requirement
        cacheControl: 'public, max-age=31536000, immutable',
        upsert: false
      });

    if (uploadError) {
      console.error('[Upload API] Supabase storage upload failed:', uploadError.message);
      return NextResponse.json(
        { error: `Supabase Storage upload failure: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 7. Retrieve Optimized Public CDN URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return NextResponse.json(
      { 
        success: true, 
        publicUrl,
        size,
        format: 'webp' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Upload API] Severe handler exception:', error);
    return NextResponse.json(
      { error: `Server exception during upload processing: ${error.message}` },
      { status: 500 }
    );
  }
}

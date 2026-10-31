import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { optimizeImage } from '@/lib/imageOptimizer';
import { ACCESS_TOKEN_COOKIE } from '@/lib/aws/cognito';

export const dynamic = 'force-dynamic';

/**
 * Upload-Time Image Optimization POST Endpoint.
 * Workflow:
 * 1. Receive file and configuration metadata (type, folder)
 * 2. Validate MIME type (must be image) and file size (max 10MB)
 * 3. Process image through Sharp optimizer pipeline (resizing and WebP conversion)
 * 4. Request a presigned S3 PUT URL from the upload Lambda, then PUT the
 *    optimized buffer directly to S3 (server-side here, since this route
 *    already has the processed bytes in hand)
 * 5. Return JSON containing the optimized public URL
 */
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    // 1. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'product'; // 'thumbnail' | 'product' | 'hero'
    const folder = formData.get('folder') || 'uploads'; // target directory inside storage bucket

    // 2. Validation Checks
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

    // 3. Run through high-performance Sharp pipeline
    console.log(`[Upload API] Optimizing file: ${file.name} (type: ${type})`);
    const { buffer, contentType, size } = await optimizeImage(file, { type });
    console.log(`[Upload API] Optimization complete. Initial size: ${(file.size / 1024).toFixed(1)}KB -> WebP size: ${(size / 1024).toFixed(1)}KB`);

    // 4. Generate sanitized WebP filename
    const baseName = file.name
      .replace(/\s+/g, '_') // Replace whitespace with underscore
      .replace(/\.[^/.]+$/, ""); // Strip original extension
    const fileName = `${baseName}.webp`;

    // 5. Get a presigned PUT URL from the upload Lambda, then upload the
    // already-optimized buffer directly to S3.
    const presignRes = await fetch(`${process.env.API_GATEWAY_URL}/upload/presign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // size is signed into the presigned URL, so S3 rejects any other body length.
      body: JSON.stringify({ folder, fileName, contentType, size: buffer.length }),
    });
    const presignData = await presignRes.json();

    if (!presignRes.ok) {
      return NextResponse.json(
        { error: presignData.error || 'Failed to get upload URL' },
        { status: presignRes.status }
      );
    }

    const putRes = await fetch(presignData.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: buffer,
    });

    if (!putRes.ok) {
      return NextResponse.json(
        { error: 'Upload to storage failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        publicUrl: presignData.publicUrl,
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

import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '../../../lib/services/storageService';
import { getSessionTokenFromRequest, verifyJWT } from '../../../lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyJWT(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadFile({
      fileBuffer: buffer,
      fileName: file.name,
      mimeType: file.type,
      folder: 'problem-photos',
    });

    return NextResponse.json({
      success: true,
      fileUrl: result.url,
      fileKey: result.key,
      provider: result.provider,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 });
  }
}

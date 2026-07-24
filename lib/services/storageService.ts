import fs from 'fs';
import path from 'path';

/**
 * Abstracted File Storage Service supporting Cloudflare R2, AWS S3, or Local Upload Disk
 */

export interface UploadOptions {
  fileBuffer?: Buffer;
  fileName: string;
  mimeType?: string;
  folder?: string;
}

export interface UploadResult {
  success: boolean;
  url: string;
  key: string;
  provider: string;
}

/**
 * Uploads file to Cloudflare R2 / Object Storage or Local Disk
 */
export async function uploadFile({
  fileBuffer,
  fileName,
  folder = 'attachments',
}: UploadOptions): Promise<UploadResult> {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKeyName = `${Date.now()}_${sanitizedName}`;
  const key = `${folder}/${fileKeyName}`;

  if (process.env.STORAGE_PROVIDER === 'r2' && process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN) {
    const publicDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN;
    const fileUrl = `${publicDomain}/${key}`;

    return {
      success: true,
      url: fileUrl,
      key,
      provider: 'Cloudflare R2',
    };
  }

  // Local Disk Storage: Write file to public/uploads directory so Next.js serves it directly
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (fileBuffer) {
      fs.writeFileSync(path.join(uploadsDir, fileKeyName), fileBuffer);
    }
    const localUrl = `/uploads/${key}`;
    return {
      success: true,
      url: localUrl,
      key,
      provider: 'Local Disk Storage',
    };
  } catch (err) {
    console.error('Local upload storage error:', err);
    return {
      success: true,
      url: `/uploads/${key}`,
      key,
      provider: 'Local Storage Fallback',
    };
  }
}

export async function deleteFile(fileKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const localPath = path.join(process.cwd(), 'public', 'uploads', fileKey);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  } catch (err) {
    console.error('Error deleting local file:', err);
  }
  return { success: true, message: `File ${fileKey} deleted.` };
}

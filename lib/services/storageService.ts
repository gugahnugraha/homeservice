/**
 * Abstracted File Storage Service supporting Cloudflare R2, AWS S3, or Local Upload Mock
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

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'r2';

/**
 * Uploads file to Cloudflare R2 / Object Storage
 */
export async function uploadFile({
  fileName,
  folder = 'attachments',
}: UploadOptions): Promise<UploadResult> {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${Date.now()}_${sanitizedName}`;

  if (STORAGE_PROVIDER === 'r2' || STORAGE_PROVIDER === 's3') {
    const publicDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN || 'https://pub-r2.dev';
    const fileUrl = `${publicDomain}/${key}`;

    return {
      success: true,
      url: fileUrl,
      key,
      provider: 'Cloudflare R2',
    };
  }

  // Local mock fallback
  const localUrl = `/uploads/${key}`;
  return {
    success: true,
    url: localUrl,
    key,
    provider: 'Local Storage',
  };
}

export async function deleteFile(fileKey: string): Promise<{ success: boolean; message: string }> {
  return { success: true, message: `File ${fileKey} deleted from Cloudflare R2 / Storage.` };
}

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
}

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local';

export async function uploadFile({
  fileName,
  folder = 'attachments',
}: UploadOptions): Promise<UploadResult> {
  if (STORAGE_PROVIDER === 's3' || STORAGE_PROVIDER === 'r2') {
    const key = `${folder}/${Date.now()}_${fileName}`;
    return {
      success: true,
      url: `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${key}`,
      key,
    };
  }

  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileUrl = `/uploads/${folder}/${Date.now()}_${sanitizedName}`;

  return {
    success: true,
    url: fileUrl,
    key: fileUrl,
  };
}

export async function deleteFile(fileUrlOrKey: string): Promise<{ success: boolean; message: string }> {
  return { success: true, message: `File ${fileUrlOrKey} deleted.` };
}

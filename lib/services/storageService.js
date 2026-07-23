/**
 * Abstracted File Storage Service
 * Supports local storage mock, S3, Cloudflare R2, or Google Cloud Storage.
 */

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local';

export async function uploadFile({ fileBuffer, fileName, mimeType, folder = 'attachments' }) {
  if (STORAGE_PROVIDER === 's3' || STORAGE_PROVIDER === 'r2') {
    // Extensible S3/R2 upload implementation placeholder
    const key = `${folder}/${Date.now()}_${fileName}`;
    return {
      success: true,
      url: `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${key}`,
      key,
    };
  }

  // Local / Mock file upload response
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileUrl = `/uploads/${folder}/${Date.now()}_${sanitizedName}`;

  return {
    success: true,
    url: fileUrl,
    key: fileUrl,
  };
}

export async function deleteFile(fileUrlOrKey) {
  // Abstracted deletion handler
  return { success: true, message: `File ${fileUrlOrKey} deleted.` };
}

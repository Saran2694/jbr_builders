import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with server-side environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export type ValidCloudinaryFolder = 'about' | 'employees' | 'gallery' | 'projects';

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME) &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Uploads an image to Cloudinary in the designated folder.
 * Accepts base64 data string, data URL, or remote URL.
 */
export async function uploadImageToCloudinary(
  base64OrUrl: string,
  folder: ValidCloudinaryFolder = 'gallery',
  customPublicId?: string
): Promise<{
  success: boolean;
  url: string;
  secureUrl: string;
  publicId: string;
  assetId: string;
  format: string;
  bytes: number;
}> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary server credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not set.'
    );
  }

  const allowedFolders: ValidCloudinaryFolder[] = ['about', 'employees', 'gallery', 'projects'];
  const targetFolder = allowedFolders.includes(folder) ? folder : 'gallery';

  const uploadOptions: Record<string, any> = {
    folder: `jbr-builders/${targetFolder}`,
    resource_type: 'image',
    overwrite: true,
  };

  if (customPublicId) {
    uploadOptions.public_id = customPublicId;
  }

  const result = await cloudinary.uploader.upload(base64OrUrl, uploadOptions);

  return {
    success: true,
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    assetId: result.asset_id,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Deletes an image from Cloudinary by its public ID.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<{ success: boolean; result?: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary server credentials are not set.');
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });

  return {
    success: result.result === 'ok' || result.result === 'not found',
    result: result.result,
  };
}

/**
 * Generates an upload signature for direct client-to-Cloudinary signed uploads if needed.
 */
export function generateCloudinarySignature(params: Record<string, any>): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
} {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '';

  const paramsToSign = {
    ...params,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
  };
}

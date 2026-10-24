import type { IncomingMessage, ServerResponse } from 'node:http';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import path from 'node:path';

// Helper to ensure .env is parsed if not already populated
function ensureEnvLoaded() {
  if (process.env.CLOUDINARY_API_KEY) return;
  try {
    if (typeof (process as any).loadEnvFile === 'function') {
      (process as any).loadEnvFile();
    }
  } catch {
    // continue
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    const candidatePaths = [
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), 'jbr-builders', '.env'),
      path.join(process.cwd(), '..', '.env'),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, 'utf8');
          content.split(/\r?\n/).forEach((line) => {
            const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (m) {
              const key = m[1];
              let val = (m[2] || '').trim();
              if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
              }
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          });
        } catch {
          // ignore
        }
        if (process.env.CLOUDINARY_API_KEY) break;
      }
    }
  }
}

ensureEnvLoaded();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 15 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  ensureEnvLoaded();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Cloudinary server credentials are not configured.',
      })
    );
    return;
  }

  try {
    const body = req.body || (await parseJsonBody(req));
    const action = body.action || req.query?.action || 'upload';

    if (action === 'upload') {
      const { base64Data, folder = 'gallery', customPublicId } = body;
      if (!base64Data) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'base64Data is required for upload' }));
        return;
      }

      const allowedFolders = ['about', 'employees', 'gallery', 'projects'];
      const targetFolder = allowedFolders.includes(folder) ? folder : 'gallery';

      const uploadOptions: Record<string, any> = {
        folder: `jbr-builders/${targetFolder}`,
        resource_type: 'image',
        overwrite: true,
      };

      if (customPublicId) {
        uploadOptions.public_id = customPublicId;
      }

      const result = await cloudinary.uploader.upload(base64Data, uploadOptions);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: true,
          url: result.secure_url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          assetId: result.asset_id,
          format: result.format,
          bytes: result.bytes,
        })
      );
      return;
    }

    if (action === 'delete') {
      const { publicId } = body;
      if (!publicId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'publicId is required for deletion' }));
        return;
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true,
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, result: result.result }));
      return;
    }

    if (action === 'sign') {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        folder: `jbr-builders/${body.folder || 'gallery'}`,
        timestamp,
      };
      const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: true,
          signature,
          timestamp,
          apiKey,
          cloudName,
          folder: `jbr-builders/${body.folder || 'gallery'}`,
        })
      );
      return;
    }

    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: `Unknown action: ${action}` }));
  } catch (err: any) {
    console.error('Cloudinary serverless API error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: err?.message || 'Cloudinary operation failed' }));
  }
}

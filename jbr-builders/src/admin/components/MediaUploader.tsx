import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface MediaUploaderProps {
  value: string;
  onChange: (url: string, isExternal?: boolean, assetId?: string) => void;
  label?: string;
  helperText?: string;
  aspectRatioHint?: string;
  folder?: 'about' | 'employees' | 'gallery' | 'projects';
  assetId?: string;
  onAssetIdChange?: (assetId: string) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  onChange,
  label = 'Media / Image',
  helperText = 'Supported formats: JPG, PNG, WebP (Max 10MB) or External URL',
  aspectRatioHint,
  folder = 'gallery',
  assetId,
  onAssetIdChange,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>(value?.startsWith('http') && !value.includes('cloudinary') ? 'url' : 'upload');
  const [urlInput, setUrlInput] = useState(value?.startsWith('http') ? value : '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setImageLoadError(false);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Invalid format. Please select a JPG, PNG, or WebP image.');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    try {
      // If replacing an existing image that had a Cloudinary assetId, delete previous asset
      if (assetId && assetId.startsWith('jbr-builders/')) {
        try {
          await adminApi.deleteMedia(assetId);
        } catch {
          // Non-blocking cleanup
        }
      }

      const res = await adminApi.uploadFile(file, folder);
      if (res.success && (res.secureUrl || res.url)) {
        const finalUrl = res.secureUrl || res.url;
        const newAssetId = res.publicId || res.assetId || '';
        onChange(finalUrl, false, newAssetId);
        if (onAssetIdChange) {
          onAssetIdChange(newAssetId);
        }
      } else {
        setUploadError('Upload failed.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading image to Cloudinary.');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = () => {
    setImageLoadError(false);
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput.trim());
      onChange(urlInput.trim(), true);
    } catch {
      setUploadError('Please enter a valid HTTP/HTTPS image URL.');
    }
  };

  const handleClear = async () => {
    if (assetId && assetId.startsWith('jbr-builders/')) {
      try {
        await adminApi.deleteMedia(assetId);
      } catch {
        // Continue
      }
    }
    onChange('', false, '');
    if (onAssetIdChange) {
      onAssetIdChange('');
    }
    setUrlInput('');
    setImageLoadError(false);
    setUploadError(null);
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">{label}</label>
          {aspectRatioHint && <span className="text-[11px] text-slate-400 font-medium">Recommended: {aspectRatioHint}</span>}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center p-1 bg-slate-100 rounded-xl max-w-xs">
        <button
          type="button"
          onClick={() => { setMode('upload'); setUploadError(null); }}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'upload' ? 'bg-white text-[#123B68] shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image</span>
        </button>
        <button
          type="button"
          onClick={() => { setMode('url'); setUploadError(null); }}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'url' ? 'bg-white text-[#123B68] shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>External URL</span>
        </button>
      </div>

      {/* Mode 1: File Upload */}
      {mode === 'upload' && (
        <div className="relative">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#2468A6] rounded-2xl p-5 cursor-pointer bg-slate-50/50 hover:bg-white transition-all group">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <span className="w-6 h-6 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
                <span className="text-xs font-bold text-[#123B68]">Uploading to Cloudinary ({folder})...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2 text-center">
                <div className="w-10 h-10 rounded-full bg-[#123B68]/10 text-[#2468A6] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-700">Click to choose image or drag & drop</div>
                <div className="text-[11px] text-slate-400">{helperText}</div>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Mode 2: External URL */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2.5 bg-[#123B68] text-white rounded-xl text-xs font-bold hover:bg-[#0E2E52] transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preview Section */}
      {value && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden relative shrink-0 border border-slate-300">
            {imageLoadError ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] p-1 text-center">
                <AlertCircle className="w-4 h-4 text-rose-400 mb-0.5" />
                Broken
              </div>
            ) : (
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-full object-cover"
                onError={() => setImageLoadError(true)}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Image Attached</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5" title={value}>
              {value}
            </p>
            {assetId && (
              <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5" title={assetId}>
                Asset ID: {assetId}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Remove media"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

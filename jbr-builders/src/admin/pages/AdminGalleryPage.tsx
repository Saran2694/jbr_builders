import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Upload,
  Link as LinkIcon,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  X,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { GalleryItemCMS } from '../../types/cms';
import { MediaUploader } from '../components/MediaUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export const AdminGalleryPage: React.FC = () => {
  const { showToast } = useToast();
  const [gallery, setGallery] = useState<GalleryItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Single Item Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItemCMS> | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Bulk Upload Modal
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<GalleryItemCMS | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Preview Lightbox State
  const [previewItem, setPreviewItem] = useState<GalleryItemCMS | null>(null);

  const categories = [
    { tag: 'all', label: 'All Photos' },
    { tag: 'exterior', label: 'Exterior & Architecture' },
    { tag: 'handover', label: 'Handover & Celebrations' },
    { tag: 'interior', label: 'Interior & Finishes' },
    { tag: 'office', label: 'Office & Facilities' },
  ];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getGallery();
      if (res.success && Array.isArray(res.data)) {
        setGallery(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed loading gallery media', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      category: 'Exterior & Architecture',
      categoryTag: 'exterior',
      imageSrc: '',
      isExternal: false,
      altText: '',
      caption: '',
      aspectRatio: 'landscape',
      isFeatured: false,
      published: true,
      displayOrder: gallery.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItemCMS) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.imageSrc) {
      showToast('Image source (upload or external URL) is required.', 'error');
      return;
    }

    setModalSaving(true);
    try {
      const payload: Partial<GalleryItemCMS> = {
        ...editingItem,
        title: editingItem.title?.trim() || 'Construction Gallery Photo',
        altText: editingItem.altText?.trim() || editingItem.title?.trim() || 'JBR Builders Photo',
        isExternal: Boolean(editingItem.imageSrc?.startsWith('http')),
      };

      if (editingItem.id && gallery.some(g => g.id === editingItem.id)) {
        // Edit existing
        const res = await adminApi.updateGalleryItem(editingItem.id, payload);
        if (res.success) {
          setGallery(prev => prev.map(g => g.id === editingItem.id ? res.data : g));
          showToast('Gallery item updated successfully', 'success');
        }
      } else {
        // Create new
        const res = await adminApi.createGalleryItem(payload);
        if (res.success) {
          setGallery(prev => [...prev, res.data]);
          showToast('Image added to gallery', 'success');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving gallery item', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleTogglePublished = async (item: GalleryItemCMS) => {
    try {
      const updated = { ...item, published: !item.published };
      const res = await adminApi.updateGalleryItem(item.id, updated);
      if (res.success) {
        setGallery(prev => prev.map(g => g.id === item.id ? res.data : g));
        showToast(`${item.title} visibility updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  const handleToggleFeatured = async (item: GalleryItemCMS) => {
    try {
      const updated = { ...item, isFeatured: !item.isFeatured };
      const res = await adminApi.updateGalleryItem(item.id, updated);
      if (res.success) {
        setGallery(prev => prev.map(g => g.id === item.id ? res.data : g));
        showToast(`${item.title} featured status updated`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating featured status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await adminApi.deleteGalleryItem(deleteTarget.id);
      if (res.success) {
        setGallery(prev => prev.filter(g => g.id !== deleteTarget.id));
        showToast('Image deleted from gallery', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting gallery item', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[targetIndex];
    newGallery[targetIndex] = temp;

    setGallery(newGallery);
    try {
      await adminApi.reorderGallery(newGallery.map(g => g.id));
      showToast('Gallery reordered', 'success');
    } catch {
      showToast('Failed to save order', 'error');
      fetchGallery();
    }
  };

  // Bulk Upload Processing
  const handleBulkUploadFiles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkFiles.length === 0) return;

    setBulkUploading(true);
    setBulkProgress({ current: 0, total: bulkFiles.length });

    let successfulCount = 0;
    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i];
      try {
        const uploadRes = await adminApi.uploadFile(file);
        if (uploadRes.success && uploadRes.url) {
          const itemPayload: Partial<GalleryItemCMS> = {
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            category: 'Exterior & Architecture',
            categoryTag: 'exterior',
            imageSrc: uploadRes.url,
            isExternal: false,
            altText: file.name,
            aspectRatio: 'landscape',
            published: true,
            isFeatured: false,
            displayOrder: gallery.length + i + 1,
          };
          const res = await adminApi.createGalleryItem(itemPayload);
          if (res.success) {
            setGallery(prev => [...prev, res.data]);
            successfulCount++;
          }
        }
      } catch (err) {
        console.error('Failed uploading bulk file:', file.name, err);
      }
      setBulkProgress({ current: i + 1, total: bulkFiles.length });
    }

    setBulkUploading(false);
    setIsBulkOpen(false);
    setBulkFiles([]);
    showToast(`Successfully uploaded ${successfulCount} images to persistent gallery storage`, 'success');
  };

  // Filtered List
  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.categoryTag === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider mb-1">
            <span>Priority Feature</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Gallery & Media Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload multiple images from desktop/phone, or link external image URLs with persistent storage.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#2468A6] text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-[#2468A6]" />
            <span>Bulk Upload</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B68] hover:bg-[#0E2E52] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Photo</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.tag}
            onClick={() => setSelectedCategory(cat.tag)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.tag
                ? 'bg-[#123B68] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <span className="w-8 h-8 border-3 border-[#2468A6]/30 border-t-[#2468A6] rounded-full animate-spin" />
          <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loading gallery media...</p>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No images found in this category</p>
          <p className="text-xs text-slate-400 mt-1">Upload direct images or paste an external image link to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as any).src = '/images/project-residential-elevation.jpg';
                  }}
                />

                {/* Storage Type Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                      item.isExternal
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#123B68] text-white'
                    }`}
                  >
                    {item.isExternal ? 'External URL' : 'Uploaded'}
                  </span>
                </div>

                {/* Action Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-2 rounded-xl bg-white/90 text-slate-800 hover:bg-white hover:scale-110 transition-all shadow-md cursor-pointer"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-white/90 text-slate-800 hover:bg-white hover:scale-110 transition-all shadow-md cursor-pointer"
                    title="Edit Information"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-xl bg-white/90 text-rose-600 hover:bg-white hover:scale-110 transition-all shadow-md cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status indicator on top right */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                      item.isFeatured ? 'bg-amber-400 text-white' : 'bg-black/30 text-white/70 hover:text-white'
                    }`}
                    title={item.isFeatured ? 'Featured image' : 'Feature image'}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleTogglePublished(item)}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                      item.published ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                    }`}
                    title={item.published ? 'Publicly Live' : 'Hidden'}
                  >
                    {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                    <span className="uppercase tracking-wider">{item.categoryTag}</span>
                    <span className="capitalize">{item.aspectRatio}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                  {item.caption && <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.caption}</p>}
                </div>

                {/* Order Up/Down Controls */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-mono font-bold text-slate-400">Order: #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      title="Move backward"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(idx, 'down')}
                      disabled={idx === gallery.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      title="Move forward"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#EBF4FC] text-[#123B68]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingItem.id ? 'Edit Gallery Photograph' : 'Add Image to Gallery'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Directly upload or paste an external image URL with categorization
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveItem} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Media Uploader */}
              <MediaUploader
                label="Photograph File or External URL *"
                value={editingItem.imageSrc || ''}
                folder="gallery"
                assetId={(editingItem as any).imageAssetId || (editingItem as any).cloudinaryPublicId}
                onChange={(url, isExt, assetId) => setEditingItem(prev => ({
                  ...prev!,
                  imageSrc: url,
                  isExternal: isExt ?? Boolean(url?.startsWith('http')),
                  ...(assetId ? { imageAssetId: assetId, cloudinaryPublicId: assetId } : {}),
                }))}
                aspectRatioHint="Landscape 16:9 or Portrait 3:4"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Photograph Title</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem(prev => ({ ...prev!, title: e.target.value }))}
                  placeholder="e.g. Modern Residential Elevation & Facade"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category Filter Tag</label>
                  <select
                    value={editingItem.categoryTag || 'exterior'}
                    onChange={(e) => {
                      const tag = e.target.value;
                      const catObj = categories.find(c => c.tag === tag);
                      setEditingItem(prev => ({
                        ...prev!,
                        categoryTag: tag as any,
                        category: catObj?.label || 'Exterior & Architecture',
                      }));
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6] bg-white"
                  >
                    {categories.filter(c => c.tag !== 'all').map(c => (
                      <option key={c.tag} value={c.tag}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Aspect Ratio</label>
                  <select
                    value={editingItem.aspectRatio || 'landscape'}
                    onChange={(e) => setEditingItem(prev => ({ ...prev!, aspectRatio: e.target.value as any }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6] bg-white"
                  >
                    <option value="landscape">Landscape (Horizontal)</option>
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem(prev => ({ ...prev!, caption: e.target.value }))}
                  placeholder="Additional context displayed in the public lightbox viewer..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Accessibility Alt Text</label>
                <input
                  type="text"
                  value={editingItem.altText || ''}
                  onChange={(e) => setEditingItem(prev => ({ ...prev!, altText: e.target.value }))}
                  placeholder="Descriptive text for screen readers"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2468A6]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured || false}
                    onChange={(e) => setEditingItem(prev => ({ ...prev!, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Mark as Featured Photo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingItem.published !== false}
                    onChange={(e) => setEditingItem(prev => ({ ...prev!, published: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#123B68] focus:ring-[#2468A6]"
                  />
                  <span>Publish to Public Gallery</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#123B68] hover:bg-[#0E2E52] rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {modalSaving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>Save to Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-5 h-5 text-[#2468A6]" />
                <h3 className="text-base font-extrabold text-slate-900">Bulk Photo Upload</h3>
              </div>
              <button onClick={() => setIsBulkOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select multiple photographs (.jpg, .png, .webp) from your computer or phone. They will all be uploaded and saved into persistent server storage.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#2468A6] rounded-2xl p-6 cursor-pointer bg-slate-50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setBulkFiles(files);
                }}
                disabled={bulkUploading}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-[#2468A6] mb-2" />
              <span className="text-xs font-bold text-slate-800">Choose multiple files to upload</span>
              <span className="text-[11px] text-slate-400 mt-1">{bulkFiles.length} files selected</span>
            </label>

            {bulkFiles.length > 0 && (
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 text-xs p-2 bg-slate-50 rounded-xl border border-slate-200">
                {bulkFiles.map((file, i) => (
                  <div key={i} className="py-1 px-2 flex justify-between items-center text-[11px] text-slate-600">
                    <span className="truncate max-w-xs">{file.name}</span>
                    <span className="text-slate-400">{Math.round(file.size / 1024)} KB</span>
                  </div>
                ))}
              </div>
            )}

            {bulkUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#123B68]">
                  <span>Uploading to Persistent Storage...</span>
                  <span>{bulkProgress.current} / {bulkProgress.total}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2468A6] h-full transition-all duration-300"
                    style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkOpen(false)}
                disabled={bulkUploading}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkUploadFiles}
                disabled={bulkFiles.length === 0 || bulkUploading}
                className="px-5 py-2 text-xs font-bold text-white bg-[#123B68] hover:bg-[#0E2E52] rounded-xl shadow-md disabled:opacity-50"
              >
                {bulkUploading ? 'Uploading...' : `Upload ${bulkFiles.length} Photos`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-transparent rounded-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewItem.imageSrc}
              alt={previewItem.altText || previewItem.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-3 text-center text-white">
              <h4 className="text-sm font-bold">{previewItem.title}</h4>
              {previewItem.caption && <p className="text-xs text-slate-300 mt-0.5">{previewItem.caption}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Permanently Delete Gallery Photograph"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This photo will be permanently removed from the public website's photo gallery.`}
        confirmLabel="Delete Photograph"
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
